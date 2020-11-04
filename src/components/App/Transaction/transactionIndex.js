import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import Paginationq, {rangeDate, ToastQ} from "../../../helper";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import {approvalPenarikan, FetchPenarikan} from "../../../redux/actions/penarikan/penarikan.action";
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {FetchTransaction} from "../../../redux/actions/transaction/transaction.action";

class Transaction extends Component{
    constructor(props){
        super(props);
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.state={
            detail:{},
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD")

        }
    }
    componentWillMount(){
        this.props.dispatch(FetchTransaction('page=1'));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageTransaction",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchTransaction(where));
    }
    handleEvent = (event, picker) => {
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("dateFromTransaction",`${from}`);
        localStorage.setItem("dateToTransaction",`${to}`);
        this.setState({
            dateFrom:from,
            dateTo:to
        });
    };
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageTransaction");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let any = this.state.any;
        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }
        if(dateFrom!==null&&dateFrom!==undefined&&dateFrom!==""){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }

        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;
    }
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(FetchTransaction(where));
    }
    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const rightStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const {total,per_page, current_page,data} = this.props.data;
        let totPerIn=0;
        let totPerOut=0;
        return (
            <Layout page={"Transaction"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Transaction</h5>
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
                                    <div className="col-10 col-xs-10 col-md-3">
                                        <div className="form-group">
                                            <label>Type something here ..</label>
                                            <input type="text" className="form-control" name="any" placeholder={"search by transaction code, amount,name"} defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
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
                                            <th className="text-black" style={columnStyle}>Transaction Code</th>
                                            <th className="text-black" style={columnStyle}>Name</th>
                                            <th className="text-black" style={columnStyle}>Trx In (Coin)</th>
                                            <th className="text-black" style={columnStyle}>Trx Out (Coin)</th>
                                            <th className="text-black" style={columnStyle}>Note</th>
                                            <th className="text-black" style={columnStyle}>Date</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !this.props.isLoading ?
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            totPerIn = totPerIn+parseFloat(v.amount_in);
                                                            totPerOut = totPerOut+parseFloat(v.amount_out);
                                                        // totPerOut = totPerOut+parseFloat(v.amount_out).toFixed(8);
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    <td style={columnStyle}>
                                                                        <CopyToClipboard text={v.kd_trx}
                                                                            onCopy={()=>ToastQ.fire({icon:'success',title:`${v.kd_trx} copied successful.`})}>
                                                                            <span><i className="fa fa-copy" style={{color:"green"}}/> {v.kd_trx?v.kd_trx:'-'} </span>
                                                                        </CopyToClipboard>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.name}</td>
                                                                    <td style={rightStyle}>
                                                                        <CopyToClipboard text={parseFloat(v.amount_in).toFixed(8)}
                                                                             onCopy={()=>ToastQ.fire({icon:'success',title:`${parseFloat(v.amount_in).toFixed(8)} copied successful.`})}>
                                                                            <span><i className="fa fa-copy" style={{color:"green"}}/> {parseFloat(v.amount_in).toFixed(8)} </span>
                                                                        </CopyToClipboard> <span style={{color:"red"}}>({v.coin})</span>
                                                                    </td>
                                                                    <td style={rightStyle}>
                                                                        <CopyToClipboard text={parseFloat(v.amount_out).toFixed(8)}
                                                                         onCopy={()=>ToastQ.fire({icon:'success',title:`${parseFloat(v.amount_out).toFixed(8)} copied successful.`})}>
                                                                            <span><i className="fa fa-copy" style={{color:"green"}}/> {parseFloat(v.amount_out).toFixed(8)} </span>
                                                                        </CopyToClipboard> <span style={{color:"red"}}>({v.coin})</span>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.note}</td>
                                                                    <td style={columnStyle}>{moment(v.created_at).locale('id').format("ddd, Do MMM YYYY hh:mm:ss")}</td>

                                                                </tr>
                                                            )
                                                        })
                                                        : <tr><td colSpan={6} style={{textAlign:"center"}}>No Data.</td></tr>
                                                        : <tr><td colSpan={6} style={{textAlign:"center"}}>No Data.</td></tr>
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
                                                            </tr>
                                                        )
                                                    }
                                                    return container;
                                                })()
                                        }
                                        </tbody>
                                        <tfoot>
                                            <th className="text-black" colspan={3}>Total Perpage</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totPerIn.toFixed(8)}</th>
                                            <th className="text-black" style={rightStyle} colspan={1}>{totPerOut.toFixed(8)}</th>
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

            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.transactionReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.transactionReducer.data,
    }
}


export default connect(mapStateToProps)(Transaction);