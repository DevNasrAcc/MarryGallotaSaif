import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';


import Main from '../screens/Main'
import ImageLists from '../screens/Lists'

const AppStack = createStackNavigator();
export default function AppContent() {
  return (
      <>
      <ImageLists />
      </>
    // <AppStack.Navigator initialRouteName="Home" >
    //     <AppStack.Screen name="Home" component={Main} />
    //     <AppStack.Screen namw="ImageLists" component={ImageLists} />
    // </AppStack.Navigator>
  );
}