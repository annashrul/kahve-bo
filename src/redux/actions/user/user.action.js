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
export function setLoadingSend(load) {
    return {
        type: USER_LIST.LOADING_SEND,
        load
    }
}
export function setLoadingDetail(load) {
    return {
        type: USER_LIST.LOADING_DETAIL,
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

export function setUserListAll(data = []) {
    return {
        type: USER_LIST.SUCCESS_ALL,
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
                dispatch(setUserList(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error

            })

    }
};

export const FetchAllUser = (where) => {
    return (dispatch) => {
        dispatch(setLoadingSend(true));
        let url = 'user';
        if(where){
            url+=`?${where}`;
        }
        console.log(url);
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setUserListAll(data));
                dispatch(setLoadingSend(false));
                // let email=[];
                // for(let i=0;i<data.result.data.length;i++){
                //     email.push(data.result.data[i].email);
                // }
                // localStorage.setItem("email",email.toString());
            })
            .catch(function (error) {
                // handle error

            })

    }
};


export const FetchDetailUser = (id) => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        let url = `user/${id}`;
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setUserListDetail(data));
                dispatch(setLoadingDetail(false));
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
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: data.msg,
                    });
                    dispatch(setIsError(true));
                    dispatch(ModalToggle(false));
                    if(data['isadmin']===0){
                        dispatch(FetchUser('page=1'));
                    }
                    else{
                        dispatch(FetchUser('page=1&isadmin=1'));
                    }

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
export const putUser = (data,id,where="") => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `user/${id}`;
        console.log(data['isadmin']);
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
                    if(data['isadmin']===1){
                        console.log('page=1&isadmin=1');
                        dispatch(FetchUser(where===""?"page=1&isadmin=1":where));
                    }
                    else{
                        console.log('page=1');
                        dispatch(FetchUser(where===""?"page=1":where));

                        // dispatch(FetchUser(where));
                    }
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


export const deleteUser = (id,param) => {
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


