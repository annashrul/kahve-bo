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

class FormUser extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleShowPassword = this.handleShowPassword.bind(this);
        this.state={
            name:"",
            email:"",
            password:"",
            conf_password:"",
            id_card:"",
            selfie:"",
            foto:"",
            error:{
                name:"",
                email:"",
                password:"",
                conf_password:"",
                id_card:"",
                selfie:"",
                foto:"",
            },
            isShowPassword :false,
            isShowConfPassword :false,
        }
    }

    getProps(param){
        console.log(param);
        if(param.detail!==undefined){
            this.setState({
                name:param.detail.name,
                email:param.detail.email,
                password:param.detail.password,
                conf_password:param.detail.conf_password,
                id_card:param.detail.id_card,
                // selfie:param.detail.selfie,
                // foto:param.detail.foto,
            });

        }

    }
    componentWillReceiveProps(nextProps){
        console.log("nextprops");
        this.getProps(nextProps);
    }
    componentWillMount(){
        console.log("this props");
        this.getProps(this.props);
    }
    clearState(){
        console.log("ABUS CLEAR STATE");
        this.setState({
            name:"",
            email:"",
            password:"",
            conf_password:"",
            id_card:"",
            selfie:"",
            foto:"",
        });
    }

    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({

        })
    };
    handleFile1(files) {
        console.log(files);
        this.setState({id_card: files});
    }
    handleFile2(files) {
        this.setState({selfie: files});
    }
    handleFile3(files) {
        this.setState({foto: files});
    }
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
        e.preventDefault();
        let err = this.state.error;
        let parseData = {};
        parseData['name'] = this.state.name;
        parseData['email'] = this.state.email;
        parseData['password'] = this.state.password;
        parseData['conf_password'] = this.state.conf_password;
        parseData['id_card'] = this.state.id_card.base64!==undefined?this.state.id_card.base64:'-';
        parseData['selfie'] = this.state.selfie.base64!==undefined?this.state.selfie.base64:'-';
        parseData['foto'] = this.state.foto.base64!==undefined?this.state.foto.base64:'-';
        console.log(this.state.foto.base64)
        if(parseData['name']===''){
            err = Object.assign({}, err, {name:"nama tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['email']===''){
            err = Object.assign({}, err, {email:"email tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(validateEmail(parseData['email'])===false){
            err = Object.assign({}, err, {email:"format email tidak sesuai"});
            this.setState({error: err,email:''});
        }
        else if(parseData['password']===''){
            err = Object.assign({}, err, {password:"password tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['conf_password']===''){
            err = Object.assign({}, err, {conf_password:"konfirmasi password tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['password']!==parseData['conf_password']){
            err = Object.assign({}, err, {conf_password:"password tidak sama"});
            this.setState({error: err,conf_password:''});
        }

        else{
         // this.handleSubmit(parseData);
        }
    }
    handleShowPassword(e,param){
        if(param==='password'){
            this.setState({isShowPassword:!this.state.isShowPassword})
        }
        if(param==='conf_password'){
            this.setState({isShowConfPassword:!this.state.isShowConfPassword})
        }
    }
    handleSubmit(param){
        this.props.dispatch(storeUser(param));
        if(this.props.isError===true){
            this.clearState();
        }
        console.log(this.props.isError);

    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUser"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah User":"Ubah User"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Nama</label>
                                <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleChange} />
                                <div className="invalid-feedback" style={this.state.error.name !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.name}</div>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} />
                                <div className="invalid-feedback" style={this.state.error.email !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.email}</div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-group mb-2">
                                    <input type={this.state.isShowPassword===true?"text":"password"} className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />
                                    <div className="input-group-prepend" onClick={(e)=>this.handleShowPassword(e,'password')}>
                                        <div className="input-group-text"><i className={this.state.isShowPassword===true?"fa fa-eye-slash":"fa fa-eye"}/></div>
                                    </div>
                                </div>
                                <div className="invalid-feedback" style={this.state.error.password !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.password}</div>

                            </div>

                            <div className="form-group">
                                <label>Konfirmasi Password</label>
                                <div className="input-group mb-2">
                                    <input type={this.state.isShowConfPassword===true?"text":"password"} className="form-control" name="conf_password" value={this.state.conf_password} onChange={this.handleChange} />
                                    <div className="input-group-prepend" onClick={(e)=>this.handleShowPassword(e,'conf_password')}>
                                        <div className="input-group-text"><i className={this.state.isShowConfPassword===true?"fa fa-eye-slash":"fa fa-eye"}/></div>
                                    </div>
                                </div>
                                <div className="invalid-feedback" style={this.state.error.conf_password !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.conf_password}</div>

                            </div>



                            <div className="form-group">
                                <label>ID Card</label><br/>
                                <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.handleFile1.bind(this) } />
                                {/*<div className="row">*/}
                                    {/*<div className="col-md-10">*/}
                                        {/*<FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.handleFile1.bind(this) } />*/}
                                    {/*</div>*/}
                                    {/*<div className="col-md-2">*/}
                                        {/*<div className="img-preview">*/}
                                            {/*{*/}
                                                {/*this.state.id_card.base64 !==undefined?(<img src={this.state.id_card.base64} style={{height:"30px"}} alt=""/>):<img  src={ProfileImage} style={{height:"30px"}} alt=""/>*/}
                                            {/*}*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                            </div>
                            <div className="form-group">
                                <label>Selfie</label><br/>
                                <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.handleFile2.bind(this) } />

                                {/*<div className="row">*/}
                                    {/*<div className="col-md-10">*/}
                                        {/*<FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.handleFile2.bind(this) } />*/}
                                    {/*</div>*/}
                                    {/*<div className="col-md-2">*/}
                                        {/*<div className="img-preview">*/}
                                            {/*{*/}
                                                {/*this.state.selfie.base64 !==undefined?(<img src={this.state.selfie.base64} style={{height:"30px"}} alt=""/>):<img  src={ProfileImage} style={{height:"30px"}} alt=""/>*/}
                                            {/*}*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                            </div>
                            <div className="form-group">
                                <label>Foto</label><br/>
                                <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.handleFile3.bind(this) } />

                                {/*<div className="row">*/}
                                    {/*<div className="col-md-10">*/}
                                        {/*<FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.handleFile3.bind(this) } />*/}
                                    {/*</div>*/}
                                    {/*<div className="col-md-2">*/}
                                        {/*<div className="img-preview">*/}
                                            {/*{*/}
                                                {/*this.state.foto.base64 !==undefined?(<img src={this.state.foto.base64} style={{height:"30px"}} alt=""/>):<img  src={ProfileImage} style={{height:"30px"}} alt=""/>*/}
                                            {/*}*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

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
        isLoadingPost: state.userReducer.isLoadingPost,
        isError: state.userReducer.isError,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,

    }
}
export default connect(mapStateToProps)(FormUser);