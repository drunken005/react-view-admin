import React from 'react';
import {Link} from 'react-router-dom'
import BaseComponent from '../BaseComponent';
import _ from 'lodash';
import Filter from '../public/filter';
import {CONSTANTS} from '../../lib/constant';
import {Notification} from '../antd_extension';
import {Modal} from 'antd';

const confirm = Modal.confirm;

const filters = [

    {
        label: '交易所编号',
        key: '_id',
        type: 'input_text'
    },
    {
        label: '交易所名称',
        key: 'name',
        type: 'input_text'

    },
    {
        label: '状态',
        key: 'status',
        type: 'select',
        options: _.map(CONSTANTS.EXCHANGE_STATUS, (v, k) => ({label: v, value: k}))
    }
];

export default class ExchangeList extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            condition: {},
            option: {page: 1, pageSize: 15},
            sort: {createdAt: -1},
            data: {},
            loading: false
        };
        this.bindCtx('handleTableChange', 'searchChange', 'createExchange', 'selectedRow', 'freezeExchange','unfreezeExchange');
    }

    loadData(props, state) {
        let {option, condition, sort} = state;
        option.sort = sort;
        this.setState({loading: true});
        this.reqwest('exchange', {data: {condition, option}}, (err, res) => {
            this.setState({loading: false});
            if (err) {
                return console.log(err);
            }
            this.setState({data: res});
        })
    }

    componentDidMount() {
        let {props, state} = this;
        this.loadData(props, state)
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.condition !==
            nextState.condition ||
            this.state.option !==
            nextState.option ||
            this.state.sort !==
            nextState.sort) {
            this.loadData(nextProps, nextState)
        }
    }

    handleTableChange(pagination, filters, sorter) {
        if (!_.isEmpty(sorter)) {
            this.setState({sort: {[sorter.field]: sorter.order === 'ascend' ? 1 : -1}})
        }
    }

    searchChange(data) {
        let {pageSize} = this.state.option;
        this.setState({condition: data, option: {page: 1, pageSize}});
    }

    createExchange() {
        this.props.history.push(`/exchange/edit/new`);
    }

    selectedRow(selectedRowKeys, selectedRows) {
        this.setState({selectedRowKeys, selectedRows});
    }

    freezeExchange() {
        let self = this;
        let {selectedRowKeys, selectedRows} = self.state;
        if (!selectedRowKeys || !selectedRowKeys.length) {
            return Notification.error('未选择任何数据')
        }
        let normal = _.compact(_.map(selectedRows, doc => doc.status === 'normal' ? doc._id : null));
        let freeze = _.compact(_.map(selectedRows, doc => doc.status === 'freeze' ? doc._id : null));
        if (freeze && freeze.length) {
            return Notification.error(freeze.join(',') + '已被冻结，不可重复冻结.');
        }

        if (!normal || !normal.length) {
            return Notification.error('请选择未冻结的交易所.');
        }
        confirm({
            title: `确定冻结交易所: ${normal.join(',')} ?`,
            content: '',
            onOk() {
                self.reqwest('exchange/freeze', {method: 'post', data: {ids: normal}}, (err, res) => {
                    if (err) {
                        return Notification.error(err.msg)
                    }
                    self.setState({selectedRowKeys: []});
                    self.loadData(self.props, self.state);
                    if(res && res.warning){
                        return Notification.info(res.warning);
                    }
                    Notification.success('冻结交易所处理成功!')
                });
            },
            onCancel() {
            },
        });
    }

    unfreezeExchange() {
        let self = this;
        let {selectedRowKeys, selectedRows} = self.state;
        if (!selectedRowKeys || !selectedRowKeys.length) {
            return Notification.error('未选择任何数据')
        }
        let normal = _.compact(_.map(selectedRows, doc => doc.status === 'normal' ? doc._id : null));
        let freeze = _.compact(_.map(selectedRows, doc => doc.status === 'freeze' ? doc._id : null));
        if (normal && normal.length) {
            return Notification.error(freeze.join(',') + '状态正常,不可执行该操作.');
        }

        if (!freeze || !freeze.length) {
            return Notification.error('请选择冻结状态的交易所.');
        }
        confirm({
            title: `确定解冻交易所: ${freeze.join(',')} ?`,
            content: '',
            onOk() {
                self.reqwest('exchange/unfreeze', {method: 'post', data: {ids: freeze}}, (err, res) => {
                    if (err) {
                        return Notification.error(err.msg)
                    }
                    self.setState({selectedRowKeys: []});
                    self.loadData(self.props, self.state);
                    if(res && res.warning){
                        return Notification.info(res.warning);
                    }
                    Notification.success('解冻交易所处理成功!')
                });
            },
            onCancel() {
            },
        });
    }


    render() {
        let self = this;
        let {data, loading, selectedRowKeys} = self.state;
        const operates = [
            {
                name: '新建交易所',
                icon: 'plus-circle',
                fn: self.createExchange,
                loading
            },
            {
                name: '冻结',
                icon: 'disconnect',
                fn: self.freezeExchange,
                loading
            },
            {
                name: '解冻',
                icon: 'bulb',
                fn: self.unfreezeExchange,
                loading
            }
        ];
        const columns = [
            {
                title: '编号',
                dataIndex: '_id',
                sorter: true,
                key: '_id',
                render: (text, {_id}) => {
                    return (<Link to={`/exchange/edit/${_id}`}>{_id}</Link>)
                }
            },
            {
                title: 'CXP账户名',
                dataIndex: 'account',
                key: 'account',
                sorter: true
            },
            {
                title: '交易所名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '交易所简称',
                dataIndex: 'short_name',
                key: 'short_name',
            },
            {
                title: '交易所地址',
                dataIndex: 'address',
                key: 'address'
            },

            {
                title: '联系人姓名',
                dataIndex: 'contact_name',
                key: 'contact_name'
            },
            {
                title: '联系人电话',
                dataIndex: 'contact_mobile',
                key: 'contact_mobile'
            },
            {
                title: '交易所官网',
                dataIndex: 'website',
                key: 'website'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, {status}) => CONSTANTS.EXCHANGE_STATUS[status]
            }
        ];
        const rowSelection = {
            onChange: self.selectedRow,
            selectedRowKeys,
            // getCheckboxProps: record => ({disabled: !record.express})
            getCheckboxProps: record => ({})
        };
        return (
            <div>
                <Filter searchChange={self.searchChange} filters={filters}/>
                {this.renderList({loading, rowSelection, columns, onChange: self.handleTableChange}, data, operates)}
            </div>
        );
    }
}