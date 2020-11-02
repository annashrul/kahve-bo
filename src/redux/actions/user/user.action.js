import axios from "axios"
import Swal from "sweetalert2";
import {USER_LIST,HEADERS} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: USER_LIST.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: USER_LIST.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: USER_LIST.IS_ERROR,
        load
    }
}

export function setUserList(data = []) {
    return {
        type: USER_LIST.SUCCESS,
        data
    }
}

export function setUserListEdit(data = []) {
    return {
        type: USER_LIST.EDIT,
        data
    }
}
export function setUserListDetail(data = []) {
    return {
        type: USER_LIST.DETAIL,
        data
    }
}

export function setUserListFailed(data = []) {
    return {
        type: USER_LIST.FAILED,
        data
    }
}

export const FetchUser = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'user';
        if(where){
            url+=`?${where}`;
        }

        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                console.log("REPONSE USER",data);
                dispatch(setUserList(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error

            })

    }
};

export const storeUser = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `user`;
        axios.post(url,data)
            .then(function (response) {
                const data = (response.data);
                console.log("ANYING",response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: data.msg,
                    });
                    dispatch(setIsError(true));
                    dispatch(ModalToggle(false));
                    dispatch(FetchUser('page=1'));
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
                console.log(error.response);
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


export const deleteUser = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `user/${id}`;
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
                dispatch(FetchUser('page=1'));
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


