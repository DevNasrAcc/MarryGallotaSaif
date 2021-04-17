import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { Images } from '../assets'

const { width, height } = Dimensions.get('window');
const ImageLists = ({navigation}) => {

    const renderList = ({ item }) => {
        return (
            <View style={listContainer}>
                <TouchableOpacity style={EditButtonStyle}>
                    <Text style={EditButtonTextStyle}>EDIT</Text>
                </TouchableOpacity>
                <View style={picDetailsStyle}>
                    <View style={picViewStyle}>
                        <Text style={picViewTextStyle}>{item.name}</Text>
                    </View>
                    <View style={detailViewStyle} >
                        <View style={item1Style}>
                            <Text style={item1TextStyle}>{'MARKDOWN'}</Text>
                            <View style={item1ViewStyle}></View>
                        </View>
                        <View style={item2Style}>
                            <Text style={item2TextStyle}>{'BRAND'}</Text>
                            <View style={item2ViewStyle}></View>
                        </View>
                        <View style={item3Style}>
                            <Text style={item3TextStyle}>{'COLOR'}</Text>
                            <View style={item3ViewStyle}></View>
                        </View>
                        <View style={item4Style}>
                            <Text style={item4TextStyle}>{'SIZE'}</Text>
                            <View style={item4ViewStyle}></View>
                        </View>
                    </View>
                    <View style={descContainerStyle}>
                        <Text style={desTextStyle}>DESCRIPTION</Text>
                        <View style={descViewStyle}></View>
                    </View>
                </View>
            </View>
        )
    }
    const obj = [
        {
            name: 'Picture 01'
        },
        {
            name: 'Picture 02'
        },
        {
            name: 'Picture 03'
        },
        {
            name: 'Picture 04'
        },
        {
            name: 'Picture 05'
        },
        {
            name: 'Picture 06'
        },
        {
            name: 'Picture 07'
        },
        {
            name: 'Picture 08'
        },
        {
            name: 'Picture 09'
        },
    ]
    const {
        mainContainerStyle,
        listContainer,
        buttonStyle,
        EditButtonStyle,
        EditButtonTextStyle,
        picDetailsStyle,
        picViewStyle,
        picViewTextStyle,
        detailViewStyle,
        item1Style,
        item1TextStyle,
        item1ViewStyle,
        item2Style,
        item2TextStyle,
        item2ViewStyle,
        item3Style,
        item3TextStyle,
        item3ViewStyle,
        item4Style,
        item4TextStyle,
        item4ViewStyle,
        descContainerStyle,
        desTextStyle,
        descViewStyle,
    } = styles;
    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#242423' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#242423' }}>
                {/* <ImageBackground source={Images.bg} style={{ width: width, height: height * 0.9 }} > */}
                <View style={mainContainerStyle}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        style={buttonStyle}>
                        <Image
                            source={Images.icon4}
                            style={{ width: 90, height: 90 }}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            keyExtractor={(it, ind) => ind}
                            data={obj}
                            renderItem={(i) => renderList(i)}

                        />
                    </View>
                </View>
                {/* </ImageBackground> */}
            </SafeAreaView>
        </>
    )
}
export default ImageLists;

const styles = StyleSheet.create({
    mainContainerStyle: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between'
    },
    listContainer: {
        flexDirection: 'row', marginTop: 40, alignItems: 'center', justifyContent: 'space-between',
    },
    EditButtonStyle: {
        marginStart: 10, alignItems: 'center', justifyContent: 'center', width: 55, height: 55, borderRadius: 10, backgroundColor: '#1BB81F'
    },
    EditButtonTextStyle: {
        fontFamily: 'CenturyGothic', color: 'white', letterSpacing: 2,
    },
    boxeViewStyle: {
        backgroundColor: '#333333', height: height * 0.16, width: width * 0.6, borderRadius: 18, alignItems: 'center', justifyContent: 'center'
    },
    buttonStyle: {
        alignItems: 'center', justifyContent: 'center',
    },
    picDetailsStyle: {
        flexDirection: 'row', justifyContent: 'space-evenly', width: width * 0.82
    },
    picViewStyle: {
        backgroundColor: '#333333', width: 75, height: 75, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
    },
    picViewTextStyle: {
        color: 'white', fontFamily: 'CenturyGothic', letterSpacing: 1, fontSize: 11
    },
    detailViewStyle: {
        flex: 0, justifyContent: 'space-between'
    },
    item1Style: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    item1TextStyle: {
        fontFamily: 'CenturyGothic', color: 'white', fontSize: 8, letterSpacing: 1.5
    },
    item1ViewStyle: {
        backgroundColor: '#333333', width: 50, height: 10, borderRadius: 3
    },
    item2Style: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    item2TextStyle: {
        fontFamily: 'CenturyGothic', color: 'white', fontSize: 8, letterSpacing: 1.5
    },
    item2ViewStyle: {
        backgroundColor: '#333333', width: 80, height: 10, borderRadius: 3
    },
    item3Style: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    item3TextStyle: {
        fontFamily: 'CenturyGothic', color: 'white', fontSize: 8, letterSpacing: 1.5
    },
    item3ViewStyle: {
        backgroundColor: '#333333', width: 80, height: 10, borderRadius: 3
    },
    item4Style: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    item4TextStyle: {
        fontFamily: 'CenturyGothic', color: 'white', fontSize: 8, letterSpacing: 1.5
    },
    item4ViewStyle: {
        backgroundColor: '#333333', width: 90, height: 10, borderRadius: 3
    },
    descContainerStyle: {
        flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'
    },
    desTextStyle: {
        fontFamily: 'CenturyGothic', color: 'white', fontSize: 9, letterSpacing: 1.5
    },
    descViewStyle: {
        backgroundColor: '#333333', width: 75, height: 55, borderRadius: 5
    }

})