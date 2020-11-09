import React from 'react'
import { View, Text, Button } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationState } from '@react-navigation/native';

const Stack = createStackNavigator();

interface Props {
  navigation: NavigationState,
  route: any
}

const feedCreate = ({ route, navigation }: Props) => {
  const routeItem  = route.params;
  console.log('넘어온 routeItem', routeItem)

  return (
    <View>
      <Text>피드 내용 수정할 페이지입니다.</Text>
      <Button
        title='업로드 하고 메인으로 이동'
        onPress={()=>{
          navigation.navigate('Feed')
        }}
      />
    </View>
  )
}

export default feedCreate
