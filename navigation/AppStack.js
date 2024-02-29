import React, {useState, useEffect, useContext} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainScreen from '../screens/MainScreen'
import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawer from '../components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ChatScreen from '../screens/ChatScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OfChatScreen from '../screens/OfChatScreen';
import AccountScreen from '../screens/AccountScreen';
import OfImportantScreen from '../screens/OfImportantScreen';
import { socket } from '../socket';
import { AuthContext } from '../context/AuthContext';
import OfMessagesScreen from '../screens/OfMessagesScreen'

const Drawer = createDrawerNavigator();

export default function AppStack() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const {userInfo} = useContext(AuthContext)
  const {globalImportantMessage} = useContext(AuthContext)
  const {newMessagePush} = useContext(AuthContext)
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.emit("join_room", userInfo.data.roomID)

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    socket.on("new_important_message", (data)=>{
      if(data.author !== userInfo.data.name){
        console.log(userInfo.data.name)
        globalImportantMessage(data.body)
      }

    })
    
    socket.on("private_message", (data)=>{
        newMessagePush(data.message)
    })

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);
  return (

        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>} screenOptions={{headerShown: false, unmountOnBlur: true, 
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: "#3b5998", 
        drawerLabelStyle: {marginLeft: -25, fontSize: 15}}} initialRouteName='Main'>
            <Drawer.Screen name="Strona główna" component={MainScreen} options={{
              drawerIcon: ({color}) => (
                  <Ionicons name="home-outline" size={(25)} color={color} />
              ), headerShown: false
            }} />
            {(userInfo.data.role === "Kierownik" || userInfo.data.role === "Franczyzobiorca" || userInfo.data.role === "Pracownik") && <Drawer.Screen name="Czat" component={ChatScreen} options={{
              drawerIcon: ({color}) => (
                  <Ionicons name="chatbox-ellipses-outline" size={(25)} color={color} />
              ), headerShown: false
            }}/>}
            {userInfo.data.role === "Biuro" && <Drawer.Screen name="Wiadomości" component={OfMessagesScreen} options={{
              drawerIcon: ({color}) => (
                  <Ionicons name="chatbox-ellipses-outline" size={(25)} color={color} />
              ), headerShown: false
            }}/>}
            <Drawer.Screen name="Ogłoszenia" component={OfImportantScreen} options={{
              drawerIcon: ({color}) => (
                  <Ionicons name="alert-circle" size={(25)} color={color} />
              ), headerShown: false
            }}/>
            <Drawer.Screen name="Moje konto" component={AccountScreen} options={{
              drawerIcon: ({color}) => (
                  <Ionicons name="person" size={(25)} color={color} />
              ), headerShown: false
            }}/>
            {(userInfo.data.role === "Biuro") && <Drawer.Screen name="Dodaj użytkownika" component={RegisterScreen} options={{
              drawerIcon: ({color}) => (
                  <Ionicons name="add-circle-outline" size={(25)} color={color} />
              ), headerShown: false
            }}/>}
            {userInfo.data.role === "Biuro" && <Drawer.Screen name="UserMessages" component={OfChatScreen} options={{
              drawerItemStyle: {height: 0}, headerShown: false
            }}/>}
        </Drawer.Navigator>

  )
}