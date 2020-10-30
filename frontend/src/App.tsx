import 'react-native-gesture-handler';
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './Components/Login'
import MainScreen from './Components/main'

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name='Main' component={MainScreen} options={{ headerShown: false }}/>
        ) : (
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
        )}         
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App
