import React from 'react';
import BaseComponent from '../../BaseComponent';
import {Notification} from '../../antd_extension';
import {Modal, Spin} from 'antd';
import PublicForm from '../../public/form';
import _ from 'lodash';
import MongoHelpers from 'mongo-helpers';
import EJSON from 'ejson';
import {CONSTANTS} from "../../../lib/constant";

const confirm = Modal.confirm;

const mapf = {
    name: {
        label: '姓名',
        type: 'input',
        required: true
    },
    username: {
        label: '登录名',
        type: 'input',
        required: true
    },
    mobile: {
        label: '手机号',
        type: 'input',
        required: true
    },
    status: {
        label: '状态',
        type: 'select',
        required: true,
        options: _.map(CONSTANTS.ACCOUNT_STATUS, (v, k) => ({label: k, value: k}))
    }
};


export default class SettingsAccountForm extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            commit: false,
            data: {},
            fieldsMap: mapf,
            oldData: {},
            loading: false,
            roles: []
        };
    }

    initFieldsMap(data, roles) {
        let {fieldsMap} = this.state;
        let role = {
            label: '角色',
            type: 'select',
            required: true,
            options: _.map(roles, (doc) => ({label: doc.name, value: doc._id}))

        };
        fieldsMap = _.assign(fieldsMap, {role});
        this.setState({data, fieldsMap});
    }

    loadData() {
        if(!this.userRoleAuth('createAccount','settings')){
            return;
        }
        let self = this;
        let {_id} = this.props.match.params;
        self.reqwest(`user/${_id}/edit`, {}, (err, result) => {
            if (result) {
                let {user, roles} = result;

                self.setState({data: user, oldData: EJSON.clone(user), roles});
                this.initFieldsMap(user, roles)
            }
        })
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUpdate(nextProps, nextState) {

    }

    handleFormChange = (data, changeObj) => {
        _.each(data, (v, k) => {
            !v && delete data[k];
        });
        let {fieldsMap, roles} = this.state;
        if (_.isEmpty(fieldsMap)) {
            return this.setState({data});
        }
        this.initFieldsMap(data, roles)
    };

    validateRequired(fields, data) {
        let validate = [];
        _.map(_.keys(_.pickBy(_.omitBy(fields, {deprecated: true}), {required: true})), (key) => {
            _.includes(['', null, [], undefined], data[key]) && validate.push(key);
        });
        return !validate.length;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.userRoleAuth('createAccount','settings')){
            return Notification.error('No access permission.');
        }
        this.setState({commit: true});
        let {data = {}, fieldsMap} = this.state;
        if (!this.validateRequired(fieldsMap, data)) {
            return Notification.error('检查必填项，是否已经填写!');
        }

        data._id ? this.updateData(data) : this.createData(data);
    };

    updateData(data) {
        let that = this, {oldData} = this.state;
        let diff = MongoHelpers.diffToFlatten(data, oldData, {unsetNonProp: true});
        if (!diff || _.isEmpty(diff)) {
            return Notification.error('数据没有发生更改');
        }
        let obj = MongoHelpers.rebuild(diff);
        if (!obj || _.isEmpty(obj)) {
            return Notification.error('数据没有发生更改');
        }
        let modifier = MongoHelpers.flattenToModifier(data, oldData, {unsetNonProp: true});
        confirm({
            title: '确定执行该修改操作吗',
            onOk() {
                that.setState({loading: true, tip: '数据上传中....'});
                that.reqwest(`user/${oldData._id}`, {method: 'put', data: {modifier}}, (err, res) => {
                    that.setState({loading: false});
                    if (err) {
                        console.log(err);
                        return Notification.error(err.msg);
                    }
                    Notification.success(`更新用户信息成功!`);
                    that.props.history.push('/settings/account');
                });
            },
            onCancel() {
            }
        });

    }

    createData(data) {
        let that = this;
        confirm({
            title: '确定信息无误提交保存吗？',
            onOk() {
                that.setState({loading: true, tip: '数据上传中....'});
                that.reqwest(`user/register`, {method: 'post', data}, (err, res) => {
                    that.setState({loading: false});
                    if (err) {
                        console.log(err);
                        return Notification.error(err.msg);
                    }
                    Notification.success(`添加管理员成功! 用户名：${data.username}, 初始密码: ${res.defaultPwd}`);
                    that.props.history.push('/settings/account');
                });
            },
            onCancel() {
            }
        });

    }

    handleCancel = (e) => {
        e.preventDefault();
        let that = this, {data, oldData} = this.state;
        let diff = MongoHelpers.diffToFlatten(data, oldData, {unsetNonProp: true});
        if (diff && !_.isEmpty(diff)) {
            confirm({
                title: '确定放弃保存？',
                onOk() {
                    that.props.history.push('/settings/account');
                },
                onCancel() {
                }
            });
        } else {
            that.props.history.push('/settings/account');
        }
    };

    render() {
        if(!this.userRoleAuth('createAccount','settings')){
            return this.noAccessAuth();
        }
        let {data, commit, loading, fieldsMap, tip = '数据加载中.....'} = this.state;
        let formProps = {
            title: data && data._id ? `更新系统管理员账号 ${data.num}` : '添加系统管理员账号',
            fields: fieldsMap,
            dataSource: data,
            handleSubmit: this.handleSubmit,
            handleCancel: this.handleCancel,
            onChange: this.handleFormChange,
            commit
        };
        return (
            <div>
                <Spin size="large" spinning={loading} tip={tip}>
                    <PublicForm {...formProps}/>
                </Spin>
            </div>
        );
    }
}



