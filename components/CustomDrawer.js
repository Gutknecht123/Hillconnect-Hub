import { View, Text, ImageBackground, Image } from 'react-native'
import React, {useContext} from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { AuthContext } from '../context/AuthContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function CustomDrawer(props) {
    const {userInfo} = useContext(AuthContext)
    const {logout} = useContext(AuthContext)
  return (
    <View className="flex-1">
        <DrawerContentScrollView {...props} contentContainerStyle={{}}>
            <ImageBackground className="flex-1 flex justify-center items-center pt-5" source={require('../assets/images/menu_bg.jpg')}>
                <Image source={require('../assets/images/default_user.png')} style={{height: 60, width: 60, borderRadius: 40, marginBottom: 10}}></Image>
                <Text className="color-white mb-5" style={{textAlign: "center"}}>{userInfo.data.name} {userInfo.data.surname}</Text>
            </ImageBackground>
            <View className="flex-1 bg-white pt-5">
                <DrawerItemList {...props}/>
            </View>
        </DrawerContentScrollView>
        <View style={{padding: 20, borderTopWidth:1, borderTopColor: '#ccc', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {logout()}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="exit-outline" size={25} />
                    <Text style={{fontSize: 15, }}> Wyloguj</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}