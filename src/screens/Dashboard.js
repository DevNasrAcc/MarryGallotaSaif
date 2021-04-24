import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { Images } from '../assets'
import { useDispatch, useSelector } from 'react-redux';
import { addimagedata } from '../redux/Data_Reducer'
import firestore from '@react-native-firebase/firestore'

const { width, height } = Dimensions.get('window')
const Dashboard = ({ navigation, route }) => {

    const dispatch = useDispatch();
    const [picture, setPicture] = useState({});
    const [details, setDetails] = useState();
    const [description, setDescription] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateData, setUpdateData] = useState();
    const [edit, setEdit] = useState();

    const addImageData = (state) => dispatch(addimagedata(state))

    useEffect(() => {
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


    const onAdd = async (state) => {
        firestore()
            .collection('Images')
            .add({
                filename: picture.fileName,
                filesize: picture.fileSize,
                width: picture.width,
                height: picture.height,
                fileuri: picture.uri,
                type: picture.type,
                description: description,
                postTime: firestore.Timestamp.fromDate(new Date()),
            })
            .then(async() => {
                console.log('Post Added!');
                Alert.alert(
                    'Post published!',
                    'Your post has been published Successfully!',
                );
                await navigation.navigate('Lists')

                setPicture({});
                setDescription('');
            })
            ;
    }
    const { mainContainerStyle, boxeViewStyle, buttonStyle, entriesViewStyle, entriesStyle } = styles;
    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#242423' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#242423' }}>
                <ImageBackground source={Images.bg} style={{ width: width, height: height }} >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "position" : "height"}
                        style={{ flex: 1, }}
                    >
                        <ScrollView contentContainerStyle={mainContainerStyle} showsVerticalScrollIndicator={false} >
                            <View>
                                <TouchableOpacity
                                    onPress={() => captureImage('photo')}
                                    style={buttonStyle} >
                                    <Image
                                        source={Images.icon3}
                                        style={{ width: 70, height: 70 }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginVertical: 5 }}>
                                <View style={{ width: width * 0.15, borderBottomWidth: 0.7, borderBottomColor: '#595959', alignSelf: "center" }} />
                                <View style={{ height: height * 0.049, backgroundColor: '#595959', width: 0.7, alignSelf: "center" }} />
                                <View style={{ width: width * 0.5, borderTopWidth: 0.7, borderTopColor: '#595959', alignSelf: "center" }} />
                            </View>

                            <View style={{}}>
                                <View style={boxeViewStyle}>
                                    {picture != undefined || picture != null ?
                                        <Image
                                            source={
                                                picture && picture.uri != undefined
                                                    ? { uri: picture.uri }
                                                    : null
                                            }
                                            style={{ height: height * 0.16, width: width * 0.6, borderRadius: 10, }}
                                        />
                                        :
                                        <Text style={{ fontFamily: 'CenturyGothic', letterSpacing: 5, fontSize: 18, color: 'white' }}>
                                            PICTURE
                                        </Text>
                                    }
                                </View>
                            </View>
                            <View style={{ marginVertical: 5 }}>
                                <View style={{ width: width * 0.4, borderBottomWidth: 0.7, borderBottomColor: '#595959', alignSelf: "center" }} />
                                <View style={{ height: height * 0.049, backgroundColor: '#595959', width: 0.7, alignSelf: "center" }} />
                                <View style={{ width: width * 0.4, borderTopWidth: 0.7, borderTopColor: '#595959', alignSelf: "center" }} />
                            </View>
                            <View>
                                <View>
                                    <View style={entriesViewStyle}>
                                        <Text style={entriesStyle}>{'MARKDOWN'}</Text>
                                        <View style={{ backgroundColor: '#333333', width: width * 0.28, height: height * 0.016, borderRadius: 3 }} >
                                            <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>
                                                {
                                                    picture != undefined || picture != null || picture != {}
                                                        ? picture.fileName
                                                        : '--'
                                                }</Text>
                                        </View>
                                    </View>
                                    <View style={entriesViewStyle}>
                                        <Text style={entriesStyle}>{'BRAND'}</Text>
                                        <View style={{ backgroundColor: '#333333', width: width * 0.36, height: height * 0.016, borderRadius: 3, }} >
                                            <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>{
                                                picture != undefined || picture != null || picture != {}
                                                    ? picture.type && picture.type.split('/').join(' ')
                                                    : '--'}</Text>
                                        </View>
                                    </View>
                                    <View style={entriesViewStyle}>
                                        <Text style={entriesStyle}>{'COLOR'}</Text>
                                        <View style={{ backgroundColor: '#333333', width: width * 0.36, height: height * 0.016, borderRadius: 3 }} >
                                            <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>{'--'}</Text>
                                        </View>

                                    </View>
                                    <View style={entriesViewStyle}>
                                        <Text style={entriesStyle}>{'SIZE'}</Text>
                                        <View style={{ backgroundColor: '#333333', width: width * 0.4, height: height * 0.016, borderRadius: 3, alignItems: 'flex-start', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white', fontSize: 10, marginLeft: 5, }}>{
                                                picture != undefined || picture != null || picture != {}
                                                    ? picture.fileSize
                                                    : '--'
                                            }</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginVertical: 5 }}>
                                <View style={{ width: width * 0.4, borderBottomWidth: 0.7, borderBottomColor: '#595959', alignSelf: "center" }} />
                                <View style={{ height: height * 0.049, backgroundColor: '#595959', width: 0.7, alignSelf: "center" }} />
                                <View style={{ width: width * 0.25, borderTopWidth: 0.7, borderTopColor: '#595959', alignSelf: "center" }} />
                            </View>
                            <View>
                                <View>
                                    <Text style={{
                                        fontFamily: 'CenturyGothic',
                                        letterSpacing: 3,
                                        fontSize: 11,
                                        textAlign: 'center',
                                        color: 'white',
                                        marginVertical: 5,
                                    }}
                                    >
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
                                            style={[boxeViewStyle, { color: 'white', textAlignVertical: 'top', padding: 5 }]}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginVertical: 5 }}>
                                <View style={{ width: width * 0.5, borderBottomWidth: 0.7, borderBottomColor: '#595959', alignSelf: "center" }} />
                                <View style={{ height: height * 0.049, backgroundColor: '#595959', width: 0.7, alignSelf: "center" }} />
                                <View style={{ width: width * 0.15, borderTopWidth: 0.7, borderTopColor: '#595959', alignSelf: "center" }} />
                            </View>
                            <View>
                                <View style={{ flexDirection: 'column', }} >
                                    <TouchableOpacity
                                        onPress={async () => {
                                            let arr = [];
                                            let mergeData = { ...picture, des: description };
                                            arr.push(mergeData);
                                            // console.warn({ ...picture, des: description });
                                            // onSave({ ...picture, des: description })
                                            onAdd({ ...picture, des: description })
                                        }
                                        }
                                        style={buttonStyle} >
                                        <Image
                                            source={Images.icon2}
                                            style={{ width: 70, height: 70 }} />

                                        <Text
                                            style={{ position: 'absolute', fontSize: 11, textAlign: 'center', top: 28, left: 21, fontFamily: 'CenturyGothic', color: 'white', fontWeight: '700' }}
                                        >
                                            {'SAVE'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </SafeAreaView>
        </>
    )
}
export default Dashboard;

const styles = StyleSheet.create({
    mainContainerStyle: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'auto'
    },
    boxeViewStyle: {
        backgroundColor: '#333333',
        height: height * 0.16,
        width: width * 0.6,
        borderRadius: 10,
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