import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import FormFaq from "../../App/modals/faq/form_faq";
import Paginationq, {noData, statusQ} from "../../../helper";
import {noImage} from "../../../helper";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import {deleteInbox, FetchInbox} from "../../../redux/actions/inbox/inbox.action";
class Inbox extends Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.state={
            detail:{}
        }
    }
    componentWillMount(){
        this.props.dispatch(FetchInbox('page=1'));
    }

    handlePageChange(pageNumber){
        console.log(pageNumber);
        this.props.dispatch(FetchInbox(`page=${pageNumber}`));
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
            last_page,
            per_page,
            current_page,
            from,
            to,
            data
        } = this.props.data;
        return (
            <Layout page={"pesan masuk"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Pesan Masuk</h5>
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
                                    !this.props.isLoading ?
                                        (
                                            typeof data === 'object' ? data.length > 0 ?
                                                data.map((v, i) => {
                                                    return (
                                                        <div className="admi-mail-list mb-30" key={i}>
                                                            <div className="admi-mail-item">
                                                                <div className="admi-mail-checkbox" style={{marginRight:"5px"}}>
                                                                    <div className="form-group mb-0">
                                                                        <a href="javascript:void(0)" className="badge badge-danger" onClick={(e)=>this.handleDelete(e,v.id)}><i className={"fa fa-trash"}/></a>
                                                                    </div>
                                                                </div>
                                                                <div className="admi-mail-body d-flex align-items-center mr-3">
                                                                    <div className="mail-thumb flex-40-thubm mr-3">
                                                                        <img className="border-radius-50" src={noImage()} alt=""/>
                                                                    </div>
                                                                    <div className="div">
                                                                        <div className="admi-mail-from">{v.name} ( {v.email} )</div>
                                                                        <div className="admi-mail-subject">
                                                                            <p className="mb-0 mail-subject--text--">{v.title} <span>{v.message}</span></p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="admi-mail-date">{moment(v.created_at).startOf('hour').fromNow()}</div>
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
                                                    <div className="admi-mail-list mb-30" key={x}>
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
                                                            <div className="admi-mail-date">11:30am</div>
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
                <FormFaq detail={this.state.detail}/>
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