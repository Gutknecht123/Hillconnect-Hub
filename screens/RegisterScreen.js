import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { AuthContext } from '../context/AuthContext'
import { ScrollView } from 'react-native-gesture-handler'
import SelectDropdown from 'react-native-select-dropdown'

export default function RegisterScreen() {

    const navigation = useNavigation()

    //Inputs

    const [inputName, setInputName] = useState('')
    const [inputSurname, setInputSurname] = useState('')
    const [inputUsername, setInputUsername] = useState('')
    const [inputPass, setInputPass] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputRole, setInputRole] = useState('')

    const roles = [ "Franczyzobiorca", "Kierownik", "Pracownik", "Biuro" ]

    const {register} = useContext(AuthContext)

    const handleSubmit = async() =>{

        try{
            console.log('aha')
            const response = await register(inputName, inputSurname, inputUsername, inputRole, inputPass, inputEmail)

            if(response !== "failed"){
                setInputName('')
                setInputSurname('')
                setInputUsername('')
                setInputPass('')
                setInputEmail('')
                setInputRole('')
            }

        }catch(err){
            console.log(err)
            setInputName('')
            setInputSurname('')
            setInputUsername('')
            setInputPass('')
            setInputEmail('')
            setInputRole('')
        }

    }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" style={{backgroundColor: '#3b5998'}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
            <TouchableOpacity className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-2" style={{backgroundColor: 'white'}}
                onPress={() => navigation.navigate('Strona główna')}
            >
                <ArrowLeftIcon size="20" color="black" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center" style={{height: 0}}>

        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white px-8 pt-8 mt-10" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
        <Text className="text-gray-700">Dodaj użytkownika</Text>
        <ScrollView className="form space-y-2 mt-3">
            <Text className="text-gray-700 ml-4">Imie</Text>
            <TextInput 
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" 
                value={inputName}
                onChangeText={(text) => setInputName(text)}
                placeholder='Podaj imię użytkownika'
            />
            <Text className="text-gray-700 ml-4">Nazwisko</Text>
            <TextInput 
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl" 
                value={inputSurname}
                onChangeText={(text) => setInputSurname(text)}
                placeholder='Podaj nazwisko użytkownika'
            />
            <Text className="text-gray-700 ml-4">Nazwa</Text>
            <TextInput 
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl" 
                value={inputUsername}
                onChangeText={(text) => setInputUsername(text)}
                placeholder='Podaj nazwe użytkownika'
            />
            <Text className="text-gray-700 ml-4">Email</Text>
            <TextInput 
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl" 
                value={inputEmail}
                onChangeText={(text) => setInputEmail(text)}
                placeholder='Podaj email użytkownika'
            />
            <Text className="text-gray-700 ml-4">Hasło</Text>
            <TextInput 
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl" 
                secureTextEntry
                value={inputPass}
                onChangeText={(text) => setInputPass(text)}
                placeholder='Podaj hasło użytkownika'
            />
            <View className="flex-1 flex-row justify-center">
                <SelectDropdown
                    data={roles}
                    buttonStyle={{marginTop: 1, width: "100%", borderRadius: 10}}
                    buttonTextStyle={{fontSize: 14}}
                    defaultButtonText='Wybierz role'
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                        setInputRole(selectedItem)
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
            </View>
            <TouchableOpacity className="py-3 rounded-xl" style={{backgroundColor: '#3b5998'}}
                onPress={handleSubmit}>
                <Text className="font-xl font-bold text-center text-white">
                    Dodaj użytkownika
                </Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}