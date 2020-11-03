import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import Paginationq, {statusQ} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import {FetchCoinType} from "../../../redux/actions/coinType/coinType.action";
import FormCoinType from "../../App/modals/coinType/form_coin_type";
class CoinType extends Component{
    constructor(props){
        super(props);
        this.handleModal = this.handleModal.bind(this);
        this.state={
            detail:{},
            any:""
        }
    }
    componentWillMount(){
        this.props.dispatch(FetchCoinType('page=1'));
    }
    handleModal(e,param) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formCoinType"));
        if(param!==''){
            const {data}=this.props.data;
            this.setState({
                detail:{
                    id:data[param].id,
                    title:data[param].title,
                    symbol:data[param].symbol,
                    status:data[param].status,
                }
            });
        }
        else{
            this.setState({detail:undefined})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageTipeKoin",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(FetchCoinType(where));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageTipeKoin");
        let any = this.state.any;
        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;
    }
    handleSearch(e){
        e.preventDefault();
        alert("fitur belum tersedia");
    }


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const {
            total,
            per_page,
            current_page,
            data
        } = this.props.data;
        return (
            <Layout page={"tipe koin"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Tipe Koin</h5>
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <Info handleSubmit={this.handleSubmit}/>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label>Search</label>
                                            <input type="text" className="form-control" name="any" defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-4 col-xs-4 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.handleModal(e,'')} className="btn btn-primary"><i className="fa fa-plus"/></button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No</th>
                                            <th className="text-black" style={columnStyle}>Aksi</th>
                                            <th className="text-black" style={columnStyle}>Title</th>
                                            <th className="text-black" style={columnStyle}>Simbol</th>
                                            <th className="text-black" style={columnStyle}>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            !this.props.isLoading ?
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    <td style={columnStyle}>
                                                                        <button style={{marginRight:"5px"}} className={"btn btn-primary btn-sm"} onClick={(e)=>this.handleModal(e,i)}><i className={"fa fa-pencil"}/></button>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.title}</td>
                                                                    <td style={columnStyle}>{v.symbol}</td>
                                                                    <td style={columnStyle}>{statusQ(v.status)}</td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data."
                                                    : "No data."
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
                                                            </tr>
                                                        )
                                                    }
                                                    return container;
                                                })()
                                        }
                                        </tbody>
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

                            </div>
                        </div>
                    </div>
                </div>
                <FormCoinType detail={this.state.detail}/>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.coinTypeReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.coinTypeReducer.data

    }
}


export default connect(mapStateToProps)(CoinType);