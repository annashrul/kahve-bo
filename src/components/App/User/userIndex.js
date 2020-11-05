import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import {
    deleteUser, FetchAllUser, FetchDetailUser, FetchUser, putUser,
    setUserListAll
} from "../../../redux/actions/user/user.action";
import FormUser from "../../App/modals/user/form_user";
import DetailUser from "../../App/modals/user/detail_user";
import Paginationq, {statusQ, ToastQ} from "../../../helper";
import {noImage} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import moment from "moment";
import {CopyToClipboard} from "react-copy-to-clipboard";

class User extends Component{
    constructor(props){
        super(props);
        this.handleModal = this.handleModal.bind(this);
        this.handleIsActive = this.handleIsActive.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.handleSendEmail = this.handleSendEmail.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.state={
            detail:{},
            formatEmail:"",
            email:"",
            perpage:0,
            lastpage:0,
            any:"",
        }
    }
    componentWillMount(){
        console.log("component will mount");
        this.props.dispatch(FetchUser('page=1'));
    }
    componentDidMount(){
        this.setState({
            perpage:this.props.data.per_page,
            lastpage:this.props.data.last_page,
            // email:data.toString()
        });
        console.log("component did mount",`${this.props.data.per_page} ${this.props.data.last_page}`)
    }
    handleModal(e,param) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formUser"));
        this.props.dispatch(setUserListAll([]));


        if(param!==''){
            const {data}=this.props.data;
            let where = this.handleValidate();
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
                    isAdmin:0,
                    where:where
                }
            });
        }
        else{
            this.setState({detail:undefined})
        }
    }

    componentWillUnmount(){
        this.props.dispatch(setUserListAll([]));
    }

    componentWillReceiveProps(nextProps){
        // console.log(nextProps.dataAll);
        // console.log("nextProps",nextProps);
        // this.setState({
        //     perpage:nextProps.data.per_page,
        //     lastpage:nextProps.data.last_page,
        //     // email:data.toString()
        // });
        // let pepage=this.state.perpage;
        // let lastpage=this.state.lastpage;
        // nextProps.dispatch(FetchAllUser(`page=1&perpage=${nextProps.data.per_page*nextProps.data.last_page}`));
        let data = [];
        // if(nextProps.dataAll!==undefined)
        if(nextProps.dataAll!==undefined){
            if(nextProps.dataAll.data!==undefined){
                if(nextProps.dataAll.data.length>0){
                    nextProps.dataAll.data.map((v,i)=>{
                        data.push(v.email);
                    });
                    window.location = `mailto:${data.toString()}`;
                }
            }

        }
    }

    handleDetail(e,param) {
        e.preventDefault();
        this.props.dispatch(setUserListAll([]));
        this.props.dispatch(FetchDetailUser(param));
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailUser"));

    }
    handleIsActive(e,param){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html:`Anda yakin akan ${param['status']===1?'menonaktifkan':'mengaktifkan'} <b style="color:red">${param['nama']}</b> ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, ${param['status']===1?'nonaktifkan':'aktifkan'} sekarang!`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                let id = param['id'];
                let data  = {"status":param['status'],'isadmin':0};
                let where = this.handleValidate();
                this.props.dispatch(putUser(data,id,where));
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
        localStorage.setItem("pagePengguna",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchUser(where));
        this.props.dispatch(setUserListAll([]));

    }
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pagePengguna");
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
        this.props.dispatch(FetchUser(where));
    }
    handleSendEmail(e,perpage,lastpage){
        e.preventDefault();
        this.props.dispatch(FetchAllUser(`page=1&perpage=${perpage*lastpage}`));
    }
    handleCopy = (e) => {
        e.preventDefault();
        console.log('abus');
        e.clipboardData.setData('text/plain', 'Hello, world!');
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const {
            total,
            last_page,
            per_page,
            current_page,
            data
        } = this.props.data;
        let totalPerActiveBalance=0;
        let totalPerActiveSlot=0;
        let totalPerPayment=0;
        let totalPerRef=0;
        return (
            <Layout page={"pengguna-member"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Member</h5>
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
                                    <div className="col-6 col-xs-6 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.handleModal(e,'')} className="btn btn-primary"><i className="fa fa-plus"/></button>
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSendEmail(e,per_page,last_page)}>{this.props.isLoadingSend?"loading ...":<i className="fa fa-send"/>}</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No</th>
                                            <th className="text-black" style={columnStyle}>#</th>
                                            <th className="text-black" style={columnStyle}>Id Wallet Indodax</th>
                                            <th className="text-black" style={columnStyle}>Email</th>
                                            <th className="text-black" style={columnStyle}>Active Balance</th>
                                            <th className="text-black" style={columnStyle}>Active Slot</th>
                                            <th className="text-black" style={columnStyle}>Payment</th>
                                            <th className="text-black" style={columnStyle}>Total Ref</th>
                                            <th className="text-black" style={columnStyle}>BEP</th>
                                            <th className="text-black" style={columnStyle}>Send</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            !this.props.isLoading ?
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            totalPerActiveBalance = totalPerActiveBalance+parseFloat(v.active_balance);
                                                            totalPerActiveSlot = totalPerActiveSlot+parseFloat(v.active_slot);
                                                            totalPerPayment = totalPerPayment+parseFloat(v.payment);
                                                            totalPerRef = totalPerRef+parseFloat(v.reff);
                                                            let faIsActive="";
                                                            let isStatus=0;
                                                            let bep;
                                                            let address=v.address;
                                                            if(v.status===1){
                                                                faIsActive="fa-ban";
                                                                isStatus=0;
                                                            }
                                                            if(v.status===0){
                                                                faIsActive="fa-check";
                                                                isStatus=1;
                                                            }
                                                            if(v.bep===true){
                                                                bep = 1;
                                                            }else{
                                                                bep = 0;
                                                            }

                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    <td style={columnStyle}>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-primary btn-sm"} onClick={(e)=>this.handleModal(e,i)}><i className={"fa fa-pencil"}/></button>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-success btn-sm"} onClick={(e)=>this.handleDetail(e,v.id)}><i className={"fa fa-eye"}/></button>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-dark btn-sm"} onClick={(e)=>this.handleIsActive(e,{"status":isStatus,"id":v.id,"nama":v.name})}><i className={`fa ${faIsActive}`} style={{color:"white"}}/></button>
                                                                    </td>
                                                                    <td style={columnStyle}>
                                                                        <CopyToClipboard text={address?address:'-'}
                                                                             onCopy={()=>ToastQ.fire({icon:'success',title:`${address} berhasil disalin.`})}>
                                                                            <span>{address?address:'-'} <i className="fa fa-copy" style={{color:"green"}}/></span>
                                                                        </CopyToClipboard>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.email}</td>
                                                                    <td style={rightStyle}>{parseFloat(v.active_balance).toFixed(8)}</td>
                                                                    <td style={rightStyle}>{v.active_slot}</td>
                                                                    <td style={rightStyle}>{parseFloat(v.payment).toFixed(8)}</td>
                                                                    <td style={rightStyle}>{parseFloat(v.reff)}</td>
                                                                    <td style={columnStyle}>{statusQ(bep)}</td>
                                                                    <td style={columnStyle}>
                                                                        <a href={`mailto:${v.email}`} className="btn btn-primary btn-sm"><i className="fa fa-send"/></a>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        : <tr><td colSpan={9} style={columnStyle}>No data</td></tr>
                                                    : <tr><td colSpan={9} style={columnStyle}>No data</td></tr>
                                                ) : (()=>{
                                                    let container =[];
                                                    for(let x=0; x<10; x++){
                                                        container.push(
                                                            <tr key={x}>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>
                                                                    <div className="row">
                                                                        <div className="col-md-2">{<Skeleton height={30} width={30}/>}</div>
                                                                        <div className="col-md-2">{<Skeleton height={30} width={30}/>}</div>
                                                                        <div className="col-md-2">{<Skeleton height={30} width={30}/>}</div>
                                                                    </div>
                                                                </td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton circle={true} height={30} width={30}/>}</td>
                                                                <td style={columnStyle}>{<Skeleton height={30} width={30}/>}</td>
                                                            </tr>
                                                        )
                                                    }
                                                    return container;
                                                })()
                                        }
                                        </tbody>
                                        <tfoot>
                                            <th className="text-black" colspan={4}>Total Allpage</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerActiveBalance}</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerActiveSlot}</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerPayment}</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerRef}</th>
                                            <th className="text-black" colspan={2}/>
                                        </tfoot>
                                        <tfoot>
                                            <th className="text-black" colspan={4}>Total Perpage</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerActiveBalance.toFixed(8)}</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerActiveSlot}</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerPayment.toFixed(8)}</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totalPerRef}</th>
                                            <th className="text-black" colspan={2}/>
                                        </tfoot>

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
                <FormUser detail={this.state.detail} isAdmin={0}/>
                <DetailUser detail={this.props.detail}/>

            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.userReducer.isLoading,
        isLoadingDetail: state.userReducer.isLoadingDetail,
        isLoadingSend: state.userReducer.isLoadingSend,
        isOpen:state.modalReducer,
        data:state.userReducer.data,
        dataAll:state.userReducer.dataAll,
        detail:state.userReducer.detail
    }
}


export default connect(mapStateToProps)(User);