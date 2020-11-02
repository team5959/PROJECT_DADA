import 'react-native-gesture-handler';
import React from 'react'
import { Text, View, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


const HomeScreen = ({ navigation }) => {

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text>Home Screen</Text>
            <Button
                title="To User Screen"
                onPress={()=>{
                    navigation.navigate('User', {
                        userIdx: 100,
                        userName: 'jong',
                        userLastName: 'kim',
                    })
                }}
            />
        </View>
    )
}

export default HomeScreen
