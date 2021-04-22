/* eslint-disable prettier/prettier */
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import DataReducer from './Data_Reducer';

const AppReducer = combineReducers({
    DataReducer
});

// const logger = (store) => {
//   return (next) => {
//     return (action) => {
//       const result = next(action);
//       console.log('[Middleware] next state =>', store.getState());
//       return result;
//     };
//   };
// };

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  AppReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  // composeEnhancers(applyMiddleware(logger)),
);

export default store;
