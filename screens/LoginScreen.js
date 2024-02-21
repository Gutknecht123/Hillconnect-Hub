import { View, Text, TouchableOpacity, TextInput, Modal, Button } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { AuthContext } from '../context/AuthContext'

export default function LoginScreen() {

    const navigation = useNavigation()

    //Inputs
    const [loginInput, setLoginInput] = useState('')
    const [passInput, setPassInput] = useState('')
    const [message, setMessage] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)
    const [newEmail, setNewEmail] = useState('')

    const handlePassInput = (text) =>{
        setPassInput(text)
    }
    const handleLoginInput = (text) =>{
        setLoginInput(text)
    }
    const toggleModal = () => {
    setModalVisible(!isModalVisible)
    }
    const handleSubmit = () => {
    // Implement your logic to handle the submitted data
       
    // You can close the modal after submitting if needed
    setModalVisible(false)
    };

    //Tu logowanie
    const handleUserLogin = () => {
        if(loginInput == "admin" && passInput == "123"){
            setMessage('')
            navigation.navigate('Main', { username: loginInput, role: "normal" })
        }else{
            setMessage('Błedny login lub hasło!')
        }
    }
    const {login} = useContext(AuthContext)
  return (
    <View className="flex-1 bg-white" style={{backgroundColor: '#3b5998'}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
            <TouchableOpacity className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-2" style={{backgroundColor: 'white'}}
                onPress={() => navigation.navigate('Home')}
            >
                <ArrowLeftIcon size="20" color="black" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center" style={{height: 0}}>

        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white px-8 pt-8 mt-10" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
        <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Adres Email</Text>
            <TextInput 
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" 
                value={loginInput}
                onChangeText={handleLoginInput}
                placeholder='Twój adres Email'
            />
            <Text className="text-gray-700 ml-4">Hasło</Text>
            <TextInput 
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl" 
                secureTextEntry
                value={passInput}
                onChangeText={handlePassInput}
                placeholder='Twóje hasło'
            />
            <Text>{message}</Text>
            <TouchableOpacity className="py-3 rounded-xl" style={{backgroundColor: '#3b5998'}}
                onPress={()=> {login(loginInput, passInput)}}>
                <Text className="font-xl font-bold text-center text-white">
                    Zaloguj
                </Text>
            </TouchableOpacity>
        </View>
      </View>
      <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
        >
            <View className="flex-1 justify-center items-center bg-gray-700 bg-opacity-50">
            <View className="bg-white p-4 rounded w-80">
            <Text className="text-lg font-bold mb-2">Podaj email przypisany do konta:</Text>
            <TextInput
              className="input mb-4 mt-4"
              placeholder="user@example.com"
              value={newEmail}
              onChangeText={(text) => setNewEmail(text)}
            />

                <Button title="Wyślij" onPress={handleSubmit} />

                <TouchableOpacity className="mt-2" onPress={toggleModal}>
                <Text className="text-blue-500 text-center">Przerwij</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    </View>
  )
}