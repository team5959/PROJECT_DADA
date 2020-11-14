import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, AsyncStorage } from 'react-native'
import { NavigationState } from '@react-navigation/native';
import { Icon, Input, Button } from 'react-native-elements'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'; 
import fs from 'react-native-fs'
import { decode } from 'base64-arraybuffer';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

var width = Dimensions.get('window').width - Dimensions.get('window').width * 0.868;

const images = [
  {
    image: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
    desc: 'Silent Waters in the mountains in midst of Himilayas',
  },
]

let currentDate = moment().format("YYYY.MM.DD");
let datee = ""

interface Props {
  navigation: NavigationState,
  route: any
}

const feedCreate = ({ route, navigation }: Props, props: { info: any }) => {
  const routeItem  = route.params;
  console.log('넘어온 routeItem', routeItem)
  
  useEffect(() => {
  })

  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [diaryDate, setDiaryDate] = useState(false);

  //사용자 정보 가져오기
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    setUserId(JSON.stringify(require('../../../../App').BucketID).slice(6, 27))
  }, [userId])

  currentDate = JSON.stringify(diaryDate).slice(1, 5) + "."
   + JSON.stringify(diaryDate).slice(6, 8) + "." 
   + JSON.stringify(diaryDate).slice(9, 11)
  
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: React.SetStateAction<boolean>) => {
    console.log('선택된 날짜',date)
    console.log('fetch 날짜', JSON.stringify(date).slice(1, 20))
    datee = JSON.stringify(date)
    console.log('이거라도 되라', datee)
    setDiaryDate(date)
    hideDatePicker();
  };

  return (
    <View style={styles.main}>
      <View style={styles.mainIn}>
        <ScrollView>

          <View style={{ flexDirection: 'row' }}>
            {/* 등록된 이미지 */}
            <Image
              source={require('../../../../Assets/Image/test_00.png')}
              style={{width: 50, height: 50, margin:8}}
            />                 

            <Input
              style={styles.title}
              placeholder="title"
              leftIcon={{ type: 'font-awesome', name: 'calendar-o' }}
              onChangeText={value => setTitle(value)}
            />
          </View>
          
          <Input
            multiline
            placeholder="content"
            leftIcon={{ type: 'font-awesome', name: 'align-justify' }}
            onChangeText={(value) => {
              setContent(value)
            }}
          />

          {/* 일자 선택 */}
          <View style={{ paddingLeft: 7 }}>
            <Button
              type='clear'
              title="작성일자 선택"
              onPress={showDatePicker}
            />
            {diaryDate && (
              <Text style={{ marginTop: 10, width: '100%', textAlign: 'center' }}>
                <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{JSON.stringify(diaryDate).slice(1, 11)} / {JSON.stringify(diaryDate).slice(12, 14)}{JSON.stringify(diaryDate).slice(14, 17)}</Text>의 일기로 <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>기록</Text>합니다.</Text>)
            }

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </ScrollView>

        {diaryDate &&
          <View style={{ flexDirection: 'row-reverse', position: 'absolute', right: 0, bottom: 0 }}>
            <Icon
              raised
              name='check'
              type='font-awesome'
              color='black'
              onPress={() => {
                alert('완료')
                console.log('피드 등록')
                //여기 피드 등록하는 함수를 넣습니다.
                FolderCreate(require('../../../../App').BucketID);
                PicUpload(require('../../../../App').BucketID, routeItem)
                contentDynamoDBUpload(require('../../../../App').BucketID, routeItem, title, content, datee)
                console.log('title', title)
                console.log('content', content)
                navigation.navigate('Feed')
              }}
              size={23}
            />
          </View>}
      </View>  
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'ivory',
    fontFamily: "BMHANNAPro",
  },
  mainIn: {
    margin: 7,
    marginTop: 10,
    flex: 1,
    backgroundColor: 'white',
    fontFamily: "BMHANNAPro",
  },
  title: {
    marginTop: 10,
    fontFamily: "BMHANNAPro",
  },
})

// 날짜로 폴더 생성 (YYYY.MM.DD/)
function FolderCreate(BucketName: string | number | boolean) {
  const s3 = new AWS.S3();

  var uploadParams = {
    Bucket : BucketName,
    Key : currentDate + '/'
  };

  s3.putObject(uploadParams, function(err: any, data: any){
    if(err){
      console.log("FILE Create Err", err);
    }else {
      console.log("FILE Create Success", data);
    }
  });
}

// 사진첩에서 체크한 사진 업로드
async function PicUpload(BucketName: string | number | boolean, datas : any){
  const s3 = new AWS.S3();

  for(var i = 0; i < datas._parts.length; i += 2){

    const base64 = await fs.readFile(datas._parts[i+1][1], 'base64')
    const arrayBuffer = decode(base64)
    
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: BucketName + "/" + currentDate,
        Key: datas._parts[i][1],
        Body: arrayBuffer,
        ContentType: 'image/jpeg',
        ACL: "public-read",
      }
    })

    var promise = upload.promise();

    promise.then(
      function(data: any){
        console.log("Upload Success", data);
      },
      function(err: any){
        console.log("Upload Err", err);
      }
    )
  }
}

// DynamoDB에 title, content 저장
async function contentDynamoDBUpload(BucketName: any, datas: any, title: any, content: any, datee : any){

  const param = {};
  console.log('첫번째 파람스', param)
  
  param['method'] = 'POST'
  param['header'] = {'content-type':'application/json'}

  console.log('두번째 파람스', param)
  
  const body = {};
  body['title'] = title
  body['content'] = content
  body['date'] = datee
  console.log('세번째 파람스', body)

  param['body'] = body
  console.log('네번째 파람스', param)

  const photos = new Array()
  for(var i = 0; i < datas._parts.length; i+=2) {
    const photo = {};
    // console.log('버킷이름', BucketName) // 정상 확인
    photo['Bucket'] = BucketName
    photo['Key'] = BucketName + "/" + currentDate + "/" + datas._parts[i][1]

    photos.push(photo)
  }
  
  // console.log('photos', photos)

  body['photos'] = photos
  

  let userid = JSON.stringify(require('../../../../App').BucketID).slice(6, 27)

  return fetch(`https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/${userid}/feeds`, JSON.parse(JSON.stringify(param)))
    .then((response) => {
      console.log('제발 와져라', response)
    })
    // .then((json) => {
    //   console.log('json', json)
    //   return json;
    // })
    .catch((error) => {
      console.error(error);
    });
};
export default feedCreate
