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
  const [location, setLocation] = useState(null);
  useEffect(() => {
    fetch(
      `https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/${ObjectFile.user.id}/feeds/${date}`,
    )
      .then((response) => response.json())
      .then((json) => {                
        json.photos.forEach((photo: { S3Object: { Key: string; }; }) => {
          images.push({
            image: `https://${photo.S3Object.Bucket}.s3.amazonaws.com/${photo.S3Object.Key}`,
          });
        });

        setTitle(json.title);
        setContents(json.contents);
        setTags(json.tags);
        setPhotos(json.photos);
        setLocation(json.location);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.main} key={title}>
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
            loop={false}
          />
        </View>

        {/* 내용 */}
        <View style={{backgroundColor: 'white', margin: 5, flex: 1}}>
          <Text style={styles.title}>{title}</Text>
          {location && <View style={{flexDirection: 'row'}}>
            <Icon style={styles.locationIcon} name="map-marker" type="font-awesome"/>
            <Text style={styles.location}>{location}</Text>
          </View>}
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
            navigation.navigate('FeedEdit', {
              title,
              tags,
              contents,
              date,
            });
          }}
          size={23}
        />

        <Icon
          raised
          name="trash-o"
          type="font-awesome"
          color="#F78C75"
          onPress={() => {
            setTimeout(function () {
              deleteDynamoDBContent(ObjectFile.user.id, date);
            }, 1500);
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
    return fetch(
      `https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/${duserid}/feeds/${ddate}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      },
    );
  };
  fetchCall()
    .then((res) => {
      console.log('Delete Feed Success');
      console.log(res);
    })
    .catch((err) => {
      console.log('Delete Feed Err');
    });
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    flex: 1,
  },
  mainIn: {
    flex: 1,
    margin: 7,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'BMHANNAPro',
    fontSize: 20,
  },
  location: {
    lineHeight:1,
    paddingTop: 17,
    fontFamily: 'BMHANNAPro',
    fontSize: 16,
  },
  locationIcon: {
    marginRight: 4
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
