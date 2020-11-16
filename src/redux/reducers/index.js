import { combineReducers } from 'redux';
import { modalReducer, modalTypeReducer } from './modal.reducer';
import { dashboardReducer } from './dashboard/dashboard.reducer'
import authReducer from './authReducer';
import errorsReducer from './errorsReducer';
import {siteReducer} from './site.reducer';
import {coinTypeReducer} from "./coinType/coinType.reducer";
import {faqReducer} from "./faq/faq.reducer";
import {inboxReducer} from "./inbox/inbox.reducer";
import {depositReducer} from "./deposit/deposit.reducer";
import {penarikanReducer} from "./penarikan/penarikan.reducer";
import {pengaturanReducer} from "./setting/setting.reducer";
import {transactionReducer} from "./transaction/transaction.reducer";
import {logReducer} from "./log/log.reducer";
import {userAdminReducer} from "./user/userAdmin.reducer";
import {userMemberReducer} from "./user/userMember.reducer";

export default combineReducers({
    modalReducer,
    modalTypeReducer,
    dashboardReducer,
    siteReducer,
    // userReducer,
    userAdminReducer,
    userMemberReducer,
    coinTypeReducer,
    faqReducer,
    inboxReducer,
    depositReducer,
    penarikanReducer,
    transactionReducer,
    pengaturanReducer,
    logReducer,
    auth: authReducer,
    errors : errorsReducer
});