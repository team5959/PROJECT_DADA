import React, { useState, } from 'react'
import { View, Text, StyleSheet, Span } from 'react-native'
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
  const [diaryDate, setDiaryDate] = useState(false);
  const [content, setContent] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log('선택된 날짜',date)
    setDiaryDate(date)
    hideDatePicker();
  };

  return (
    <View style={{flex:1}}>
      <Input
        placeholder="title"
        // leftIcon={{ type: 'font-awesome', name: 'calendar-o' }}
        onChangeText={value => setTitle(value)}
      />

      <Input
        multiline
        placeholder="content"
        // leftIcon={{ type: 'font-awesome', name: 'align-justify' }}
        onChangeText={(value) => {
          setContent(value)
        }}
      />
      <View style={{flexDirection: 'row', paddingLeft: 7}}>
        <Button
          type='clear'
          title="작성일자 선택" 
          onPress={showDatePicker} 
        />
        {diaryDate && (<Text style={{ marginTop: 10, paddingRight: 20, width: '100%', textAlign: 'center' }}><Text style={{ color: "navy" }}>{JSON.stringify(diaryDate).slice(1, 11)} / {JSON.stringify(diaryDate).slice(12,17)}</Text>의 일기로 <Text style={{color: "navy"}}>기록</Text>합니다.</Text>)}
        
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        

      </View>


      {diaryDate && 
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
      </View>}
      
    </View>
  )
}

const styles = StyleSheet.create({
  
})

export default editFeed
