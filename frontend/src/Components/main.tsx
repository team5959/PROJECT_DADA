
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FeedScreen from './Screens/Feed/feed'
import photoSelectFeed from './Screens/Feed/photoSelectFeed'
import EditFeed from './Screens/Feed/editFeed'
import SearchScreen from './Screens/Search/search'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const feedTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = focused
              ? 'home-sharp'
              : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused
              ? 'md-search'
              : 'search-outline';
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeBackgroundColor: 'skyblue',
        activeTintColor: 'white',
        inactiveTintColor: 'grey',
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  )
}


const main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Feed' component={feedTabNavigation} />
        <Stack.Screen name='photoSelectFeed' component={photoSelectFeed} />
        <Stack.Screen name='EditFeed' component={EditFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  // search: {
  //   flex: 1,
  //   backgroundColor: 'red'
  // }
})

export default main
