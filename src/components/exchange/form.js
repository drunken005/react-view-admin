import React from 'react';
import BaseComponent from '../BaseComponent';
import {Notification} from '../antd_extension';
import {Modal, Spin} from 'antd';
import PublicForm from '../public/form';
import _ from 'lodash';
import MongoHelpers from 'mongo-helpers';
import EJSON from 'ejson';

const confirm = Modal.confirm;

const mapf = {
    name: {
        label: '交易所名称',
        type: 'input',
        required: true
    },
    short_name: {
        label: '交易所简称',
        type: 'input',
        required: true
    },
    logo: {
        label: 'logo',
        type: 'input',
        required: true
    },
    address: {
        label: '交易所地址',
        type: 'input',
        required: true
    },
    contact_name: {
        label: '联系人姓名',
        type: 'input',
        required: true
    },
    contact_mobile: {
        label: '联系人电话',
        type: 'input',
        required: true
    },
    website: {
        label: '交易所官网',
        type: 'input',
        required: true
    },
    account: {
        label: 'CXP账户名',
        type: 'input',
        required: true
    }
};


export default class ExchangeForm extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            commit: false,
            data: {},
            fieldsMap: mapf,
            oldData: {},
            loading: false
        };
    }


    loadData() {
        let self = this;
        let {_id} = this.props.match.params;
        if (!_id || _id === 'new') {
            return;
        }
        self.reqwest(`exchange/${_id}/edit`, {}, (err, data) => {
            if (data) {
                self.setState({data, oldData: EJSON.clone(data)});
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
        let {fieldsMap} = this.state;
        if (_.isEmpty(fieldsMap)) {
            return this.setState({data});
        }
        this.setState({data, fieldsMap});
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
                that.reqwest(`exchange/${oldData._id}`, {method: 'put', data: {modifier}}, (err, res) => {
                    that.setState({loading: false});
                    if (err) {
                        console.log(err);
                        return Notification.error(err.msg);
                    }
                    Notification.success(`更新交易所信息成功!`);
                    that.props.history.push('/exchange/info');
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
                that.reqwest(`exchange`, {method: 'post', data}, (err, res) => {
                    that.setState({loading: false});
                    if (err) {
                        console.log(err);
                        return Notification.error(err.msg);
                    }
                    Notification.success(`新增交易所成功!`);
                    that.props.history.push('/exchange/info');
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
                    that.props.history.push('/exchange/info');
                },
                onCancel() {
                }
            });
        } else {
            that.props.history.push('/exchange/info');
        }
    };

    render() {
        let {data, commit, loading, fieldsMap, tip = '数据加载中.....'} = this.state;
        let formProps = {
            title: data && data._id ? `更新交易所信息 ${data._id}` : '新增交易所',
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



