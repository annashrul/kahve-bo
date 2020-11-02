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
import {stringifyFormData, validateEmail, validateForm} from "../../../../helper";
import {storeUser} from "../../../../redux/actions/user/user.action";
import {putCoinType, storeCoinType} from "../../../../redux/actions/coinType/coinType.action";

class FormCoinType extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.state={
            id:"",
            title:"",
            symbol:"",
            status:"",
            error:{
                title:"",
                symbol:"",
                status:"",
            },
        }
    }

    getProps(param){
        console.log(param);
        this.clearState();
        if(param.detail!==undefined){
            this.setState({
                id:param.detail.id,
                title:param.detail.title,
                symbol:param.detail.symbol,
                status:param.detail.status,
            });

        }

    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    clearState(){
        console.log("ABUS CLEAR STATE");
        this.setState({
            title:"",
            symbol:"",
            status:"",
            error:{
                title:"",
                symbol:"",
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
        parseData['title'] = this.state.title;
        parseData['symbol'] = this.state.symbol;
        parseData['status'] = this.state.status;
        console.log(parseData['title']);
        if(parseData['title']===''||parseData['title']===undefined){
            err = Object.assign({}, err, {title:"title tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['symbol']===''||parseData['symbol']===undefined){
            err = Object.assign({}, err, {symbol:"symbol tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['status']===''||parseData['status']===undefined){
            err = Object.assign({}, err, {status:"status tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            this.handleSubmit(parseData);
        }
    }
    handleSubmit(param){
        if(this.state.id){
            this.props.dispatch(putCoinType(param,this.state.id));
        }
        else{
            this.props.dispatch(storeCoinType(param));
        }
        if(this.props.isError===true){
            this.clearState();
        }
        console.log(this.props.isError);

    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCoinType"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah Tipe Koin":"Ubah Tipe Koin"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} />
                                <div className="invalid-feedback" style={this.state.error.title !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.title}</div>
                            </div>
                            <div className="form-group">
                                <label>Simbol</label>
                                <input type="email" className="form-control" name="symbol" value={this.state.symbol} onChange={this.handleChange} />
                                <div className="invalid-feedback" style={this.state.error.symbol !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.symbol}</div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-control" name="status" value={this.state.status} onChange={this.handleChange} defaultValue={this.state.status}>
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
                        <button style={{color:"white"}} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle} ><i className="ti-close"/>Keluar</button>
                        <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleValidation} ><i className="ti-save" /> {!this.props.isLoadingPost?'Simpan':'Loading ......'}</button>
                    </div>
                </ModalFooter>
            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isLoadingPost: state.coinTypeReducer.isLoadingPost,
        isError: state.coinTypeReducer.isError,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,

    }
}
export default connect(mapStateToProps)(FormCoinType);