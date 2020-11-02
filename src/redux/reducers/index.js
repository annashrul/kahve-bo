import { combineReducers } from 'redux';
import { modalReducer, modalTypeReducer } from './modal.reducer';
import { dashboardReducer } from './dashboard/dashboard.reducer'
import authReducer from './authReducer';
import errorsReducer from './errorsReducer';
import {siteReducer} from './site.reducer';
import {userReducer} from "./user/user.reducer";
import {coinTypeReducer} from "./coinType/coinType.reducer";
import {faqReducer} from "./faq/faq.reducer";

export default combineReducers({
    modalReducer,
    modalTypeReducer,
    dashboardReducer,
    siteReducer,
    userReducer,
    coinTypeReducer,
    faqReducer,
    auth: authReducer,
    errors : errorsReducer
});