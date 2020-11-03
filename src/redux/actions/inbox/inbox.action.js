import axios from "axios"
import Swal from "sweetalert2";
import {INBOX,HEADERS} from "../_constants";
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

            })

    }
};

export const storeInbox = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `inbox`;
        axios.post(url,data)
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
                    dispatch(FetchInbox('page=1'));
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
                        text: data.msg,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchInbox('page=1'));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
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
