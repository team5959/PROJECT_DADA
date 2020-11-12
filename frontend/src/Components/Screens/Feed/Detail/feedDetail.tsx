import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { NavigationState } from '@react-navigation/native'
import { FlatListSlider } from 'react-native-flatlist-slider';

interface Props {
  navigation: NavigationState
}

var width = Dimensions.get('window').width; //full width

const images = [
  {
    image: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
    desc: 'Silent Waters in the mountains in midst of Himilayas',
  },
  {
    image: 'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
    desc:
      'Red fort in India New Delhi is a magnificient masterpeiece of humans',
  },
]

const feedDetail = ({ navigation }: Props) => {
  useEffect(() => {
    console.log('피드 디테일 페이지 시작')
  })

  return (
    <View style={styles.main}>
      <View style={styles.mainIn}>
        {/* 등록된 이미지 */}
        <View style={{flex: 0.6}}>
          <FlatListSlider
            data={images}
            height={width*0.7}
            // timer={5000}
            onPress={(value) => {
              alert(JSON.stringify(value))
              navigation.navigate('PhotoDetail')
            }}
            // contentContainerStyle={{ paddingHorizontal: 16 }}
            indicatorContainerStyle={{ position: 'absolute', bottom: 20 }}
            indicatorActiveColor={'skyblue'}
            indicatorInActiveColor={'#ffffff'}
            indicatorActiveWidth={15}
            animation={false}
            autoscroll={false}
            loop={true}
          />
        </View>        

        {/* 내용 */}
        <View style={{ backgroundColor: 'white', margin: 5, flex: 1 }}>
          <Text style={styles.title}>이때 날씨 정말 좋았지</Text>

          <Text style={styles.tag}># 날씨 지렸다. # 그냥 하는 말</Text>

          <Text style={styles.content}>
            날이 정말 좋았따아아 내용을 작성하는 부분인데 너무 횡해 보여서 그냥 아무말이나 등록해놓은건데
            더이상 할말도 없고.
          </Text>
        </View>     

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
  )
}
export default feedDetail

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
