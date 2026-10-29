# Redux setup

- `api.js`: one `BASE_URL`, endpoint paths, queries, mutations and generated hooks.
- `authSlice.js`: login state plus secure token save, restore and clear functions.
- `store.js`: reducers and RTK Query middleware.
- `App.jsx`: the existing `<Provider store={store}>` supplies Redux to screens.

Use a generated hook directly in a screen:

```jsx
import {useSendOtpMutation} from '../redux/api';

const [sendOtp, {isLoading}] = useSendOtpMutation();
const response = await sendOtp({mobileNo}).unwrap();
```

The app flow remains:

- New customer: registration details → RegisterUser → SendOtp → OTP verification → Home.
- Existing customer: “Already registered? Sign in” → mobile → SendOtp → OTP verification → Home.
- SendOtp's returned 6-digit OTP is prefilled in the verification boxes. Resend fills the newly returned OTP after the existing 30-second cooldown. The user still taps Verify & Continue, and verifyotp must succeed before login.
- Valid saved session → Home on restart. If the access token expired but the refresh token is valid, `AuthCustomer/refreshtoken` renews the session before opening Home.
- A protected API returning 401 refreshes the tokens and retries once. Concurrent failures share one refresh request. Both rotated tokens are saved securely. An invalid or expired refresh token returns the user to Login; temporary network failures preserve saved credentials for retry.
- Logout clears secure credentials, login state and API cache. A delayed refresh cannot restore a logged-out session.

Tokens still use `react-native-keychain`. The `vehicles` query remains an example route and is not connected to vehicle screens.

Home banners use `GET Master/Banner` through `useGetBannersQuery`, with no added parameters. The existing session supplies the bearer token and refresh handling. `BannerSlider` uses the backend's `BANCODE`, `BNAME`, `BURL`, `IMG`, `PLACEMENT`, `APAGE` and `APP` fields directly, showing Top/Index/User banners. An IMG filename shows a neutral placeholder until the backend supplies a full image URL or confirms its base path; no upload path is guessed. A valid HTTP(S) BURL opens the supplied link, while null BURL leaves the banner non-clickable.

Edit Profile and My Sales Add/Edit forms use the shared `LocationFields` dropdowns: Country → State → City → Area. The existing `api.js` holds all four master queries, including the POST methods and parent ID query parameters. Changing a parent clears dependent selections; selecting an area displays its pincode. Selected IDs and names are saved using the existing local profile/listing storage. No backend profile or vehicle save endpoint has been supplied.

`GET Master/Brand` supplies the Brand dropdowns in 2 Wheeler filters (Bike), 4 Wheeler filters (Car), and My Sales Add/Edit forms. Brands use exact `VehicleBrandId`, `VEHICLETYPEID`, `VEHICLETYPENAME`, `BrandName` and numeric `DisplayOrder` values. Filter results still use the existing brand-name matching, with backend IDs retained alongside it. Selecting a filter brand resets the model; changing a listing category clears its prior brand. Listing brand selection is optional and saved locally with the other listing fields. My Sales and Other Vehicle filters match brands by the selected `VEHICLETYPEID`; no IDs are invented. Logo paths are not guessed and no token is hardcoded.


`GET Master/VehicalType` uses the backend endpoint spelling exactly. My Sales keeps its existing category controls, adds a Vehicle Type dropdown (Car for 4 Wheeler, Bike/Scooter for 2 Wheeler, remaining API types for Other), and saves `VEHICLETYPEID`, `VEHICLETYPECODE` and `VEHICLETYPENAME` locally. Brand selection waits for a type, and changing type/category clears the previous brand. Other Vehicle filters use these same API types and retain their existing type-name matching against local example listings. `ICONPATH` filenames are not turned into guessed URLs.

`POST Master/CategoryByVehicaltype?typeid=<VEHICLETYPEID>` supplies My Sales' Vehicle Category dropdown and the existing 4 Wheeler Body Type chips. The car type ID is resolved from the Vehicle Type API, not hardcoded. Queries wait for a type and use `currentData` to avoid stale options when it changes. `VehicleCategoryId`, `CATEGORYCODE`, `CATEGORYNAME`, `ParentCategoryID` and `CategoryLevel` are retained with a listing/category selection; type changes clear the previous category. Category selection remains optional, and no backend listing-save endpoint or icon base URL is assumed.
`GET AuthCustomer/UserAddress` supplies Account → My Profile → My Addresses. It uses the current Redux bearer token and shared 401 refresh handling. GET has no body; the supplied response fields are displayed directly, including the default-address marker. Loading, retry and empty states are included. No address create/update endpoint is inferred.
`GET AuthCustomer/profile` supplies Account and My Profile through useGetProfileQuery. FirstName and LastName form the display name; MobileNo and Email populate profile and edit fields. The existing Redux session supplies authorization and 401 refresh. API failures show retry. Edit Profile still saves locally until an update endpoint is supplied; city/location remain in existing local storage.
My Addresses supports Edit and confirmed Delete. POST AuthCustomer/UserAddressById receives the selected AddressID as a string; the detail response populates the edit form. POST AuthCustomer/UpdateAddress sends AddressID, AddressType, AddressLine1, AddressLine2, Landmark, Pincode, Latitude and Longitude. POST AuthCustomer/UserDeleteAddressById sends only AddressID. Successful update/delete refetches the list. Failed requests retain the form and show an error; no add-address or profile-update operation is introduced.
Account Log Out confirmation invokes POST AuthCustomer/logout before clearing secure credentials, Redux auth and API cache. As supplied in the curl, this endpoint uses the saved refresh token in Authorization and the exact RefreshToken body field, preserving the token unchanged. It has a 10-second timeout and skips automatic 401 refresh to avoid rotating the token being revoked. Remote failure still allows local logout and displays that server logout could not be confirmed. Other protected requests continue using the access token.
Expiry handling accepts explicit timezone timestamps and .NET fractional-second precision. For timezone-free timestamps, expiry is enforced by server 401 responses rather than the device local timezone; this avoids premature logout without inventing a backend timezone. Malformed timestamps are rejected. Refresh requests have a 15-second timeout, preserving credentials on temporary failures.
