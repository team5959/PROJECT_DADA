import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, View } from 'react-native'
import { Button } from 'react-native-elements';
import { NavigationContainer, NavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeProvider, SearchBar } from 'react-native-elements';

interface Props {
  navigation: NavigationState,
}

const UserScreen = ({ route, navigation }: Props) => {
  // const { userIdx, userName, userLastName } = route.params; //전달받은 값(route)
  const [search, setSearch] = useState("")

  const updateSearch = (search) => {
    setSearch( search );
  };

  return (
    <ThemeProvider theme ={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'yellow'
    }}>
      <SearchBar
        containerStyle={{ backgroundColor: 'green' }}
        inputStyle={{ backgroundColor: 'ivory'}}
        inputContainerStyle={{ backgroundColor: 'white'}}
        placeholder="Search Here..."
        onChangeText={updateSearch}
        value={search}
        round={true}
        showLoading
      />
      
      <Button
        title="To Feed Screen"
        type="outline"
        onPress={() => {
          navigation.navigate('Feed')
        }}
      />
      {/* <Text>User Idx: {JSON.stringify(userIdx)}</Text>
      <Text>User Name: {JSON.stringify(userName)}</Text>
      { route.params.userLastName && <Text>User LastName: {JSON.stringify(userLastName)}</Text>} */}
    </ThemeProvider>
  )
}

export default UserScreen
