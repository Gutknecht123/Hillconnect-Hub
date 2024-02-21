import { View, Text, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react'
import AppNavigation from './appNavigation'
import { AuthContext } from '../context/AuthContext'
import AppStack from './AppStack'
import { NavigationContainer } from '@react-navigation/native'

export default function AppMainNav() {
    const {isLoading, userToken} = useContext(AuthContext)

    if( isLoading ) {
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size={'large'}/>
            </View>
        )
    }

  return (
    <NavigationContainer>
        {userToken !== null ? <AppStack /> : <AppNavigation />}
    </NavigationContainer>
  )
}