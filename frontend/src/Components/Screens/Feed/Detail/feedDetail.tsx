import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { NavigationState } from '@react-navigation/native'
import { FlatListSlider } from 'react-native-flatlist-slider';
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

const feedDetail = ({ route, navigation }) => {
  
  const { selectedDate } = route.params;
  const [title, setTitle] = useState([]);
  const [comment, setComment] = useState([]);
  const [tags, setTags ] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    console.log('피드 디테일 페이지 시작')
    
    fetch('https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/' + ObjectFile.user.id+'/feeds/2020-11-09T09:08:40')
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
  }, []) // 무한루프 방지용 2번째 변수 []

  console.log("ss: " + selectedDate );

  const bucket = "dada-" + ObjectFile.user.id;

  const predate = selectedDate.toJSON().split('T');
  const pretime = predate[1].split('Z')[0].split(',');
  const prefix = predate[0] + '/' + pretime + '/';

  viewAlbum(bucket,prefix);

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
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.tag}>{tags + ""}# 날씨 지렸다. # 그냥 하는 말</Text>

          <Text style={styles.content}>
            {comment}
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
