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
    ActivityIndicator,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { Images } from '../assets'
import { useDispatch, useSelector } from 'react-redux';
import { addimagedata } from '../redux/Data_Reducer'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';
import { useIsFocused } from '@react-navigation/native';
const { width, height } = Dimensions.get('window')
const Dashboard = ({ navigation, route }) => {
    const isFocused = useIsFocused();

    const dispatch = useDispatch();
    const [loading, setloading] = useState(true)
    const [picture, setPicture] = useState({});
    const [markdown, setMarkdown] = useState('')
    const [brand, setBrand] = useState('')
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const addImageData = (state) => dispatch(addimagedata(state))

    useEffect(() => {
        return () => {
            setPicture({});
            setDescription('')
            setMarkdown('');
            setBrand('');
            setColor('');
            setSize('');
        }
    }, [isFocused])

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
                    setPicture(response)
                    uploadImage(response)
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

    const uploadImage = async (response) => {
        if (response == null) {
            return null;
        }
        const uploadUri = response.uri;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        // // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);

        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);

        // Set transferred state
        task.on('state_changed', (taskSnapshot) => {
            console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );

            setTransferred(
                Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
                100,
            );
        });

        try {
            await task;

            const url = await storageRef.getDownloadURL();

            setUploading(false);
            setImage(null);

            Alert.alert(
                'Image uploaded!',
                'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
            );
            setImageUrl(url)
            return url;

        } catch (e) {
            console.log(e);
            return null;
        }

    };

    const onAdd = async () => {
        if (markdown != '' && brand != '' && color != '' && size != '' && description != '') {

            const ImageUrl = await imageUrl;
            setloading(false)
            firestore()
                .collection('Images')
                .add({
                    markdown: markdown,
                    size: size,
                    color: color,
                    brand: brand,
                    fileuri: ImageUrl,
                    description: description,
                    postTime: firestore.Timestamp.fromDate(new Date()),
                })
                .then(async () => {
                    console.log('Image Added!');
                    Alert.alert(
                        'Image published!',
                        'Your Image has been published Successfully!',
                    );
                    if (!loading) {
                        await navigation.navigate('Lists')
                    }

                    await setPicture({});
                    await etDescription('');
                })
                .catch(err => console.log(err));
        }
        else {
            Alert.alert(
            'Warning',
            'Please fill up all field',)
        }

    }
    const {
        mainContainerStyle,
        boxeViewStyle,
        buttonStyle,
        entriesViewStyle,
        entriesStyle
    } = styles;

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
                                        <>
                                            <Image
                                                source={
                                                    picture && picture.uri != undefined
                                                        ? { uri: picture.uri }
                                                        : null
                                                }
                                                style={{ height: height * 0.16, width: width * 0.6, borderRadius: 10, }}
                                            />
                                            {
                                                uploading &&
                                                <View style={{ position: "absolute" }}>
                                                    <Text style={{ color: 'white', fontSize: 10, fontFamily: 'CenturyGothic', letterSpacing: 2, marginBottom: 5 }}>{transferred} % Completed!</Text>
                                                    <ActivityIndicator size="large" color="#1BB81F" />
                                                </View>
                                            }
                                        </>
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
                                        <TextInput
                                            style={{
                                                backgroundColor: '#333333', width: width * 0.28,
                                                ...Platform.select({
                                                    ios: {
                                                        height: height * 0.016,
                                                    },
                                                    android: {
                                                        height: 35,
                                                        // lineHeight: 5,
                                                    },
                                                }),
                                                borderRadius: 3, color: 'white'
                                            }}

                                            value={markdown}
                                            onChangeText={(text) => setMarkdown(text)}
                                        />
                                    </View>
                                    <View style={entriesViewStyle}>
                                        <Text style={entriesStyle}>{'BRAND'}</Text>
                                        <TextInput
                                            style={{
                                                backgroundColor: '#333333', width: width * 0.36,
                                                ...Platform.select({
                                                    ios: {
                                                        height: height * 0.016,
                                                    },
                                                    android: {
                                                        height: 35,
                                                        // lineHeight: 5,

                                                    },
                                                }),
                                                borderRadius: 3, color: 'white'
                                            }}

                                            value={brand}
                                            onChangeText={(text) => setBrand(text)}
                                        />
                                    </View>
                                    <View style={entriesViewStyle}>
                                        <Text style={entriesStyle}>{'COLOR'}</Text>
                                        <TextInput
                                            style={{
                                                backgroundColor: '#333333', width: width * 0.36,
                                                ...Platform.select({
                                                    ios: {
                                                        height: height * 0.016,
                                                    },
                                                    android: {
                                                        height: 35,
                                                        justifyContent: 'center',
                                                        alignContent: 'center',
                                                        // lineHeight: 5,
                                                    },
                                                }),
                                                borderRadius: 3, color: 'white'
                                            }}
                                            value={color}
                                            onChangeText={(text) => setColor(text)}
                                        />
                                    </View>
                                    <View style={entriesViewStyle}>
                                        <Text style={entriesStyle}>{'SIZE'}</Text>
                                        <TextInput
                                            style={{
                                                backgroundColor: '#333333', width: width * 0.4,
                                                ...Platform.select({
                                                    ios: {
                                                        height: height * 0.016,
                                                    },
                                                    android: {
                                                        height: 35,
                                                        // lineHeight: 5,

                                                    },
                                                }),
                                                borderRadius: 3, alignItems: 'flex-start', justifyContent: 'center', color: 'white'
                                            }}
                                            value={size}
                                            onChangeText={(text) => setSize(text)}
                                        />
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
                                        onPress={() => onAdd()}
                                        style={buttonStyle} >
                                        <Image
                                            source={Images.icon2}
                                            style={{ width: 70, height: 70 }} />

                                        <Text
                                            style={{
                                                position: 'absolute',
                                                letterSpacing: 1.5,
                                                fontSize: 11,
                                                textAlign: 'center',
                                                top: 28,
                                                left: 19,
                                                fontFamily: 'CenturyGothic',
                                                color: 'white',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {'SAVE'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Lists')}
                                        style={buttonStyle} >
                                        {/* <Image
                                            source={Images.icon2}
                                            style={{ width: 70, height: 70 }} /> */}

                                        <Text
                                            style={{
                                                // position: 'absolute',
                                                marginVertical: 10,
                                                letterSpacing: 1.5,
                                                fontSize: 11,
                                                textAlign: 'center',
                                                // top: 28,
                                                // left: 19,
                                                fontFamily: 'CenturyGothic',
                                                color: 'white',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {'IMAGES'}
                                        </Text>
                                    </TouchableOpacity>
                                    {/* {loading && <View>
                                        <ActivityIndicator size={25} />
                                    </View>} */}
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