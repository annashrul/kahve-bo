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

class DetailUser extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            detail:[]
        }
    }
    componentWillReceiveProps(nextProps){
        let data = [];
        if(typeof nextProps.detail.slot === 'object'){
            if(nextProps.detail.slot.length>0){
                nextProps.detail.slot.forEach((e,i)=>{
                    data.push({
                        "id": e.id,
                        "id_user": e.id_user,
                        "slot_no": e.slot_no?e.slot_no:'-',
                        "id_coin": e.id_coin?e.id_coin:'-',
                        "amount": e.amount?e.amount:'0',
                        "daily_earning": e.daily_earning?e.daily_earning:'-',
                        "contract": e.contract?e.contract:'-',
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
        this.setState({detail:data});

    }

    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({

        })
    };

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailUser"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail User {this.props.detail.name}</ModalHeader>
                <ModalBody>
                    <div style={{overflowX: "auto"}}>
                        <table className="table table-hover">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>Slot No</th>
                                <th className="text-black" style={columnStyle}>Id Coin</th>
                                <th className="text-black" style={columnStyle}>Amount</th>
                                <th className="text-black" style={columnStyle}>Daily Earning</th>
                                <th className="text-black" style={columnStyle}>Contract</th>
                                <th className="text-black" style={columnStyle}>Monthly Profit</th>
                                <th className="text-black" style={columnStyle}>Status</th>
                                <th className="text-black" style={columnStyle}>Start Date</th>

                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.detail.length>0?
                                this.state.detail.map((v,i)=>{
                                    return (
                                        <tr key={i}>
                                            <td style={columnStyle}>{v.slot_no}</td>
                                            <td style={columnStyle}>{v.id_coin}</td>
                                            <td style={columnStyle}>{parseFloat(v.amount).toFixed(8)}</td>
                                            <td style={columnStyle}>{v.daily_earning!==undefined&&v.daily_earning!==null&&v.daily_earning!=='-'?parseFloat(v.daily_earning).toFixed(8):"0.00000000"}</td>
                                            <td style={columnStyle}>{v.contract}</td>
                                            <td style={columnStyle}>{parseFloat(v.monthly_profit).toFixed(8)}</td>
                                            <td style={columnStyle}>{v.status}</td>
                                            <td style={columnStyle}>{v.start_date}</td>

                                        </tr>
                                    );
                                }):<tr><td style={columnStyle} colSpan={9}>No data.</td></tr>
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
    }
}
export default connect(mapStateToProps)(DetailUser);