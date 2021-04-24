import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';


import Dashboard from '../screens/Dashboard'
import ImageLists from '../screens/ImageLists'
import Edit from '../screens/Edit'

export default function AppContent() {


  const Stack = createStackNavigator();

  const AppStackScreen = () => {

    return (
      <Stack.Navigator initialRouteName="Home" headerMode={'none'}>
        <Stack.Screen name="Home">
          {(props) => <Dashboard {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Lists">
          {(props) => <ImageLists {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Edit">
          {(props) => <Edit {...props} />}
        </Stack.Screen>

      </Stack.Navigator>
    )
  }

  return <AppStackScreen />
}