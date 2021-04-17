import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { Images } from '../assets'


const { width, height } = Dimensions.get('window')
const Dashboard = ({ navigation }) => {

    const [picture, setPicture] = useState({});
    const [details, setDetails] = useState();
    const [description, setDescription] = useState();
    const [deleteModal, setDeleteModal]  = useState(false);


    useEffect(() => {
        // console.warn('WelCome to Marry Gallota')
    }, [])

    const captureImage = async (type) => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchCamera(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                console.warn(response)
                console.log('response', JSON.stringify(response));
                setPicture(response)
            }
        });
    };
    // console.warn('Picture data', picture);

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };
    const onSave = async (value) => {
        try {
            const imageData = JSON.stringify(value)
            await AsyncStorage.setItem('@imagedata', imageData)
            console.warn('SAVED')
            setTimeout(() => {
                navigation.navigate('Lists')
            }, 1000)

        } catch (error) {
            console.warn('Error', error.message)
        }
    }


    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.warn('Error', error.message)
        }
    }


    const { mainContainerStyle, boxeViewStyle, buttonStyle, entriesViewStyle, entriesStyle } = styles;
    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#242423' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#242423' }}>
                <ImageBackground source={Images.bg} style={{ width: width, height: height * 0.9 }} >
                    <View style={mainContainerStyle} >
                        <TouchableOpacity
                            onPress={() => captureImage('photo')}
                            style={buttonStyle} >
                            <Image
                                source={Images.icon3}
                                style={{ width: 80, height: 80 }} />
                            {/* <Image
                                source={Images.camera}
                                style={{ position: 'absolute', width: 30, height: 30, resizeMode: 'contain', top: 22, left: 25 }} /> */}
                        </TouchableOpacity>
                        <View style={boxeViewStyle}>
                            {picture !== {} ? <Image source={{ uri: picture.uri }} style={{ height: height * 0.16, width: width * 0.6, borderRadius: 18, }} />
                                : <Text style={{ fontFamily: 'CenturyGothic', letterSpacing: 5, fontSize: 18, color: 'white' }}>
                                    PICTURE
                            </Text>}
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
                            <View >
                                <TextInput
                                    multiline={true}
                                    maxLength={1000}
                                    type="text"
                                    value={description}
                                    // placeholder="type..."
                                    // placeholderTextColor={'white'}
                                    onChangeText={(e) => setDescription(e)}
                                    color={'white'}
                                    style={[boxeViewStyle, { color: 'white', textAlignVertical: 'top', padding: 5 }]}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', }} >
                            <TouchableOpacity
                                onPress={async () => {
                                    await onSave(picture)
                                }
                                }
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
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginBottom: -10, marginTop: 10 }} activeOpacity={0.7} onPress={()=>{setDeleteModal(!deleteModal)}} >
                                <Text style={{ color: 'white', fontFamily: 'CenturyGothic', letterSpacing: 2, fontSize: 12 }}>DELETE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </>
    )
}
export default Dashboard;

const styles = StyleSheet.create({
    mainContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boxeViewStyle: {
        backgroundColor: '#333333', height: height * 0.16, width: width * 0.6, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
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