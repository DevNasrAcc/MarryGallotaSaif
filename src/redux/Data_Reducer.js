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
    type: ADD_USER_DATA,
    data,
  };
}
export function updateimagedata(data) {
  return {
    type: UPDATE_DATA,
    data,
  };
}
export function clearimagedata() {
  return {
    type: CLEAR_USER_DATA,
  };
}
export function clearimagedetails() {
  return {
    type: CLEAR_USER_DETAILS,
  };
}

//global State
// Intial State
let empty = {};
let user = {};
AsyncStorage.getItem('@imagedata').then((result) => {
  if (result) {
    Object.assign(user, JSON.parse(result));
    console.warn('user', result);
  }
});
export default function DataReducer(state = user, action) {
  console.log('UPDATED REDUX',action.data)
  switch (action.type) {
    case ADD_IMAGE_DATA:
      return action.data;
    case UPDATE_IMAGE_DATA:
      console.log('UPDATE_IMAGE_DATA REDUX',action.data)
      return {
        ...state,
        [action.data.name]: action.data.value,
      };
    case CLEAR_IMAGE_DETAILS:
      return empty;
    default:
      return state;
  }
}
