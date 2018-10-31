import React from 'react';
import {Link} from 'react-router-dom'
import BaseComponent from '../BaseComponent';
import _ from 'lodash';
import Filter from '../public/filter';


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

    }
];

export default class ExchangeList extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            condition: {},
            option: {page: 1, pageSize: 15},
            sort: {createAt: -1},
            data: {},
            loading: false
        };
        this.bindCtx('handleTableChange', 'searchChange', 'createExchange');
    }

    loadData(props, state) {
        let {option, condition, sort} = state;
        option.sort = sort;
        console.log(condition);
        // this.setState({loading: true});
        // this.reqwest('boxes', {data: {condition, option}}, (err, res)=> {
        //     this.setState({loading: false});
        //     if (err) {
        //         return console.log(err);
        //     }
        //     this.setState({data: res});
        // })
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

    createExchange(){
        console.log('create exchange....')
    }

    render() {
        let self = this;
        let {data, loading} = self.state;

        const operates = [
            {
                name: '新建交易所',
                icon: 'plus-circle',
                fn: self.createExchange,
                loading
            }
        ];
        const columns = [
            {
                title: '编号',
                dataIndex: '_id',
                sorter: true,
                key: '_id',
                render: (text, {currentStatus, _id, userId}, index) => {
                    if (_.includes(['started', 'matching', 'suspended'], currentStatus)) {
                        return _id;
                    }
                    return (<Link to={`/boxes/detail/${_id}/${userId}/current`}>{_id}</Link>)
                }
            },
            {
                title: '交易所名称',
                dataIndex: 'name',
                key: 'name',
            }, {
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
                title: 'CXP账户名',
                dataIndex: 'account',
                key: 'account',
                sorter: true
            }
        ];

        return (
            <div>
                <Filter searchChange={self.searchChange} filters={filters}/>
                {this.renderList({loading, columns, onChange: self.handleTableChange}, data, operates)}
            </div>
        );
    }
}