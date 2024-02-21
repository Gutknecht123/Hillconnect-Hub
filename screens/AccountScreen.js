import { View, Text, KeyboardAvoidingView, TouchableOpacity, Modal, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useContext, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'
import { AuthContext } from '../context/AuthContext'

export default function AccountScreen({route, navigation}) {
    const [email, setEmail] = useState('user@example.com')
    const [isModalVisible, setModalVisible] = useState(false)
    const [isModalVisible2, setModalVisible2] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [newPass, setNewPass] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const {userInfo} = useContext(AuthContext)
    const {logout} = useContext(AuthContext)
    const {changePass} = useContext(AuthContext)

      const handleChangeEmail = () => {
        // Implement logic to handle changing email
        console.log('Change Email Button Pressed')
      }
    
      const handleChangePassword = () => {
        // Implement logic to handle changing password
        console.log('Change Password Button Pressed')
      }
      const toggleModal = () => {
        setModalVisible(!isModalVisible)
      }
      const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2)
      }
      const handleSubmit = () => {
        // Implement your logic to handle the submitted data
        
        // You can close the modal after submitting if needed
        setModalVisible(false)
      }
      const handleSubmit2 = () => {
        
        changePass(userInfo.data.email, password, newPass, confirmPassword)

        setModalVisible2(false)
      }
  return (
    <KeyboardAvoidingView className="flex-1" style={{backgroundColor: "#F0F0F0"}}>
        <SafeAreaView>
            <View className="flex-row items-center" style={{backgroundColor: "#3b5998", height: 50}}>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                onPress={() => navigation.openDrawer()}>
                    <Ionicons name="reorder-three" size={(30)} color={'white'}/>
                </TouchableOpacity>
                <Text className="text-white font-semibold text-lg text-center w-10/12">Moje konto</Text>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                >
                    <Ionicons name="reorder-three" size={(30)} color={'#3b5998'}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <View className="flex p-4 justify-center">
            <View className="mb-4">
                <Text className="text-base font-bold mb-3 text-center">Nazwa użytkownika: {userInfo.data.username}</Text>
   

                <Text className="text-base font-bold mb-3 text-center">Imię: {userInfo.data.name} | Nazwisko: {userInfo.data.surname}</Text>


                <Text className="text-base font-bold mb-3 text-center">Rola: {userInfo.data.role}</Text>
         

                <Text className="text-base font-bold mb-3 text-center">Email: {userInfo.data.email}</Text>
             
            </View>

            <TouchableOpacity className="bg-blue-500 rounded p-4" onPress={toggleModal2}>
                <Text className="text-white font-bold text-center">Zmień hasło</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 rounded p-4 mt-3" onPress={() => {logout()}}>
                <Text className="text-white font-bold text-center">Wyloguj</Text>
            </TouchableOpacity>
            <View className="flex mt-10">
              <Text className="text-center">Hillconnect Hub v1.0</Text>
              <Text className="text-center">2024 Wszelkie prawa zastrzeżone</Text>
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
            <Text className="text-lg font-bold mb-2 mt-1">Nowy Email:</Text>
            <TextInput
              className="input mb-1"
              placeholder="Podaj nowy email..."
              value={newEmail}
              onChangeText={(text) => setNewEmail(text)}
            />

            <Text className="text-lg font-bold mb-2 mt-1">Twoje hasło:</Text>
            <TextInput
              className="input mb-1"
              placeholder="Hasło..."
              value={password}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />

            <Text className="text-lg font-bold mb-2 mt-1">Potwierdź swoje hasło</Text>
            <TextInput
              className="input mb-5"
              placeholder="Potwierdź hasło..."
              value={confirmPassword}
              secureTextEntry
              onChangeText={(text) => setConfirmPassword(text)}
            />

                <Button title="Zmień" onPress={handleSubmit} />

                <TouchableOpacity className="mt-2" onPress={toggleModal}>
                <Text className="text-blue-500 text-center">Przerwij</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible2}
            onRequestClose={toggleModal2}
        >
            <View className="flex-1 justify-center items-center bg-gray-700 bg-opacity-50">
            <View className="bg-white p-4 rounded w-80">
            <Text className="text-lg font-bold mb-2 mt-1">Stare hasło:</Text>
            <TextInput
              className="input mb-1"
              placeholder="Hasło..."
              value={password}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />

            <Text className="text-lg font-bold mb-2 mt-1">Nowe hasło:</Text>
            <TextInput
              className="input mb-1"
              placeholder="Nowe hasło..."
              value={newPass}
              secureTextEntry
              onChangeText={(text) => setNewPass(text)}
            />

            <Text className="text-lg font-bold mb-2 mt-1">Potwierdź nowe hasło:</Text>
            <TextInput
              className="input mb-5"
              placeholder="Potwierdź hasło..."
              value={confirmPassword}
              secureTextEntry
              onChangeText={(text) => setConfirmPassword(text)}
            />

                <Button title="Zmień" onPress={handleSubmit2} />

                <TouchableOpacity className="mt-2" onPress={toggleModal2}>
                <Text className="text-blue-500 text-center">Przerwij</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    </KeyboardAvoidingView>
  )
}