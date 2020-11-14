import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, } from 'react-native'
import { NavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { Icon } from 'react-native-elements'
import ObjectFile from '~/Components/ObjectFile';

const AWS = require('aws-sdk')
AWS.config.update({
  region: ObjectFile.aws.region,
  accessKeyId: ObjectFile.aws.accessKeyId,
  secretAccessKey: ObjectFile.aws.secretAccessKey
});

const Stack = createStackNavigator();

console.log('###################################피드 리스트 페이지 시작###################################')

interface Props {
  navigation: NavigationState 
}
const mark = [];

const HomeScreen = ({ navigation }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log('###################홈스크린함수 시작###################')
  
 
  const [feeds, setFeeds] = useState([]);

  
  console.log('selectedDate:', selectedDate)

  useEffect(() => {
    viewAlbum(require('../../../App').BucketID);
    
  })
  
  const getFeedList = ( date: Date ) => {
    const feeddate = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
    console.log("feeddate : " + feeddate);

    fetch('https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/' + ObjectFile.user.id+'/feeds/of/' + feeddate)
    .then((response) => response.json())
    .then((json) => {
      console.log("response :" + JSON.stringify(json));
      setFeeds(json)
      return json;
    })
    .catch((error) => {
      console.error(error);
  });
  }  

 
  

  return (
    <View style={styles.main}>
      {/* 상단 달력 */}
      <View style={{ backgroundColor: 'white' }}>
        <CalendarStrip
          // showWeekNumber
          selectedDate={selectedDate}
          onPressDate={(date: React.SetStateAction<Date>) => {
            console.log('date:', date)
            setSelectedDate(date);
            const tmp = getFeedList(date);
            console.log("tmp :" + tmp);
            console.log('선택된 날짜:', selectedDate)
          }}
          // onPressGoToday={(today) => {
          //   setSelectedDate('today:',today);
          // }}
          // onSwipeDown={() => {
          //   alert('onSwipeDown');
          // }}

          markedDate={mark}
          weekStartsOn={1} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
        />
      </View>
      { feeds[0] === undefined ? 
        (<View style={{ flex: 1, margin: 7 }}>
          {/* 일기 작성 유도 피드 */}
          <TouchableOpacity
            onPress={() => {
              alert('가피드 생성')
            }}>
            <ImageBackground
              source={{ uri: 'https://s3.amazonaws.com/dada-107302456767622872057/2020-11-09%2FIMG_2089.jpg' }}
              style={{
                width: '100%',
                height: 160,
                backgroundColor: 'navy',
                borderRadius: 20,
                marginBottom: 10,
              }}              
            >
              <Text style={styles.textInCard}>아직 작성한 일기가 없네요! {'\n'}
                <Text style={styles.tag}>#일기를 써줄게요!</Text>
              </Text>              
            </ImageBackground>
          </TouchableOpacity>
        </View>)
        :
        (feeds.map((feed, i) => {
          console.log("으악" + feed.date);
          console.log(selectedDate);
          console.log(feed.date);
          return <ScrollView style={{ flex: 1, margin: 7 }} key={i}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('FeedDetail', {
                  selectedDate: selectedDate,
                  date: feed.date
                })
              }}
            >
              <ImageBackground
                source={{ uri: 'https://s3.amazonaws.com/dada-107302456767622872057/2020-11-09%2FIMG_2089.jpg' }}
                style={{
                  width: '100%',
                  height: 160,
                  backgroundColor: 'skyblue',
                  borderRadius: 20,
                  marginBottom: 10,
                }}
              >
                <Text style={styles.textInCard}>{feed.title}{'\n'}
                  {/* 가피드때는 이걸로 ? */}
                  {/* {JSON.stringify(selectedDate).slice(6, 8)}월 {JSON.stringify(selectedDate).slice(9, 11)}의 첫 번째 추억{'\n'} */}
                  <Text style={styles.tag}>#야... #이거 개어려움</Text>
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </ScrollView>
        }))
      }       

      <View style={styles.addFeed}>
        <Icon
          raised
          name='add'
          type='ionicon'
          color='black'
          size={20}
          reverseColor='black'
          onPress={() => {
            console.log('사진 선택시작')
            navigation.navigate('photoSelectFeed')
          }} />
      </View>
    </View>
  )

}

function getHtml(template: any[]) {
  return template.join('\n');
}


// Show the photos that exist in an album.
function viewAlbum(BucketName: string | number | boolean) {
  const s3 = new AWS.S3();
  
  var albumPhotosKey = encodeURIComponent(BucketName) + '/';

  var bucketParams = {
    Bucket : BucketName
  };

  //디렉토리 이름만 가져오기 도전
  s3.listObjects(bucketParams, function(err: any, data: any) {
    if (err) {
      console.log("Error", err);
    } else {

      data.Contents.map(function(photo: { Key: any; }) {

        
        const d = photo.Key.split('/');
        console.log("디렉토리만 떠주세요!!!!!" + d[0]);
        // console.log("dd!!!!!" + photoUrl);
        mark.push(d[0]);
      });      
    }
  });

  var bucketParams = {
    Bucket : BucketName
  };

  //읽기 권한 부여
  s3.getBucketAcl(bucketParams, function(err: any, data: { Grants: any; }) {
    if (err) {
      console.log("Error", err);
    } else if (data) {
      console.log("Success", data.Grants);
    }
  });

  s3.listObjects(bucketParams, function(err: any, data: any) {
    if (err) {
      // console.log("Error", err);
    } else {
      // console.log("버킷 데이터 : ", data);

      console.log(s3.endpoint);
      console.log(s3.endpoint.href);
      var href = s3.endpoint.href;
      
      var bucketUrl = href + BucketName + '/';

      var photos = data.Contents.map(function(photo: { Key: any; }) {
        var photoKey = photo.Key;
        
        var photoUrl = bucketUrl + encodeURIComponent(photoKey);
        
        // console.log("ss!!!!!" + photos);
        // console.log("dd!!!!!" + photoUrl);
      });      
    }
  });

}

const styles = StyleSheet.create({
  tag:{
    fontFamily: "BMHANNAPro",
    fontSize: 20,
  },
  main: {
    flex: 1,
    backgroundColor: 'ivory',
  },
  textInCard: {
    flex: 1,
    borderRadius: 20,
    color: "white",
    fontSize: 28,
    // fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#000000a0",
    fontFamily: "BMHANNAPro"
  },
  addFeed: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  noneContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 3,
  }

})

export default HomeScreen
