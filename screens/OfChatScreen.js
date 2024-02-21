import { View, Text, TouchableOpacity, Image, ImageBackground, ScrollView, FlatList, KeyboardAvoidingView} from 'react-native'
import React, {useState, useContext, useEffect, Component} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'
import { AuthContext } from '../context/AuthContext'
import { socket } from '../socket'
import * as DocumentPicker from 'expo-document-picker'
import axios from 'axios'
import { BASE_URL } from "../config"
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { shareAsync } from 'expo-sharing'


export default function OfChatScreen({route, navigation}) {
  
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const {userInfo} = useContext(AuthContext)
  const {getMessages} = useContext(AuthContext)
  const [count, setCount] = useState(15)
  const [singleFile, setSingleFile] = useState(null)
  const {fileUpload} = useContext(AuthContext)


  const fetchMessages = async (c) => {
    console.log(route.params?.data.roomID)
    const mess = await getMessages(route.params?.data.username, c)
    console.log("MESS")
    console.log(mess)
    setChat(mess)

  }
  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    this.setState({
      downloadProgress: progress,
    });
  };
  fileSelect = async () =>{
    try{
      const res = await DocumentPicker.getDocumentAsync();
      setSingleFile(res)
    }catch(err){
      console.log(err)
    }
  }
  fileDeselect = async () => {
      setSingleFile(null)
  }
  const fileDownload = async (fileName, filePath) => {
      try{

        FileSystem.downloadAsync(
          `${BASE_URL}/download/${fileName}`,
          FileSystem.documentDirectory + fileName,
        )
          .then(({ uri }) => {
            console.log('Finished downloading to ', uri)
            //permissions(uri, status)
            shareAsync(uri)
          })
          .catch(error => {
            console.error(error)
          })
        
      }catch(err){
        console.log(err)
      }
  }
  const permissions = async (filePath) =>{
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('no access')
        return;
      }
      const asset = await MediaLibrary.createAssetAsync(filePath)
      await MediaLibrary.createAlbumAsync("Download", asset, false)
    }
    catch (ex) {
      console.log('no access: exception')
    }
  }
  useEffect(()=>{

    fetchMessages(count)

    socket.emit("join_room", route.params?.data.roomID)

    socket.on("private_message", (data)=>{
      let tab = {
        body: data.message,
        sender: data.sender
      }
      setChat((prevChat) => [...prevChat, tab]);
    })

    
    console.log(route)

    return () => {
      socket.emit('leaveRoom', route.params?.data.roomID);
      console.log("disconnected")
    };

  }, [route])
  async function handleMessage(){

    const trimed = message.trim()

    if(singleFile === null && trimed.length === 0){
      console.log('podaj tresc lub plik')
      return
    }

    try{
      let file = null
      let fn = null
      let imageUri = null
      let didFileUpload = null
      if(singleFile != null){
        const fileToUpload = singleFile.assets
        file = new FormData()
        file.append('file', fileToUpload)
        console.log('to file')
        console.log(fileToUpload[0].name)
        fn = Date.now() + '-' + fileToUpload[0].name
        imageUri = fileToUpload[0].uri
        didFileUpload = await fileUpload(imageUri, fn)
      }
      let data = {
        room: route.params?.data.roomID,
        message: message,
        username: route.params?.data.username,
        sender: userInfo.data.username,
        file: fn,
        time: new Date()
      }
      if(didFileUpload !== "failed"){
        await socket.emit('private_message', data)
        let tab = {
          body: data.message,
          sender: data.sender,
          fileName: fn,
          filePath: '',
          createdAt: new Date()
        }
        let temp = chat;
        temp.push(tab)
        console.log(temp)
        setChat(temp)
      }
      setMessage("")
      setSingleFile(null)
      
    }catch(err){
      console.log(err)
    }
  }
  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent
    
    // Check if the scroll position is at the top
    if (contentOffset.y === 0) {
      setCount(count+10)
      fetchMessages(count)
      // Run your code here when the ScrollView is at the top
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" style={{backgroundColor: "#F0F0F0"}}>
        <SafeAreaView>
            <View className="flex-row items-center" style={{backgroundColor: "#3b5998", height: 50}}>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                onPress={() => navigation.openDrawer()}>
                    <Ionicons name="reorder-three" size={(30)} color={'white'}/>
                </TouchableOpacity>
                <Text className="text-white font-semibold text-lg text-center w-10/12">{route.params?.data.name} {route.params?.data.surname} ({route.params?.data.username})</Text>
                <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#3b5998", height: 50, borderRadius: 40}}
                >
                    <Ionicons name="reorder-three" size={(30)} color={'#3b5998'}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      <ScrollView ref={ref => {this.scrollView = ref}} onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})} onScroll={handleScroll}>
          {chat.map((item, index)=>{
              return (
                <View key={index} style={[
                   (item?.sender === route.params?.data.username) ? {alignSelf: "flex-start", backgroundColor: "white", padding: 8, margin: 10, borderRadius: 7, maxWidth: "60%"}
                   : (item?.sender === userInfo.data.username && userInfo.data.role === "Biuro") ? {alignSelf: "flex-end", backgroundColor: "#DCF8C6", maxWidth: "60%", borderRadius: 7, margin: 10, padding: 8}
                   : (item?.sender !== userInfo.data.username && userInfo.data.role === "Biuro") ? {alignSelf: "flex-end", backgroundColor: "#c6eff8", padding: 8, margin: 10, borderRadius: 7, maxWidth: "60%"}
                   : {alignSelf: "flex-start", backgroundColor: "white", padding: 8, margin: 10, borderRadius: 7, maxWidth: "60%"}
                ]}>
                  <Text style={{fontSize: 10, marginBottom: 10}}>{new Date(item?.createdAt).toLocaleString('pl-PL')}</Text>
                  {item?.body !== "" && <Text>{item?.body}</Text>}
                  {item?.fileName !== null && <TouchableOpacity onPress={() => fileDownload(item?.fileName, item?.filePath)}>
                  
                      <Text>(Pobierz plik <Ionicons style={{marginRight: 5}} name="arrow-down-circle" size={(18)} color={'black'}/>)</Text>
                  </TouchableOpacity>}
                </View>
              )
          })}
      </ScrollView>
      <View style={{flexDirection: 'row', alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: 25}}>
        {singleFile === null && <TouchableOpacity onPress={fileSelect}>
          <Ionicons style={{marginRight: 5}} name="add-circle-outline" size={(25)} color={'black'}/>
        </TouchableOpacity>}
        {singleFile !== null && <TouchableOpacity onPress={fileDeselect} className="flex-row justify-center items-center">
          <Text>1 plik </Text>
          <Ionicons style={{marginRight: 5}} name="close-circle-outline" size={(25)} color={'red'}/>
        </TouchableOpacity>}
        <TextInput value={message} onChangeText={(text)=>setMessage(text)} style={{flex: 1, height:40, borderWidth: 1, borderColor: "#dddddd", borderRadius:20, paddingHorizontal: 10}} placeholder='Napisz wiadomość...'/>
        <TouchableOpacity onPress={handleMessage} style={{backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20}}>
          <Text style={{color: "white", fontWeight: "bold"}}>Wyślij</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  )
}