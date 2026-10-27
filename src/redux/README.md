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

Edit Profile and My Sales Add/Edit forms use the shared `LocationFields` dropdowns: Country → State → City → Area. The existing `api.js` holds all four master queries, including the POST methods and parent ID query parameters. Changing a parent clears dependent selections; selecting an area displays its pincode. Selected IDs and names are saved using the existing local profile/listing storage. No backend profile or vehicle save endpoint has been supplied.
