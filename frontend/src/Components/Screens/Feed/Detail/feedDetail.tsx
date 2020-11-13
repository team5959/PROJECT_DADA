import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import {FlatListSlider} from 'react-native-flatlist-slider';
import ObjectFile from '~/Components/ObjectFile';

var width = Dimensions.get('window').width; //full width

const FeedDetail = ({route, navigation}) => {
  const {selectedDate, date} = route.params; // 무슨형식 쓸지 모르니 우선 둘다
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [tags, setTags] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(
      `https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/${ObjectFile.user.id}/feeds/${date}`,
    )
      .then((response) => response.json())
      .then((json) => {
        setTitle(json.title);
        setContents(json.contents);
        setTags(json.tags);
        setPhotos(json.photos);
        setImages(
          json.photos.map((photo) => {
            return {
              image: `https://${photo.S3Object.Bucket}.s3.amazonaws.com/${photo.S3Object.Key}`,
              desc: 'hi',
            };
          }),
        );
      })
      .catch((error) => {
        console.error(error);
        // TODO 에러 발생 알림, 이전 페이지로 돌아가기
      });
  }, []); // 무한루프 방지용 2번째 변수 []

  return (
    <View style={styles.main}>
      <View style={styles.mainIn}>
        {/* 등록된 이미지 */}
        <View style={{flex: 0.6}}>
          <FlatListSlider
            data={images}
            width={width}
            height={width * 0.7}
            // timer={5000}
            onPress={(value: any) => {
              alert(JSON.stringify(value));
              navigation.navigate('PhotoDetail', photos[value]);
            }}
            // contentContainerStyle={{ paddingHorizontal: 16 }}
            indicatorContainerStyle={{position: 'absolute', bottom: 20}}
            indicatorActiveColor={'skyblue'}
            indicatorInActiveColor={'#ffffff'}
            indicatorActiveWidth={15}
            animation={false}
            autoscroll={false}
            loop={true}
          />
        </View>

        {/* 내용 */}
        <View style={{backgroundColor: 'white', margin: 5, flex: 1}}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.tag}>{tags.map((tag) => `#${tag} `)}</Text>

          <Text style={styles.content}>{contents}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row-reverse',
          position: 'absolute',
          right: 0,
          bottom: 0,
        }}>
        <Icon
          raised
          name="edit"
          type="font-awesome"
          color="#494747"
          onPress={() => {
            console.log('피드 수정한다.');
            navigation.navigate('FeedEdit');
          }}
          size={23}
        />

        <Icon
          raised
          name="trash-o"
          type="font-awesome"
          color="#F78C75"
          onPress={() => {
            console.log('피드 지운다.')
            // 여기에 피드 삭제 메서드가 들어갑니다.
            setTimeout(function () {
              deleteDynamoDBContent(ObjectFile.user.id, date)
            }, 2000) // 사진 여러개면 업로드 동안 시간 걸려서 타이머 
          }}
          size={23}
        />
      </View>
    </View>
  );
};
export default FeedDetail;

// // DynamoDB 삭제
function deleteDynamoDBContent(duserid: any, ddate: any) {  
  var fetchCall = function () {
    return fetch(`https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/${duserid}/feeds/${ddate}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json'
      },
    })
  }
  fetchCall().then((res) => {
    console.log("Delete Feed Success")
    console.log(res)
  }).catch((err) => {
    console.log("Delete Feed Err")
  })
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'ivory',
    flex: 1,
  },
  mainIn: {
    flex: 1,
    margin: 7,
    marginTop: 10,
    backgroundColor: 'ivory',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'BMHANNAPro',
    fontSize: 20,
  },
  tag: {
    fontFamily: 'BMHANNAPro',
    marginTop: -7,
    color: 'blue',
    fontSize: 15,
  },
  content: {
    fontFamily: 'BMHANNAPro',
    marginTop: -7,
    fontSize: 16,
  },
});
