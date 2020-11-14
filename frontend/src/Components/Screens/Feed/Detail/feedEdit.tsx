import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Alert} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import Loader from '~/Components/Util/Loader';
import ObjectFile from '~/Components/ObjectFile';

const FeedEdit = ({route, navigation}) => {
  const {
    title: originalTitle,
    tags: originalTags,
    contents: originalContents,
    date,
  } = route.params;
  const [title, setTitle] = useState(originalTitle);
  const [tags, setTags] = useState('#' + originalTags.join(' #'));
  const [contents, setContents] = useState(originalContents);
  const [isLoading, setLoading] = useState(false);

  return (
    <View style={styles.main}>
      <Loader isLoading={isLoading} />
      <View style={styles.mainIn}>
        <ScrollView>
          <Input
            style={styles.title}
            label="title"
            leftIcon={{type: 'font-awesome', name: 'calendar-o'}}
            onChangeText={(value) => setTitle(value)}>
            {title}
          </Input>

          <Input
            multiline
            style={styles.tag}
            label="tags"
            leftIcon={{type: 'font-awesome', name: 'tag'}}
            onChangeText={(value) => setTags(value)}>
            {tags}
          </Input>

          <Input
            multiline
            style={styles.content}
            label="contents"
            leftIcon={{type: 'font-awesome', name: 'align-justify'}}
            onChangeText={(value) => setContents(value)}>
            {contents}
          </Input>
        </ScrollView>
      </View>

      {/* 하단 아이콘설정 */}
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
            const parsedTags: Array<string> = tags.split(' #');
            if (parsedTags.length >= 1) {
              parsedTags[0] = parsedTags[0].slice(1);
            }
            setLoading(true);
            uploadToDB(
              {
                title,
                contents,
                tags: parsedTags,
              },
              date,
            )
              .then(() => {
                setLoading(false);
                Alert.alert('DADA가 알려드립니다.', '수정이 완료되었습니다.', [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.navigate('FeedDetail');
                    },
                  },
                ]);
              })
              .catch(() => {
                setLoading(false);
                Alert.alert(
                  'DADA가 알려드립니다.',
                  '수정 중 오류가 생겼습니다. \n다시 시도해주세요.',
                  [
                    {
                      text: 'OK',
                    },
                  ],
                );
              });
          }}
          size={23}
        />
      </View>
    </View>
  );
};
export default FeedEdit;

const uploadToDB = async (
  feed: {
    title: string;
    contents: string;
    tags: Array<string>;
  },
  date: string,
) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://fdonrkhu46.execute-api.us-east-1.amazonaws.com/dev/users/${ObjectFile.user.id}/feeds/${date}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feed),
      },
    )
      .then((response) => {
        if (response.status !== 200) {
          console.error('피드 수정 중 에러 발생', response);
          reject();
        }
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject();
      });
  });
};

const styles = StyleSheet.create({
  content: {
    fontFamily: 'BMHANNAPro',
  },
  main: {
    flex: 1,
    backgroundColor: 'ivory',
  },
  mainIn: {
    margin: 7,
    marginTop: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    marginTop: 10,
    fontFamily: 'BMHANNAPro',
  },
  tag: {
    fontFamily: 'BMHANNAPro',
  },
});
