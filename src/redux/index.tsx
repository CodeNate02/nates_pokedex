export { useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { objReducer } from './reducers/objReducer';
export const store = configureStore({
	reducer: combineReducers({
		data: objReducer({}, 'data'),
	}),
});
//Generic setState action
export const setState = (value: unknown, target = '') => {
	return {
		type: `SET${target}`,
		payload: value,
	};
};
