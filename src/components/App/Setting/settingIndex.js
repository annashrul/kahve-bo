import React,{Component} from 'react';
import Layout from 'components/Layout';
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import {FetchPengaturan, putPengaturan} from "../../../redux/actions/setting/setting.action";
import {noImage, rangeDate, validateEmail} from "../../../helper";
import Skeleton from 'react-loading-skeleton';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import moment from "moment";

class Setting extends Component{
    constructor(props){
        super(props);
        this.state={
            hari:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
            monthly_profit:"",
            contract:"",
            charge:"",
            site_name:"",
            logo:"",
            site_url:"",
            number_of_month:"",
            limit_member:"",
            referral_profit:"",
            email_admin:"",
            wallet_address:"",
            hariInvest1:"",
            hariInvest2:"",
            jamInvestFrom1:"",
            jamInvestFrom2:"",
            jamInvestTo1:"",
            jamInvestTo2:"",

            hariWD1:"",
            hariWD2:"",
            jamWDFrom1:"",
            jamWDFrom2:"",
            jamWDTo1:"",
            jamWDTo2:"",

            invest_min:"",
            invest_max:"",
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
        console.log(nextProps.data.length)
        if(nextProps.data.length>0||nextProps.data.length==undefined){
            this.setState({
                monthly_profit:nextProps.data.monthly_profit,
                contract:nextProps.data.contract,
                charge:nextProps.data.charge,
                site_name:nextProps.data.site_name,
                logo:nextProps.data.logo,
                site_url:nextProps.data.site_url,
                number_of_month:nextProps.data.number_of_month,
                limit_member:nextProps.data.limit_member,
                referral_profit:nextProps.data.referral_profit,
                email_admin:nextProps.data.email_admin,
                wallet_address:nextProps.data.wallet_address,
                hariInvest1:nextProps.data.schedule_invest.days[0],
                hariInvest2:nextProps.data.schedule_invest.days[1],
                jamInvestFrom1:nextProps.data.schedule_invest.time[0].split("-")[0],
                // jamInvestFrom2:nextProps.data.schedule_invest.time[0].split("-")[1],
                jamInvestTo1:nextProps.data.schedule_invest.time[1].split("-")[0],
                // jamInvestTo2:nextProps.data.schedule_invest.time[1].split("-")[1],

                hariWD1:nextProps.data.schedule_wd.days[0],
                hariWD2:nextProps.data.schedule_wd.days[1],
                jamWDFrom1:nextProps.data.schedule_wd.time[0].split("-")[0],
                // jamWDFrom2:nextProps.data.schedule_wd.time[0].split("-")[1],
                jamWDTo1:nextProps.data.schedule_wd.time[1].split("-")[0],
                // jamWDTo2:nextProps.data.schedule_wd.time[1].split("-")[1],

                invest_min:nextProps.data.invest_min,
                invest_max:nextProps.data.invest_max,
            })
        }

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
        parsedata["limit_member"]=this.state.limit_member;
        parsedata["number_of_month"]=this.state.number_of_month;
        parsedata["referral_profit"]=this.state.referral_profit;
        parsedata["email_admin"]=this.state.email_admin;
        parsedata["wallet_address"]=this.state.wallet_address;
        parsedata["invest_min"]=this.state.invest_min;
        parsedata["invest_max"]=this.state.invest_max;
        parsedata["schedule_invest"] =  {
            "days": [this.state.hariInvest1, this.state.hariInvest2],
            "time": [`${this.state.jamInvestFrom1}`, `${this.state.jamInvestTo1}`]
        };
        parsedata["schedule_wd"] ={
            "days": [this.state.hariWD1,this.state.hariWD2],
            "time": [`${this.state.jamWDFrom1}`, `${this.state.jamWDTo1}`]
        };
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
            <Layout page={"Setting"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Setting</h5>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                            <div className="dashboard-btn-group d-flex align-items-center">
                                <button type="button" className="btn btn-primary ml-1 float-right" onClick={this.handleSubmit}>{!this.props.isLoadingPost?'Save':'Loading ......'}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>App Name</label>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                        <input type="text" className="form-control" name="site_name" value={this.state.site_name} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    </div>
                                            }

                                        </div>
                                        <div className="form-group">
                                            <label>App Link</label>
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
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Number of Month</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{color:"#e8ebf1",float:"right"}}>Unit</label>
                                                </div>
                                            </div>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                        <input type="number" className="form-control" name="number_of_month" value={this.state.number_of_month} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                        <div className="input-group-prepend"><div className="input-group-text"><small>Day</small></div></div>

                                                    </div>

                                            }

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Profit Month</label>
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <div className="input-group mb-2">
                                                                <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                                <input type="number" className="form-control" name="monthly_profit" value={this.state.monthly_profit} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                                <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-percent"></i></div></div>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Limit Member</label>

                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <div className="input-group mb-2">
                                                                <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                                <input type="number" className="form-control" name="limit_member" value={this.state.limit_member} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                                {/*<div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-percent"></i></div></div>*/}

                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Contract</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{color:"#e8ebf1",float:"right"}}>Unit</label>
                                                </div>
                                            </div>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="number" className="form-control" name="contract" value={this.state.contract} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    <div className="input-group-prepend"><div className="input-group-text"><small>Month</small></div></div>

                                                </div>
                                            }

                                        </div>
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Fee charge</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{color:"#e8ebf1",float:"right"}}>Unit</label>
                                                </div>
                                            </div>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="number" className="form-control" name="charge" value={this.state.charge} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-percent"/></div></div>
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
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Profit Referral</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label style={{color:"#e8ebf1",float:"right"}}>Unit</label>
                                                </div>
                                            </div>
                                            {
                                                this.props.isLoading?<Skeleton height={30}/>:
                                                <div className="input-group mb-2">
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-list"/></div></div>
                                                    <input type="text" className="form-control" name="referral_profit" value={this.state.referral_profit} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                    <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-bitcoin"/></div></div>

                                                </div>
                                            }

                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Invest Min</label>
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <div className="input-group mb-2">
                                                                <input type="text" className="form-control" name="invest_min" value={this.state.invest_min} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                                <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-bitcoin"/></div></div>

                                                            </div>
                                                    }

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Invest Max</label>
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <div className="input-group mb-2">
                                                                <input type="text" className="form-control" name="invest_max" value={this.state.invest_max} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event);}}} />
                                                                <div className="input-group-prepend"><div className="input-group-text"><i className="fa fa-bitcoin"/></div></div>

                                                            </div>
                                                    }

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label>Schedule Invest</label>
                                            </div>
                                            <div className="col-md-6">
                                                <label style={{color:"#e8ebf1",float:"right"}}>From</label>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                        <select name="hariInvest1" className="form-control form-control-lg" defaultValue={this.state.hariInvest1} value={this.state.hariInvest1} onChange={this.handleChange}>
                                                            {
                                                                this.state.hari.map((v,i)=>{
                                                                    return (
                                                                        <option value={v}>{v}</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                        <input type="time" className="form-control" name={"jamInvestFrom1"} value={this.state.jamInvestFrom1} onChange={this.handleChange}/>

                                                    }
                                                </div>
                                            </div>
                                            {/*<div className="col-md-3" style={{paddingLeft:"0px"}}>*/}
                                                {/*<div className="form-group">*/}
                                                    {/*{*/}
                                                        {/*this.props.isLoading?<Skeleton height={30}/>:*/}
                                                        {/*<input type="time" className="form-control" name={"jamInvestFrom2"} value={this.state.jamInvestFrom2} onChange={this.handleChange}/>*/}

                                                    {/*}*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                            <div className="col-md-12">
                                                <label style={{color:"#e8ebf1",float:"right"}}>To</label>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <select name="hariInvest2" className="form-control form-control-lg" defaultValue={this.state.hariInvest2} value={this.state.hariInvest2} onChange={this.handleChange}>
                                                                {
                                                                    this.state.hari.map((v,i)=>{
                                                                        return (
                                                                            <option value={v}>{v}</option>
                                                                        );
                                                                    })
                                                                }
                                                            </select>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <input type="time" className="form-control" name={"jamInvestTo1"} value={this.state.jamInvestTo1} onChange={this.handleChange}/>

                                                    }
                                                </div>
                                            </div>
                                            {/*<div className="col-md-3" style={{paddingLeft:"0px"}}>*/}
                                                {/*<div className="form-group">*/}
                                                    {/*{*/}
                                                        {/*this.props.isLoading?<Skeleton height={30}/>:*/}
                                                            {/*<input type="time" className="form-control" name={"jamInvestTo2"} value={this.state.jamInvestTo2} onChange={this.handleChange}/>*/}

                                                    {/*}*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                        </div>
                                        <div className="row">

                                            <div className="col-md-6">
                                                <label>Schedule Withdraw</label>
                                            </div>
                                            <div className="col-md-6">
                                                <label style={{color:"#e8ebf1",float:"right"}}>From</label>
                                            </div>
                                            <div className="col-md-6" style={{paddingRight:"0px"}}>
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <select name="hariWD1" className="form-control form-control-lg" defaultValue={this.state.hariWD1} value={this.state.hariWD1} onChange={this.handleChange}>
                                                                {
                                                                    this.state.hari.map((v,i)=>{
                                                                        return (
                                                                            <option value={v}>{v}</option>
                                                                        );
                                                                    })
                                                                }
                                                            </select>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <input type="time" className="form-control" name={"jamWDFrom1"} value={this.state.jamWDFrom1} onChange={this.handleChange}/>

                                                    }
                                                </div>
                                            </div>
                                            {/*<div className="col-md-3" style={{paddingLeft:"0px"}}>*/}
                                                {/*<div className="form-group">*/}
                                                    {/*{*/}
                                                        {/*this.props.isLoading?<Skeleton height={30}/>:*/}
                                                            {/*<input type="time" className="form-control" name={"jamWDFrom2"} value={this.state.jamWDFrom2} onChange={this.handleChange}/>*/}

                                                    {/*}*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                            <div className="col-md-12">
                                                <label style={{color:"#e8ebf1",float:"right"}}>To</label>
                                            </div>
                                            <div className="col-md-6" style={{paddingRight:"0px"}}>
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <select name="hariWD2" className="form-control form-control-lg" defaultValue={this.state.hariWD2} value={this.state.hariWD2} onChange={this.handleChange}>
                                                                {
                                                                    this.state.hari.map((v,i)=>{
                                                                        return (
                                                                            <option value={v}>{v}</option>
                                                                        );
                                                                    })
                                                                }
                                                            </select>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    {
                                                        this.props.isLoading?<Skeleton height={30}/>:
                                                            <input type="time" className="form-control" name={"jamWDTo1"} value={this.state.jamWDTo1} onChange={this.handleChange}/>

                                                    }
                                                </div>
                                            </div>
                                            {/*<div className="col-md-3" style={{paddingLeft:"0px"}}>*/}
                                                {/*<div className="form-group">*/}
                                                    {/*{*/}
                                                        {/*this.props.isLoading?<Skeleton height={30}/>:*/}
                                                            {/*<input type="time" className="form-control" name={"jamWDTo2"} value={this.state.jamWDTo2} onChange={this.handleChange}/>*/}

                                                    {/*}*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
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