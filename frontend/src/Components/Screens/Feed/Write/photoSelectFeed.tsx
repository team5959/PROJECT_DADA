import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, BackHandler} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import CropPicker from 'react-native-image-crop-picker';
import { keyframes } from 'styled-components';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface Props {
  navigation: NavigationState
}

const createFeed = ({ navigation }: Props) => {

  const tmp = new FormData();

  useEffect (() => {
    CropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      inculdeExif: true
    }).then(images => {
      console.log(images);
      for(var i = 0; i < images.length; i ++){
        tmp.append('path',images[i].path);
      }
    }).catch(() => {
      console.log('사진을 불러오는데 실패하였습니다');
      navigation.navigate('Feed')
    })
  })

  return (
    <View>
      <Text>피드 생성을 위한 사진 선택창입니다.</Text>   

      <Button
        title='피드 내용 달기'
        onPress={() => {
          console.log('수정 페이지이동')
          console.log("불러온 데이터", tmp)
          navigation.navigate('EditFeed')
        }} />
    </View>
  )
}

// const Styles = StyleSheet.create ({
//   feed: {
//     height: 10,
//     backgroundColor: "green"
//   }
// })


export default createFeed
