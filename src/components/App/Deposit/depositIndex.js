import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import Paginationq, {copyTxt, rangeDate, ToastQ} from "../../../helper";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import {approval, FetchDeposit} from "../../../redux/actions/deposit/deposit.action";
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {BrowserView, MobileView} from 'react-device-detect';

class Deposit extends Component{
    constructor(props){
        super(props);
        this.handleApproval = this.handleApproval.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            detail:{},
            status:"",
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
            data:[],
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            let tgl = atob(this.props.match.params.tgl);
            this.setState({
                dateFrom:tgl,
                dateTo:tgl
            });
            this.props.dispatch(FetchDeposit(`page=1&q=${this.props.match.params.id}&datefrom=${tgl}&dateto=${tgl}`));
            this.forceUpdate();
        }
    }
    componentWillMount(){
        if(this.props.match.params.id!==undefined){
            let tgl = atob(this.props.match.params.tgl);
            this.props.dispatch(FetchDeposit(`page=1&q=${this.props.match.params.id}&datefrom=${tgl}&dateto=${tgl}`));
            this.setState({
                dateFrom:tgl,
                dateTo:tgl
            });
            this.forceUpdate();
        }
        else{
            this.props.dispatch(FetchDeposit(`page=1&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`));
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data:nextProps.data.data
        })
    }

    handlePageChange(pageNumber){
        localStorage.setItem("pageDeposit",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchDeposit(where));
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
    handleApproval(e,id,status){
        e.preventDefault();
        Swal.fire({
            title: 'Warning !!!',
            text: `are you sure ${status===1?"approve":"cancel"} this data ??`,
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
                this.props.dispatch(approval(parsedata,id,where));
            }
        })
    }
    handleModal(e,param) {
        e.preventDefault();
        Swal.fire({
            title: 'transfer proof',
            text: 'name of '+this.props.data.data[param].name,
            imageUrl: this.props.data.data[param].pict,
            imageAlt: 'image not available',
            showClass   : {popup: 'animate__animated animate__fadeInDown'},
            hideClass   : {popup: 'animate__animated animate__fadeOutUp'},
        })
    }
    handleEvent = (event, picker) => {
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("dateFromDeposit",`${from}`);
        localStorage.setItem("dateToDeposit",`${to}`);
        this.setState({
            dateFrom:from,
            dateTo:to
        });
    };
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageDeposit");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let status = this.state.status;
        let any = this.state.any;
        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+=`page=1`;
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
        this.props.history.push('/investment');
        let where = this.handleValidate();
        this.props.dispatch(FetchDeposit(where));
    }


    HandleChangeInputValue(e,i) {
        const column = e.target.name;
        const val = e.target.value;

        let data = [...this.state.data];
        data[i] = {...data[i], [column]: val};
        this.setState({ data });
    }

    handleSubmit(e,i,note){
        e.preventDefault();
        if(note===""){
            let where = this.handleValidate();
            this.props.dispatch(approval({amount:this.state.data[i].amount},this.state.data[i].id,where))
        }

    }


    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const {total,per_page, current_page,data} = this.props.data;
        return (
            <Layout page={"Investment"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Investment</h5>
                        </div>
                    </div>
                    <Info handleSubmit={this.handleSubmit}/>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">

                            <div className="card-body">
                                <div className="row" style={{zoom:"80%"}}>
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
                                    <div className="col-12 col-xs-12 col-md-3">
                                        <div className="form-group">
                                            <label>Type something here ..</label>
                                            <input type="text" className="form-control" name="any" placeholder={"search by amount,name"} defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-4">
                                        <BrowserView>
                                            <div className="form-group">
                                                {
                                                    !this.props.isLoading?(
                                                        <button style={{marginTop:"27px"}} type="submit" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                                    ):(
                                                        <button style={{marginTop:"27px"}} type="button" className="btn btn-primary"><i className="fa fa-circle-o-notch fa-spin"/></button>
                                                    )
                                                }
                                            </div>
                                        </BrowserView>
                                        <MobileView>
                                            <div className="form-group">
                                                {
                                                    !this.props.isLoading?(
                                                        <button type="button" className="btn btn-primary btn-fixed-bottom" onClick={(e)=>this.handleSearch(e)}><i style={{fontSize:"30px"}} className="fa fa-search"/></button>
                                                    ):(
                                                        <button type="button" className="btn btn-primary btn-fixed-bottom"><i style={{fontSize:"30px"}} className="fa fa-circle-o-notch fa-spin"/></button>
                                                    )
                                                }
                                            </div>
                                        </MobileView>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto",zoom:"80%"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No</th>
                                            <th className="text-black" style={columnStyle}>#</th>
                                            <th className="text-black" style={columnStyle}>Wallet Address</th>
                                            <th className="text-black" style={columnStyle}>Name</th>
                                            <th className="text-black" style={columnStyle}>Amount (Coin)</th>
                                            <th className="text-black" style={columnStyle}>Invest Date</th>
                                            <th className="text-black" style={columnStyle}>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            !this.props.isLoading ?
                                                (
                                                    this.state.data!==undefined?this.state.data.length>0?
                                                        this.state.data.map((v,i)=>{
                                                            let badge = "";
                                                            let txt = "";
                                                            let note = "";
                                                            if(v.status===0){badge="btn-warning";txt="Pending";}
                                                            if(v.status===1){badge="btn-success";txt="Success";}
                                                            if(v.status===2){badge="btn-danger";txt="Cancel";}
                                                            // if()
                                                            if(parseFloat(v.amount)===0){
                                                                note = "input amount min 0.025 and max 0.25";
                                                            }
                                                            else if(parseFloat(v.amount)>0.25){
                                                                note = "input amount min 0.025 and max 0.25";
                                                            }
                                                            else if(parseFloat(v.amount)<0.025){
                                                                note = "input amount min 0.025 and max 0.25";
                                                            }
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    <td style={columnStyle}>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-primary btn-sm"} disabled={v.status === 1 || v.status===2} onClick={(e)=>this.handleApproval(e,v.id,1)}><i className={"fa fa-check"}/></button>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-danger btn-sm"} disabled={v.status === 1 || v.status===2} onClick={(e)=>this.handleApproval(e,v.id,2)}><i className={"fa fa-close"}/></button>
                                                                        <button className={"btn btn-success btn-sm"} onClick={(e)=>this.handleModal(e,i)}><i className={"fa fa-eye"}/></button>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.wallet_address}</td>
                                                                    <td style={columnStyle}>{v.name}</td>
                                                                    <td style={columnStyle}>
                                                                        <div style={{width:"20em"}}>
                                                                            <div className="form-group">
                                                                                <div className="input-group mb-2">
                                                                                    <div className="input-group-prepend" onClick={(e) => {e.preventDefault();navigator.clipboard.writeText(parseFloat(v.amount).toFixed(8));ToastQ.fire({icon:'success',title:`${parseFloat(v.amount).toFixed(8)} copied successful.`})}}><div className="input-group-text">
                                                                                        <i className="fa fa-copy"/>
                                                                                    </div></div>
                                                                                    <input minLength="4" maxLength="5" type="text" className="form-control form-control-sm" readOnly={v.status===1||v.status===2} name="amount" value={v.amount} onChange={(e) => this.HandleChangeInputValue(e, i)} onKeyPress={event=>{if(event.key==='Enter'){this.handleSubmit(event,i,note);}}} />
                                                                                    <div className="input-group-prepend"><div className="input-group-text"><small style={{color:"red",fontWeight:"bold"}}>{v.coin}</small></div></div>
                                                                                </div>
                                                                                <small style={{color:"red",float:"left"}}>{note}</small>
                                                                            </div>
                                                                        </div>




                                                                    </td>
                                                                    <td style={columnStyle}>{moment(v.created_at).locale('id').format("ddd, Do MMM YYYY hh:mm:ss")}</td>
                                                                    <td style={columnStyle}><button className={`btn ${badge} btn-sm`}>{txt}</button></td>
                                                                </tr>
                                                            )
                                                        })
                                                        : <tr><td colSpan={8} style={columnStyle}><img className="img-fluid" src={NOTIF_ALERT.NO_DATA}/></td></tr>
                                                        : <tr><td colSpan={8} style={columnStyle}><img className="img-fluid" src={NOTIF_ALERT.NO_DATA}/></td></tr>
                                                ) : (()=>{
                                                    let container =[];
                                                    for(let x=0; x<10; x++){
                                                        container.push(
                                                            <tr key={x}>
                                                                <td style={columnStyle}>{<Skeleton/>}</td>
                                                                <td style={columnStyle}>
                                                                    <Skeleton height={30} width={30}/>
                                                                </td>
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
                                <div style={{"marginTop":"20px","marginBottom":"20px","float":"right"}}>
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
        isLoading: state.depositReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.depositReducer.data

    }
}


export default connect(mapStateToProps)(Deposit);