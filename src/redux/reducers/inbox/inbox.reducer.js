

import {INBOX} from "../../actions/_constants";

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

export const inboxReducer = (state = initialState, action) => {
    switch (action.type) {
        case INBOX.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case INBOX.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case INBOX.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case INBOX.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case INBOX.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case INBOX.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case INBOX.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}