import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import {deleteUser, FetchUser} from "../../../redux/actions/user/user.action";
import FormUser from "../../App/modals/user/form_user";
import Paginationq, {statusQ} from "../../../helper";
import {noImage} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import moment from "moment";

class User extends Component{
    constructor(props){
        super(props);
        this.handleModal = this.handleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
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
                    id:data[param].id,
                    name:data[param].name,
                    email:data[param].email,
                    status:data[param].status,
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

    handleZoom(e,param){
        e.preventDefault();
        Swal.fire({
            showClass   : {popup: 'animate__animated animate__fadeInDown'},
            hideClass   : {popup: 'animate__animated animate__fadeOutUp'},
            imageUrl    : param,
            imageAlt    : 'gambar tidak tersedia'
        })
    }

    render(){
        const centerStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
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
            <Layout page={"pengguna"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Pengguna</h5>
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
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={centerStyle}>No</th>
                                            <th className="text-black" style={centerStyle}>Aksi</th>
                                            <th className="text-black" style={centerStyle}>ID Card</th>
                                            <th className="text-black" style={centerStyle}>Selfie</th>
                                            <th className="text-black" style={centerStyle}>Photo</th>
                                            <th className="text-black" style={centerStyle}>Nama</th>
                                            <th className="text-black" style={centerStyle}>Email</th>
                                            <th className="text-black" style={columnStyle}>Tanggal</th>
                                            <th className="text-black" style={centerStyle}>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            !this.props.isLoading ?
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    <td style={columnStyle}>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-primary btn-sm"} onClick={(e)=>this.handleModal(e,i)}><i className={"fa fa-pencil"}/></button>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-danger btn-sm"} onClick={(e)=>this.handleDelete(e,v.id)}><i className={"fa fa-trash"}/></button>
                                                                    </td>
                                                                    <td style={columnStyle}><img style={{height:"50px",width:"50px",cursor:"pointer"}} onClick={(e)=>this.handleZoom(e,v.id_card)} src={v.id_card} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/></td>
                                                                    <td style={columnStyle}><img style={{height:"50px",width:"50px",cursor:"pointer"}} onClick={(e)=>this.handleZoom(e,v.selfie)} src={v.selfie} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/></td>
                                                                    <td style={columnStyle}><img style={{height:"50px",width:"50px",cursor:"pointer"}} onClick={(e)=>this.handleZoom(e,v.foto)} src={v.foto} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/></td>
                                                                    <td style={columnStyle}>{v.name}</td>
                                                                    <td style={columnStyle}>{v.email}</td>
                                                                    <td style={columnStyle}>{moment(v.created_at).locale('id').format("LLLL")}</td>
                                                                    <td style={columnStyle}>{statusQ(v.status)}</td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data."
                                                    : "No data."
                                                ) : (()=>{
                                                    let container =[];
                                                    for(let x=0; x<10; x++){
                                                        container.push(
                                                            <tr key={x}>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
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