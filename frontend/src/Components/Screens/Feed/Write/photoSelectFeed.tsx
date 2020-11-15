import React, {useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import CropPicker from 'react-native-image-crop-picker';

const CreateFeed = ({navigation}) => {
  const tmp = new FormData();

  useEffect(() => {
    CropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      inculdeExif: true,
    })
      .then((images) => {
        for (let i = 0; i < images.length; i++) {
          tmp.append(
            '파일명',
            images[i].path.substring(images[i].path.lastIndexOf('/') + 1),
          );
          tmp.append('path', images[i].path);
        }

        navigation.navigate('feed_Create', tmp);
      })
      .catch(() => {
        Alert.alert('Error!', '사진을 불러오는데 실패하였습니다.');
        navigation.navigate('Feed');
        
      });    
  });

  return (
    <View style={{flex: 1}}>
      <Button
        title="사진 선택"
        onPress={() => {
          console.log('수정 페이지이동');
          console.log('불러온 데이터', tmp);
        }}
      />
    </View>
  );
};

export default CreateFeed;
