import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Image, TextInput, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { Images } from '../assets'


const { width, height } = Dimensions.get('window')
const Edit = ({ navigation, route }) => {
    // console.warn(route.params)

    const [picture, setPicture] = useState({});
    const [details, setDetails] = useState();
    const [description, setDescription] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateData, setUpdateData] = useState();
    const [edit, setEdit] = useState();

    useEffect(() => {
        // removeItem()
        route.params !== undefined && route.params.edit == true ? setEdit(true) : setEdit(false)
        route.params !== undefined && setPicture(route.params.item)

        getData()
        return () => {
            setPicture({})
            setDescription('')
        }
    }, [])

    const captureImage = async (type) => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
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
    }

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
    const onSave = async (a) => {
        try {
            await AsyncStorage.setItem('@imagedata', JSON.stringify(a))
            console.warn('SAVED')
            setTimeout(() => {
                getData()
                navigation.navigate('Lists')
            }, 1000)

        } catch (error) {
            console.warn('Error', error.message)
        }
    }

    const updateImageItem = async (index) => {
        try {

            const picturedata = await AsyncStorage.getItem('@imagedata');
            let pictureItems = JSON.parse(picturedata);
            console.warn('pictureItems', pictureItems)
            index.map(async (it, ind) => {
                const updatedImageItems = pictureItems.filter(function (e, itemIndex) { return itemIndex !== ind });
                console.warn('updatedImageItems', updatedImageItems)
                await AsyncStorage.setItem('@imagedata', JSON.stringify(index));
            })
            setEdit(false)
            setTimeout(() => {
                getData()
                navigation.navigate('Lists')
            }, 1000)

        } catch (error) {
            console.log('error: ', error);
        }
    };



    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@imagedata')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null;
            setUpdateData(data)
        } catch (error) {
            console.warn('Error', error.message)
        }
    }

    const removeItem = async () => {
        try {
            const res = await AsyncStorage.removeItem('@imagedata')
            setDeleteModal(!deleteModal)
            console.warn('Delete Items', res)
            setPicture({})
            setDescription('')
            navigation.navigate('Home')
            getData()
        } catch (e) {
            console.warn('Error', e.message)
        }

        console.log('Done.')
    }


    const { mainContainerStyle, box1ViewStyle, boxViewStyle, buttonStyle, entriesViewStyle, entriesStyle } = styles;
    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#242423' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#242423' }}>
                {/* <ImageBackground source={Images.bg} style={{ width: width, height: height * 0.9 }} > */}
                <Modal transparent={true} isVisible={deleteModal} onBackdropPres={deleteModal} s >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                height: 260,
                                width: 260,
                                borderRadius: 200,
                                paddingVertical: 10,
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                backgroundColor: '#1BB81F',
                                borderWidth: 10,
                                borderColor: '#139245',
                            }}>
                            <View style={{ width: 180, marginTop: 20 }}>
                                <Text style={{ fontSize: 22, textAlign: 'center', color: 'white', letterSpacing: 2, fontWeight: '300' }}>
                                    {'ARE YOU SURE YOU WANT TO DELETE ?'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 130 }}>
                                <TouchableOpacity onPress={() => removeItem()}>
                                    <Text style={{ fontFamily: 'CenturyGothic', fontSize: 22, color: 'white', letterSpacing: 2 }}>YES</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setDeleteModal(!deleteModal)}>
                                    <Text style={{ fontFamily: 'CenturyGothic', fontSize: 22, color: 'white', letterSpacing: 2 }}>NO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={mainContainerStyle} >
                    {/* <TouchableOpacity
                            onPress={() => captureImage('photo')}
                            style={buttonStyle} >
                            <Image
                                source={Images.icon3}
                                style={{ width: 80, height: 80 }}
                            />
                        </TouchableOpacity> */}
                    <View>
                        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333333', width: width * 0.65, alignSelf: "center", padding: 10 }} />
                        <View style={box1ViewStyle}>
                            {picture.uri ?
                                <Image
                                    source={
                                        picture.uri != undefined
                                            ? { uri: picture.uri }

                                            : '--'
                                    }
                                    style={{ height: height * 0.16, width: width * 0.6, borderRadius: 10, }}
                                />
                                :
                                <Text style={{ fontFamily: 'CenturyGothic', letterSpacing: 5, fontSize: 18, color: 'white' }}>
                                    PICTURE
                            </Text>}
                        </View>
                        <View style={{ borderTopWidth: 1.5, borderTopColor: '#333333', width: width * 0.65, alignSelf: "center", padding: 10 }} />
                    </View>
                    <View style={{height:40, width: 2, backgroundColor: '#333333', position:'absolute', top:203, bottom:0 }} />

                    <View>
                        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333333', width: width * 0.4, alignSelf: "center", padding: 10 }} />
                        <View style={{ alignSelf: "center", marginVertical: 5, }}>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'MARKDOWN'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.28, height: height * 0.018, borderRadius: 4 }} >
                                    <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>{
                                        picture.fileName != undefined
                                            ? picture.fileName

                                            : '--'
                                    }</Text>
                                </View>
                            </View>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'BRAND'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.36, height: height * 0.018, borderRadius: 4, }} >
                                    <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>{
                                        picture.type
                                            ? picture.type.split('/').join(' ')
                                            : '--'}</Text>
                                </View>
                            </View>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'COLOR'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.36, height: height * 0.018, borderRadius: 4 }} >
                                    <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>{'--'}</Text>
                                </View>
                            </View>
                            <View style={entriesViewStyle}>
                                <Text style={entriesStyle}>{'SIZE'}</Text>
                                <View style={{ backgroundColor: '#333333', width: width * 0.4, height: height * 0.018, borderRadius: 4, alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>{
                                        picture.fileSize != undefined
                                            ? picture.fileSize
                                            : '--'
                                    }</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ borderTopWidth: 1.5, borderTopColor: '#333333', width: width * 0.4, alignSelf: "center", padding: 10 }} />
                    </View>
                    <View style={{height:40, width: 2, backgroundColor: '#333333', position:'absolute', top:358, bottom:0 }} />

                    <View>
                        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333333', width: width * 0.25, alignSelf: "center", padding: 10 }} />
                        <View style={{ alignSelf: "center", marginVertical: 10 }}>
                            <Text style={{ fontFamily: 'CenturyGothic', letterSpacing: 3, fontSize: 11, textAlign: 'center', color: 'white', marginVertical: 5, }}>
                                Description
                                </Text>
                            <View >
                                <TextInput
                                    multiline={true}
                                    maxLength={1000}
                                    editable={true}
                                    type="text"
                                    value={description ? description : ''}
                                    onChangeText={(e) => setDescription(e)}
                                    color={'white'}
                                    style={[boxViewStyle, { color: 'white', textAlignVertical: 'top', padding: 5 }]}
                                />
                            </View>
                        </View>
                        <View style={{ borderTopWidth: 1.5, borderTopColor: '#333333', width: width * 0.5, alignSelf: "center", padding: 10 }} />
                    </View>
                    <View style={{height:40, width: 2, backgroundColor: '#333333', position:'absolute', bottom:122 }} />
                    <View>
                        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333333', width: width * 0.25, alignSelf: "center", padding: 10, }} />
                        <View style={{ flexDirection: 'column', marginVertical: 10, alignSelf: "center" }} >
                            <TouchableOpacity
                                onPress={async () => {
                                    let data = { ...picture, des: description }
                                    let arr = [];
                                    arr.push(data)
                                    edit ? updateImageItem(arr) : onSave(arr)
                                }
                                }
                                style={buttonStyle} >
                                <Image
                                    source={Images.icon2}
                                    style={{ width: 80, height: 80 }} />
                                {edit
                                    ? <Text
                                        style={{ position: 'absolute', textAlign: 'center', fontSize: 12, top: 32, left: 17, fontFamily: 'CenturyGothic', color: 'white', fontWeight: '700' }}
                                    >
                                        {'UPDATE'}
                                    </Text>
                                    :
                                    <Text
                                        style={{ position: 'absolute', textAlign: 'center', top: 30, left: 22, fontFamily: 'CenturyGothic', color: 'white', fontWeight: '700' }}
                                    >
                                        {'SAVE'}
                                    </Text>}
                            </TouchableOpacity>
                            {<TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center', marginBottom: -10, marginTop: 15 }}
                                onPress={() => setDeleteModal(!deleteModal)} >
                                <Text style={{ color: 'white', fontFamily: 'CenturyGothic', letterSpacing: 3, fontSize: 13 }}>DELETE</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </View>
                {/* </ImageBackground> */}
            </SafeAreaView>
        </>
    )
}
export default Edit;

const styles = StyleSheet.create({
    mainContainerStyle: {
        // flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between'
    },
    box1ViewStyle: {
        marginVertical: 10,
        backgroundColor: '#333333',
        height: height * 0.19,
        width: width * 0.8,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxViewStyle: {
        backgroundColor: '#333333',
        height: height * 0.16,
        width: width * 0.6,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    entriesViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.5,
        marginVertical: 5,
    },
    entriesStyle: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        fontFamily: 'CenturyGothic',
        color: 'white',
        fontSize: 11,
    }
})