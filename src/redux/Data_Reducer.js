import AsyncStorage from '@react-native-async-storage/async-storage';

/* eslint-disable prettier/prettier */
export const ADD_IMAGE_DATA = 'ADD_IMAGE_DATA ';
export const UPDATE_IMAGE_DATA = 'CLEAR_IMAGE_DATA';
export const CLEAR_IMAGE_DATA = 'CLEAR_IMAGE_DATA';
export const CLEAR_IMAGE_DETAILS = 'CLEAR_IMAGE_DETAILS';
//action creators
export function addimagedata(data) {
  console.log('USER DATA AFTER UPADTE==>', data)
  return {
    type: ADD_IMAGE_DATA,
    data,
  };
}
export function updateimagedata(data) {
  return {
    type: UPDATE_IMAGE_DATA,
    data,
  };
}
export function clearimagedata() {
  return {
    type: CLEAR_IMAGE_DATA,
  };
}
export function clearimagedetails() {
  return {
    type: CLEAR_IMAGE_DETAILS,
  };
}

//global State
// Intial State
let empty = [];
let images = [];
AsyncStorage.getItem('@imagedata').then((result) => {
  if (result) {
    images = JSON.parse(result);
  }
});
export default function DataReducer(state = images, action) {
  // console.log('UPDATED REDUX',action.data)
  switch (action.type) {
    case ADD_IMAGE_DATA:
      return action.data;
    case UPDATE_IMAGE_DATA:
      // console.log('UPDATE_IMAGE_DATA REDUX',action.data)
      return action.data;
    case CLEAR_IMAGE_DETAILS:
      return empty;
    default:
      return state;
  }
}
