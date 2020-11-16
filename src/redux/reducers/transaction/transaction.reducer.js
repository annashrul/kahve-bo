

import {TRANSACTION} from "../../actions/_constants";

const initialState = {
    isLoading: true,
    isLoadingPost: true,
    isLoadingCheck: true,
    isError: false,
    isSkipped: false,
    status: "",
    msg: "",
    data: [],
    edit:[],
    detail:[]
}

export const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case TRANSACTION.CHECKING_GET:
            return Object.assign({}, state, {
                skipped: action.data.result.skipped,
            });
        case TRANSACTION.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case TRANSACTION.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case TRANSACTION.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case TRANSACTION.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case TRANSACTION.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case TRANSACTION.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case TRANSACTION.LOADING_CHECKING_POST:
            return Object.assign({}, state, {
                isLoadingCheck: action.load
            });
        case TRANSACTION.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}