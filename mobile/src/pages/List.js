import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { SafeAreaView, Image, ScrollView, AsyncStorage, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';

import logo from '../assets/logo.png';
import SpotList from '../components/SpotList';

export default function List({ navigation }){
    const [ techs, setTechs ] = useState([]);

    useEffect(()=>{
        AsyncStorage.getItem('user').then(user_id =>{
            const socket = socketio('http://192.168.0.109:3333', {
                query: { user_id }
            })

            socket.on('booking_response', booking => {
                Alert.alert('Status da reserva', `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`);
            })
        })
    }, []);

    useEffect(()=>{
        AsyncStorage.getItem('techs').then(storagedTechs=>{
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    },[]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },

    logo:{
        height: 32,
        resizeMode: "contain",
        alignSelf: 'center',
        marginTop: 10,
    }, 
});