import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function OfMessagesScreen({route, navigation}) {

    const {getOfficeMessages} = useContext(AuthContext)
    const {userInfo} = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    const fetchMessages = async () => {
        const us = await getOfficeMessages()
        console.log(us)
        setUsers(us)
      }

    useEffect(() => {
        fetchMessages()
    }, [])

  return (
    
    <View className="flex-1">
        <SafeAreaView>
            <View className="flex-row items-center" style={{backgroundColor: "#3b5998", height: 50}}>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                onPress={() => navigation.openDrawer()}>
                    <Ionicons name="reorder-three" size={(30)} color={'white'}/>
                    <Text className="text-white font-semibold text-lg">Menu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 10,
          paddingLeft: 10,
        }}
        placeholder="Wyszukaj: Imię + Nazwisko"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
        <ScrollView>
            {users.filter((item) =>
            item.username !== userInfo.data.username &&
            (item.name + ' ' + item.surname)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
            .sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage))
            .map((item, index) => {
                if(item.role !== userInfo.data.role){
                    return(
                        <TouchableOpacity className="flex-1 flex-row items-center" style={{gap: 10, borderWidth: 0.7, borderColor: "#D0D0D0", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, padding: 10}} key={index} onPress={() => navigation.navigate("UserMessages",{ data: item })}>
                            <Image style={{width: 50, height: 50}} source={require('../assets/images/default_user.png')}></Image>
                            <View className="flex-1">
                                <Text style={{fontSize: 15, fontWeight: "500"}}>{item?.name} {item?.surname} ({item?.username})</Text>
                                <Text style={{fontSize: 12, marginTop: 3, color: "gray", fontWeight: "500"}}>{new Date(item?.lastMessage).toLocaleString('pl-PL')}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 11, fontWeight: "400", color: "#585858"}}>-</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            })}
        </ScrollView>
    </View>
  )
}