import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import Paginationq, {copyTxt, rangeDate, ToastQ} from "../../../helper";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import {approvalPenarikan, FetchPenarikan} from "../../../redux/actions/penarikan/penarikan.action";
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";

class Penarikan extends Component{
    constructor(props){
        super(props);
        this.handleApproval = this.handleApproval.bind(this);
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.state={
            detail:{},
            status:"",
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD")

        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            let tgl = atob(this.props.match.params.tgl);
            this.setState({
                dateFrom:tgl,
                dateTo:tgl
            });
            this.props.dispatch(FetchPenarikan(`page=1&q=${this.props.match.params.id}&datefrom=${tgl}&dateto=${tgl}`));
            this.forceUpdate();

        }
    }

    componentWillMount(){
        if(this.props.match.params.id!==undefined){
            let tgl = atob(this.props.match.params.tgl);
            this.setState({
                dateFrom:tgl,
                dateTo:tgl
            });
            this.props.dispatch(FetchPenarikan(`page=1&q=${this.props.match.params.id}&datefrom=${tgl}&dateto=${tgl}`));
            this.forceUpdate();
        }
        else{
            this.props.dispatch(FetchPenarikan(`page=1&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`));
        }
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
        localStorage.setItem("pagePenarikan",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchPenarikan(where));
    }
    handleApproval(e,id,status){
        e.preventDefault();
        Swal.fire({
            title: 'Warning !!!',
            text: `you are sure will ${status===1?"approve":"cancel"} this data ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, ${status===1?"approve":"cancel"} now!`,
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.value) {
                let parsedata={"status":status};
                let where = this.handleValidate();
                this.props.dispatch(approvalPenarikan(parsedata,id,where));
            }
        })
    }
    handleEvent = (event, picker) => {
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("dateFromPenarikan",`${from}`);
        localStorage.setItem("dateToPenarikan",`${to}`);
        this.setState({
            dateFrom:from,
            dateTo:to
        });
    };
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pagePenarikan");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let status = this.state.status;
        let any = this.state.any;
        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }
        if(dateFrom!==null&&dateFrom!==undefined&&dateFrom!==""){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(status!==null&&status!==undefined&&status!==""){
            where+=`&status=${status}`;
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;
    }
    handleSearch(e){
        e.preventDefault();
        this.props.history.push('/withdraw');
        let where = this.handleValidate();
        this.props.dispatch(FetchPenarikan(where));
    }
    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const {total,per_page, current_page,data} = this.props.data;
        return (
            <Layout page={"Withdraw"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Withdraw</h5>
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <Info handleSubmit={this.handleSubmit}/>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">

                            <div className="card-body">
                                <div className="row" style={{zoom:"90%"}}>
                                    <div className="col-6 col-xs-6 col-md-2">
                                        <div className="form-group">
                                            <label>Periode </label>
                                            <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                                <input type="text" className="form-control" name="date_sale_report" value={`${this.state.dateFrom} to ${this.state.dateTo}`}/>
                                            </DateRangePicker>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xs-6 col-md-2">
                                        <div className="form-group">
                                            <label>Status</label>
                                            <select name="status" className="form-control form-control-lg" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                                <option value="">All Status</option>
                                                <option value="0">Pending</option>
                                                <option value="1">Success</option>
                                                <option value="2">Cancel</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-10 col-xs-10 col-md-3">
                                        <div className="form-group">
                                            <label>Type something here ..</label>
                                            <input type="text" className="form-control" name="any" placeholder={"search by amount,wallet address"} defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px"}} type="submit" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No</th>
                                            <th className="text-black" style={columnStyle}>#</th>
                                            <th className="text-black" style={columnStyle}>Transaction Code</th>
                                            <th className="text-black" style={columnStyle}>Name</th>
                                            <th className="text-black" style={columnStyle}>Wallet Address</th>
                                            <th className="text-black" style={columnStyle}>Amount (Coin)</th>
                                            <th className="text-black" style={columnStyle}>Withdraw Date</th>
                                            <th className="text-black" style={columnStyle}>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !this.props.isLoading ?
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            let badge = "";
                                                            let txt = "";
                                                            if(v.status===0){badge="btn-warning";txt="Pending";}
                                                            if(v.status===1){badge="btn-success";txt="Success";}
                                                            if(v.status===2){badge="btn-danger";txt="Cancel";}
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    <td style={columnStyle}>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-primary btn-sm"} disabled={v.status === 1||v.status === 2} onClick={(e)=>this.handleApproval(e,v.id,1)}><i className={"fa fa-check"}/></button>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-danger btn-sm"} disabled={v.status === 1||v.status === 2} onClick={(e)=>this.handleApproval(e,v.id,2)}><i className={"fa fa-close"}/></button>
                                                                    </td>
                                                                    <td style={columnStyle}>
                                                                        {copyTxt(v.kd_trx?v.kd_trx:'-')}
                                                                    </td>
                                                                    <td style={columnStyle}>{v.users}</td>
                                                                    <td style={columnStyle}>
                                                                        {copyTxt(v.wallet?v.wallet:'-')}
                                                                    </td>
                                                                    <td style={columnStyle}>
                                                                        {copyTxt(v.amount?parseFloat(v.amount).toFixed(8):'0')}
                                                                        <span style={{color:"red"}}>({v.coin})</span>
                                                                    </td>
                                                                    <td style={columnStyle}>{moment(v.created_at).locale('id').format("ddd, Do MMM YYYY hh:mm:ss")}</td>
                                                                    <td style={columnStyle}><button className={`btn ${badge} btn-sm`}>{txt}</button></td>
                                                                </tr>
                                                            )
                                                        })
                                                        : <tr><td colSpan={9} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td></tr>
                                                    : <tr><td colSpan={9} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td></tr>
                                                ) : (()=>{
                                                    let container =[];
                                                    for(let x=0; x<10; x++){
                                                        container.push(
                                                            <tr key={x}>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
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

            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.penarikanReducer.isLoading,
        isOpen:state.modalReducer,

        data:state.penarikanReducer.data,
        isLoadingPost: state.penarikanReducer.isLoadingPost,
        isError: state.penarikanReducer.isError,

    }
}


export default connect(mapStateToProps)(Penarikan);