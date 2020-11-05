import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../common/PrivateRoute';
import NotFound from '../common/notfound'

import Login from '../App/Auth/Login/Login';
import Dashboard from '../App/Dashboard/Dashboard';
import Admin from '../App/User/adminIndex';
import User from '../App/User/userIndex';
import CoinType from '../App/CoinType/coinTypeIndex';
import Faq from '../App/Faq/faqIndex';
import Inbox from '../App/Inbox/inboxIndex';
import Deposit from '../App/Deposit/depositIndex';
import Penarikan from '../App/Penarikan/penarikanIndex';
import Transaction from '../App/Transaction/transactionIndex';
import Setting from '../App/Setting/settingIndex';
const Routes = (
    <div>
        <Switch>
            <Route path="/login" exact strict component={Login} />
           
            {/* DASHBOARD SECTION START */}
            <PrivateRoute path="/" exact strict component={Dashboard} />
            {/* DASHBOARD SECTION END */}
            {/* USER SECTION START */}
            <PrivateRoute path="/admin" exact strict component={Admin} />
            <PrivateRoute path="/user" exact strict component={User} />
            {/* USER SECTION END */}
            {/* COIN TYPE SECTION START */}
            <PrivateRoute path="/coin_type" exact strict component={CoinType} />
            {/* COIN TYPE SECTION END */}
            {/* FAQ SECTION START */}
            <PrivateRoute path="/faq" exact strict component={Faq} />
            {/* FAQ SECTION END */}
            {/* INBOX SECTION START */}
            <PrivateRoute path="/contact" exact strict component={Inbox} />
            {/* INBOX SECTION END */}
            {/* DEPOSIT SECTION START */}
            <PrivateRoute path="/investment" exact strict component={Deposit} />
            {/* DEPOSIT SECTION END */}
            {/* PENARIKAN SECTION START */}
            <PrivateRoute path="/withdraw" exact strict component={Penarikan} />
            {/* PENARIKAN SECTION END */}
            {/* TRANSACTION SECTION START */}
            <PrivateRoute path="/transaction" exact strict component={Transaction} />
            {/* TRANSACTION SECTION END */}
            {/* PENGATURAN SECTION START */}
            <PrivateRoute path="/setting" exact strict component={Setting} />
            {/* PENGATURAN SECTION END */}
            <Route component={NotFound}/>

        </Switch>
    </div>
)

export default Routes;