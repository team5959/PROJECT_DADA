import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { NavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { Button, Icon } from 'react-native-elements'
import ObjectFile from '~/Components/ObjectFile';

const AWS = require('aws-sdk')
AWS.config.update({
  region: ObjectFile.aws.region,
  accessKeyId: ObjectFile.aws.accessKeyId,
  secretAccessKey: ObjectFile.aws.secretAccessKey
});

const Stack = createStackNavigator();

interface Props {
  navigation: NavigationState 
}

const HomeScreen = ({ navigation }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isData, setIsData] = useState(true);
  
  console.log('selectedDate:', selectedDate)

  viewAlbum("dada-107302456767622872057");

  
  // axios 테스트 파일(정상 작동 확인완료) 
  const fetchTest = () => {
    return fetch('https://reactnative.dev/movies.json')
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        return json.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isData) {
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
              console.log('selectedDate:', selectedDate)
            }}
            // onPressGoToday={(today) => {
            //   setSelectedDate('today:',today);
            // }}
            // onSwipeDown={() => {
            //   alert('onSwipeDown');
            // }}
            markedDate={['2020-11-02', '2020-11-09']}
            weekStartsOn={1} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
          />
        </View>


        {/* map으로 돌릴부분 */}
        <ScrollView style={{ flex: 1, margin: 7}}>
          <TouchableOpacity
            onPress={()=>{
              navigation.navigate('FeedDetail',{
                selectedDate : selectedDate
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
              <Text style={styles.textInCard}>{
                JSON.stringify(selectedDate).slice(6, 8)}월 {JSON.stringify(selectedDate).slice(9, 11)}의 
                첫 번째 추억{'\n'}
                <Text style={styles.tag}>#야... #이거 개어려움</Text>    
              </Text>
                   
              
              
            </ImageBackground>
          </TouchableOpacity>

          
        </ScrollView>

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
  } else {
    return (
      
      <View>
        <Text>아직 피드가 없네요 작성해보세요!</Text>
        <TouchableOpacity>
          <Image source={{uri: 'https://s3.amazonaws.com/dada-107302456767622872057/2020-11-09%2FIMG_2089.jpg'}}
          style={{width: 400, height: 400}} 
        />
        </TouchableOpacity>
        
      </View>
    )
  }
  
}

function getHtml(template: any[]) {
  return template.join('\n');
}


// Show the photos that exist in an album.
function viewAlbum(BucketName: string | number | boolean) {
  const s3 = new AWS.S3();
  
  var albumPhotosKey = encodeURIComponent(BucketName) + '/';

  // 버킷 리스트 확인
  // s3.listBuckets(function(err: any, data: { Buckets: any; }) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data.Buckets);
  //   }
  // });

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
      console.log("Error", err);
    } else {
      console.log("버킷 데이터 : ", data);

      console.log(s3.endpoint);
      console.log(s3.endpoint.href);
      var href = s3.endpoint.href;
      
      var bucketUrl = href + BucketName + '/';

      var photos = data.Contents.map(function(photo: { Key: any; }) {
        var photoKey = photo.Key;
        
        var photoUrl = bucketUrl + encodeURIComponent(photoKey);
        
        console.log("ss!!!!!" + photos);
        console.log("dd!!!!!" + photoUrl);
        
      
      });      

      
    }
    //console.log(photos);
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
