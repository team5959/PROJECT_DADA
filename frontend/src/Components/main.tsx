import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image} from 'react-native'
import {Button} from 'react-native-elements'
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionics from 'react-native-vector-icons/dist/Ionicons';
import FeedScreen from './Screens/Feed/feedList'
import photoSelectFeed from './Screens/Feed/Write/photoSelectFeed'
import feedCreate from './Screens/Feed/Write/feedCreate'
import SearchScreen from './Screens/Search/search'
import FeedDetail from './Screens/Feed/Detail/feedDetail'
import FeedEdit from './Screens/Feed/Detail/feedEdit'
import Feed from '../Components/main'
import ObjectFile from './ObjectFile'
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
          return <Ionics name={iconName} size={size} color={color} />;
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
interface Props {
  navigation: NavigationState
}


const main = (props: { info: any }, { navigation }: Props) => {
  console.log('메인 페이지 시작')
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setUserInfo(props.info)
    //console.log('main으로 넘어온 값',userInfo)
  }, [userInfo])


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='DADA' 
          component={feedTabNavigation} 
          options={{ 
            headerTitleAlign: 'center',
            headerStatusBarHeight: -10
          }}
        />
        <Stack.Screen 
          name='photoSelectFeed'
          component={photoSelectFeed} 
          options={{
            // title: 'Diary',
            headerTitleAlign: 'center',
            headerStatusBarHeight: -10
          }}
        />
        <Stack.Screen 
          name='feedCreate' 
          component={feedCreate} 
          options={{
            // title: 'Diary',
            headerTitleAlign: 'center',
            headerStatusBarHeight: -10
          }}
        />

        {/* //피드 디테일 */}
        <Stack.Screen
          name='FeedDetail'
          component={FeedDetail}
          options={{
            // title: 'Diary',
            headerTitleAlign: 'center',
            headerStatusBarHeight: -10
          }}
        />
        <Stack.Screen
          name='FeedEdit'
          component={FeedEdit}
          options={{
            // title: 'Diary',
            headerTitleAlign: 'center',
            headerStatusBarHeight: -10,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          
        />
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
