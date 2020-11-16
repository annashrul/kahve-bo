import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";
import {statusQ} from "../../../../helper";
import moment from "moment";
import {FetchDetailUser} from "../../../../redux/actions/user/user.action";
import Skeleton from 'react-loading-skeleton';
import {NOTIF_ALERT} from "../../../../redux/actions/_constants";

class DetailUser extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            detail:[],
            miner:[],
            date:[],

        }
    }

    getProps(param){
        let data = [];
        let dates=[];
        if(typeof param.dataDetail.slot === 'object'){
            if(param.dataDetail.slot.length>0){
                param.dataDetail.slot.forEach((e,i)=>{
                    let start = moment(e.start_date);
                    let now = moment();
                    let end = moment(e.start_date).add((e.contract), 'days');
                    const timer = this.calculateCountdown(start, end, now);
                    dates.push(timer);
                    data.push({
                        "id": e.id,
                        "id_user": e.id_user,
                        "slot_no": e.slot_no?e.slot_no:'-',
                        "symbol": e.symbol?e.symbol:'-',
                        "amount": e.amount?e.amount:'0',
                        "daily_earning": e.daily_earning?e.daily_earning:'-',
                        "contract": e.contract?`${e.contract} day`:'-',
                        "start_date": e.start_date?moment(e.start_date).locale('id').format("LLLL"):'-',
                        "status": statusQ(e.status),
                        "created_at": e.created_at,
                        "updated_at": e.updated_at,
                        "monthly_profit": e.monthly_profit?e.monthly_profit:'0'
                    });
                });

            }
            else{
                data=[];
            }
        }
        else{
            data=[];
        }
        this.setState({detail:data,date: dates});
    }

    componentDidUpdate(prevProps) {
        if (this.props.detailUser !== prevProps.detailUser) {
            this.props.dispatch(FetchDetailUser(this.props.detailUser.id));
        }
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({

        })
    };


    calculateCountdown(start,end,now) {
        let diff = (Date.parse(new Date(end)) - Date.parse(new Date(now))) / 1000;

        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            millisec: 0,
        };

        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;
        return timeLeft;

    }
    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
            value = '0' + value;
        }
        return value;
    }


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailUser"} size="lg"  className="custom-map-modal">
                <ModalHeader toggle={this.toggle}>Detail User {this.props.detailUser.name}</ModalHeader>
                <ModalBody>
                    <div style={{overflowX: "auto"}}>
                        <table className="table table-hover">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>Slot No</th>
                                <th className="text-black" style={columnStyle}>Coin</th>
                                <th className="text-black" style={columnStyle}>Investment</th>
                                <th className="text-black" style={columnStyle}>Daily Earning</th>
                                <th className="text-black" style={columnStyle}>Contract Left</th>
                                <th className="text-black" style={columnStyle}>Monthly Profit</th>
                                <th className="text-black" style={columnStyle}>Status</th>
                                <th className="text-black" style={columnStyle}>Start Date</th>

                            </tr>
                            </thead>
                            <tbody>
                            {
                                !this.props.isLoadingDetail?
                                this.state.detail.length>0?
                                    this.state.detail.map((v,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td style={columnStyle}>{v.slot_no}</td>
                                                <td style={columnStyle}>{v.symbol}</td>
                                                <td style={columnStyle}>{parseFloat(v.amount).toFixed(8)}</td>
                                                <td style={columnStyle}>{v.daily_earning!==undefined&&v.daily_earning!==null&&v.daily_earning!=='-'?parseFloat(v.daily_earning).toFixed(8):"0.00000000"}</td>
                                                <td style={columnStyle}>{
                                                    this.addLeadingZeros(this.state.date[i].days)+" Days"
                                                }</td>
                                                <td style={columnStyle}>{parseFloat(v.monthly_profit).toFixed(8)}</td>
                                                <td style={columnStyle}>{v.status}</td>
                                                <td style={columnStyle}>{v.start_date}</td>



                                            </tr>
                                        );
                                    })
                                :<tr><td style={columnStyle} colSpan={9}><img className="img img-responsive" src={NOTIF_ALERT.NO_DATA}/></td></tr>
                                :(()=>{
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
                                                    <td style={columnStyle}>{<Skeleton circle={true} width={30} height={30}/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                </tr>
                                            )
                                        }
                                        return container;
                                    })()
                                // :
                            }
                            </tbody>
                        </table>
                    </div>
                </ModalBody>

            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        isLoadingDetail: state.userReducer.isLoadingDetail,
        dataDetail:state.userReducer.detail

    }
}
export default connect(mapStateToProps)(DetailUser);