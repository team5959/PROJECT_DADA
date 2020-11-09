import React, { useState} from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
// import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { Icon, Input, Button } from 'react-native-elements'

interface Props {
  navigation: NavigationState
}

export default function feedEdit({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');


  return (
    <View style={{flex: 1, backgroundColor: 'yellow'}}>
      <Text>피드 내용을 수정합니다.</Text>
      <Input
        placeholder="title"
        leftIcon={{ type: 'font-awesome', name: 'calendar-o' }}
        style={styles}
        onChangeText={value => setTitle({ title: value })}
      />
      <Input
        placeholder="tag"
        leftIcon={{ type: 'font-awesome', name: 'tag' }}
        style={styles}
        onChangeText={value => setTag({ tag: value })}
      />
      <Input
        placeholder="content"
        leftIcon={{ type: 'font-awesome', name: 'align-justify' }}
        style={styles}
        onChangeText={value => setContent({ content: value })}
      />
      <View style={{ flexDirection: 'row-reverse', position: 'absolute', right: 0, bottom: 0 }}>
        <Icon
          raised
          name='check'
          type='font-awesome'
          color='black'
          onPress={() => {
            alert('완료')
            console.log('피드 등록')
            //여기 피드 등록하는 함수를 넣습니다.
            navigation.navigate('Feed')
          }}
          size={23}
        />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  
})
