

import {COIN_TYPE} from "../../actions/_constants";

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

export const coinTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case COIN_TYPE.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case COIN_TYPE.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case COIN_TYPE.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case COIN_TYPE.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case COIN_TYPE.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case COIN_TYPE.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case COIN_TYPE.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}