import axios from "axios"
import Swal from "sweetalert2";
import {DEPOSIT, HEADERS, NOTIF_ALERT} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: DEPOSIT.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: DEPOSIT.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: DEPOSIT.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: DEPOSIT.SUCCESS,
        data
    }
}

export function setDataConfig(data = []) {
    return {
        type: DEPOSIT.CONFIG,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: DEPOSIT.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: DEPOSIT.FAILED,
        data
    }
}

export const FetchDeposit = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'topup';
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


export const FetchConfigDeposit = () => {
    return (dispatch) => {
        let url = 'topup/config';
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataConfig(data));
            })
            .catch(function (error) {

            })

    }
};


export const approval = (data,id,where) => async dispatch =>{
    Swal.fire({
        title: 'Please Wait.',
        html: NOTIF_ALERT.CHECKING,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
        onClose: () => {}
    });
    const url = HEADERS.URL + `topup/${id}`;

    axios.put(url,data)
        .then(response=>{
            setTimeout(
                function () {
                    Swal.close() ;
                    const data = (response.data);
                    if (data.status === 'success') {
                        Swal.fire({
                            title: 'Success',
                            icon: 'success',
                            text: NOTIF_ALERT.SUCCESS,
                        });
                        dispatch(setIsError(true));
                        dispatch(ModalToggle(false));
                        dispatch(FetchDeposit(where));
                    }
                    else {
                        Swal.fire({
                            title: 'failed',
                            icon: 'error',
                            text: NOTIF_ALERT.FAILED,
                        });
                        dispatch(setIsError(false));
                        dispatch(ModalToggle(true));
                    }
                    dispatch(setLoadingPost(false));
                },800)

        }).catch(error =>{
        Swal.close()
        dispatch(setLoading(false));
        if (error.message === 'Network Error') {
            Swal.fire(
                'Network Failed!.',
                'Please check your connection',
                'error'
            );
        }
        else {
            Swal.fire({
                title: 'failed',
                icon: 'error',
                text: error.response.data.msg,
            });
            if (error.response) {

            }
        }

    });
}

