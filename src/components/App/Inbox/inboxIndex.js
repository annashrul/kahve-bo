import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import FormInbox from "../../App/modals/inbox/form_inbox";
import Paginationq from "../../../helper";
import {noImage} from "../../../helper";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import {deleteInbox, FetchInbox, putInbox} from "../../../redux/actions/inbox/inbox.action";
import UncontrolledButtonDropdown from "reactstrap/es/UncontrolledButtonDropdown";
import DropdownToggle from "reactstrap/es/DropdownToggle";
import DropdownMenu from "reactstrap/es/DropdownMenu";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
class Inbox extends Component{
    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state={
            detail:{},
            id:"",
            any:""
        }
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({detail:{id:this.props.match.params.id}});
            this.forceUpdate();
            const bool = !this.props.isOpen;
            this.props.dispatch(ModalToggle(bool));
            this.props.dispatch(ModalType("formInbox"));
        }
    }

    componentWillMount(){
        if(this.props.match.params.id!==undefined){
            this.setState({detail:{id:this.props.match.params.id}});
            this.forceUpdate();
        }
        else{
            this.props.dispatch(FetchInbox('page=1&perpage=5'));
        }
    }

    handleSearch(e){
        e.preventDefault();
        this.props.history.push('/contact');
        let where = this.handleValidate();
        this.props.dispatch(FetchInbox(where));
    }

    handleValidate(){
        let where="perpage=5";
        let page = localStorage.getItem("pageInbox");
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

    handleDetail(e,i){
        if(this.props.data.data[i].status===0){
            this.props.dispatch(putInbox({status:1},this.props.data.data[i].id))
        }
        this.setState({
            detail:{
                id:this.props.data.data[i].id,
                message:this.props.data.data[i].message,
                name:this.props.data.data[i].name,
                email:this.props.data.data[i].email,
                title:this.props.data.data[i].title,
                created_at:this.props.data.data[i].created_at
            }
        })
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formInbox"));
        // this.props.dispatch(putInbox({status:1},id))
    }

    handlePageChange(pageNumber){
        localStorage.setItem("pageInbox",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchInbox(where));
        // this.props.dispatch(FetchInbox(`page=${pageNumber}&perpage=5`));
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
                this.props.dispatch(deleteInbox(id));
            }
        })
    }

    render(){
        const {
            total,
            per_page,
            current_page,
            data
        } = this.props.data;
        return (
            <Layout page={"Contact"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Contact</h5>
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
                                    <div className="col-8 col-xs-8 col-md-3">
                                        <div className="form-group">
                                            <label>Type something here ..</label>
                                            <input type="text" className="form-control" name="any" value={this.state.any} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                    <div className="col-4 col-xs-4 col-md-4">
                                        <div className="form-group">
                                            <button onClick={(e)=>this.handleSearch(e)} style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"/></button>
                                            <button onClick={(e)=>this.handleSearch(e)} style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-refresh"/></button>
                                        </div>
                                    </div>
                                </div>

                                {
                                    !this.props.isLoading ?
                                        (
                                            typeof data === 'object' ? data.length > 0 ?
                                                data.map((v, i) => {
                                                    return (
                                                        <div className="admi-mail-list mb-30" key={i} style={{cursor:"pointer",zoom:"80%",backgroundColor:v.status===0?"#eeeeee":""}}>
                                                            <div className="admi-mail-item">
                                                                <div className="admi-mail-checkbox" style={{marginRight:"5px"}}>
                                                                    <div className="form-group mb-0">
                                                                        <a href="javascript:void(0)" className="badge badge-danger" onClick={(e)=>this.handleDelete(e,v.id)}><i className={"fa fa-trash"}/></a>
                                                                    </div>
                                                                </div>
                                                                <div className="admi-mail-body d-flex align-items-center mr-3" style={{width:"70%"}}  onClick={(e)=>this.handleDetail(e,i)}>
                                                                    <div className="mail-thumb flex-40-thubm mr-3">
                                                                        <img className="border-radius-50" src={noImage()} alt=""/>
                                                                    </div>
                                                                    <div className="div">
                                                                        <div className="admi-mail-from"style={{color:"green"}}>{v.name} ( {v.email} )</div>
                                                                        <div className="admi-mail-subject">
                                                                            <p className="mb-0 mail-subject--text--">{v.title} - <span>{v.message.length>200?v.message.substr(0,200)+" [..]":v.message}</span> <br/> <i class="fa fa-clock-o"/> <span style={{color:"#6c757d"}}>{moment(v.created_at).startOf('minute').fromNow()}</span></p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/*<div className="admi-mail-date" style={{color:"rgba(0,0,0,.125)"}}>{moment(v.created_at).startOf('hour').fromNow()}</div>*/}
                                                                <div className="admi-mail-date">
                                                                    <button className="btn btn-primary" onClick={(e)=>this.handleDetail(e,i)}><i className="fa fa-eye"/></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                : "No data."
                                            : "No data."
                                        )
                                    :
                                        (()=>{
                                            let container =[];
                                            for(let x=0; x<10; x++){
                                                container.push(
                                                    <div className="admi-mail-list mb-30" key={x} style={{zoom:"80%"}}>
                                                        <div className="admi-mail-item">
                                                            <div className="admi-mail-checkbox">
                                                                <div className="form-group mb-0">
                                                                    <div className="checkbox d-inline">
                                                                        <input type="checkbox" name="checkbox-1" id="checkbox-2"/>
                                                                        <label for="checkbox-2" className="cr"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="admi-mail-body d-flex align-items-center mr-3">
                                                                <div className="mail-thumb flex-40-thubm mr-3">
                                                                    <Skeleton circle={true} height={50} width={50}/>
                                                                </div>
                                                                <div className="div">
                                                                    <div className="admi-mail-from">
                                                                        <Skeleton width={500}/>
                                                                    </div>
                                                                    <div className="admi-mail-subject">
                                                                        <Skeleton width={500}/>
                                                                        <Skeleton width={1000}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return container;
                                        })()


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
                <FormInbox detail={this.state.detail}/>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.inboxReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.inboxReducer.data

    }
}


export default connect(mapStateToProps)(Inbox);