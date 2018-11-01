import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import App from '../components/app';
import Home from '../components/home';
import Test from '../components/test';
import Login from '../components/login';
import ExchangeList from '../components/exchange';
import ExchangeForm from '../components/exchange/form';

export const renderRoutes = ()=>(
    <Router basename="/">
        <div>
            <App>
                <Route exact strict path="/" component={Home}/>
                <Route exact strict path="/test" component={Test}/>
                <Route exact strict path="/exchange/info" component={ExchangeList}/>
                <Route exact strict path="/exchange/edit/:_id" component={ExchangeForm}/>
            </App>
            <Route exact strict path="/login" component={Login}/>
        </div>
    </Router>
);