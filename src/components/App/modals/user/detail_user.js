import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";
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
        if(typeof nextProps.detail.wallet === 'object'){
            if(nextProps.detail.wallet.length>0){
                nextProps.detail.wallet.forEach((e,i)=>{
                    data.push({
                        "symbol":e.symbol,
                        "address":e.address,
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
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailUser"} size="md">
                <ModalHeader toggle={this.toggle}>Detail User {this.props.detail.name}</ModalHeader>
                <ModalBody>
                    <div style={{overflowX: "auto"}}>
                        <table className="table table-hover">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>No</th>
                                <th className="text-black" style={columnStyle}>Symbol</th>
                                <th className="text-black" style={columnStyle}>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.detail.length>0?
                                this.state.detail.map((v,i)=>{
                                    return (
                                        <tr>
                                            <td style={columnStyle}>{i+1}</td>
                                            <td style={columnStyle}>{v.symbol}</td>
                                            <td style={columnStyle}>{v.address}</td>
                                        </tr>
                                    );
                                }):<tr><td style={columnStyle} colSpan={3}>No data</td></tr>
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