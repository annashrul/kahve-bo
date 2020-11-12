import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import ProfileImage from "../../../../assets/profile.png";
import FileBase64 from "react-file-base64";
import {ModalToggle} from "../../../../redux/actions/modal.action";
import {isEmpty, stringifyFormData, validateEmail, validateForm} from "../../../../helper";
import {storeUser} from "../../../../redux/actions/user/user.action";
import {putCoinType, storeCoinType} from "../../../../redux/actions/coinType/coinType.action";

class DetailLogActivity extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);

    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
    }



    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailLogActivity"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Log Activity</ModalHeader>
                <ModalBody>

                </ModalBody>

            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(DetailLogActivity);