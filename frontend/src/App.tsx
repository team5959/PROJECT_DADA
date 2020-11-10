import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import MainScreen from './Components/main'


const AWS = require('aws-sdk')
AWS.config.update({ 
  region: 'us-east-1',
  accessKeyId: "***REMOVED***",
  secretAccessKey: "***REMOVED***",
});




const App = () => {
  console.log('앱 시작했다.')
  const [userInfo, setUserInfo] = useState(null)
  
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
      setUserInfo(JSON.parse(JSON.stringify(userInfo)))
      
      console.log("idtoken : " + userInfo.idToken);
      console.log("id : " + userInfo.user.id);

      createBucket(userInfo.user.id);

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

  async function createBucket(userid: string) {

    const s3 = new AWS.S3();

    // s3.listBuckets(function(err: any, data: { Buckets: any; }) {
    //     if (err) {
    //       console.log("Error", err);
    //     } else {
    //       console.log("Success", data.Buckets);
    //     }
    // });

    var bucketParams = {
      Bucket : "dada-" + userid
    };
      
      // call S3 to create the bucket
    s3.createBucket(bucketParams, function(err: any, data: { Location: any; }) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Location);
      }
    });
  }

  return (
    <View style={{ flex: 1 }}>
      {userInfo ? (
        <MainScreen info={userInfo}/>
      ) : (
        <View style={styles.body}>
          <View style={styles.content}>
              <Text style={styles.title}>DADA</Text>            
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
  title: {
    fontSize: 120,
  },
  content: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "ivory"
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "skyblue"
  },
  body: {
    flex: 1,
  },
  googleButton: {
    width: 390, 
    height: 55,
  },
});
export default App
