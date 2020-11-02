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
                    <li  className={path==='/'?"active":''}><Link to="/"> <i className="fa fa-dashboard" /><span> Dashboard</span></Link></li>
                    {/* DASHBOARD MODUL END */}

                    {/* USER MODUL START */}
                    <li  className={path==='/user'?"active":''}><Link to="/user"> <i className="fa fa-dashboard" /><span> User</span></Link></li>
                    {/* USER MODUL END */}

                    {/* COIN TYPE MODUL START */}
                    <li  className={path==='/coin_type'?"active":''}><Link to="/coin_type"> <i className="fa fa-dashboard" /><span> Tipe Koin</span></Link></li>
                    {/* COIN TYPE MODUL END */}

                    {/* FAQ MODUL START */}
                    <li  className={path==='/faq'?"active":''}><Link to="/faq"> <i className="fa fa-dashboard" /><span> Faq</span></Link></li>
                    {/* FAQ MODUL END */}

                    {/* LOGOUT MODUL START */}
                    <li><a href={null} style={{cursor:'pointer',color:'#a6b6d0'}} onClick={(event)=>this.handleLogout(event)}> <i className="fa fa-chain-broken" /><span> Logout</span></a></li>
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