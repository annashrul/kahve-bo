import axios from "axios"
import Swal from "sweetalert2";
import {PENGATURAN,HEADERS} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: PENGATURAN.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: PENGATURAN.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: PENGATURAN.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: PENGATURAN.SUCCESS,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: PENGATURAN.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: PENGATURAN.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: PENGATURAN.FAILED,
        data
    }
}

export const FetchPengaturan = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'site/config';
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

export const putPengaturan = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `site/config`;
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
                    dispatch(FetchPengaturan());
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


