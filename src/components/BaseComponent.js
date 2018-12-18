import '../stylesheet/table.css';
import React from 'react';
import {Component} from 'react';
import {Notification} from './antd_extension';
import _ from 'lodash';
import {RestfulApis, RoleApi} from '../lib/apis';

class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.userRoleAuth = RoleApi.userRoleAuth;
    }

    //bind context
    bindCtx(...nameList) {
        if (_.isArray(nameList[0])) {
            nameList = nameList[0];
        }
        nameList.forEach(name =>
            this[name] = this[name].bind(this)
        );
    }

    //login out clear localStorage
    loginOut() {
        localStorage.clear();
        this.props.history.push('/login');
    }

    //Request restful api to unify the entry
    reqwest(path, data, cb) {
        RestfulApis.reqwest(path, data, (err, res) => {
            if (err && [10110, 10102, 10104].indexOf(err.statusCode) >= 0) {
                Notification.error(err.msg);
                this.loginOut();
            } else {
                cb(err, res);
            }
        });
    }

    noAccessAuth() {
        return (
            <div style={{padding: '50px'}}>
                <h1>No access permission </h1>
            </div>
        )
    }

}

export default BaseComponent;