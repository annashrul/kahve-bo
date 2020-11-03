import axios from "axios"
import Swal from "sweetalert2";
import {DEPOSIT,HEADERS} from "../_constants";
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

export function setDataEdit(data = []) {
    return {
        type: DEPOSIT.EDIT,
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

            })

    }
};

export const approval = (data,id) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `topup/${id}`;
        axios.put(url,data)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: data.msg,
                    });
                    dispatch(setIsError(true));
                    dispatch(ModalToggle(false));
                    dispatch(FetchDeposit('page=1'));
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: data.msg,
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
                Swal.fire({
                    title: 'failed',
                    icon: 'error',
                    text: error.response.data.msg,
                });

                if (error.response) {

                }
            })
    }
}


