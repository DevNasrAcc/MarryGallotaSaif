import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { Images } from '../assets'

const { width, height } = Dimensions.get('window');
export default Lists = () => {



    const renderList = ({item}) => {
        console.warn(item.name)
        return (
            <View style={{  flexDirection: 'row', marginTop: 40, alignItems: 'center', justifyContent: 'space-between', }}>
                <TouchableOpacity style={{ marginStart: 10, alignItems: 'center', justifyContent: 'center', width: 55, height: 55, borderRadius: 10, backgroundColor: '#1BB81F' }}>
                    <Text style={{ fontFamily: 'CenturyGothic', color: 'white', letterSpacing: 2, }}>EDIT</Text>
                </TouchableOpacity>
                <View style={{  flexDirection: 'row', justifyContent: 'space-evenly', width:width * 0.82 }}>
                    <View style={{ backgroundColor: '#333333', width: 75, height: 75, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'CenturyGothic', letterSpacing: 1, fontSize: 11 }}>{item.name}</Text>
                    </View>
                    <View style={{ flex: 0, justifyContent: 'space-between' }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'CenturyGothic', color: 'white', fontSize: 9, letterSpacing: 1.5 }}>{'MARKDOWN'}</Text>
                            <View style={{ backgroundColor: '#333333', width: 50, height: 10, borderRadius: 3 }}></View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'CenturyGothic', color: 'white', fontSize: 9, letterSpacing: 1.5 }}>{'BRAND'}</Text>
                            <View style={{ backgroundColor: '#333333', width: 80, height: 10, borderRadius: 3 }}></View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'CenturyGothic', color: 'white', fontSize: 9, letterSpacing: 1.5 }}>{'COLOR'}</Text>
                            <View style={{ backgroundColor: '#333333', width: 80, height: 10, borderRadius: 3 }}></View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ fontFamily: 'CenturyGothic', color: 'white', fontSize: 9, letterSpacing: 1.5 }}>{'SIZE'}</Text>
                            <View style={{ backgroundColor: '#333333', width: 90, height: 10, borderRadius: 3 }}></View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'CenturyGothic', color: 'white', fontSize: 9, letterSpacing: 1.5 }}>DESCRIPTION</Text>
                        <View style={{ backgroundColor: '#333333', width: 75, height: 55, borderRadius: 5 }}></View>
                    </View>
                </View>
            </View>
        )
    }
    const obj = [
        {
            name:'Picture 1'
        },
        {
            name:'Picture 2'
        },
        {
            name:'Picture 3'
        }]
    const { mainContainerStyle, boxeViewStyle, buttonStyle, entriesViewStyle, entriesStyle } = styles;
    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#242423' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#242423' }}>
                {/* <ImageBackground source={Images.bg} style={{ width: width, height: height * 0.9 }} > */}
                <View style={mainContainerStyle}>
                    <TouchableOpacity
                        onPress={() => captureImage('photo')}
                        style={buttonStyle} >
                        <Image
                            source={Images.icon4}
                            style={{ width: 90, height: 90 }}
                        />
                    </TouchableOpacity>
                    <FlatList
                    style={{}}
                    // keyExtractor={}
                        data={obj}
                        renderItem={(i) => renderList(i)}

                    />
                    {/* {renderList()} */}
                </View>
                {/* </ImageBackground> */}
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    mainContainerStyle: {
        // flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between'
    },
    boxeViewStyle: {
        backgroundColor: '#333333', height: height * 0.16, width: width * 0.6, borderRadius: 18, alignItems: 'center', justifyContent: 'center'
    },
    buttonStyle: {
        alignItems: 'center', justifyContent: 'center',
    },
    entriesViewStyle: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width * 0.5, marginVertical: 5,
    },
    entriesStyle: {
        alignItems: 'flex-start', justifyContent: 'flex-start', fontFamily: 'CenturyGothic', color: 'white', fontSize: 11,
    }
})