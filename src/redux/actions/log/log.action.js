import axios from "axios"
import Swal from "sweetalert2";
import {LOG, HEADERS} from "../_constants";


export function setLoadingActivity(load) {
    return {
        type: LOG.LOADING_LOG_ACTIVITY,
        load
    }
}
export function setLoadingAuth(load) {
    return {
        type: LOG.LOADING_LOG_AUTH,
        load
    }
}
export function setLoadingTransaction(load) {
    return {
        type: LOG.LOADING_LOG_TRANSACTION,
        load
    }
}



export function setDataAtivity(data = []) {
    return {
        type: LOG.SUCCESS_LOG_ACTIVITY,
        data
    }
}

export function setDataAuth(data = []) {
    return {
        type: LOG.SUCCESS_LOG_AUTH,
        data
    }
}

export function setDataTransaction(data = []) {
    return {
        type: LOG.SUCCESS_LOG_TRANSACTION,
        data
    }
}


export function setDataFailedActivity(data = []) {
    return {
        type: LOG.FAILED_LOG_ACTIVITY,
        data
    }
}
export function setDataFailedAuth(data = []) {
    return {
        type: LOG.FAILED_LOG_AUTH,
        data
    }
}
export function setDataFailedTransaction(data = []) {
    return {
        type: LOG.FAILED_LOG_TRANSACTION,
        data
    }
}




export const FetchLog = (param,where) => {
    return (dispatch) => {
        if(param==='activity') dispatch(setLoadingActivity(true));
        if(param==='auth')dispatch(setLoadingAuth(true));
        if(param==='transaction')dispatch(setLoadingTransaction(true));
        let url = `site/log/${param}`;

        if(where){
            url+=`?${where}`;
        }
        console.log(url)

        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                if(param==='activity'){
                    dispatch(setDataAtivity(data));
                    dispatch(setLoadingActivity(false));
                }
                if(param==='auth'){
                    dispatch(setDataAuth(data));
                    dispatch(setLoadingAuth(false));
                }
                if(param==='transaction'){
                    dispatch(setDataTransaction(data));
                    dispatch(setLoadingTransaction(false));
                }
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoadingActivity(false));
                dispatch(setLoadingAuth(false));
                dispatch(setLoadingTransaction(false));

                if (error.message === 'Network Error') {
                    Swal.fire(
                        'Network Failed!.',
                        'Please check your connection',
                        'error'
                    );
                }
            })

    }
};

