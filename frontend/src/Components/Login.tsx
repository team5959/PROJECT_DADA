import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import HomeScreen from './Screens/home'
import UserScreen from './Screens/user'

const Stack = createStackNavigator();

const App = ({ navigation }) => { 
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [photo, setPhoto] = useState("")
  const [isLoggedIn, setisLoggedIn] = useState(false)

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

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log(userInfo)					//👈콘솔로 로그인 정보 찍어보자
      setName(userInfo.user.name)
      setEmail(userInfo.user.email)
      setPhoto(userInfo.user.photo)
      setisLoggedIn(true)
      console.log('isLoggedIn:', isLoggedIn)

      // this.setState({ userInfo });		//👈함수형으로 개발하여 이건 불필요
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
      console.log(error)					//👈콘솔로 에러내용 찍어보자
    }
  }

  return (
    <>
      <View style={styles.container}></View>
      <View style={styles.content}>
        <View style={styles.sub1}>
          <Text style={styles.title1}>Auto</Text>
        </View>
        <View style={styles.sub2}>
          <Text style={styles.title2}>Diary</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <GoogleSigninButton
          style={{ width: 380, height: 50 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: .5,
    backgroundColor: 'blue',
  },
  content: {
    flex: 3,
    backgroundColor: 'ivory',
  },
  bottom: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub1: { 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title1: {
    fontSize: 120
  },
  title2: {
    fontSize: 170
  },
});
export default App