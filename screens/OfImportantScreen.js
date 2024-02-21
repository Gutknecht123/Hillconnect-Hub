import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Modal, Button, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { AuthContext } from '../context/AuthContext'
import { ScrollView } from 'react-native-gesture-handler'
import SelectDropdown from 'react-native-select-dropdown'
import { socket } from '../socket';

export default function OfImportantScreen() {

    const navigation = useNavigation()
    const {userInfo} = useContext(AuthContext)
    const {getImportantMessages} = useContext(AuthContext)
    const {globalImportantMessage} = useContext(AuthContext)
    const {deleteIM} = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const [mess, setMess] = useState('')
    const [forWho, setForWho] = useState('')
    const [isModalVisible, setModalVisible] = useState(false);

    const roles = [ "Wszyscy", "Biuro" ]
    
    const handleLongPress = (postID) => {
        // Show an Alert with "Yes" and "No" buttons
        if(userInfo.data.role === "Biuro"){
            Alert.alert(
            'Potwierdzenie',
            'Usunąć wybrane ogłoszenie?',
            [
                {
                text: 'Nie',
                style: 'cancel',
                },
                {
                text: 'Tak',
                onPress: () => {
                    // Handle "Yes" button press
                    deleteIM(postID)
                    fetchMessages()
                },
                },
            ],
            { cancelable: false }
            )
        }
      }

    const fetchMessages = async () => {
        const ms = await getImportantMessages()
        console.log(ms)
        setMessages(ms)
      }
      const toggleModal = () => {
        setModalVisible(!isModalVisible)
      }
      const handleSubmit = () => {
        // Implement your logic to handle the submitted data
        const data = {
            author: userInfo.data.name,
            body: mess,
            forWorkers: forWho
        }
        socket.emit("important_message", data)

        let tab = {
            author: "Biuro",
            message: [{
              body: data.body,
              createdAt: new Date()
            }]
          }
          console.log(messages)
          setMessages((prevMess) => [...prevMess, tab]);
        // You can close the modal after submitting if needed
        setModalVisible(false)
      }
    useEffect(()=>{
        fetchMessages()
    }, [])

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" style={{backgroundColor: '#F0F0F0'}}>
        <SafeAreaView>
            <View className="flex-row items-center" style={{backgroundColor: "#3b5998", height: 50}}>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                onPress={() => navigation.openDrawer()}>
                    <Ionicons name="reorder-three" size={(30)} color={'white'}/>
                </TouchableOpacity>
                <Text className="text-white font-semibold text-lg text-center w-10/12">Ogłoszenia</Text>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                onPress={toggleModal}>
                    {userInfo.data.role === "Biuro" && <Ionicons name="add-circle-outline" size={(30)} color={'#F0F0F0'}/>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <ScrollView>
            {messages.reverse().map((item, index) => {

                const isBiuro = userInfo.data.role === "Biuro"

                const isForWszyscy = item?.forWorkers === "Wszyscy"

                const shouldShowMessage = isBiuro || (userInfo.data.role !== "Biuro" && isForWszyscy)

                if (shouldShowMessage) {
                    return(
                        <TouchableOpacity onLongPress={() => handleLongPress(item?._id)} className="flex-1 flex-row items-center" style={{gap: 10, borderWidth: 0.7, borderColor: "#D0D0D0", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, padding: 10}} key={index}>
                            <View className="flex-1">
                                <Text style={{fontSize: 15, fontWeight: "500"}}>{item?.message[0].body}</Text>
                                <Text style={{fontSize: 12, marginTop: 3, color: "gray", fontWeight: "500"}}>{new Date(item?.message[0].createdAt).toLocaleString('pl-PL')}</Text>
                            </View>

                        </TouchableOpacity>
                    )
                }
            })}
        </ScrollView>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
        >
            <View className="flex-1 justify-center items-center bg-gray-700 bg-opacity-50">
            <View className="bg-white p-4 rounded w-80">
            <Text className="text-lg font-bold mb-2">Napisz ogłoszenie</Text>
            <TextInput
              className="input mb-10 mt-10"
              placeholder="Podaj treść..."
              value={mess}
              onChangeText={(text) => setMess(text)}
            />
                <SelectDropdown
                    data={roles}
                    buttonStyle={{marginTop: 1, width: "100%", borderRadius: 10, marginBottom: 25}}
                    buttonTextStyle={{fontSize: 14}}
                    defaultButtonText='Wybierz role'
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                        setForWho(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                />

                <Button title="Dodaj" onPress={handleSubmit} />

                <TouchableOpacity className="mt-2" onPress={toggleModal}>
                <Text className="text-blue-500 text-center">Przerwij</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    </KeyboardAvoidingView>
  )
}