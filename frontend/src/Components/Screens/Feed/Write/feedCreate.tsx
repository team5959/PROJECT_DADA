import React, { useState, } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { Icon, Input, Button } from 'react-native-elements'
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Stack = createStackNavigator();

interface Props {
  navigation: NavigationState,
  route: any
}

const editFeed = ({ route, navigation }: Props) => {
  const routeItem  = route.params;
  console.log('넘어온 routeItem', routeItem)

  const [title, setTitle] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [content, setContent] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <View>
      <Text>피드 내용을 추가 합니다.</Text>
      <Input
        placeholder="title"
        // leftIcon={{ type: 'font-awesome', name: 'calendar-o' }}
        onChangeText={value => setTitle(value)}
      />

      <Input
        placeholder="content"
        // leftIcon={{ type: 'font-awesome', name: 'align-justify' }}
        onChangeText={(value) => {
          setContent(value)
        }}
      />
          
      <Button
        type='clear'
        title="작성일자 선택" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
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
  textareaContainer: {
    height: 180,
    padding: 5,
    backgroundColor: '#F5FCFF',
  },
  textarea: {
    textAlignVertical: 'top',
    height: 170,
    fontSize: 14,
    color: '#333',
  },
})

export default editFeed
