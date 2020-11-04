import React from 'react'
import { View, Text, Button} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationState } from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface Props {
  navigation: NavigationState
}

const createFeed = ({ navigation }: Props) => {
  return (
    <View>
      <Text>피드 생성을 위한 사진 선택창입니다.</Text>
      <Button
        title='피드 내용 달기'
        onPress={() => {
          console.log('수정 페이지이동')
          navigation.navigate('EditFeed')
        }} />
    </View>
  )
}

export default createFeed
