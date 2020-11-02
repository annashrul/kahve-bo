import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import {deleteUser, FetchUser} from "../../../redux/actions/user/user.action";
import FormUser from "../../App/modals/user/form_user";
import Paginationq from "../../../helper";

import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';
import {noImage} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";

class User extends Component{
    constructor(props){
        super(props);
        this.handleModal = this.handleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state={
            detail:{}
        }
    }
    componentWillMount(){
        this.props.dispatch(FetchUser('page=1'));
    }
    handleModal(e,param) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formUser"));
        if(param!==''){
            const {data}=this.props.data;
            this.setState({
                detail:{
                    name:data[param].name,
                    email:data[param].email,
                    password:data[param].password,
                    conf_password:data[param].password,
                    id_card:data[param].id_card,
                    selfie:data[param].selfie,
                    foto:data[param].foto,
                }
            });
        }
        else{
            this.setState({detail:undefined})
        }
    }
    handlePageChange(pageNumber){
       console.log(pageNumber);
        this.props.dispatch(FetchUser(`page=${pageNumber}`));
    }


    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            text: "Anda yakin akan menghapus data ini ??",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke, hapus sekarang!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteUser(id));
            }
        })
    }

    render(){
        const centerStyle = {verticalAlign: "middle", textAlign: "center"};
        const leftStyle = {verticalAlign: "middle", textAlign: "left"};
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            total,
            last_page,
            per_page,
            current_page,
            from,
            to,
            data
        } = this.props.data;
        return (
            <Layout page={"user"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Dashboard</h5>
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <Info handleSubmit={this.handleSubmit}/>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">

                            <div className="card-body">
                                <form onSubmit={this.handlesearch} noValidate>
                                    <div className="row">
                                        <div className="col-10 col-xs-10 col-md-3">
                                            <div className="form-group">
                                                <label>Search</label>
                                                <input type="text" className="form-control" name="field_any" defaultValue={localStorage.getItem('any_customer')}/>
                                            </div>
                                        </div>
                                        <div className="col-2 col-xs-4 col-md-4">
                                            <div className="form-group">
                                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.handleModal(e,'')} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                {
                                    typeof data === 'object' ?
                                        data.length>0?(
                                            <div style={{overflowX: "auto"}}>
                                                <table className="table table-hover table-bordered" style={{zoom:"80%"}}>
                                                    <thead className="bg-light">
                                                    <tr>
                                                        <th className="text-black" style={centerStyle}>No</th>
                                                        <th className="text-black" style={centerStyle}>Aksi</th>
                                                        <th className="text-black" style={centerStyle}>Nama</th>
                                                        <th className="text-black" style={centerStyle}>Email</th>
                                                        <th className="text-black" width="10%" style={centerStyle}>ID Card</th>
                                                        <th className="text-black" width="10%" style={centerStyle}>Selfi</th>
                                                        <th className="text-black" width="10%" style={centerStyle}>Photo</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    {
                                                        !this.props.isLoading ?
                                                            (
                                                                typeof data === 'object' ?
                                                                    data.map((v,i)=>{
                                                                        return(
                                                                            <tr key={i}>
                                                                                <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                                <td style={columnStyle}>
                                                                                    <div className="btn-group">
                                                                                        <UncontrolledButtonDropdown>
                                                                                            <DropdownToggle caret>
                                                                                                Aksi
                                                                                            </DropdownToggle>
                                                                                            <DropdownMenu>
                                                                                                <DropdownItem onClick={(e)=>this.handleModal(e,i)}>Edit</DropdownItem>
                                                                                                <DropdownItem onClick={(e)=>this.handleDelete(e,v.id)}>Delete</DropdownItem>
                                                                                            </DropdownMenu>
                                                                                        </UncontrolledButtonDropdown>
                                                                                    </div>
                                                                                </td>
                                                                                <td style={columnStyle}>{v.name}</td>
                                                                                <td style={columnStyle}>{v.email}</td>
                                                                                <td style={columnStyle}><img style={{height:"50px"}} src={v.id_card} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/></td>
                                                                                <td style={columnStyle}><img style={{height:"50px"}} src={v.selfie} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/></td>
                                                                                <td style={columnStyle}><img style={{height:"50px"}} src={v.foto} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/></td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                    : "No data."
                                                            ) : (()=>{
                                                                let container =[];
                                                                for(let x=0; x<10; x++){
                                                                    container.push(
                                                                        <tr key={x}>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50}/>}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                                return container;
                                                            })()
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ):(
                                            <img style={{height:"50px"}} src={"https://i.pinimg.com/originals/88/36/65/8836650a57e0c941b4ccdc8a19dee887.png"} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/>
                                        )
                                    : <img style={{height:"50px"}} src={"https://i.pinimg.com/originals/88/36/65/8836650a57e0c941b4ccdc8a19dee887.png"} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/>

                                }

                                <div style={{"marginTop":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={current_page}
                                        per_page={per_page}
                                        total={total}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <FormUser detail={this.state.detail}/>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.userReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.userReducer.data

    }
}


export default connect(mapStateToProps)(User);