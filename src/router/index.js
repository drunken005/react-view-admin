import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import App from '../components/app';
import Home from '../components/home';
import Login from '../components/login';

import SettingsAccount from '../components/settings/account';
import SettingsAccountForm from '../components/settings/account/form';

import SettingsRole from '../components/settings/role';
import SettingsRoleForm from '../components/settings/role/role/form';
import SettingsRoleMenuForm from '../components/settings/role/role/menuForm';
import OpLogs from '../components/settings/oplog';

import NoMatch from '../components/no_match';


const routes = [
    {
        path: '/',
        component: Home,
        role: '',
    },
    {
        path: '/settings',
        role: '',
        routes: [
            {
                path: '/settings/account',
                component: SettingsAccount,
                role: '',
            },
            {
                path: '/settings/account/edit/:_id',
                component: SettingsAccountForm,
                role: '',
            },
            {
                path: '/settings/role',
                component: SettingsRole,
                role: '',
            },
            {
                path: '/settings/role/edit/:_id',
                component: SettingsRoleForm,
                role: '',
            },
            {
                path: '/settings/role/menu/:_id',
                component: SettingsRoleMenuForm,
                role: '',
            },
            {
                path: '/settings/oplog',
                component: OpLogs,
                role: '',
            }
        ]
    }
];

export const renderRoutes = () => (
    <Router basename="/">
        <div>
            <App>
                <Switch>
                    {
                        routes.map((route, index) => {
                            if (!route.routes || !route.routes.length) {

                                return (<Route key={index} exact strict {...route}/>)
                            } else {
                                return route.routes.map((tow_route, t_index) => {
                                    return (<Route exact key={t_index} {...tow_route}/>)
                                })
                            }
                        })
                    }
                    <Route component={NoMatch}/>
                </Switch>
            </App>
            <Route exact strict path="/login" component={Login}/>
        </div>
    </Router>
);