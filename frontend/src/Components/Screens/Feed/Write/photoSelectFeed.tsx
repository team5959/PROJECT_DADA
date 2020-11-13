import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, BackHandler } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import CropPicker from 'react-native-image-crop-picker';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface Props {
  navigation: NavigationState
}

const createFeed = ({ navigation }: Props) => {
  const [imageData, setImageData] = useState(null)
  const tmp = new FormData();

  useEffect(() => {
    CropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      inculdeExif: true
    }).then(images => {

      for (var i = 0; i < images.length; i++) {
        tmp.append('파일명', images[i].path.substring(images[i].path.lastIndexOf("/") + 1));
        tmp.append('path', images[i].path);
      }
      
      navigation.navigate('feedCreate', tmp)
    }).catch(() => {
      console.log('사진을 불러오는데 실패하였습니다');
      navigation.navigate('Feed')
    })
  })

  useEffect(()=> {
    navigation.navigate('Feed')
  })

  return (
    <View style={{flex:1}}>  
      <Button
        title='사진 선택'
        onPress={() => {
          console.log('수정 페이지이동')
          console.log("불러온 데이터", tmp)
          
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