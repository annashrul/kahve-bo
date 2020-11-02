

import {DEPOSIT} from "../../actions/_constants";

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

export const depositReducer = (state = initialState, action) => {
    switch (action.type) {
        case DEPOSIT.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case DEPOSIT.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case DEPOSIT.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case DEPOSIT.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case DEPOSIT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case DEPOSIT.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case DEPOSIT.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}