import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../common/PrivateRoute';
import NotFound from '../common/notfound'

import Login from '../App/Auth/Login/Login';
import Dashboard from '../App/Dashboard/Dashboard';
import User from '../App/User/userIndex';
import CoinType from '../App/CoinType/coinTypeIndex';
import Faq from '../App/Faq/faqIndex';
const Routes = (
    <div>
        <Switch>
            <Route path="/login" exact strict component={Login} />
           
            {/* DASHBOARD SECTION START */}
            <PrivateRoute path="/" exact strict component={Dashboard} />
            {/* DASHBOARD SECTION END */}
            {/* USER SECTION START */}
            <PrivateRoute path="/user" exact strict component={User} />
            {/* USER SECTION END */}
            {/* COIN TYPE SECTION START */}
            <PrivateRoute path="/coin_type" exact strict component={CoinType} />
            {/* COIN TYPR SECTION END */}
            {/* COIN TYPE SECTION START */}
            <PrivateRoute path="/faq" exact strict component={Faq} />
            {/* COIN TYPR SECTION END */}
            <Route component={NotFound}/>

        </Switch>
    </div>
)

export default Routes;