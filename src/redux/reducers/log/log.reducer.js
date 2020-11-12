

import {LOG} from "../../actions/_constants";

const initialState = {
    isLoadingActivity: true,
    isLoadingAuth: true,
    isLoadingTransaction: true,
    dataActivity: [],
    dataAuth: [],
    dataTransaction: [],
}

export const logReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOG.SUCCESS_LOG_ACTIVITY:
            return Object.assign({}, state, {
                dataActivity: action.data.result,
            });
        case LOG.SUCCESS_LOG_AUTH:
            return Object.assign({}, state, {
                dataAuth: action.data.result,
            });
        case LOG.SUCCESS_LOG_TRANSACTION:
            return Object.assign({}, state, {
                dataTransaction: action.data.result,
            });

        case LOG.FAILED_LOG_ACTIVITY:
            return Object.assign({}, state, {
                dataActivity: action.data.data,
            });
        case LOG.FAILED_LOG_AUTH:
            return Object.assign({}, state, {
                dataAuth: action.data.data,
            });
        case LOG.FAILED_LOG_TRANSACTION:
            return Object.assign({}, state, {
                dataTransaction: action.data.data,
            });

        case LOG.LOADING_LOG_ACTIVITY:
            return Object.assign({}, state, {
                isLoadingActivity: action.load
            });
        case LOG.LOADING_LOG_AUTH:
            return Object.assign({}, state, {
                isLoadingAuth: action.load
            });
        case LOG.LOADING_LOG_TRANSACTION:
            return Object.assign({}, state, {
                isLoadingTransaction: action.load
            });

        default:
            return state
    }
}