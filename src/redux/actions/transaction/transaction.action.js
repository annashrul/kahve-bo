import axios from "axios"
import Swal from "sweetalert2";
import {TRANSACTION, HEADERS, NOTIF_ALERT} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: TRANSACTION.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: TRANSACTION.LOADING_POST,
        load
    }
}
export function setLoadingCheck(load) {
    return {
        type: TRANSACTION.LOADING_CHECKING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: TRANSACTION.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: TRANSACTION.SUCCESS,
        data
    }
}
export function setCheck(data = []) {
    return {
        type: TRANSACTION.CHECKING_GET,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: TRANSACTION.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: TRANSACTION.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: TRANSACTION.FAILED,
        data
    }
}

export const FetchTransaction = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'transaction';
        if(where){
            url+=`?${where}`;
        }

        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setData(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
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


export const FetchDetailTransaction = (id,where) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        let url = `transaction/detail/${id}`;
        if(where){
            url+=`?${where}`;
        }
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataDetail(data));
                dispatch(setLoadingPost(false));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoadingPost(false));
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


export const CheckDaily = () => {
    return (dispatch) => {
        let url = 'transaction/daily_profit';
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setCheck(data));
            })
            .catch(function (error) {
                // handle error
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



export const storeDailyProfit = () => {
    return (dispatch) => {
        dispatch(setLoadingCheck(true));
        const url = HEADERS.URL + `transaction/daily_profit`;
        axios.post(url,{})
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: NOTIF_ALERT.SUCCESS,
                    });
                    dispatch(setIsError(true));
                    dispatch(ModalToggle(false));
                    dispatch(CheckDaily());
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: NOTIF_ALERT.FAILED,
                    });
                    dispatch(setIsError(false));
                    dispatch(ModalToggle(true));
                }
                dispatch(setLoadingCheck(false));
            })
            .catch(function (error) {
                dispatch(setLoadingCheck(false));
                dispatch(setIsError(false));
                dispatch(ModalToggle(true));
                if (error.message === 'Network Error') {
                    Swal.fire(
                        'Network Failed!.',
                        'Please check your connection',
                        'error'
                    );
                }
                else{
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: error.response.data.msg,
                    });

                    if (error.response) {

                    }
                }

            })
    }
}

