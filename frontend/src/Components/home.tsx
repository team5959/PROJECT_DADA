import 'react-native-gesture-handler';
import React from 'react'
import { Text, View, Button } from 'react-native'


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
                        userLastName: null,
                    })
                }}
            />
        </View>
    )
}

export default HomeScreen
