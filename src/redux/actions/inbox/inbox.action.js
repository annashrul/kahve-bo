import axios from "axios"
import Swal from "sweetalert2";
import {INBOX, HEADERS, NOTIF_ALERT} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: INBOX.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: INBOX.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: INBOX.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: INBOX.SUCCESS,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: INBOX.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: INBOX.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: INBOX.FAILED,
        data
    }
}

export const FetchInbox = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'inbox';
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

export const putInbox = (data,id) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `inbox/${id}`;
        axios.put(url,data)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    dispatch(setIsError(true));
                    dispatch(FetchInbox('page=1&perpage=5&q='+id));
                    console.log("success");
                } else {
                    console.log("error");
                }
                dispatch(setLoadingPost(false));


            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
                dispatch(setIsError(false));
                // dispatch(ModalToggle(true));
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



export const deleteInbox = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `inbox/${id}`;
        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: NOTIF_ALERT.SUCCESS,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: NOTIF_ALERT.FAILED,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchInbox('page=1'));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                if (error.message === 'Network Error') {
                    Swal.fire(
                        'Network Failed!.',
                        'Please check your connection',
                        'error'
                    );
                }else{
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
