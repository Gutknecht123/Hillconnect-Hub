import { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ImageBackground } from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation()
    return(
     <SafeAreaView className="flex-1" style={{backgroundColor: 'white'}}>
        <View className="justify-center items-center" style={{width: "100%"}}>
            <Image source={require('../assets/images/logo.png')} style={{marginTop: 20}}></Image>
        </View>
        <View className="flex-1 flex justify-around my-4">
            <View className="items-center">
                <Text className="font-bold text-4xl text-center" style={{color: '#3b5998'}}>Witaj!</Text>
                <Text className="font-bold text-xl text-center mt-1" style={{color: '#3b5998'}}>Jak możemy Ci dzisiaj pomóc?</Text>
            </View>
        </View>
        <View className="space-y-4 mb-5">
            <TouchableOpacity className="py-3 mx-7 rounded-xl" style={{backgroundColor: '#3b5998'}} onPress={() => navigation.navigate('Login')}>
                <Text className="text-xl font-bold text-white text-center">Zaloguj się</Text>
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mb-5">
        </View>
     </SafeAreaView>
    );
}