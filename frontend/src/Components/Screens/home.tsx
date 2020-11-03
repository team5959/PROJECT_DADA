import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarStrip from 'react-native-slideable-calendar-strip';


const HomeScreen = ({ navigation }) => {
  // let today = new Date()
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentDateIndex =  null

  return (
    <View style={{
      backgroundColor: 'ivory',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <View style={{ backgroundColor: 'white'}}>
        <CalendarStrip
          // showWeekNumber
          style={{ backgroundColor: 'red' }}
          selectedDate={selectedDate}
          onPressDate={(date) => {
            console.log('date:',date)
            setSelectedDate(date);
          }}
          // onPressGoToday={(today) => {
          //   setSelectedDate('today:',today);
          // }}
          // onSwipeDown={() => {
          //   alert('onSwipeDown');
          // }}
          markedDate={['2020-11-02', '2020-11-03' ]}
          weekStartsOn={1} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
        />
      </View>
      
      <Text>Home Screen</Text>
      <Button
        title="To Search Screen"
        onPress={()=>{
          navigation.navigate('Search', {
            userIdx: 100,
            userName: 'jong',
            userLastName: 'kim',
          })
        }}
      />
    </View>
  )
}

export default HomeScreen
