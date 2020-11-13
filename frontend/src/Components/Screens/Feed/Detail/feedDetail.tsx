import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { NavigationState } from '@react-navigation/native'
import ObjectFile from '~/Components/ObjectFile';

const AWS = require('aws-sdk')
AWS.config.update({
  region: ObjectFile.aws.region,
  accessKeyId: ObjectFile.aws.accessKeyId,
  secretAccessKey: ObjectFile.aws.secretAccessKey
});

interface Props {
  navigation: NavigationState
}

export default function feedDetail( { route , navigation }) {
  
  const { selectedDate } = route.params;
  const [title, setTitle] = useState([]);
  const [comment, setComment] = useState([]);
  const [tags, setTags ] = useState([]);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    console.log('피드 디테일 페이지 시작')

    
      fetch('https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/107302456767622872057/feeds/2020-11-09T09:08:40')
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
  
          setTitle(json.title)
          setComment(json.comment)
          setTags(json.tags)
          setPhotos(json.S3Object.Key)
          console.log("사진사진사진" + photos)
        })
        .catch((error) => {
          console.error(error);
        });
  
       //console.log("fffff" + this.title)
    
  }, [])

  
  //selectedDate 임의지정 - feedlist에서 가져올때 props로 넘겨줘야 함
  console.log("ss: " + selectedDate );


  const bucket = "dada-" + ObjectFile.user.id;


  const predate = selectedDate.toJSON().split('T');
  const pretime = predate[1].split('Z')[0].split(',');
  //console.log(predate[0] + "  으악  " + pretime);
  const prefix = predate[0] + '/' + pretime + '/';

  console.log("prefix : " + prefix);
  viewAlbum(bucket,prefix);

  
// Show the photos that exist in an album.
  function viewAlbum(BucketName: string | number | boolean, PrefixName: string | number | boolean) {
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

    var bucketParamsforAcl={
      Bucket : BucketName
    }
    var bucketParams = {
      Bucket : BucketName,
      Prefix : PrefixName
    };

    //읽기 권한 부여
    s3.getBucketAcl(bucketParamsforAcl, function(err: any, data: { Grants: any; }) {
      if (err) {
        console.log("Error ACL", err);
      } else if (data) {
        console.log("Success ACL", data.Grants);
      }
    });

    s3.listObjects(bucketParams, function(err: any, data: any) {
      if (err) {
        console.log("Error list", err);
      } else {
        console.log("Success list", data);

        // console.log(s3.endpoint);
        // console.log(s3.endpoint.href);
        var href = s3.endpoint.href;
        
        var bucketUrl = href + BucketName + '/';
      // /2020-11-09/00:00:00.000/image.jpg


        var photos = data.Contents.map(function(photo: { Key: any; }) {
          var photoKey = photo.Key;
          
          var photoUrl = bucketUrl + encodeURIComponent(photoKey);
          
          //console.log("ss!!!!!" + photos);
          console.log("사진:" + photoUrl);
          
        });      

        
      }
      //console.log(photos);
    });
  }
  
  //<Image source={require('../../../../Assets/Image/test_02.png')} />
  
  return (
    <View style={{backgroundColor: 'yellow', flex: 1}}>
      <Image source={{uri: 'https://s3.amazonaws.com/dada-107302456767622872057/' + photos}}
          style={{width: 400, height: 400}} 
        />
      <View style={{ backgroundColor: 'skyblue', margin:5, flex: 1}}>
        <Text>{title}</Text>

        
        <Text style={styles.tag}>{tags + ""} +"" 를 해야 ,로 구분되서 출력되는데 이거 무엇 #날씨 지렸다. #그냥 하는 말</Text>

        <Text>
          {comment} 
        </Text>

      </View>
      <View style={{ flexDirection: 'row-reverse', position: 'absolute', right: 0, bottom: 0 }}>
        <Icon
          raised
          name='edit'
          type='font-awesome'
          color='black'
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
          color='black'
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

const styles = StyleSheet.create({
  tag: {
    color: 'blue',
  },
})
