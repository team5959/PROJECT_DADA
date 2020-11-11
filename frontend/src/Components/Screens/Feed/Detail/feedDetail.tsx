import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { NavigationState } from '@react-navigation/native'
import ImagesSwiper from "react-native-image-swiper";

interface Props {
  navigation: NavigationState
}

var width = Dimensions.get('window').width; //full width

export default function feedDetail({ navigation }: Props) {
  useEffect(() => {
    console.log('피드 디테일 페이지 시작')
  })
  
  const customImg = [
    "https://firebasestorage.googleapis.com/v0/b/lotapp-9e84d.appspot.com/o/aster.jpg?alt=media&token=166e66b0-9c8e-4803-918e-25762c58dbda",
    "https://firebasestorage.googleapis.com/v0/b/lotapp-9e84d.appspot.com/o/fan.jpg?alt=media&token=b419d507-9de8-4c4c-97e3-6b4eb2202e68",
    "https://firebasestorage.googleapis.com/v0/b/lotapp-9e84d.appspot.com/o/stone.jpg?alt=media&token=e9d41537-7f26-4bfd-86eb-c2ef6fc58a9c"
  ];


  return (
    <View style={styles.main}>
      <View style={styles.mainIn}>
        {/* 등록된 이미지 */}
        <ImagesSwiper
          images={customImg}
          // autoplay={true}
          // autoplayTimeout={1.5}
          showsPagination={true}
          width={width*0.97}
          height={width}
        />

        {/* 내용 */}
        <View style={{ backgroundColor: 'white', margin: 5, flex: 1 }}>
          <Text style={styles.title}>이때 날씨 정말 좋았지</Text>

          <Text style={styles.tag}># 날씨 지렸다. # 그냥 하는 말</Text>

          <Text style={styles.content}>
            날이 정말 좋았따아아 내용을 작성하는 부분인데 너무 횡해 보여서 그냥 아무말이나 등록해놓은건데
            더이상 할말도 없고.
        </Text>

        </View>
        <View style={{ flexDirection: 'row-reverse', position: 'absolute', right: 0, bottom: 0 }}>
          <Icon
            raised
            name='edit'
            type='font-awesome'
            color='#494747'
            onPress={() => {
              console.log('피드 수정한다.')
              navigation.navigate('FeedEdit')
            }}
            size={23}
          />

          <Icon
            raised
            name='trash-o'
            type='font-awesome'
            color='#F78C75'
            onPress={() => {
              console.log('피드 지운다.')
              // 여기에 피드 삭제 메서드가 들어갑니다. 

              alert('피드가 삭제되었습니다.')
            }}
            size={23}
          />
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'ivory', 
    flex: 1
  },
  mainIn: {
    flex: 1,
    margin: 7,
    marginTop: 10,
    backgroundColor: 'ivory',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: "BMHANNAPro",
    fontSize: 20
  },
  tag: {
    fontFamily: "BMHANNAPro",
    marginTop: -7,
    color: 'blue',
    fontSize: 15
  },
  content: {
    fontFamily: "BMHANNAPro",
    marginTop: -7,
    fontSize: 16
  },
})
