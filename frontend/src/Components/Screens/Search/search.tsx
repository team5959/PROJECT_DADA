import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, View } from 'react-native'
import {  NavigationState } from '@react-navigation/native'
import { ThemeProvider, SearchBar } from 'react-native-elements';

interface Props {
  navigation: NavigationState,
}

const UserScreen = ({ navigation }: Props) => {
  // const { userIdx, userName, userLastName } = route.params; //전달받은 값(route)
  const [search, setSearch] = useState("")

  const updateSearch = (search) => {
    setSearch( search );
  };

  return (
    <View>
      <ThemeProvider 
      theme ={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}
      >
        <SearchBar
          containerStyle={{ backgroundColor: 'skyblue', borderTopColor: 'white', borderBottomColor: 'white' }}
          inputStyle={{ backgroundColor: 'white'}}
          inputContainerStyle={{ backgroundColor: 'white'}}
          placeholder="Search Here..."
          onChangeText={updateSearch}
          value={search}
          round={true}
          showLoading
        />
      </ThemeProvider>
    </View>
  )
}

export default UserScreen
