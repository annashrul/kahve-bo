import React, { Component } from 'react';
import {connect} from 'react-redux';
import Layout from 'components/Layout';
import moment from 'moment';
import {toRp} from "helper";
import {FetchStock} from 'redux/actions/dashboard/dashboard.action'
import 'bootstrap-daterangepicker/daterangepicker.css';
import socketIOClient from "socket.io-client";
import {HEADERS} from 'redux/actions/_constants'

import Cards from './src/Cards'
import Charts from './src/charts'
import Filter from './src/Filter'
import Info from './src/Info'
const socket = socketIOClient(HEADERS.URL);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate:localStorage.getItem("startDateDashboard")===null?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateDashboard"),
            endDate:localStorage.getItem("endDateDashboard")===null?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateDashboard"),

            grossSales:"0",
            wGrossSales:110,
            netSales:"0",
            wNetSales:110,
            trxNum:"0",
            wTrxNum:110,
            avgTrx:"0",
            wAvgTrx:110,

            location_data:[],
            location:"-",

            lokasi_sales: {
                    options: {
                        chart: {
                            id: "basic-bar"
                        },
                        xaxis: {
                            categories: []
                        }
                    },
                    series: [{
                            name: "Bulan Lalu",
                            data: []
                        },
                        {
                            name: "Bulan Sekarang",
                            data: []
                        }
                    ],
                },
            lokasi_tr: {
                    options: {
                        chart: {
                            id: "basic-bar"
                        },
                        xaxis: {
                            categories: []
                        }
                    },
                    series: [{
                            name: "Bulan Lalu",
                            data: []
                        },
                        {
                            name: "Bulan Sekarang",
                            data: []
                        }
                    ],
                },
        };

        socket.on('refresh_dashboard',(data)=>{
            this.refreshData();
        })
        
        socket.on("set_dashboard", (data) => {
            this.setState({
                grossSales:toRp(parseInt(data.header.penjualan,10)),
                netSales:toRp(parseInt(data.header.net_sales,10)),
                trxNum:data.header.transaksi,
                avgTrx:toRp(parseInt(data.header.avg,10)),
                lokasi_sales: data.lokasi_sales,
                lokasi_tr: data.lokasi_tr,
                hourly: data.hourly,
                daily: data.daily,
                top_item_qty: data.top_item_qty,
                top_item_sale: data.top_item_sale,
                top_cat_qty: data.top_cat_qty,
                top_cat_sale: data.top_cat_sale,
                top_sp_qty: data.top_sp_qty,
                top_sp_sale: data.top_sp_sale,
            });
        });
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    }

    componentDidMount(){
        this.props.dispatch(FetchStock());
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

    refreshData(start=null,end=null,loc=null){
        socket.emit('get_dashboard', {
            datefrom: start!==null?start:this.state.startDate,
            dateto: end!==null?end:this.state.endDate,
            location: loc!==null?loc:this.state.location
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
        this.refreshData(awal,akhir,null);
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
        this.refreshData(null, null, lk.value)

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
                    <Info handleSubmit={this.handleSubmit}/>
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
                    <Cards title="Gross Sales" data={this.state.grossSales} icon="fa fa-area-chart text-primary"/>                    
                    <Cards title="NET Sales" data={this.state.netSales} icon="fa fa-area-chart text-primary"/>                    
                    <Cards title="Number Of Transaction" data={this.state.trxNum} icon="fa fa-area-chart text-primary"/>                    
                    <Cards title="Avg. Sales Per-Transaction" data={this.state.avgTrx} icon="fa fa-area-chart text-primary"/>                    
                </div>
                <div className="row">
                   <Charts title="Monthly Sales Amount" data={this.state.lokasi_sales}/>
                </div>
                <div className="row">
                    <Charts title="MONTHLY TRANSACTIONS" data={this.state.lokasi_tr}/>
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