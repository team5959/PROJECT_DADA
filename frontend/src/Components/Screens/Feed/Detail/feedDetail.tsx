import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { NavigationState } from '@react-navigation/native'

interface Props {
  navigation: NavigationState
}

export default function feedDetail({ navigation }: Props) {
  useEffect(() => {
    console.log('피드 디테일 페이지 시작')

  })
  
  return (
    <View style={{backgroundColor: 'yellow', flex: 1}}>
      
      <Image source={require('../../../../Assets/Image/test_02.png')} />
      <View style={{ backgroundColor: 'skyblue', margin:5, flex: 1}}>
        <Text>이때 날씨 정말 좋았지</Text>

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
          color='black'
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
          color='black'
          onPress={() => {
            console.log('피드 지운다.')
            // 여기에 피드 삭제 메서드가 들어갑니다. 

            alert('피드가 삭제되었습니다.')
          }}
          size={23}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  tag: {
    marginTop: 3,
    color: 'blue',
  },
  content: {
    marginTop: 3,
  },
})
