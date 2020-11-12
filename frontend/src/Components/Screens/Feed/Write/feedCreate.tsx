import React, { useState, } from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native'
import { NavigationState } from '@react-navigation/native';
import { Icon, Input, Button } from 'react-native-elements'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FlatListSlider } from 'react-native-flatlist-slider';
// import { Image } from 'react-native-svg';

var width = Dimensions.get('window').width - Dimensions.get('window').width * 0.868;

const images = [
  {
    image: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
    desc: 'Silent Waters in the mountains in midst of Himilayas',
  },

]

interface Props {
  navigation: NavigationState,
  route: any
}

const editFeed = ({ route, navigation }: Props) => {
  const routeItem  = route.params;
  console.log('넘어온 routeItem', routeItem)

  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [diaryDate, setDiaryDate] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: React.SetStateAction<boolean>) => {
    console.log('선택된 날짜',date)
    setDiaryDate(date)
    hideDatePicker();
  };

  return (
    <View style={styles.main}>
      <View style={styles.mainIn}>
        <ScrollView>

          <View style={{ flexDirection: 'row' }}>
            {/* 등록된 이미지 */}
            <Image
              source={require('../../../../Assets/Image/test_00.png')}
              style={{width: 50, height: 50, margin:8}}
            />                 

            <Input
              style={styles.title}
              placeholder="title"
              leftIcon={{ type: 'font-awesome', name: 'calendar-o' }}
              onChangeText={value => setTitle(value)}
            />
          </View>
          
          <Input
            multiline
            placeholder="content"
            leftIcon={{ type: 'font-awesome', name: 'align-justify' }}
            onChangeText={(value) => {
              setContent(value)
            }}
          />

          {/* 일자 선택 */}
          <View style={{ flexDirection: 'row', paddingLeft: 7 }}>
            <Button
              type='clear'
              title="작성일자 선택"
              onPress={showDatePicker}
            />
            {diaryDate && (
              <Text style={{ marginTop: 10, paddingRight: 58, width: '100%', textAlign: 'center' }}>
                <Text style={{ color: 'black', fontSize: 16, }}>{JSON.stringify(diaryDate).slice(1, 11)} / {JSON.stringify(diaryDate).slice(12, 14)}{JSON.stringify(diaryDate).slice(14, 17)}</Text>의 일기로 <Text style={{ color: 'black', fontSize: 16 }}>기록</Text>합니다.</Text>)
            }

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          
        </ScrollView>

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
                console.log('title', title)
                console.log('content', content)
              }}
              size={23}
            />
          </View>}
      </View>  
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'ivory'
  },
  mainIn: {
    margin: 7,
    marginTop: 10,
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    marginTop: 10,
    fontFamily: ''
  },
})

export default editFeed
