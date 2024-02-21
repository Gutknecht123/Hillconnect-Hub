import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {createContext, useState, useEffect} from "react";
import { BASE_URL } from "../config";
import * as Notifications from "expo-notifications"
import mime from "mime";
import { Alert } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [userToken, setUserToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)

    const globalImportantMessage = async (message) => {
        let m = message
        if(m.length > 25){
            m = message.slice(0, 25) + "..."
        }
        //show the notification to the user
        Notifications.scheduleNotificationAsync({
          //set the content of the notification
          content: {
            title: "Ogłoszenie!",
            body: m,
          },
          trigger: null,
        });
    }

    const newMessagePush = async (message) => {
        let m = message
        if(m.length > 25){
            m = message.slice(0, 25) + "..."
        }
        //show the notification to the user
        Notifications.scheduleNotificationAsync({
          //set the content of the notification
          content: {
            title: "Masz nową wiadomość od naszego biura!",
            body: m,
          },
          trigger: null,
        });
    }

    const deleteIM = async(postID) => {

        try{
            const response = await axios.post(`${BASE_URL}/deleteIM`, {
                postID
            })
            return response
            
        }catch(err){
            console.log(err)
        }

    }

    const login = (email, password) =>{
        setIsLoading(true)
        axios.post(`${BASE_URL}/userLogin`, {
            email,
            password
        })
        .then((res) => {
            
            let userInfo = res.data
            setUserInfo(userInfo)
            setUserToken(userInfo.data.jwt)
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
            AsyncStorage.setItem('userToken', userInfo.data.jwt)
            console.log(userInfo)
            console.log(userInfo.data.jwt)
        })
        .catch((err) => {
            console.log(err)
            Alert.alert('', 'Błędny email lub hasło!')
        })
        //setUserToken('xdd')
        //AsyncStorage.setItem('userToken', 'xdd')
        setIsLoading(false)
    }

    const changePass = async(email, pass, newPass, newPass2) => {

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

        if (!passwordRegex.test(newPass)){
            Alert.alert('',"Błędne nowe hasło! Minimum 8 znaków, 1 litera, 1 numer, 1 znak specjalny")
            return "failed"
        }


        if(newPass !== newPass2){
            Alert.alert('', 'Hasła się nie zgadzają!')
            return "failed"
        }
        try{
            const response = await axios.post(`${BASE_URL}/changePass`, {
                email,
                pass,
                newPass
            })
            console.log('zmieniono haslo')
            Alert.alert('', 'Hasło zostało zmienione.')
            setUserToken(null)
            AsyncStorage.removeItem('userToken')
            AsyncStorage.removeItem('userInfo')
            return response
            
        }catch(err){
            console.log(err)
            Alert.alert('', 'Błędne hasło!')
        }
    }

    const register = async (name, surname, username, role, password, email) => {

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
        const usernameRegex = /^[a-zA-Z0-9_]{1,25}$/
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

        const tempName = name.trim()
        const tempSurname = surname.trim()
        const tempUsername = username.trim()
        const tempRole = role.trim()
        const tempPassword = password.trim()
        const tempEmail = email.trim()

        if(tempName.length == 0 || tempSurname.length == 0 || tempUsername.length == 0 || tempRole.length == 0 || tempPassword.length == 0 || tempEmail.length == 0){
            Alert.alert('',"Uzupełnij wszystkie pola!")
            return "failed"
        }

        if (!emailRegex.test(email)) {
            Alert.alert('',"Błędny adres Email!")
            return "failed"
          }
        
        if (!usernameRegex.test(username)){
            Alert.alert('',"Błędna nazwa użytkownika!")
            return "failed"
        }
        if (!usernameRegex.test(name)){
            Alert.alert('',"Błędne imię!")
            return "failed"
        }
        if (!usernameRegex.test(surname)){
            Alert.alert('',"Błędne nazwisko!")
            return "failed"
        }
        
        if (!passwordRegex.test(password)){
            Alert.alert('',"Błędne hasło! Minimum 8 znaków, 1 litera, 1 numer, 1 znak specjalny")
            return "failed"
        }

        try{
        const response = await axios.post(`${BASE_URL}/userRegister`, {
            name,
            password,
            username,
            surname,
            role,
            email
        })
        Alert.alert('',"Pomyślnie dodano użytkownika!")
            return response

        }catch(err){
            console.log(err)
            Alert.alert('',"Nazwa użytkownika lub Email są już w użyciu!")
            return "failed"
        }
    }
    const getMessages = async (username, count) => {

        const response = await axios.get(`${BASE_URL}/messages?username=${username}&count=${count}`)
        return response.data
    }

    const logout = () => {
        setIsLoading(true)
        setUserToken(null)
        AsyncStorage.removeItem('userToken')
        AsyncStorage.removeItem('userInfo')
        setIsLoading(false)

    }

    const getOfficeMessages = async () => {

        const response = await axios.get(`${BASE_URL}/officemessages`)
        return response.data

    }

    const getImportantMessages = async () =>{

        const response = await axios.get(`${BASE_URL}/importantmessages`)
        return response.data

    }

    const fileUpload = async (file, fn) => {

        try {

            let ext = mime.getType(file)
            const extension = file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2);
    
            // If the extension is '.jpg', set the Content-Type to 'image/jpg'
            if (extension.toLowerCase() === 'jpg') {
                ext = 'image/jpg';
            }

            console.log(fn)
            const formData = new FormData();
            formData.append('file', {
                uri: file,
                type: ext,
                name: fn
            });

            const response = await axios.post(`${BASE_URL}/fileUpload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error(error)
                Alert.alert('','Wystąpił błąd podczas przesyłania pliku.')
                return "failed"
            });
            return response
            
        }catch (error) {
            console.error('Error uploading file:', error)
            Alert.alert('','Wystąpił błąd podczas przesyłania pliku.')
            return "failed"
            //throw error; // Rethrow the error for further handling, if needed
        }
    }

    const addImportantMessage = () =>{
        try{
            
            axios.post(`${BASE_URL}/userRegister`, {
                name,
                password,
                username,
                surname,
                role,
                email
            })

        }catch(err){
            console.log(err)
        }
    }

    const isLoggedIn = async() => {
        try{
            setIsLoading(true)
            let userInfo = await AsyncStorage.getItem('userInfo')
            let userToken = await AsyncStorage.getItem('userToken')
            userInfo = JSON.parse(userInfo)

            if( userInfo ) {
                setUserToken(userToken)
                setUserInfo(userInfo)
            }

            setIsLoading(false)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, [])

    return (
        <AuthContext.Provider value={{changePass, deleteIM, newMessagePush, globalImportantMessage, login, logout, getMessages, getOfficeMessages, getImportantMessages, register, fileUpload, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    )
}