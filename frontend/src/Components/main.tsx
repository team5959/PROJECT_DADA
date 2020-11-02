
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/home'
import UserScreen from './Screens/user'

const Tab = createBottomTabNavigator();

const main = () => {
  return (
    // <View style={styles.title}>
    //   <Text >메인 화면 왔어요</Text>
    // </View>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="User" component={UserScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'center', 
    alignItems: 'center'
  }
})



export default main
