import React, { Component } from 'react'
import {connect} from 'react-redux'
import { logoutUser } from "redux/actions/authActions";
// import { updateContact } from "redux/actions/i";
import PropTypes from "prop-types";
import {setEcaps} from 'redux/actions/site.action'
import {setMobileEcaps} from 'redux/actions/site.action'
import { Link } from 'react-router-dom';
import isMobile from 'react-device-detect';
import moment from "moment";
import Swal from "sweetalert2";
import {toRp} from "helper";
import {HEADERS} from "redux/actions/_constants"
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle, Button, UncontrolledCollapse
} from 'reactstrap';
import Default from 'assets/default.png';
import socketIOClient from "socket.io-client";

import {putInbox} from "../../redux/actions/inbox/inbox.action";

const socket = socketIOClient(HEADERS.URL);

class Header extends Component {
    constructor(props) {
        super(props);
        this.handleEcaps=this.handleEcaps.bind(this)
        this.handleMobileEcaps=this.handleMobileEcaps.bind(this)
        this.handleToggleMobileNav=this.handleToggleMobileNav.bind(this)
        this.handleNotif=this.handleNotif.bind(this)
        this.handleSetHeight=this.handleSetHeight.bind(this)
        this.handleUpdate=this.handleUpdate.bind(this)
        this.state = {
            toggleMobileNav:false,
            isShowNotif:false,
            isDay:7,
            tanggal_tempo:"",
            server_price:"",
            acc_name:"",
            acc_number:"",
            invest:[],
            withdraw:[],
            user:[],
            contact:[],
            isSetHeightInvest:false,
            isSetHeightWithdraw:false,
            isSetHeightUser:false,
            isSetHeightContact:false,
            isNotif:false,

        }
        socket.on('set_notif',(data)=>{
            console.log("set_notif",data);
            let investData=[];
            let withdrawData=[];
            let userData=[];
            let contactData=[];
            for(let i=0;i<data.invest.length;i++){
                investData.push(data.invest[i]);
            }
            for(let i=0;i<data.withdraw.length;i++){
                withdrawData.push(data.withdraw[i]);
            }
            for(let i=0;i<data.users.length;i++){
                userData.push(data.users[i]);
            }
            for(let i=0;i<data.inbox.length;i++){
                contactData.push(data.inbox[i]);
            }
            this.setState({
                invest:investData,
                withdraw:withdrawData,
                user:userData,
                contact:contactData
            });
            // this.refreshDat/**/a();
        });
        socket.on('refresh_notif',(data)=>{
            console.log("refresh_notif",data.invest);
            const audioEl = document.getElementsByClassName("audio-element")[0];
            audioEl.play()
            this.refreshData();
            // this.setState({isNotif:!this.state.isNotif});
            // this.forceUpdate();
        })
    }

    handleSetHeight(e,param){
        e.preventDefault();
        if(param==='invest'){
            this.setState({
                isSetHeightInvest:!this.state.isSetHeightInvest,
                // isSetHeightWithdraw:false,
                // isSetHeightUser:false,
                // isSetHeightContact:false,

            });
        }
        if(param==='withdraw'){
            this.setState({
                // isSetHeightInvest:false,
                isSetHeightWithdraw:!this.state.isSetHeightWithdraw,
                // isSetHeightUser:false,
                // isSetHeightContact:false,

            });
        }
        if(param==='user'){
            this.setState({
                // isSetHeightInvest:false,
                // isSetHeightWithdraw:false,
                isSetHeightUser:!this.state.isSetHeightUser,
                // isSetHeightContact:false,

            });        }
        if(param==='contact'){
            this.setState({
                // isSetHeightInvest:false,
                // isSetHeightWithdraw:false,
                // isSetHeightUser:false,
                isSetHeightContact:!this.state.isSetHeightContact,

            });        }
    }

    refreshData(){
        console.log("naon")
        socket.emit('get_notif', {})
        // this.forceUpdate();
    }
    componentDidMount(){
        this.refreshData();

    }
    //
    // componentDidMount() {
    //
    // }
    // componentWillMount(){
    //     this.refreshData();
    // }
    handleLogout = () => {
        this.props.logoutUser();
    };

    handleEcaps=()=>{
        const bool = !this.props.triggerEcaps;
        this.props.setEcaps(bool);
    }
    handleMobileEcaps=()=>{
        const bool = !this.props.triggerMobileEcaps;
        this.props.setMobileEcaps(bool);
    }
    handleToggleMobileNav=()=>{
        this.setState({
            toggleMobileNav:!this.state.toggleMobileNav
        })
    }
    componentWillMount(){
        fetch(HEADERS.URL + `site/logo`)
            .then(res => res.json())
            .then(
                (data) => {
                    if (parseInt(data.result.day,10)===0||parseInt(data.result.day,10) < 0){
                        Swal.fire({
                            title: 'Warning!',
                            html: `<h6>Aplikasi telah kedaluarsa.</h6><br/>
                            <p>Silahkan lakukan pembayaran<br> melalui rekening berikut ini,</p>
                            <b>Jumlah:</b><br/>
                            ${data.result.server_price}<br/>
                            <b>No. rekening:</b><br/>
                            ${data.result.acc_number}<br/>
                            <b>Atas nama:</b><br/>
                            ${data.result.acc_name}`,
                            icon: 'warning',
                            confirmButtonColor: '#ff9800',
                            confirmButtonText: 'Oke',
                        }).then((result) => {

                        })
                        this.props.logoutUser();
                    }
                    localStorage.setItem("site_title", data.result.title);

                    this.setState({
                        isShowNotif: parseInt(data.result.day,10) <= 7 ? true : false,
                        isDay: data.result.day,
                        tanggal_tempo: moment(data.result.tgl_tempo).format("yyyy-MM-DD"),
                        server_price: data.result.server_price,
                        acc_name: data.result.acc_name,
                        acc_number: data.result.acc_number
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

    }

    handleUpdate=(e,id,param)=>{
        console.log(id);
        e.preventDefault();
        this.props.putInbox({status:1},id);
        this.refreshData();
        this.refreshData();
        this.setState({});
        // this.props.updateContact({status:1},id);

        // this.props.dispatch(putInbox({status:1},id));
        // this.props.dispatch(putInbox({status:1},id));
    }

    handleNotif(e){
        e.preventDefault();
        Swal.fire({
            title: 'Informasi Pembayaran.',
            html:`<div class="card"><div class="card-header"><h6 class="text-left">Silahkan lakukan pembayaran ke akun dibawah ini</h6></div><div class="card-body"><table class="table table-bordered table-hover"><thead><tr><th>Harga Server</th><th>No. Rekening</th><th>Atas Nama</th></tr></thead><tbody><tr><td>${toRp(parseInt(this.state.server_price,10))}</td><td>${this.state.acc_number}</td><td>${this.state.acc_name}</td></tr></tbody></table></div></div>`,
            icon: 'info',
            confirmButtonColor: '#ff9800',
            confirmButtonText: 'Oke',
        }).then((result) => {

        })
    }
    render() {
        console.log("NOTIFIKASI",this.state.isNotif);
        const columnStyle ={verticalAlign: "middle", textAlign: "left",whiteSpace: "nowrap"};

        const {isShowNotif,isDay,isNotif} = this.state;
        return (
            // <!-- Top Header Area -->
            <header className="top-header-area d-flex align-items-center justify-content-between" style={{backgroundColor:(!isMobile?'':'#242939')}} >
                <div className="left-side-content-area d-flex align-items-center">
                    {/* Mobile Logo */}
                    <div className="mobile-logo mr-3 mr-sm-4">
                        <Link to={'./'} ><img src={localStorage.getItem("logos")} onError={(e)=>{e.target.onerror = null; e.target.src=`${Default}`}}  alt="Mobile Logo"/></Link>
                    </div>
                    {/* <!-- Triggers --> */}
                    <div className="ecaps-triggers mr-1 mr-sm-3">
                        <div className="menu-collasped" id="menuCollasped" onClick={(e)=>{e.preventDefault();this.handleEcaps();}}>
                            <i className="zmdi zmdi-menu"/>
                        </div>
                        <div className="mobile-menu-open" id="mobileMenuOpen" onClick={(e)=>{e.preventDefault();this.handleMobileEcaps();}}>
                            <i className="zmdi zmdi-menu"/>
                        </div>
                    </div>

                    {/* <!-- Left Side Nav --> */}
                    <ul className="left-side-navbar d-flex align-items-center">

                        {
                            isShowNotif?(
                                <li className={`full-screen-mode ml-1 animate__animated animate__bounceInRight`} style={{marginTop:"14px",cursor:"pointer"}} onClick={this.handleNotif}>
                                    <div className="alert alert-warning" style={{backgroundColor:"#ffeb3b",border:'none'}} role="alert">
                                        <p style={{marginBottom:'0'}}><i className="fa fa-warning"/> Aplikasi kedaluarsa {isDay} hari lagi. </p>
                                    </div>
                                </li>
                            ):""
                        }
                    </ul>
                </div>
                <audio className="audio-element">
                    <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"/>
                </audio>

                <div className="right-side-navbar d-flex align-items-center justify-content-end">
                    {/* <!-- Mobile AREAAAAAA --> */}
                    <div className="right-side-trigger" style={{width:'unset',height:'unset',marginRight:'unset'}} >
                        <li className="nav-item dropdown"  style={{listStyleType:'none', float:"left"}}>
                            <UncontrolledButtonDropdown nav inNavbar>
                                <DropdownToggle caret inNavbar className="nohover">
                                    <i className="fa fa-bell-o"/>
                                    <span className="badge badge-xs badge-pill badge-primary inbox">
                                        {
                                            (
                                                this.state.invest.length+
                                                this.state.withdraw.length+
                                                this.state.user.length+
                                                this.state.contact.length
                                            )
                                        }
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <div className="top-message-area">
                                        <div className="top-message-heading">
                                            <div className="heading-title">
                                                <h6>Notification</h6>
                                            </div>
                                            <span>{
                                                (
                                                    this.state.invest.length+
                                                    this.state.withdraw.length+
                                                    this.state.user.length+
                                                    this.state.contact.length
                                                )
                                            } New</span>
                                        </div>
                                        <br/>
                                        <div className="row" id="toggleInvestM" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'invest')}>
                                            <div className="col-10 col-xs-10 col-md-10" onClick={(e)=>this.handleSetHeight(e,'invest')}>
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>INVESTEMENT <span className="badge badge-danger">{this.state.invest.length}</span></h6>
                                            </div>
                                            <div className="col-2 col-xs-2 col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <UncontrolledCollapse toggler="#toggleInvestM" style={{marginLeft:"5px",marginRight:"5px",overflowY: "auto",height:`${this.state.isSetHeightInvest===false?"0px":(this.state.invest.length>4?(this.state.isSetHeightInvest===false?"0px":"200px"):"auto")}`}}>
                                            {
                                                this.state.invest.map((v,i)=>{
                                                    return (
                                                        <table className="table table-hover" key={i}>
                                                            <tbody>
                                                            <tr>
                                                                <td className="text-black" style={columnStyle}>
                                                                    {v.name} -
                                                                    &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/>
                                                                    <small style={{color:"green"}}>{v.kd_trx}</small><br/>
                                                                    <small style={{color:"black"}}>{parseFloat(v.amount).toFixed(8)}</small>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>


                                                    );
                                                })
                                            }
                                        </UncontrolledCollapse>

                                        <div className="row" id="toggleWithdrawM" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'withdraw')}>
                                            <div className="col-10 col-xs-10 col-md-10">
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>WITHDRAW <span className="badge badge-danger">{this.state.withdraw.length}</span></h6>
                                            </div>
                                            <div className="col-2 col-xs-2 col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <UncontrolledCollapse toggler="#toggleWithdrawM" style={{overflowY: "auto",height:`${this.state.isSetHeightWithdraw===false?"0px":(this.state.withdraw.length>4?(this.state.isSetHeightWithdraw===false?"0px":"200px"):"auto")}`}}>

                                        {/*<div style={{overflowY: "auto",height:`${this.state.isSetHeightWithdraw===false?"0px":(this.state.withdraw.length>4?(this.state.isSetHeightWithdraw===false?"0px":"200px"):"auto")}`}}>*/}

                                            {
                                                this.state.withdraw.map((v,i)=>{
                                                    return (
                                                        <table className="table table-hover" key={i}>
                                                            <tbody>
                                                            <tr>
                                                                <td className="text-black" style={columnStyle}>
                                                                    {v.users} -
                                                                    &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/><small style={{color:"green"}}>{v.kd_trx}</small><br/><small style={{color:"black"}}>{parseFloat(v.amount).toFixed(8)}</small></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>


                                                    );
                                                })
                                            }
                                        {/*</div>*/}
                                        </UncontrolledCollapse>


                                        <div className="row" id="toggleUserM" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'user')}>
                                            <div className="col-10 col-xs-10 col-md-10">
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>USER <span className="badge badge-danger">{this.state.user.length}</span></h6>
                                            </div>
                                            <div className="col-2 col-xs-2 col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <UncontrolledCollapse toggler="#toggleUserM" style={{overflowY: "auto",height:`${this.state.isSetHeightUser===false?"auto":"200px"}`}}>
                                        {
                                            this.state.user.map((v,i)=>{
                                                return (
                                                    <table className="table table-hover" key={i}>
                                                        <tbody>
                                                        <tr>
                                                            <td className="text-black" style={columnStyle}>
                                                                <Link to={`/user`}>
                                                                    {v.name.length>20?v.name.substr(0,20)+"..":v.name} -
                                                                    &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/>
                                                                    <small style={{color:"green"}}>{v.email}</small>
                                                                </Link>
                                                            </td>
                                                            {/*<td className="text-black" style={columnStyle}>{v.name.length>20?v.name.substr(0,20)+"..":v.name} - <small>{moment(v.created_at).fromNow()}</small><br/><small style={{color:"green"}}>{v.email}</small></td>*/}
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                );
                                            })
                                        }
                                        </UncontrolledCollapse>

                                        <div className="row" id="toggleContactM" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'contact')}>
                                            <div className="col-10 col-xs-10 col-md-10">
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>CONTACT <span className="badge badge-danger">{this.state.contact.length}</span></h6>
                                            </div>
                                            <div className="col-2 col-xs-2 col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <UncontrolledCollapse toggler="#toggleContactM" style={{overflowY: "auto",height:`${this.state.isSetHeightContact===false?"0px":(this.state.contact.length>4?(this.state.isSetHeightContact===false?"0px":"200px"):"auto")}`}} >

                                            {
                                                this.state.contact.map((v,i)=>{
                                                    return (
                                                        <table className="table table-hover"key={i}>
                                                            <tbody>
                                                            <tr onClick={(e)=>this.handleUpdate(e,v.id,'contact')}>
                                                                <Link to={`/contact/${v.id}`}>
                                                                    <td className="text-black" style={columnStyle}>
                                                                        {v.name.length>20?v.name.substr(0,20)+"..":v.name} -
                                                                        &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/>
                                                                        <small style={{color:"green"}}>{v.title}</small>
                                                                    </td>
                                                                </Link>
                                                            </tr>
                                                            </tbody>
                                                        </table>


                                                    );
                                                })
                                            }
                                        </UncontrolledCollapse>
                                    </div>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </li>
                        {/*<li className="nav-item dropdown" style={{listStyleType:'none'}}>*/}
                            {/*<UncontrolledButtonDropdown nav inNavbar>*/}
                                {/*<DropdownToggle caret inNavbar className="nohover">*/}
                                    {/*<img src={this.props.auth.user.foto} onError={(e)=>{e.target.onerror = null; e.target.src=`${Default}`}}  alt=""/>*/}
                                {/*</DropdownToggle>*/}
                                {/*<DropdownMenu right>*/}
                                    {/*<div className="user-profile-area">*/}
                                        {/*<div className="user-profile-heading">*/}
                                            {/*<div className="profile-img">*/}
                                                {/*<img className="chat-img mr-2" src={this.props.auth.user.foto} onError={(e)=>{e.target.onerror = null; e.target.src=`${Default}`}}  alt=""/>*/}
                                            {/*</div>*/}
                                            {/*<div className="profile-text">*/}
                                                {/*<h6>{this.props.auth.user.name}</h6>*/}
                                                {/*<span>{this.props.auth.user.email}</span>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                        {/*<DropdownItem  onClick={this.handleLogout}>*/}
                                            {/*<i className="fa fa-chain-broken profile-icon bg-warning" aria-hidden="true"/> Sign-out*/}
                                        {/*</DropdownItem>*/}
                                    {/*</div>*/}
                                {/*</DropdownMenu>*/}
                            {/*</UncontrolledButtonDropdown>*/}
                        {/*</li>*/}
                    </div>
                    {/* <!-- END Mobile AREAAAAAA --> */}

                    {/* <!-- Top Bar Nav --> */}
                    <ul className={"right-side-content d-flex align-items-center " + (this.state.toggleMobileNav === true? "active":"")}>
                        <li className="nav-item dropdown">
                            <UncontrolledButtonDropdown nav inNavbar>
                                <DropdownToggle caret inNavbar className="nohover">
                                    <i className="fa fa-bell-o"/>
                                    <span className="badge badge-pill badge-primary inbox ml-0">
                                        {
                                            (
                                                this.state.invest.length+
                                                this.state.withdraw.length+
                                                this.state.user.length+
                                                this.state.contact.length
                                            )
                                        }
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <div className="top-message-area">
                                        <div className="top-message-heading">
                                            <div className="heading-title">
                                                <h6>Notification</h6>
                                            </div>
                                            <span>{
                                                (
                                                    this.state.invest.length+
                                                    this.state.withdraw.length+
                                                    this.state.user.length+
                                                    this.state.contact.length
                                                )
                                            } New</span>
                                        </div>
                                        <br/>
                                        <div className="row" id="toggleInvest" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'invest')}>
                                            <div className="col-md-10">
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>INVESTEMENT <span className="badge badge-danger">{this.state.invest.length}</span></h6>
                                            </div>
                                            <div className="col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <div style={{overflowY: "auto",height:`${this.state.isSetHeightInvest===false?"0px":(this.state.invest.length>4?"200px":"auto")}`}}>

                                        {/*<h6 style={{textAlign:"left",marginLeft:"5px",color:"#5d78ff"}} id="toggleInvest">Investment</h6>*/}
                                        {
                                            this.state.invest.map((v,i)=>{
                                               return (
                                                   <UncontrolledCollapse toggler="#toggleInvest" key={i}>
                                                       <table className="table table-hover">
                                                           <tbody>
                                                           <tr>
                                                               <Link to={`/investment/${v.id}/${btoa(moment(v.created_at).format("yyyy-MM-DD"))}`}>
                                                               <td className="text-black" style={columnStyle}>
                                                                   {v.name} -
                                                                   &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/>
                                                                   <small style={{color:"green"}}>{v.kd_trx}</small><br/>
                                                                   <small style={{color:"black"}}>{parseFloat(v.amount).toFixed(8)}</small>
                                                               </td>
                                                               </Link>
                                                           </tr>
                                                           </tbody>
                                                       </table>
                                                   </UncontrolledCollapse>
                                               );
                                            })
                                        }
                                        </div>
                                        <div className="row" id="toggleWithdraw" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'withdraw')}>
                                            <div className="col-md-10">
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>WITHDRAW <span className="badge badge-danger">{this.state.withdraw.length}</span></h6>
                                            </div>
                                            <div className="col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <div style={{overflowY: "auto",height:`${this.state.isSetHeightWithdraw===false?"0px":(this.state.withdraw.length>4?"200px":"auto")}`}}>

                                        {
                                            this.state.withdraw.map((v,i)=>{
                                                return (
                                                    <UncontrolledCollapse toggler="#toggleWithdraw" key={i}>
                                                        <table className="table table-hover">
                                                            <tbody>
                                                            <tr>
                                                                <Link to={`/withdraw/${v.id}/${btoa(moment(v.created_at).format("yyyy-MM-DD"))}`}>
                                                                    <td className="text-black" style={columnStyle}>
                                                                        {v.users} -
                                                                        &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/>
                                                                        <small style={{color:"green"}}>{v.kd_trx}</small><br/>
                                                                        <small style={{color:"black"}}>{parseFloat(v.amount).toFixed(8)}</small>
                                                                    </td>
                                                                </Link>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </UncontrolledCollapse>

                                                );
                                            })
                                        }
                                        </div>


                                        <div className="row" id="toggleUser" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'user')}>
                                            <div className="col-md-10">
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>USER <span className="badge badge-danger">{this.state.user.length}</span></h6>
                                            </div>
                                            <div className="col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <div style={{overflowY: "auto",height:`${this.state.isSetHeightUser===false?"0px":(this.state.user.length>4?"200px":"auto")}`}}>
                                        {
                                            this.state.user.map((v,i)=>{
                                                return (

                                                    <UncontrolledCollapse toggler="#toggleUser" key={i}>
                                                        <table className="table table-hover">
                                                            <tbody>
                                                            <tr>
                                                                <Link to={`/user/${v.id}`}>
                                                                    <td className="text-black" style={columnStyle}>
                                                                        {v.name.length>20?v.name.substr(0,20)+"..":v.name} -
                                                                        &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/>
                                                                        <small style={{color:"green"}}>{v.email}</small>
                                                                    </td>
                                                                </Link>

                                                                {/*<td className="text-black" style={columnStyle}>{v.name.length>20?v.name.substr(0,20)+"..":v.name} - <small>{moment(v.created_at).fromNow()}</small><br/><small style={{color:"green"}}>{v.email}</small></td>*/}
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </UncontrolledCollapse>

                                                );
                                            })
                                        }
                                        </div>

                                        <div className="row" id="toggleContact" style={{cursor:"pointer"}} onClick={(e)=>this.handleSetHeight(e,'contact')}>
                                            <div className="col-md-10">
                                                <h6 style={{textAlign:"left",marginLeft:"5px",color:"green"}}>CONTACT <span className="badge badge-danger">{this.state.contact.length}</span></h6>
                                            </div>
                                            <div className="col-md-2">
                                                <i className="fa fa-sort-down"/>
                                            </div>
                                        </div>
                                        <div style={{overflowY: "auto",height:`${this.state.isSetHeightContact===false?"0px":(this.state.contact.length>4?"200px":"auto")}`}}>

                                        {
                                            this.state.contact.map((v,i)=>{
                                                return (
                                                    <UncontrolledCollapse toggler="#toggleContact" key={i}>
                                                        <table className="table table-hover">
                                                            <tbody>
                                                            <tr onClick={(e)=>this.handleUpdate(e,v.id,'contact')}>
                                                                <Link to={`/contact/${v.id}`}>
                                                                    <td className="text-black" style={columnStyle}>
                                                                        {v.name.length>20?v.name.substr(0,20)+"..":v.name} -
                                                                        &nbsp;<small style={{color:"#FC8213"}}>{moment(v.created_at).fromNow()}</small><br/>
                                                                        <small style={{color:"green"}}>{v.title}</small>
                                                                    </td>
                                                                </Link>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </UncontrolledCollapse>
                                                );
                                            })
                                        }
                                        </div>

                                    </div>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </li>

                        <li className="nav-item dropdown">
                            <UncontrolledButtonDropdown nav inNavbar>
                                <DropdownToggle caret inNavbar className="nohover">
                                    <div className="user-name">
                                        <table>
                                            <tr>
                                                <td className="fs1">
                                                    <p>{this.props.auth.user.name}</p>
                                                    <span>{this.props.auth.user.email}</span>

                                                </td>
                                                <td className="fs1"  style={{paddingLeft:'10px'}}>
                                                    <p>
                                                        <i className="fa fa-angle-down lnr"/>
                                                    </p>

                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <div className="user-profile-area">
                                        <div className="user-profile-heading">
                                            <div className="profile-img">
                                                <img className="chat-img mr-2" src={this.props.auth.user.foto} onError={(e)=>{e.target.onerror = null; e.target.src=`${Default}`}}  alt=""/>
                                            </div>
                                            <div className="profile-text">
                                                <h6>{this.props.auth.user.name}</h6>
                                                <span>{this.props.auth.user.email}</span>
                                            </div>
                                        </div>
                                        <DropdownItem  onClick={this.handleLogout}>
                                            <i className="fa fa-chain-broken profile-icon bg-warning" aria-hidden="true"/> Sign-out
                                        </DropdownItem>
                                    </div>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </li>

                    </ul>
                </div>
            </header>
        );
    }
}
Header.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    setEcaps: PropTypes.func.isRequired,
    setMobileEcaps: PropTypes.func.isRequired,
    auth: PropTypes.object,
    triggerEcaps: PropTypes.bool,
    triggerMobileEcaps: PropTypes.bool,
    putInbox:PropTypes.func.isRequired
};

const mapStateToProps = ({auth,siteReducer}) =>{
    return{
        auth: auth,
        triggerEcaps: siteReducer.triggerEcaps,
        triggerMobileEcaps: siteReducer.triggerMobileEcaps

    }
}


export default connect(mapStateToProps,{logoutUser,setEcaps,setMobileEcaps,putInbox})(Header);