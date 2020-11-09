import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import { NavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { Button, Icon, Tile } from 'react-native-elements'

const AWS = require('aws-sdk')
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: "AKIA4YE3HYZ2XEQOVIO4",
  secretAccessKey: "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",
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

  
  

  const getMoviesFromApi = () => {
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

      <View style={{
        flex: 1,
        backgroundColor: 'ivory',
      }}>
        <View style={{ backgroundColor: 'white' }}>
          <Button
            title="ddd"
            onPress={() => {
              getMoviesFromApi()
            }} />
          
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
            markedDate={['2020-11-02', '2020-11-03']}
            weekStartsOn={1} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
          />
        </View>

        <View style={styles.noneContent}>
          <Text>{JSON.stringify(selectedDate).slice(1, 11)}</Text>
        </View>


        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
          <Tile
            height={160}
            overlayContainerStyle={{ backgroundColor: '#aeae', borderRadius: 18, marginBottom: 10 }}
            imageContainerStyle={{ backgroundColor: '#f7f7', borderRadius: 18 }}
            imageSrc={require('../../../Assets/Image/test_00.png')}
            title='2020-11-11의 추억'
            featured
          />

          <Tile
            height={160}
            overlayContainerStyle={{ backgroundColor: '#a1a1a1', borderRadius: 18, marginBottom: 10 }}
            imageContainerStyle={{ backgroundColor: '#DAD9FF', borderRadius: 18 }}
            imageSrc={require('../../../Assets/Image/test_01.png')}
            title='2020-11-11의 추억'
            featured
          />
        </ScrollView>

        <View style={styles.addFeed}>
          <Icon
            reverse
            name='add'
            type='ionicon'
            color='#f261DF'
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
        <Text>자료가 없어면 보여줄 화면</Text>
        <TouchableOpacity>
          <Image source={{uri: 'https://s3.amazonaws.com/dada-107302456767622872057/2020-11-09%2FIMG_2089.jpg'}}
          style={{width: 400, height: 400}} 
        />
          {/* <Image source={require('../../../Assets/Image/test_00.png')}/> */}
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
