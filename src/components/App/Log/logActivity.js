import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import {rangeDate} from "../../../helper";
import {FetchLog} from "../../../redux/actions/log/log.action";
import moment from "moment";
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import { isArray } from 'lodash';
import * as Swal from "sweetalert2";
import {BrowserView, MobileView} from 'react-device-detect';

class LogActivity extends Component{
    constructor(props){
        super(props)
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleGet    = this.handleGet.bind(this);
        this.handleLoadMore    = this.handleLoadMore.bind(this);
        this.videoRefs = [];

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

        }

    }

    componentWillUnmount(){
        localStorage.removeItem("numKeyActivity");
    }

    componentWillReceiveProps(nextProps){
        if(typeof nextProps.data.data === 'object'){
            if(nextProps.data.data.length>0){
                this.getData(nextProps.data.data[localStorage.numKeyActivity!==undefined?parseInt(localStorage.numKeyActivity):0].detail,localStorage.numKeyActivity!==undefined?parseInt(localStorage.numKeyActivity):0);
            }
        }
    }

    componentWillMount(){
        let where = this.handleValidate();
        this.props.dispatch(FetchLog('activity',where));
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
        let page = localStorage.getItem("pageLogActivity");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let any = this.state.any;
        let where=`perpage=${this.state.perpage}&datefrom=${dateFrom}&dateto=${dateTo}`;
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
        this.props.dispatch(FetchLog('activity',where));
    }
    handleEvent = (event, picker) => {
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("dateFromLogActivity",`${from}`);
        localStorage.setItem("dateToLogActivity",`${to}`);
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
        localStorage.setItem("numKeyActivity",i);
        this.setState({
            isScroll:false,
        });
        this.getData(data,i);
    }

    handleLoadMore(e){
        e.preventDefault();
        this.setState({
            isScroll:true,
            scrollPage:this.state.scrollPage+=5,
            perpage:this.state.perpage+=5
        });
        let perpage = parseInt(this.props.data.per_page,10);
        let lengthBrg = parseInt(this.props.data.data.length,10);
        if(perpage===lengthBrg || perpage<lengthBrg){
            let where = this.handleValidate();
            this.props.dispatch(FetchLog('activity',where));
        }
        else{
            Swal.fire({
                title: 'Warning',
                icon: 'warning',
                text: "No Data.",
            });
        }
    }




    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const {
            data
        } = this.props.data;
        return (
            <Layout page={"Log Activity"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Log Activity </h5>
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


                                            <div id="chat_user_2">
                                                <ul className="chat-list list-unstyled">
                                                    {
                                                        typeof data==='object'?data.length!==0?
                                                            data.map((i,inx)=>{
                                                                return(
                                                                    <li style={{backgroundColor:this.state.isClick===inx?"#eeeeee":""}} id={`item${inx}`} className={`clearfix`} key={inx} onClick={(e)=>this.handleGet(e,i.detail,inx)}>
                                                                        {
                                                                            <span class="circle">{inx+1}</span>
                                                                        }
                                                                        <div className="about">
                                                                            <div className="status" style={{color: 'black',fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>{i.tabel} | {i.aksi}</div>
                                                                            <div className="status" style={{color: '#FC8213',fontWeight:"bold", wordBreak:"break-all", fontSize:"14px"}}>{i.nama}</div>
                                                                            <div className="status" style={{color: '#a1887f', fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>{moment(i.tgl).format('LLLL')}</div>
                                                                        </div>

                                                                    </li>
                                                                )
                                                            }):(
                                                                <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>No Data.</div>
                                                            ) : ''
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        {/*<div style={{ float:"left", clear: "both" }}*/}
                                             {/*ref={(el) => { this.messagesEnd = el; }}>*/}
                                        {/*</div>*/}
                                        <hr/>
                                        <BrowserView>
                                            <div className="form-group">

                                                {
                                                    !this.props.isLoading?(
                                                        <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>Loadmore</button>
                                                    ):(
                                                        <button disabled={true} className={"btn btn-primary"} style={{width:"100%"}}><i className="fa fa-circle-o-notch fa-spin"/></button>
                                                    )
                                                }
                                            </div>
                                        </BrowserView>
                                        <MobileView>
                                            <div className="form-group">

                                                {
                                                    !this.props.isLoading?(
                                                        <button className={"btn btn-primary btn-fixed-bottom"} style={{width:"100%"}} onClick={this.handleLoadMore}>Loadmore</button>
                                                    ):(
                                                        <button disabled={true} className={"btn btn-primary btn-fixed-bottom"} style={{width:"100%"}}><i className="fa fa-circle-o-notch fa-spin"/></button>
                                                    )
                                                }
                                            </div>
                                        </MobileView>
                                    </div>
                                    <div className="col-md-9">
                                        <div style={{overflowX: "auto"}}>
                                            <table className="table table-hover">

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
                                            </table>
                                        </div>
                                    </div>
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
        isLoading: state.logReducer.isLoadingActivity,
        data:state.logReducer.dataActivity,
        isOpen:state.modalReducer,

    }
}


export default connect(mapStateToProps)(LogActivity);
