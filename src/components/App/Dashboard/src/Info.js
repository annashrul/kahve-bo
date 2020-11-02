import React, {Component} from 'react'
import Clock from "components/common/clock"
import moment from 'moment';

class Info extends Component {
    render(){
        return(
            <div className="col-6">
                <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                    <div className="dashboard-clock">
                        <div id="dashboardDate">{moment().format("dddd, Do MMM YYYY")}</div>
                        <Clock/>
                    </div>
                    <div className="dashboard-btn-group d-flex align-items-center">
                        <button type="button" onClick={(e)=>this.props.handleSubmit(e)} className="btn btn-primary ml-1 float-right"><i className="fa fa-refresh"></i></button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Info;