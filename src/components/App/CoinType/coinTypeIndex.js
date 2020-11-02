import React,{Component} from 'react';
import Layout from 'components/Layout';
import Info from "../Dashboard/src/Info";
import connect from "react-redux/es/connect/connect";
import Paginationq, {statusQ} from "../../../helper";
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';
import {noImage} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import {FetchCoinType} from "../../../redux/actions/coinType/coinType.action";
import FormCoinType from "../../App/modals/coinType/form_coin_type";
class CoinType extends Component{
    constructor(props){
        super(props);
        this.handleModal = this.handleModal.bind(this);
        this.state={
            detail:{}
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
        console.log(pageNumber);
        this.props.dispatch(FetchCoinType(`page=${pageNumber}`));
    }



    render(){
        const centerStyle = {verticalAlign: "middle", textAlign: "center"};
        const leftStyle = {verticalAlign: "middle", textAlign: "left"};
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            total,
            last_page,
            per_page,
            current_page,
            from,
            to,
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
                                <form onSubmit={this.handlesearch} noValidate>
                                    <div className="row">
                                        <div className="col-10 col-xs-10 col-md-3">
                                            <div className="form-group">
                                                <label>Search</label>
                                                <input type="text" className="form-control" name="field_any" defaultValue={localStorage.getItem('any_customer')}/>
                                            </div>
                                        </div>
                                        <div className="col-2 col-xs-4 col-md-4">
                                            <div className="form-group">
                                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.handleModal(e,'')} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                {
                                    typeof data === 'object' ?
                                        data.length>0?(
                                            <div style={{overflowX: "auto"}}>
                                                <table className="table table-hover table-bordered" style={{zoom:"80%"}}>
                                                    <thead className="bg-light">
                                                    <tr>
                                                        <th className="text-black" style={centerStyle}>No</th>
                                                        <th className="text-black" style={centerStyle}>Aksi</th>
                                                        <th className="text-black" style={centerStyle}>Title</th>
                                                        <th className="text-black" style={centerStyle}>Simbol</th>
                                                        <th className="text-black" style={centerStyle}>Status</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    {
                                                        !this.props.isLoading ?
                                                            (
                                                                typeof data === 'object' ?
                                                                    data.map((v,i)=>{
                                                                        return(
                                                                            <tr key={i}>
                                                                                <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                                <td style={columnStyle}>
                                                                                    <div className="btn-group">
                                                                                        <UncontrolledButtonDropdown>
                                                                                            <DropdownToggle caret>
                                                                                                Aksi
                                                                                            </DropdownToggle>
                                                                                            <DropdownMenu>
                                                                                                <DropdownItem onClick={(e)=>this.handleModal(e,i)}>Edit</DropdownItem>
                                                                                            </DropdownMenu>
                                                                                        </UncontrolledButtonDropdown>
                                                                                    </div>
                                                                                </td>
                                                                                <td style={columnStyle}>{v.title}</td>
                                                                                <td style={columnStyle}>{v.symbol}</td>
                                                                                <td style={columnStyle}>{statusQ(v.status)}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                    : "No data."
                                                            ) : (()=>{
                                                                let container =[];
                                                                for(let x=0; x<10; x++){
                                                                    container.push(
                                                                        <tr key={x}>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                            <td style={columnStyle}>{<Skeleton count={2}/>}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                                return container;
                                                            })()
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ):(
                                            <img style={{height:"50px"}} src={"https://i.pinimg.com/originals/88/36/65/8836650a57e0c941b4ccdc8a19dee887.png"} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/>
                                        )
                                        : <img style={{height:"50px"}} src={"https://i.pinimg.com/originals/88/36/65/8836650a57e0c941b4ccdc8a19dee887.png"} onError={(e)=>{e.target.onerror = null; e.target.src=noImage()}} alt=""/>

                                }

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