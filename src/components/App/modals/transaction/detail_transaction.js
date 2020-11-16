import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";
import Paginationq, {copyTxt, isFloat, isFloatFix} from "../../../../helper";
import {FetchDetailTransaction} from "../../../../redux/actions/transaction/transaction.action";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import {NOTIF_ALERT} from "../../../../redux/actions/_constants";

class DetailTransaction extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state={
            name:"",
            any:"",
            isNodata:false
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.dataDetail !== prevProps.dataDetail) {
            this.setState({name:this.props.dataDetail.name});
            this.props.dispatch(FetchDetailTransaction(this.props.dataDetail.id,"page=1"));
        }
    }
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageDetailTransaction");
        let any = this.state.any;
        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${btoa(any)}&datefrom=${localStorage.dateFromTransaction}&dateto=${localStorage.dateToTransaction}`;
            // where+=`&q=${btoa(any)}&datefrom=${localStorage.dateFromTransaction!==undefined?localStorage.dateFromTransaction:moment(new Date()).format("yyyy-MM-DD")}&dateto=${localStorage.dateToTransaction!==undefined?localStorage.dateToTransaction:moment(new Date()).format("yyyy-MM-DD")}`;

        }
        return where;
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageDetailTransaction",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchDetailTransaction(this.props.dataDetail.id,where));

    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
            this.props.dispatch(FetchDetailTransaction(this.props.dataDetail.id,where));

    }


    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        localStorage.removeItem("pageDetailTransaction");
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

        this.setState({any:""})
    };

    render(){
        const {total,last_page,per_page, current_page,data} = this.props.data;
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const rightStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        let totalPerAmountIn=0;
        let totalPerAmountOut=0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailTransaction"} size="lg" style={{zoom:"90%"}}>
                <ModalHeader toggle={this.toggle}>Detail Transaction {this.state.name}</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Type something here ..</label>
                        <div className="input-group mb-2">
                            <input type="text" className="form-control" name="any" placeholder={"search by transaction code, note"} value={this.state.any} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}} />
                            <div className="input-group-prepend">
                                <button className="btn btn-primary" onClick={(event)=>this.handleSearch(event)}>
                                    <i className="fa fa-search"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{overflowX: "auto",zoom:"85%"}}>
                        <table className="table table-hover">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>No</th>
                                <th className="text-black" style={columnStyle}>Transaction Code</th>
                                <th className="text-black" style={columnStyle}>Name</th>
                                <th className="text-black" style={columnStyle}>Amount In <span style={{color:"red"}}> (Coin) </span></th>
                                <th className="text-black" style={columnStyle}>Amount Out <span style={{color:"red"}}> (Coin) </span></th>
                                <th className="text-black" style={columnStyle}>Note</th>
                                <th className="text-black" style={columnStyle}>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                !this.props.isLoadingPost ?
                                    (
                                        typeof data === 'object' ? data.length>0?
                                            data.map((v,i)=>{
                                                // this.setState({isNoData:false});
                                                totalPerAmountIn = totalPerAmountIn+isFloat(v.amount_in);
                                                totalPerAmountOut = totalPerAmountOut+isFloat(v.amount_out);
                                                return(
                                                    <tr key={i}>
                                                        <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                        <td style={columnStyle}>{copyTxt(v.kd_trx)}</td>
                                                        <td style={columnStyle}>{v.name}</td>
                                                        <td style={rightStyle}>
                                                            {copyTxt(isFloatFix(v.amount_in))} <span style={{color:"red"}}>({v.coin})</span>
                                                        </td>
                                                        <td style={rightStyle}>
                                                            {copyTxt(isFloatFix(v.amount_out))}
                                                            <span style={{color:"red"}}>({v.coin})</span>
                                                        </td>
                                                        <td style={columnStyle}>
                                                            {copyTxt(v.note)}
                                                        </td>
                                                        <td style={columnStyle}>{moment(v.created_at).locale('id').format("ddd, Do MMM YYYY hh:mm:ss")}</td>

                                                    </tr>
                                                )
                                            })
                                            : <tr><td colSpan={7} style={columnStyle}><img className="img-fluid" src={NOTIF_ALERT.NO_DATA}/></td></tr>
                                            : <tr><td colSpan={7} style={columnStyle}><img className="img-fluid" src={NOTIF_ALERT.NO_DATA}/></td></tr>
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
                            <tr style={{backgroundColor:this.props.isLoadingPost?"white":"#EEEEEE"}}>
                                <th className="text-black" colspan={3}>TOTAL PERPAGE</th>
                                <th className="text-black" style={rightStyle} colspan={1}>{this.props.isLoadingPost?<Skeleton/>:isFloatFix(totalPerAmountIn)}</th>
                                <th className="text-black" style={rightStyle} colspan={1}>{this.props.isLoadingPost?<Skeleton/>:totalPerAmountOut.toFixed(8)}</th>
                                <th colspan={2}/>
                            </tr>
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
                </ModalBody>

            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isLoadingPost: state.transactionReducer.isLoadingPost,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        data:state.transactionReducer.detail

    }
}
export default connect(mapStateToProps)(DetailTransaction);