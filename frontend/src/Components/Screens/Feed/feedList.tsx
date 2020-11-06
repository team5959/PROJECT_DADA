import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native'
import { NavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { Icon, Tile } from 'react-native-elements'

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
      
      
      <View style={styles.noneContent}>
        <Text>작성된 피드가 없으면 이걸 보여줍니다.</Text>
      </View>
      



      <Tile
        featured
        imageContainerStyle={{ 
          borderRadius: 20,
          // backgroundColor: '#f434', 
        }}
        imageSrc={require('../../../Assets/Image/test_00.png')}
        title="2020-11-03의 일기입니다."
        height={150}
        caption="Some Caption Text"
        captionStyle={{
          backgroundColor: 'red'
        }}
      >;
      </Tile> 

      

      
      
      <View style={styles.addFeed}>
        <Icon
          reverse
          name='add'
          type='ionicon'
          color='#543fa4'
          size={20}
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
  },
  noneContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }

})

export default HomeScreen
