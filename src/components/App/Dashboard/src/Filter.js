import React, {Component} from 'react'
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";

class Charts extends Component {
    render(){
        return(
            <div className="row">
                <div className="col-md-2 col-sm-2 col-lg-2">
                    <div className="form-group">
                        <DateRangePicker
                            ranges={rangeDate}
                            alwaysShowCalendars={true}
                            onEvent={this.props.handleEvent}
                            >
                            <input type="text" className="form-control" name="date_product" value={`${this.props.startDate} to ${this.props.endDate}`} style={{padding: '9px',fontWeight:'bolder'}}/>
                        </DateRangePicker>
                    </div>
                </div>
                <div className="col-md-2 col-sm-2 col-lg-2">
                    <div className="form-group">
                        <Select 
                            options={this.props.location_data} 
                            placeholder = "Pilih Lokasi"
                            defaultValue={{ label: "Select Location", value: "-" }}
                            onChange={this.props.HandleChangeLokasi}
                            value = {
                                this.props.location_data.find(op => {
                                    return op.value === this.props.location
                                })
                            }
                            />
                    </div>
                </div>
            </div>
        )
    }
}

export default Charts;