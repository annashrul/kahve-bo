import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import FormUser from "../../App/modals/user/form_user";
import DetailUser from "../../App/modals/user/detail_user";
import Paginationq, {statusQ} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import moment from "moment";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {deleteUserAdmin, FetchUserAdmin} from "../../../redux/actions/user/userAdmin.action";

class Admin extends Component{
    constructor(props){
        super(props);
        this.handleModal = this.handleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.state={
            detail:{},
            detail_:{},

            any:"",
        }
    }
    componentWillMount(){
        this.props.dispatch(FetchUserAdmin('&page=1'));
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

    handleDetail(e,param) {
        e.preventDefault();
        // this.props.dispatch(FetchDetailUser(param));
        this.setState({detail_:{id:param.id,name:param.name}});
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailUser"));

    }
    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Warning !!!',
            text: "Are you sure delete this data ??",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oke, delete!',
            cancelButtonText: 'cancel',
        }).then((result) => {
            if (result.value) {
                let where = this.handleValidate();
                this.props.dispatch(deleteUserAdmin(id,where));
            }
        })
    }
    handleZoom(e,param){
        e.preventDefault();
        Swal.fire({
            showClass   : {popup: 'animate__animated animate__fadeInDown'},
            hideClass   : {popup: 'animate__animated animate__fadeOutUp'},
            imageUrl    : param,
            imageAlt    : 'image not available'
        })
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
    handlePageChange(pageNumber){
        localStorage.setItem("pageAdmin",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchUserAdmin(where));
    }
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageAdmin");
        let any = this.state.any;
        if(page!==null&&page!==undefined&&page!==""){
            where+=`&page=${page}`;
        }else{
            where+="&page=1";
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;
    }
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(FetchUserAdmin(where));
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const {
            total,
            per_page,
            current_page,
            data
        } = this.props.data;
        return (
            <Layout page={"admin"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Admin</h5>
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <Info handleSubmit={this.handleSubmit}/>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label>Type something here ..</label>
                                            <input type="text" className="form-control" name="any" value={this.state.any} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-4 col-xs-4 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.handleModal(e,'')} className="btn btn-primary"><i className="fa fa-plus"/></button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No</th>
                                            <th className="text-black" style={columnStyle}>#</th>
                                            {/*<th className="text-black" style={columnStyle}>ID Card</th>*/}
                                            {/*<th className="text-black" style={columnStyle}>Selfie</th>*/}
                                            {/*<th className="text-black" style={columnStyle}>Photo</th>*/}
                                            <th className="text-black" style={columnStyle}>Name</th>
                                            <th className="text-black" style={columnStyle}>Email</th>
                                            <th className="text-black" style={columnStyle}>Date</th>
                                            <th className="text-black" style={columnStyle}>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            typeof data === 'object' ? data.length>0?
                                                data.map((v,i)=>{

                                                    return(
                                                        <tr key={i}>
                                                            <td style={columnStyle}>
                                                                <span class="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                            </td>
                                                            {/*<td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>*/}
                                                            <td style={columnStyle}>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-primary btn-sm"} onClick={(e)=>this.handleModal(e,i)}><i className={"fa fa-pencil"}/></button>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-success btn-sm"} onClick={(e)=>this.handleDetail(e,{"id":v.id,"name":v.name})}><i className={"fa fa-eye"}/></button>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-danger btn-sm"} onClick={(e)=>this.handleDelete(e,v.id)}><i className={"fa fa-trash"}/></button>
                                                            </td>
                                                            <td style={columnStyle}>{v.name}</td>
                                                            <td style={columnStyle}>{v.email}</td>
                                                            <td style={columnStyle}>{moment(v.created_at).locale('id').format("LLLL")}</td>
                                                            <td style={columnStyle}>{statusQ(v.status)}</td>
                                                        </tr>
                                                    )
                                                })
                                                : <tr><td colSpan={9} style={columnStyle}>{NOTIF_ALERT.NO_DATA}</td></tr>
                                            : (()=>{
                                                    let container =[];
                                                    for(let x=0; x<10; x++){
                                                        container.push(
                                                            <tr key={x}>
                                                                <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50} duration={0.5}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton duration={0.5}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton duration={0.5}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton duration={0.5}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton duration={0.5}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton circle={true} height={50} width={50} duration={0.5}/>}</td>
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
                <FormUser detail={this.state.detail} isAdmin={1}/>
                <DetailUser detailUser={this.state.detail_}/>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.userAdminReducer.isLoading,
        isLoadingDetail: state.userAdminReducer.isLoadingDetail,
        isOpen:state.modalReducer,
        data:state.userAdminReducer.data,
    }
}


export default connect(mapStateToProps)(Admin);