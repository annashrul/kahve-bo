import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import Paginationq, {rangeDate, statusQ} from "../../../helper";
import Skeleton from 'react-loading-skeleton';
import {HEADERS, NOTIF_ALERT} from "../../../redux/actions/_constants";
import {FetchLog} from "../../../redux/actions/log/log.action";
import moment from "moment";
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import DetailLogActivity from "../../App/modals/log/detail_log_activity";
import { isArray } from 'lodash';
import Preloader from "../../../Preloader";
import axios from "axios"
import * as Swal from "sweetalert2";

class LogTransaction extends Component{
    constructor(props){
        super(props);
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleGet    = this.handleGet.bind(this);
        this.handleLoadMore    = this.handleLoadMore.bind(this);
        this.state={
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
            isClick:0,
            perpage:5,
            keyName_:[],
            valData_:[],
            dataActivity:[],
            isLoading:false,
            scrollPage:0,
            isScroll:false,
            transform: 'translateY(0px)'
        }
    }
    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps",nextProps);
        if(typeof nextProps.data.data === 'object'){
            if(nextProps.data.data.length>0){
                this.getData(nextProps.data.data[0].detail,0);
            }
            let perpage=this.state.perpage;
            if(nextProps.data.data.length === perpage){
                this.setState({
                    perpage:perpage+5
                });
            }
        }
    }
    componentDidMount(){

    }
    componentWillMount(){
        let where = this.handleValidate();
        this.props.dispatch(FetchLog('transaction',where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageLogActivity",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchLog('activity',where));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleValidate(){
        let page = localStorage.getItem("pageLogTransaction");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let any = this.state.any;
        let where=`perpage=${this.state.perpage}&datefrom=${dateFrom}&dateto=${dateTo}`;
        console.log(where);
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
        this.props.dispatch(FetchLog('transaction',where));
    }
    handleEvent = (event, picker) => {
        console.log(picker);
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("dateFromLogTransaction",`${from}`);
        localStorage.setItem("dateToLogTransaction",`${to}`);
        this.setState({
            dateFrom:from,
            dateTo:to
        });
    };

    getData(data,i){
        const arr_data = isArray(JSON.parse(data))?JSON.parse(data):[JSON.parse(data)];
        const keyName = arr_data.map((o) => {
            return Object.keys(o)
        }).reduce((prev, curr) => {
            return prev.concat(curr)
        }).filter((col, i, array) => {
            return array.indexOf(col) === i
        });
        this.setState({
            keyName_:keyName,
            valData_:arr_data,
            isClick:i
        })
    }
    handleGet(e,data,i){
        e.preventDefault();
        this.setState({
            isScroll:false
        });
        this.getData(data,i);
    }

    handleLoadMore(e){
        e.preventDefault();
        this.setState({
            isScroll:true
        });
        let perpage = parseInt(this.props.data.per_page,10);
        let lengthBrg = parseInt(this.props.data.data.length,10);
        if(perpage===lengthBrg || perpage<lengthBrg){
            let where = this.handleValidate();
            this.props.dispatch(FetchLog('transaction',where));
            // this.props.dispatch(FetchBrg(1, searchby, localStorage.anyAdj!==undefined?localStorage.anyAdj:"", this.state.location, null, this.autoSetQty,this.state.perpage));
            this.setState({scrollPage:this.state.scrollPage+5});
        }
        else{
            Swal.fire({
                title: 'Warning',
                icon: 'warning',
                text: NOTIF_ALERT.NO_DATA,
            });
        }
    }

    handleScroll(){
        let divToScrollTo;
        console.log('bus');
        divToScrollTo = document.getElementById(`item${this.state.scrollPage}`);
        if (divToScrollTo) {
            // divToScrollTo.scrollIntoView(false);
            divToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    render(){
        if(this.state.isScroll===true)this.handleScroll();

        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        // console.log("STATE",this.state.keyName_);
        const {
            total,
            per_page,
            current_page,
            data
        } = this.props.data;
        return (
            <Layout page={"Log Activity"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Log Activity</h5>
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
                                    <div className="col-5 col-xs-5 col-md-2">
                                        <div className="form-group">
                                            <label>Periode </label>
                                            <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                                <input type="text" className="form-control" value={`${this.state.dateFrom} to ${this.state.dateTo}`}/>
                                            </DateRangePicker>
                                        </div>
                                    </div>

                                    <div className="col-5 col-xs-5 col-md-3">
                                        <div className="form-group">
                                            <label>Type something here ..</label>
                                            <input type="text" className="form-control" name="any" placeholder={"search by name, table,action"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px"}} type="submit" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className={"people-list"} style={{zoom:"80%",height:'300px',maxHeight:'100%',overflowY:'scroll'}}>
                                            {/*<ul className="chat-list list-unstyled">*/}
                                            {
                                                !this.props.isLoading?(
                                                    <div id="chat_user_2">
                                                        <ul className="chat-list list-unstyled">
                                                            {
                                                                typeof data==='object'?data.length!==0?
                                                                    data.map((i,inx)=>{
                                                                        return(
                                                                            <li style={{backgroundColor:this.state.scrollPage===inx?"#eeeeee":""}} id={`item${inx}`} className="clearfix" key={inx} onClick={(e)=>this.handleGet(e,i.detail,i)}>
                                                                                {
                                                                                    <span class="circle">{inx+1}</span>
                                                                                }
                                                                                <div className="about">
                                                                                    <div className="status" style={{color: 'black',fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>{i.nama_user} | {i.aksi} <small style={{float:"right"}}>{i.transaksi}</small></div>
                                                                                    <div className="status" style={{color: '#a1887f', fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>{moment(i.tgl).format('LLLL')}</div>
                                                                                </div>

                                                                            </li>
                                                                        )
                                                                    }):(
                                                                        <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>{NOTIF_ALERT.NO_DATA}</div>
                                                                    ) : ''

                                                            }

                                                        </ul>
                                                    </div>

                                                ):(()=>{
                                                    let container =[];
                                                    for(let x=0; x<5; x++){
                                                        container.push(
                                                            <a href="!#" key={x}>
                                                                <li className="d-flex align-items-center mb-15">
                                                                    <div className={"timeline-icon mr-3"}>
                                                                        <Skeleton circle={true} height={40} width={40}/>
                                                                    </div>
                                                                    <div className="timeline-info">
                                                                        <p className="font-weight-bold mb-0"><Skeleton height={15} width={100}/></p>
                                                                        <span><Skeleton height={15} width={150}/></span>
                                                                        <p className="mb-0"><Skeleton height={15} width={200}/></p>
                                                                    </div>
                                                                </li>
                                                            </a>
                                                        )
                                                    }
                                                    return container;
                                                })()
                                            }
                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.state.isLoading?"loading":"Loadmore"}</button>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div style={{overflowX: "auto"}}>
                                            <table className="table table-hover">

                                                {
                                                    !this.props.isLoading?(
                                                        <thead>
                                                        <tr>
                                                            {
                                                                this.state.keyName_.length>0?
                                                                    this.state.keyName_.map((v,i)=>{
                                                                        return(
                                                                            <th className="text-black" style={columnStyle} rowSpan="2" key={i}>{v.split('_').map(f=>{ return f.toUpperCase(); }).join(' ')}</th>
                                                                        )
                                                                    })
                                                                    : ""
                                                            }
                                                        </tr>
                                                        </thead>
                                                    ):(()=>{
                                                        let container =[];
                                                        for(let x=0; x<1; x++){
                                                            container.push(
                                                                <tr key={x}>
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

                                                {
                                                    !this.props.isLoading?(
                                                        <tbody>
                                                        {
                                                            (
                                                                this.state.valData_.length>0?
                                                                    this.state.valData_.map((v,i)=>{
                                                                        return(
                                                                            <tr key={i}>
                                                                                {
                                                                                    (
                                                                                        typeof this.state.keyName_ === 'object' ? this.state.keyName_.length>0?
                                                                                            this.state.keyName_.map((w,j)=>{
                                                                                                return(
                                                                                                    <td style={columnStyle} key={j}>{v[w]}</td>
                                                                                                )
                                                                                            })
                                                                                            : "No data." : "No data."
                                                                                    )
                                                                                }

                                                                            </tr>
                                                                        )
                                                                    })
                                                                    : ""
                                                            )
                                                        }
                                                        </tbody>
                                                    ):(()=>{
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
                                                                </tr>
                                                            )
                                                        }
                                                        return container;
                                                    })()
                                                }
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DetailLogActivity/>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.logReducer.isLoadingTransaction,
        data:state.logReducer.dataTransaction,
        isOpen:state.modalReducer,

    }
}


export default connect(mapStateToProps)(LogTransaction);