import { View, Text, TouchableOpacity, Image, ImageBackground, Linking } from 'react-native'
import React, {useContext} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../context/AuthContext'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function MainScreen({ route, navigation}) {
    //parametry
    const {logout} = useContext(AuthContext)
    const {userInfo} = useContext(AuthContext)
    const nrTel = "579154860"
  return (
    <View className="flex-1" style={{backgroundColor: "#F0F0F0"}}>
        <SafeAreaView>
            <View className="flex-row items-center" style={{backgroundColor: "#3b5998", height: 50}}>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                onPress={() => navigation.openDrawer()}>
                    <Ionicons name="reorder-three" size={(30)} color={'white'}/>
                    <Text className="text-white font-semibold text-lg">Menu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <ImageBackground className="justify-center items-center h-60" source={require('../assets/images/menu_bg.jpg')}>
                <Image source={require('../assets/images/default_user.png')} style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}></Image>
                <Text className="color-white" style={{textAlign: "center", fontSize: 18}}>{userInfo.data.name} {userInfo.data.surname}</Text>
                <Text className="color-white" style={{textAlign: "center", fontSize: 15}}>{userInfo.data.role}</Text>
        </ImageBackground>
        <View className="flex-1 flex-row flex-wrap items-center justify-center bg-white px-5 pt-8" style={{backgroundColor: "#F0F0F0", gap: 10}}>
            {(userInfo.data.role === "Kierownik" || userInfo.data.role === "Franczyzobiorca" || userInfo.data.role === "Pracownik") && <TouchableOpacity className="flex-col justify-center items-center h-1/3" style={{backgroundColor: "#3b5998", borderRadius: 10, width: 90/2+'%', gap: 10}}
            onPress={() => navigation.navigate('Czat')}>
                <Ionicons name="chatbox-ellipses-outline" size={(40)} color={'white'}/>
                <Text className="color-white" style={{fontSize: 18}}>Czat</Text>
            </TouchableOpacity>}
            {userInfo.data.role === "Biuro" && <TouchableOpacity className="flex-col justify-center items-center h-1/3" style={{backgroundColor: "#3b5998", borderRadius: 10, width: 90+'%', gap: 10}}
            onPress={() => navigation.navigate('Wiadomości')}>
                <Ionicons name="chatbox-ellipses-outline" size={(40)} color={'#FFFFFF'}/>
                <Text className="color-white" style={{fontSize: 18}}>Wiadomości</Text>
            </TouchableOpacity>}
            {(userInfo.data.role === "Kierownik" || userInfo.data.role === "Franczyzobiorca" || userInfo.data.role === "Pracownik") && <TouchableOpacity onPress={() => Linking.openURL(`tel:+48${nrTel}`)} className="flex-col justify-center items-center h-1/3" style={{backgroundColor: "#3b5998", borderRadius: 10, width: 90/2+'%', gap: 10}}>
                <Ionicons name="call" size={(40)} color={'#2b9c25'}/>
                <Text className="color-white" style={{fontSize: 18}}>Kontakt tel.</Text>
            </TouchableOpacity>}
            <TouchableOpacity className="flex-col justify-center items-center mt-4 h-1/3" style={{backgroundColor: "#3b5998", borderRadius: 10, width: 90/2+'%', gap: 10}}
            onPress={() => navigation.navigate('Ogłoszenia')}>
                <Ionicons name="alert" size={(40)} color={'#e02b20'}/>
                <Text className="color-white" style={{fontSize: 18}}>Ogłoszenia</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-col justify-center items-center mt-4 h-1/3" style={{backgroundColor: "#3b5998", borderRadius: 10, width: 90/2+'%', gap: 10}}
            onPress={() => navigation.navigate('Moje konto')}>
                <Ionicons name="person" size={(40)} color={'white'}/>
                <Text className="color-white" style={{fontSize: 18}}>Moje konto</Text>
            </TouchableOpacity>
        </View>
    </View>

  )
}