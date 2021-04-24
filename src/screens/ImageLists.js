import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Image, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addimagedata } from '../redux/Data_Reducer'
import { useDispatch, useSelector } from 'react-redux';

import firestore from '@react-native-firebase/firestore'

import { Images } from '../assets'
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const ImageLists = ({ navigation, route }) => {
    const isFocused = useIsFocused();

    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(false)

    const dispatch = useDispatch();
    const addImageData = (state) => dispatch(addimagedata(state))

    const async_data = async () => {
        await fetchImagedata()
    };

    useEffect(() => {
        async_data()
    }, [isFocused])

    const onPressEdit = (item) => {
        navigation.navigate('Edit', {
            item: item,
        })
    }

    const fetchImagedata = async () => {
        try {
            let list = [];
            await firestore()
                .collection('Images')
                .orderBy('postTime', 'desc')
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const { filename, filesize, fileuri, type, postTime, description, height, width } = doc.data();
                        list.push({
                            id: doc.id,
                            fileName: filename,
                            fileSize: filesize,
                            type: type,
                            uri: fileuri,
                            des: description,
                        })
                    });
                })
            await setData(list)
            await addImageData(list);
        }
        catch (err) {
            console.log(err)
        };
    };

    const renderList = (item) => {
        return (
            <View style={listContainer}>
                <TouchableOpacity style={EditButtonStyle} onPress={() => onPressEdit(item)} >
                    <Text style={EditButtonTextStyle}>EDIT</Text>
                </TouchableOpacity>
                <View style={{ marginHorizontal: 2, flexDirection: 'row' }}>
                    <View style={{ height: height * 0.05, borderRightWidth: 0.7, borderRightColor: '#595959', alignSelf: "center" }} />
                    <View style={{ width: width * 0.03, backgroundColor: '#595959', alignSelf: "center", height: 0.7 }} />
                    <View style={{ height: height * 0.08, borderLeftWidth: 0.7, borderLeftColor: '#595959', alignSelf: "center" }} />
                </View>
                <View style={picDetailsStyle}>
                    <View >
                        {item.item.uri == undefined ? <View style={picViewStyle}>
                            <Text style={picViewTextStyle}>{'PICTURE'}</Text>
                        </View>
                            : <Image source={{ uri: item.item.uri }} style={{ width: 75, height: 75, borderRadius: 10, }} />
                        }
                    </View>
                    <View style={detailViewStyle} >
                        <View style={item1Style}>
                            <Text style={item1TextStyle}>{'MARKDOWN'}</Text>
                            <View style={item1ViewStyle}>
                                <Text style={{ color: 'white', fontSize: 8, marginLeft: 5, }}>{item.item.fileName ? item.item.fileName : '--'}</Text>
                            </View>
                        </View>
                        <View style={item2Style}>
                            <Text style={item2TextStyle}>{'BRAND'}</Text>
                            <View style={item2ViewStyle}>
                                <Text style={{ color: 'white', fontSize: 8, marginLeft: 5, }}>
                                    {item.item.type ? item.item.type.split('/').join(' ') : '--'}
                                </Text>
                            </View>
                        </View>
                        <View style={item3Style}>
                            <Text style={item3TextStyle}>{'COLOR'}</Text>
                            <View style={item3ViewStyle}>
                                <Text style={{ color: 'white', fontSize: 8, marginLeft: 5, }}>{'--'}</Text>
                            </View>
                        </View>
                        <View style={item4Style}>
                            <Text style={item4TextStyle}>{'SIZE'}</Text>
                            <View style={item4ViewStyle}>
                                <Text style={{ color: 'white', fontSize: 8, marginLeft: 5, }}>
                                    {item.item.fileSize ? item.item.fileSize : '--'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={descContainerStyle}>
                        <Text style={desTextStyle}>DESCRIPTION</Text>
                        <View style={{ marginVertical: 2 }}>
                            <View style={{ width: width * 0.05, borderBottomWidth: 0.7, borderBottomColor: '#595959', alignSelf: "center" }} />
                            <View style={{ height: height * 0.015, backgroundColor: '#595959', width: 0.7, alignSelf: "center" }} />
                            <View style={{ width: width * 0.17, borderTopWidth: 0.7, borderTopColor: '#595959', alignSelf: "center" }} />
                        </View>
                        <View style={descViewStyle}><Text style={{ color: 'white', fontSize: 10, marginLeft: 5, textAlign: 'left' }}>{item.item.des}</Text></View>
                    </View>
                </View>
            </View>
        )
    }
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
                <View style={mainContainerStyle}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        style={buttonStyle}>
                        <Image
                            source={Images.icon4}
                            style={{ width: 70, height: 70 }}
                        />
                    </TouchableOpacity>
                    <View style={{ marginVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: width * 0.1, borderBottomWidth: 0.7, borderBottomColor: '#595959', alignSelf: "center" }} />
                        <View style={{ height: height * 0.029, backgroundColor: '#595959', width: 0.7, alignSelf: "center" }} />
                        <View style={{ width: width * 0.5, borderTopWidth: 0.7, borderTopColor: '#595959', alignSelf: "center" }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        {data.length > 0 ?
                            <FlatList
                                refreshing={refresh}
                                onRefresh={() => fetchImagedata()}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                data={data}
                                renderItem={(i) => renderList(i)}

                            />
                            :
                            <ScrollView
                                refreshing={refresh}
                                onRefresh={() => fetchImagedata()}
                                contentContainerStyle={{ alignItems: 'center', flex: 2, justifyContent: 'center' }}
                            >

                                <Image source={Images.notfound} style={{ width: 80, height: 80, marginVertical: 10 }} />
                                <Text style={{ color: 'white', fontFamily: 'CenturyGothic', textAlign: 'center', }}>
                                    No Data Found...
                            </Text>
                            </ScrollView>
                        }

                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
export default ImageLists;

const styles = StyleSheet.create({
    mainContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
    listContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    EditButtonStyle: {
        marginStart: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 55, height: 55,
        borderRadius: 10,
        backgroundColor: '#1BB81F'
    },
    EditButtonTextStyle: {
        fontFamily: 'CenturyGothic',
        color: 'white',
        letterSpacing: 2,
    },
    boxeViewStyle: {
        backgroundColor: '#333333',
        height: height * 0.16,
        width: width * 0.6,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    picDetailsStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: width * 0.73
    },
    picViewStyle: {
        backgroundColor: '#333333',
        width: 75,
        height: 75,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    picViewTextStyle: {
        color: 'white',
        fontFamily: 'CenturyGothic',
        letterSpacing: 1,
        fontSize: 11
    },
    detailViewStyle: {
        flex: 1,
        height: 80,
        // backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    item1Style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    item1TextStyle: {
        fontFamily: 'CenturyGothic',
        color: 'white',
        fontSize: 8,
        letterSpacing: 1.5
    },
    item1ViewStyle: {
        backgroundColor: '#333333',
        width: 50,
        height: 10,
        borderRadius: 3
    },
    item2Style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    item2TextStyle: {
        fontFamily: 'CenturyGothic',
        color: 'white',
        fontSize: 8,
        letterSpacing: 1.5
    },
    item2ViewStyle: {
        backgroundColor: '#333333',
        width: 80,
        height: 10,
        borderRadius: 3
    },
    item3Style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    item3TextStyle: {
        fontFamily: 'CenturyGothic',
        color: 'white',
        fontSize: 8,
        letterSpacing: 1.5
    },
    item3ViewStyle: {
        backgroundColor: '#333333',
        width: 80,
        height: 10,
        borderRadius: 3
    },
    item4Style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    item4TextStyle: {
        fontFamily: 'CenturyGothic',
        color: 'white',
        fontSize: 8,
        letterSpacing: 1.5
    },
    item4ViewStyle: {
        backgroundColor: '#333333',
        width: 90,
        height: 10,
        borderRadius: 3
    },
    descContainerStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    desTextStyle: {
        fontFamily: 'CenturyGothic',
        color: 'white',
        fontSize: 9,
        letterSpacing: 1.5
    },
    descViewStyle: {
        backgroundColor: '#333333',
        width: 75, height: 45,
        borderRadius: 5
    }

})