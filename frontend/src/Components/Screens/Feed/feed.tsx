import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native'
import { NavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { Icon } from 'react-native-elements'

const Stack = createStackNavigator();

interface Props {
  navigation: NavigationState
}

const HomeScreen = ({ navigation }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'ivory',
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

      <Button
        title="To Search Screen"
        onPress={()=>{
          console.log("사진선택 for Feed")
          navigation.navigate('Search', 
            // {
            //   userIdx: 100,
            //   userName: 'jong',
            //   userLastName: 'kim',
            // }
          )
        }}
      />
      
      <View style={styles.addFeed}>
        <Icon
          reverse
          name='add'
          type='ionicon'
          color='#517fa4'
          reverseColor='white'
          onPress={()=>{
            console.log('사진 선택시작')
            navigation.navigate('photoSelectFeed')  
          }} />
      </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
  addFeed: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  addIcon: {
    backgroundColor: "white"
  }

})

export default HomeScreen
