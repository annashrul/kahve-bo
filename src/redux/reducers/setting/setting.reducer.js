

import {PENGATURAN} from "../../actions/_constants";

const initialState = {
    isLoading: true,
    isLoadingPost: false,
    isError: false,
    status: "",
    msg: "",
    data: [],
    edit:[],
    detail:[]
}

export const pengaturanReducer = (state = initialState, action) => {
    switch (action.type) {
        case PENGATURAN.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case PENGATURAN.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case PENGATURAN.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case PENGATURAN.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case PENGATURAN.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case PENGATURAN.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case PENGATURAN.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}