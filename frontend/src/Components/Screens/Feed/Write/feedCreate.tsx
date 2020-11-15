import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Image, Alert} from 'react-native';
import {Icon, Input, Button} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import fs from 'react-native-fs';
import {decode} from 'base64-arraybuffer';
import ObjectFile from '~/Components/ObjectFile';
import Loader from '~/Components/Util/Loader';

const AWS = require('aws-sdk');
AWS.config.update({
  region: ObjectFile.aws.region,
  accessKeyId: ObjectFile.aws.accessKeyId,
  secretAccessKey: ObjectFile.aws.secretAccessKey,
});

const FeedCreate = ({route, navigation}) => {
  const routeItem = route.params;

  useEffect(() => {});

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  return (
    <View style={styles.main}>
      <Loader isLoading={isLoading} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <View style={styles.mainIn}>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            {/* TODO 등록된 이미지 */}
            <Image
              source={require('../../../../Assets/Image/test_00.png')}
              style={{width: 50, height: 50, margin: 8}}
            />
          </View>

          <View style={{paddingLeft: 7}}>
            <Button
              titleStyle={{fontFamily: 'BMHANNAPro', color: '#000'}}
              buttonStyle={{borderColor: '#222', backgroundColor: '#eee'}}
              icon={{type: 'font-awesome', name: 'calendar-o'}}
              type="outline"
              title={`${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`}
              onPress={showDatePicker}
            />

            <Input
              style={styles.title}
              label="Title"
              placeholder="제목을 입력해주세요."
              leftIcon={{type: 'font-awesome', name: 'bookmark'}}
              onChangeText={(value) => setTitle(value)}
            />

            <Input
              style={{fontFamily: 'BMHANNAPro'}}
              multiline
              label="Contents"
              placeholder="내용을 입력해주세요."
              leftIcon={{type: 'font-awesome', name: 'align-justify'}}
              onChangeText={(value) => setContents(value)}
            />
          </View>
        </ScrollView>

        <View
          style={{
            flexDirection: 'row-reverse',
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}>
          <Icon
            raised
            name="check"
            type="font-awesome"
            color="black"
            onPress={() => {
              setLoading(true);
              const parsedDate = `${JSON.stringify(date).slice(
                1,
                11,
              )}T${JSON.stringify(date).slice(12, 20)}`;
              PicUpload(
                require('../../../../App').BucketID,
                routeItem,
                parsedDate,
              ).then(() => {
                contentDynamoDBUpload(
                  require('../../../../App').BucketID,
                  routeItem,
                  {
                    date: parsedDate,
                    title,
                    contents,
                  },
                )
                  .then(() => {
                    setLoading(false);
                    Alert.alert('Done!', '피드가 만들어졌습니다!', [
                      {
                        text: 'OK',
                        onPress: () => {
                          navigation.navigate('Feed');
                        },
                      },
                    ]);
                  })
                  .catch(() => {
                    setLoading(false);
                    Alert.alert(
                      'Error',
                      '업로드 중 오류가 생겼습니다. \n다시 시도해주세요.',
                      [
                        {
                          text: 'OK',
                        },
                      ],
                    );
                  });
              });
            }}
            size={23}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    fontFamily: 'BMHANNAPro',
  },
  main: {
    flex: 1,
    backgroundColor: 'ivory',
    fontFamily: 'BMHANNAPro',
  },
  mainIn: {
    margin: 7,
    marginTop: 10,
    flex: 1,
    backgroundColor: 'white',
    fontFamily: 'BMHANNAPro',
  },
  title: {
    marginTop: 10,
    fontFamily: 'BMHANNAPro',
  },
});

// 사진첩에서 체크한 사진 업로드
async function PicUpload(Bucket: string, photoData: any, date: string) {
  const promises = [];
  const slashDate = date.replace('T', '/');

  for (let i = 0; i < photoData._parts.length; i += 2) {
    const base64 = await fs.readFile(photoData._parts[i + 1][1], 'base64');
    const arrayBuffer = decode(base64);

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket,
        Key: `${slashDate}/${photoData._parts[i][1]}`,
        Body: arrayBuffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      },
    });

    promises.push(upload.promise());
  }

  await Promise.all(promises);
}

// DynamoDB에 title, content 저장
function contentDynamoDBUpload(
  Bucket: any,
  photoData: any,
  item: {date: string; title: string; contents: string},
) {
  const photos: Array<{Bucket: string; Key: string}> = [];
  const slashDate = item.date.replace('T', '/');

  for (let i = 0; i < photoData._parts.length; i += 2) {
    // photos 채워넣기
    photos.push({
      Bucket,
      Key: `${slashDate}/${photoData._parts[i][1]}`,
    });
  }

  const fetchCall = function () {
    return fetch(
      `https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/${ObjectFile.user.id}/feeds`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          photos,
        }),
      },
    );
  };

  return new Promise((resolve, reject) => {
    fetchCall()
      .then((response) => {
        if (response.status !== 200) {
          console.error('피드 업로드 중 에러 발생', response);
          reject();
        }
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject();
      });
  });
}

export default FeedCreate;
