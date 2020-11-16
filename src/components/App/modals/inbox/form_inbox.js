import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";
import {putFaq, storeFaq} from "../../../../redux/actions/faq/faq.action";
import {noImage} from "../../../../helper";
import moment from "moment";

class FormInbox extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleReply = this.handleReply.bind(this);
        this.state={
            body:""
        }
    }

    getProps(param){
        this.clearState();
        if(param.detail!==undefined){
        }

    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    clearState(){
        this.setState({
        });
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.clearState();

    };

    handleReply(e){
        e.preventDefault();
        if(this.state.body!==""){
            window.location = `mailto:${this.props.detail.email}?subject=re:${this.props.detail.title}!&body=${this.state.body}`;
        }
    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formInbox"} size="md">
                <ModalHeader toggle={this.toggle}>Message From {this.props.detail.name}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mail-window-text-content">
                                <h5 className="mb-0">{this.props.detail.title}</h5>
                                <p>{moment(this.props.detail.created_at).startOf('hour').fromNow()}</p>
                                <div className="mail-avatra d-flex align-items-center mb-15">
                                    <div className="mail-thumb flex-40-thubm mr-3">
                                        <img className="border-radius-50" src={noImage()} alt=""/>
                                    </div>
                                    <div class="mail-avatra-text">
                                        <h6 className="mb-0">{this.props.detail.name}</h6>
                                        <p className="mb-0">{this.props.detail.email}</p>
                                    </div>
                                </div>
                                <p>{this.props.detail.message}</p>

                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <textarea className="form-control" name="body" placeholder={"write something here .. "} value={this.state.body} onChange={this.handleChange}>

                    </textarea>
                    <button className="btn btn-primary" onClick={this.handleReply}><i className="fa fa-reply"/> Reply</button>
                </ModalFooter>
            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isLoadingPost: state.faqReducer.isLoadingPost,
        isError: state.faqReducer.isError,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,

    }
}
export default connect(mapStateToProps)(FormInbox);