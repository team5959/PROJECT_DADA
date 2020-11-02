import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, AsyncStorage  } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import MainScreen from './Components/main'

const App = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [photo, setPhoto] = useState("")
  
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '119212281486-bi6bqfvgnc2kauhuqln1qcvu1a8t63te.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, [])

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log(userInfo)					//👈콘솔로 로그인 정보 찍어보자
      setName(userInfo.user.name)
      setEmail(userInfo.user.email)
      setPhoto(userInfo.user.photo)
      console.log('name:', name)
      console.log('email:', email)

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      console.log(error)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {name ? (
        <MainScreen />
      ) : (
        <View style={styles.body}>
          <View style={styles.content}>
            <Text style={{fontSize: 120}}>DADA</Text>
          </View>
          <View style={styles.footer}>
            <GoogleSigninButton
              style={styles.googleButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={_signIn}
            />
          </View>  
        </View>
      )}  
    </View>
  )
}


const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    backgroundColor: 'red'
  },
  googleButton: {
    width: 380, 
    height: 50,
  },
});
export default App
