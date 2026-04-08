import { View, Text, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ setIsLoggedIn }) => {
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20 }}>Login Screen</Text>

      <View style={styles.buttonWrapper}>
        <Button
          title="Login"
          onPress={() => setIsLoggedIn(true)}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonWrapper: {
    width: "50%",     
    height: 50,     
    justifyContent: 'center',
  },
});