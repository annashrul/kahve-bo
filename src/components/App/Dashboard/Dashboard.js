import React, { Component } from 'react';
import {connect} from 'react-redux';
import Layout from 'components/Layout';
import moment from 'moment';
import {toRp} from "helper";
import {FetchStock} from 'redux/actions/dashboard/dashboard.action'
import 'bootstrap-daterangepicker/daterangepicker.css';
import socketIOClient from "socket.io-client";
import {HEADERS} from 'redux/actions/_constants'
import ReactApexChart from "react-apexcharts";


import Cards from './src/Cards'
import Filter from './src/Filter'
import Info from './src/Info'
import Clock from "../../common/clock";
const socket = socketIOClient(HEADERS.URL);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            totalBalance:"0",
            totalInvest:"0",
            totalWD:"0",
            totalMember:"0",
            location_data:[],
            location:"-",
            series: [
                {
                    name: 'Active Balance',
                    data: this.generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 60
                    })
                },
                {
                    name: 'Investment',
                    data: this.generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 20
                    })
                },
                {
                    name: 'Withdraw',
                    data: this.generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 15
                    })
                }
            ],
            options: {
                chart: {
                    type: 'area',
                    height: 350,
                    stacked: true,
                    events: {
                        selection: function (chart, e) {
                            console.log(new Date(e.xaxis.min))
                        }
                    },
                },
                colors: ['#008FFB', '#00E396', '#b71c1c'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.6,
                        opacityTo: 1.0,
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                },
                xaxis: {
                    type: 'datetime'
                },
            },

        };

        socket.on('refresh_dashboard',(data)=>{
            console.log(data);
            this.refreshData();
        })
        
        socket.on("set_dashboard", (data) => {
            console.log(data);
            this.setState({
                series:data.series,
                totalBalance:data.total_balance,
                totalInvest:data.total_invest,
                totalWD:data.total_wd,
                totalMember:data.total_member,
            })
        });
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    }
    generateDayWiseTimeSeries(baseval, count, yrange) {
        let i = 0;
        let series = [];
        while (i < count) {
            let y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            series.push([baseval, y]);
            baseval += 86400000;
            i++;
        }
        return series;
    }


    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
          let lk = [{
              value: "-",
              label: "Semua Lokasi"
          }]
          let loc = nextProps.auth.user.lokasi;
          if(loc!==undefined){
              loc.map((i) => {
                lk.push({
                  value: i.kode,
                  label: i.nama
                });
                return null;
              })
              
              this.setState({
                location_data: lk,
                userid: nextProps.auth.user.id
              })
          }
        }
      }

    refreshData(start=null,end=null){
        socket.emit('get_dashboard', {
            datefrom: start!==null?start:this.state.startDate,
            dateto: end!==null?end:this.state.endDate,
        })
    }

    componentWillMount(){
        this.refreshData();
    }

    componentWillUnmount(){
        localStorage.removeItem('startDateProduct');
        localStorage.removeItem('endDateDashboard');
    }

    onChange = date => this.setState({ date })

    handleEvent = (event, picker) => {
        // end:  2020-07-02T16:59:59.999Z
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
        this.refreshData(awal,akhir);
    };

    handleSubmit = (event) => {
        event.preventDefault()
        this.refreshData();
    }

    HandleChangeLokasi(lk) {
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location: lk.value,
            error: err
        })
        this.refreshData(null, null)

    }

    render() {
        return (
            <Layout page="Dashboard">
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                        <h5 className="mb-0 font-weight-bold">Dashboard</h5>
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                            <div className="dashboard-clock">
                                <div id="dashboardDate">{moment().format("dddd, Do MMM YYYY")}</div>
                                <Clock/>
                            </div>
                            <div className="dashboard-btn-group d-flex align-items-center">
                                <button type="button" onClick={(e)=>this.handleSubmit(e)} className="btn btn-primary ml-1 float-right"><i className="fa fa-refresh"></i></button>
                            </div>

                        </div>
                    </div>
                    {/*<Info handleSubmit={this.handleSubmit}/>*/}
                </div>

                {/* Dashboard Filter Area */}
                <Filter
                    className="mb-3"
                    handleEvent={this.handleEvent}                        
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    location_data={this.state.location_data}
                    HandleChangeLokasi={this.HandleChangeLokasi}
                    location={this.state.location}
                />

                {/* Dashboard Widget Area */}
                <div className="row">
                    <Cards title="TOTAL INVESTMENT" data={this.state.totalInvest} icon="fa fa-area-chart text-primary"/>
                    <Cards title="ACTIVE BALANCE" data={this.state.totalBalance} icon="fa fa-area-chart text-primary"/>
                    <Cards title="TOTAL WITHDRAW" data={this.state.totalWD} icon="fa fa-area-chart text-primary"/>
                    <Cards title="MEMBER ACTIVE" data={this.state.totalMember} icon="fa fa-area-chart text-primary"/>
                </div>
                {/* Dashboard Widget Area */}
                <div className="card">
                    <div className="card-body">
                        <div className="card-header bg-transparent text-center">
                            <h4 className="card-title mt-3">ACTIVE BALANCE</h4>
                        </div>
                        <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={350} />

                        {/*<div className="row">*/}
                            {/*<div className="col-md-12">*/}
                                {/*<Chart*/}
                                    {/*options={this.state.options}*/}
                                    {/*series={this.state.series}*/}
                                    {/*height="400"*/}
                                {/*/>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    </div>
                </div>
        </Layout>
       
        );
    }
}
// Dashboard.propTypes = {
//     auth: PropTypes.object
// }

const mapStateToProps = (state) =>{
     return{
       auth: state.auth,
       stock: state.dashboardReducer.data
     }
}
export default connect(mapStateToProps)(Dashboard);