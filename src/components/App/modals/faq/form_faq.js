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
import {isEmpty} from "../../../../helper";

class FormFaq extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.state={
            id:"",
            question:"",
            answer:"",
            status:"",
            error:{
                question:"",
                answer:"",
                status:"",
            },
        }
    }

    getProps(param){
        this.clearState();
        if(param.detail!==undefined){
            this.setState({
                id:param.detail.id,
                question:param.detail.question,
                answer:param.detail.answer,
                status:param.detail.status,
            });

        }

    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    clearState(){
        this.setState({
            question:"",
            answer:"",
            status:"",
            error:{
                question:"",
                answer:"",
                status:"",
            },
        });
    }

    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.clearState();

    };
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        let err = Object.assign({}, this.state.error, {
            [event.target.name]: ""
        });
        this.setState({
            error: err
        });
    }
    handleValidation(e){
        e.preventDefault();
        let err = this.state.error;
        let parseData = {};
        parseData['question'] = this.state.question;
        parseData['answer'] = this.state.answer;
        parseData['status'] = this.state.status;
        if(parseData['question']===''||parseData['question']===undefined){
            err = Object.assign({}, err, {question:isEmpty("question")});
            this.setState({error: err});
        }
        else if(parseData['answer']===''||parseData['answer']===undefined){
            err = Object.assign({}, err, {answer:isEmpty("answer")});
            this.setState({error: err});
        }
        else if(parseData['status']===''||parseData['status']===undefined){
            err = Object.assign({}, err, {status:isEmpty("status")});
            this.setState({error: err});
        }
        else{
            this.handleSubmit(parseData);
        }
    }
    handleSubmit(param){
        if(this.state.id){
            this.props.dispatch(putFaq(param,this.state.id));
        }
        else{
            this.props.dispatch(storeFaq(param));
        }
        if(this.props.isError===true){
            this.clearState();
        }

    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formFaq"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Faq":"Update Faq"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Question</label>
                                <input type="text" className="form-control" name="question" value={this.state.question} onChange={this.handleChange} />
                                <div className="invalid-feedback" style={this.state.error.question !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.question}</div>
                            </div>
                            <div className="form-group">
                                <label>Answer</label>
                                <input type="email" className="form-control" name="answer" value={this.state.answer} onChange={this.handleChange} />
                                <div className="invalid-feedback" style={this.state.error.answer !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.answer}</div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-control form-control-lg" name="status" value={this.state.status} onChange={this.handleChange} defaultValue={this.state.status}>
                                    <option value="">=== Pilih ===</option>
                                    <option value="1">Aktif</option>
                                    <option value="0">Tidak Aktif</option>
                                </select>
                                <div className="invalid-feedback" style={this.state.error.status !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.status}</div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button style={{color:"white"}} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle} ><i className="ti-close"/>Exit</button>
                        {
                            !this.props.isLoadingPost?(
                                <button type="button" className="btn btn-primary mb-2 mr-2" onClick={this.handleValidation}><i className="ti-save" /> Save</button>
                            ):(
                                <button type="button" className="btn btn-primary mb-2 mr-2" disabled={true}><i className="fa fa-circle-o-notch fa-spin"/></button>
                            )
                        }
                    </div>
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
export default connect(mapStateToProps)(FormFaq);