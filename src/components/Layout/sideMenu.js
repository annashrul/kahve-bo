import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import { logoutUser } from "redux/actions/authActions";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state ={
            isPengguna:false,
            isAdmin:false,
            isUser:false,
        }
        this.subChangeMenu = this.subChangeMenu.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
    }

    subChangeMenu(e){
        e.preventDefault();
        this.setState({isMasterdata : true});
    }

    changeMenu(e,param){
        e.preventDefault();
        if(param === 'pengguna'){
            this.setState({
                isPengguna : !this.state.isPengguna,
            });
            console.log('abus')

        }

        this.forceUpdate();
        
    }
    getProps(param){
        if (param.auth.user) {
            let akses = param.auth.user.access;
            

        }
    }
    componentDidMount(){
        this.getProps(this.props);
      
        const path = this.props.location.pathname;
        if(path==='/admin' || path==='/user'){
            this.setState({
                isPengguna:true
            })
        }


    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
        if (this.props.activePath !== nextProps.activePath) {
            this.setState({
              activePath: nextProps.activePath
            })
        }
    }

    getSortByClass(){
    setTimeout(() => {
        return 'none';
        }, 500);
    }
    
    handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Apakah anda yakin akan logout aplikasi?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!'
        }).then((result) => {
            if (result.value) {
                this.props.logoutUser();
            }
        })
    };
    render() {
        const path = this.props.location.pathname;
        return (
            <nav>
                <ul className="sidebar-menu" data-widget="tree">
                    {/* DASHBOARD MODUL START */}
                    <li  className={path==='/'?"active":''}><Link to="/"> <i className="fa fa-area-chart" /><span> Dashboard</span></Link></li>
                    {/* DASHBOARD MODUL END */}

                    {/* USER MODUL START */}
                    <li className={"treeview" +(this.state.isPengguna===true || path==='/admin' || path==='/user' ?" active menu-open" : "")}>
                        <a href="!#" onClick={(e) => this.changeMenu(e,'pengguna')}><i className="fa fa-gears" /> <span>Pengguna</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu"} style={{display:this.state.isPengguna===true?"block":"none"}}>
                            <li className={path==='/admin'?"active":''} style={this.state.isAdmin==="0"?{"display":"none"}:{"display":"block"}}><Link to="/admin" style={{width:'fit-content'}}> <i className="fa fa-user-secret" />Admin</Link></li>
                            <li className={path==='/user'?"active":''} style={this.state.isUser==="0"?{"display":"none"}:{"display":"block"}}><Link to="/user" style={{width:'fit-content'}}> <i className="fa fa-group" />Member</Link></li>
                        </ul>
                    </li>
                    {/* USER MODUL END */}

                    {/* COIN TYPE MODUL START */}
                    <li  className={path==='/coin_type'?"active":''}><Link to="/coin_type"> <i className="fa fa-bitcoin" /><span> Tipe Koin</span></Link></li>
                    {/* COIN TYPE MODUL END */}

                    {/* FAQ MODUL START */}
                    <li  className={path==='/faq'?"active":''}><Link to="/faq"> <i className="fa fa-info-circle" /><span> Faq</span></Link></li>
                    {/* FAQ MODUL END */}

                    {/* INBOX MODUL START */}
                    <li  className={path==='/inbox'?"active":''}><Link to="/inbox"> <i className="fa fa-inbox" /><span> Pesan Masuk</span></Link></li>
                    {/* INBOX MODUL END */}

                    {/* DEPOSIT MODUL START */}
                    <li  className={path==='/deposit'?"active":''}><Link to="/deposit"> <i className="fa fa-exchange" /><span> Deposit</span></Link></li>
                    {/* DEPOSIT MODUL END */}

                    {/* PENARIKAN MODUL START */}
                    <li  className={path==='/penarikan'?"active":''}><Link to="/penarikan"> <i className="fa fa-exchange" /><span> Penarikan</span></Link></li>
                    {/* PENARIKAN MODUL END */}

                    {/* PENGATURAN MODUL START */}
                    <li  className={path==='/setting'?"active":''}><Link to="/setting"> <i className="fa fa-cogs" /><span> Pengaturan</span></Link></li>
                    {/* PENGATURAN MODUL END */}

                    {/* LOGOUT MODUL START */}
                    <li><a href={null} style={{cursor:'pointer',color:'#a6b6d0'}} onClick={(event)=>this.handleLogout(event)}> <i className="fa fa-sign-out" /><span> Keluar</span></a></li>
                    {/* LOGOUT MODUL END */}
                </ul>
            </nav>
        )
    }
}
SideMenu.propTypes = {
    logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps,{logoutUser})(SideMenu))