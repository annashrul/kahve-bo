import axios from "axios"
import Swal from "sweetalert2";
import {TRANSACTION,HEADERS} from "../_constants";
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
                        'Server tidak tersambung!.',
                        'Periksa koneksi internet anda.',
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
        console.log(url)
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
                        'Server tidak tersambung!.',
                        'Periksa koneksi internet anda.',
                        'error'
                    );

                }
            })

    }
};



