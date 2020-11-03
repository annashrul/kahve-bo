import React,{Component} from 'react';
import Layout from 'components/Layout';
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import {FetchPengaturan, putPengaturan} from "../../../redux/actions/setting/setting.action";
import {noImage, validateEmail} from "../../../helper";
import Skeleton from 'react-loading-skeleton';

class Setting extends Component{
    constructor(props){
        super(props);
        this.state={
            monthly_profit:"",
            contract:"",
            charge:"",
            site_name:"",
            logo:"",
            site_url:"",
            number_of_month:"",
            referral_profit:"",
            email_admin:"",
            wallet_address:"",
            error:{
                email:""
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){
        this.props.dispatch(FetchPengaturan());
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            monthly_profit:nextProps.data.monthly_profit,
            contract:nextProps.data.contract,
            charge:nextProps.data.charge,
            site_name:nextProps.data.site_name,
            logo:nextProps.data.logo,
            site_url:nextProps.data.site_url,
            number_of_month:nextProps.data.number_of_month,
            referral_profit:nextProps.data.referral_profit,
            email_admin:nextProps.data.email_admin,
            wallet_address:nextProps.data.wallet_address,
        })
    }
    handleFile1(files) {
        this.setState({logo: files});
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
    handleSubmit(e){
        e.preventDefault();
        let err = this.state.error;
        let parsedata={};
        parsedata["monthly_profit"]=this.state.monthly_profit;
        parsedata["contract"]=this.state.contract;
        parsedata["charge"]=this.state.charge;
        parsedata["site_name"]=this.state.site_name;
        parsedata["logo"]=this.state.logo.base64;
        parsedata["site_url"]=this.state.site_url;
        parsedata["number_of_month"]=this.state.number_of_month;
        parsedata["referral_profit"]=this.state.referral_profit;
        parsedata["email_admin"]=this.state.email_admin;
        parsedata["wallet_address"]=this.state.wallet_address;
        if(validateEmail(parsedata["email_admin"])===false){
            err = Object.assign({}, err, {email_admin:"format email tidak sesuai"});
            this.setState({error: err});
        }
        else{
            this.props.dispatch(putPengaturan(parsedata));
        }
    }
    render(){
        return (
            <Layout page={"Pengaturan"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Pengaturan Umum</h5>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                            <div className="dashboard-btn-group d-flex align-items-center">
                                <button type="button" className="btn btn-primary ml-1 float-right" onClick={this.handleSubmit}>{!this.props.isLoadingPost?'Simpan':'Loading ......'}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Nama Aplikasi</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                        <input type="text" className="form-control" name="site_name" value={this.state.site_name} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    </div>
                                            }

                                        </div>
                                        <div className="form-group">
                                            <label>Link</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                        <input type="text" className="form-control" name="site_url" value={this.state.site_url} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    </div>
                                            }

                                        </div>

                                        <div className="form-group">
                                            <label>Email</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                        <input type="text" className="form-control" name="email_admin" value={this.state.email_admin} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    </div>
                                            }
                                            <div className="invalid-feedback" style={this.state.error.email_admin !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.email_admin}</div>


                                        </div>
                                        <div className="form-group">
                                            <label>Logo</label><br/>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={this.handleFile1.bind(this) } />
                                                        </div>
                                                        <div className="col-md-2" style={{float:"right"}}>
                                                            <img src={this.state.logo} alt="" onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} style={{height:"20px",float:"right"}}/>
                                                        </div>
                                                    </div>
                                            }

                                        </div>
                                        <div className="form-group">
                                            <label>No.Bulan</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                        <input type="text" className="form-control" name="number_of_month" value={this.state.number_of_month} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    </div>

                                            }

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Profit perbulan</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="text" className="form-control" name="monthly_profit" value={this.state.monthly_profit} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                </div>
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label>Kontrak</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="text" className="form-control" name="contract" value={this.state.contract} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                </div>
                                            }

                                        </div>
                                        <div className="form-group">
                                            <label>Biaya</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="text" className="form-control" name="charge" value={this.state.charge} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                </div>
                                            }

                                        </div>
                                        <div className="form-group">
                                            <label>Wallet Address</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="text" className="form-control" name="wallet_address" value={this.state.wallet_address} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                </div>

                                            }

                                        </div>
                                        <div className="form-group">
                                            <label>Profit Referral</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="text" className="form-control" name="referral_profit" value={this.state.referral_profit} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                </div>
                                            }

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.pengaturanReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.pengaturanReducer.data,
        isLoadingPost: state.pengaturanReducer.isLoadingPost,
        isError: state.pengaturanReducer.isError,
    }
}


export default connect(mapStateToProps)(Setting);