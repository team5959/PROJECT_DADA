import 'react-native-gesture-handler';
import React from 'react'
import { Text, View, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


const UserScreen = ({ route, navigation }) => {
    const { userIdx, userName, userLastName } = route.params; //전달받은 값(route)

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text>User Screen</Text>
            <Button 
                title="To Home Screen"
                onPress={() => {
                    navigation.navigate('Home')
                }}
            />
            <Text>User Idx: {JSON.stringify(userIdx)}</Text>
            <Text>User Name: {JSON.stringify(userName)}</Text>
            { route.params.userLastName && <Text>User LastName: {JSON.stringify(userLastName)}</Text>}
        </View>
    )
}

export default UserScreen
