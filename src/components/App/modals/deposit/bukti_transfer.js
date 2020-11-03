import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";

class FormBuktiTransfer extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            image:"",
            name:"",
        }
    }

    getProps(param){
        if(param.detail!==undefined){
            this.setState({
                image:param.detail.image,
                name:param.detail.name,
            });

        }

    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    clearState(){
        this.setState({
            image:"",
            name:"",
        });
    }

    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.clearState();
    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formBuktiTransfer"} size="md">
                <ModalHeader toggle={this.toggle}>Bukti Transfer a/n {this.state.name}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <img src={this.state.image} alt=""/>
                        </div>
                    </div>
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
export default connect(mapStateToProps)(FormBuktiTransfer);