
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './Screens/home'
import UserScreen from './Screens/user'

const Tab = createBottomTabNavigator();

const main = () => {
  
  return (
    // <View style={styles.title}>
    //   <Text >메인 화면 왔어요</Text>
    // </View>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'User') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeBackgroundColor: 'skyblue',
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          
        }}
      >
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
