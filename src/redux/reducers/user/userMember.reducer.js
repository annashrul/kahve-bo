

import {USER_MEMBER} from "../../actions/_constants";

const initialState = {
    isLoading: true,
    isLoadingPost: false,
    isLoadingDetail: false,
    isLoadingSend: false,
    isError: false,
    status: "",
    msg: "",
    data: [],
    dataAll: [],
    edit:[],
    detail:[]
}

export const userMemberReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_MEMBER.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case USER_MEMBER.SUCCESS_ALL:
            return Object.assign({}, state, {
                dataAll: action.data.result,
            });
        case USER_MEMBER.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case USER_MEMBER.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case USER_MEMBER.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case USER_MEMBER.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case USER_MEMBER.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case USER_MEMBER.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        case USER_MEMBER.LOADING_SEND:
            return Object.assign({}, state, {
                isLoadingSend: action.load
            });
        case USER_MEMBER.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}