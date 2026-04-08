import React, { useState } from 'react';
import AuthStack from './AuthStack';
import BottomTabs from './BottomTabs';

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn 
    ? <BottomTabs /> 
    : <AuthStack setIsLoggedIn={setIsLoggedIn} />;
};

export default AppNavigator;