import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Image } from 'react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { Images } from '../assets'


const { width, height } = Dimensions.get('window')
export default Main = () => {

    const [picture, setPicture] = useState();
    const [details, setDetails] = useState();
    const [description, setDescription] = useState();


    useEffect(() => {
        console.warn('WelCome to Marry Gallota')
    }, [])

    const Capture = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            videoQuality: 'low',
            durationLimit: 30,
            saveToPhotos: true,
        };
        launchCamera(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            console.log('base64 -> ', response.base64);
            console.log('uri -> ', response.uri);
            console.log('width -> ', response.width);
            console.log('height -> ', response.height);
            console.log('fileSize -> ', response.fileSize);
            console.log('type -> ', response.type);
            console.log('fileName -> ', response.fileName);
            setSingleFile(response);
        });
    }

    const { mainContainerStyle, boxeViewStyle, buttonStyle, entriesViewStyle, entriesStyle } = styles;
    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#2C2C2C' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#2C2C2C' }}>
                <ImageBackground source={Images.bg} style={{ width: width, height: height * 0.9 }} >
                    <View style={mainContainerStyle} >
                        <TouchableOpacity
                            onPress={() => {
                                Capture()
                                console.warn('Captured')
                            }}
                            style={buttonStyle} >
                            <Image
                                source={Images.icon3}
                                style={{ width: 80, height: 80 }} />
                            {/* <Image
                                source={Images.camera}
                                style={{ position: 'absolute', width: 30, height: 30, resizeMode: 'contain', top: 22, left: 25 }} /> */}
                        </TouchableOpacity>
                        <View style={boxeViewStyle}>
                            <Text style={{ fontFamily: 'CenturyGothic', letterSpacing: 5, fontSize: 18, color: 'white' }}>
                                PICTURE
                            </Text>
                        </View>
                        <View>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'MARKDOWN'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.28, height: height * 0.018, borderRadius: 4 }} />
                            </View>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'BRAND'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.36, height: height * 0.018, borderRadius: 4 }} />

                            </View>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'COLOR'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.36, height: height * 0.018, borderRadius: 4 }} />

                            </View>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'SIZE'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.4, height: height * 0.018, borderRadius: 4 }} />

                            </View>
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'CenturyGothic', letterSpacing: 3, fontSize: 11, textAlign: 'center', color: 'white', marginVertical: 5, }}>
                                Description
                            </Text>
                            <View style={boxeViewStyle}>

                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => console.warn('SAVED')}
                            style={buttonStyle} >
                            <Image
                                source={Images.icon2}
                                style={{ width: 80, height: 80 }} />
                            <Text
                                style={{ position: 'absolute', textAlign: 'center', top: 30, left: 22, fontFamily: 'CenturyGothic', color: 'white', fontWeight: '700' }}
                            >
                                SAVE
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    mainContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boxeViewStyle: {
        backgroundColor: '#333333', height: height * 0.16, width: width * 0.6, borderRadius: 25, alignItems: 'center', justifyContent: 'center'
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