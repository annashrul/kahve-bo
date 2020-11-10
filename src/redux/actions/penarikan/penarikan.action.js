import axios from "axios"
import Swal from "sweetalert2";
import {PENARIKAN, HEADERS, NOTIF_ALERT} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: PENARIKAN.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: PENARIKAN.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: PENARIKAN.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: PENARIKAN.SUCCESS,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: PENARIKAN.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: PENARIKAN.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: PENARIKAN.FAILED,
        data
    }
}

export const FetchPenarikan = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'withdraw';
        if(where){
            url+=`?${where}`;
        }
        console.log(url)

        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setData(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
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

export const approvalPenarikan = (data,id,where) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `withdraw/${id}`;
        axios.put(url,data)
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
                    dispatch(FetchPenarikan(where));
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: NOTIF_ALERT.FAILED,
                    });
                    dispatch(setIsError(false));
                    dispatch(ModalToggle(true));
                }
                dispatch(setLoadingPost(false));


            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
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


