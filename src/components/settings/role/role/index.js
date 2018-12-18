import React from 'react';
import ListComponent from '../../../ListComponent';
import {Link} from 'react-router-dom'

export default class Role extends ListComponent {
    constructor(props) {
        super(props);
        this.state = {
            condition: {},
            option: {page: 1, pageSize: 10},
            sort: {_id: 1},
            data: {},
            loading: false
        };

        this.bindCtx('createExchange')
    }

    loadData(props, state) {
        if (!this.userRoleAuth('role', 'settings')) {
            return;
        }
        let {option, condition, sort} = state;
        option.sort = sort;
        this.setState({loading: true});
        this.reqwest('role', {data: {condition, option}}, (err, res) => {
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

    createExchange() {
        this.props.history.push(`/settings/role/edit/new`);
    }

    render() {
        if (!this.userRoleAuth('role', 'settings')) {
            return this.noAccessAuth();
        }
        const self = this;
        let {data, loading} = self.state;
        const operates = [
            {
                name: '添加角色',
                icon: 'plus-circle',
                fn: self.createExchange,
                loading,
                show: self.userRoleAuth('roleSettings', 'settings')
            }
        ];
        const columns = [
            {
                title: '编号',
                dataIndex: '_id',
                sorter: true,
                key: 'num',
                render: (text, {_id, isAdmin}) => {
                    if (isAdmin) {
                        if (!self.userRoleAuth('admin', 'admin')) {
                            return text;
                        } else {
                            return (<Link to={`/settings/role/edit/${_id}`}>{text}</Link>)
                        }
                    }


                    if (!self.userRoleAuth('roleSettings', 'settings')) {
                        return text;
                    }
                    return (<Link to={`/settings/role/edit/${_id}`}>{text}</Link>)
                }
            },
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                sorter: true
            },
            {
                title: '描述',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '',
                dataIndex: 'roles',
                key: 'roles',
                render: (text, {isAdmin, _id}) => {
                    if (isAdmin) {
                        if (!self.userRoleAuth('admin', 'admin')) {
                            return null;
                        } else {
                            return (<Link to={`/settings/role/menu/${_id}`}>设置权限</Link>)
                        }
                    }
                    if (!self.userRoleAuth('roleSettings', 'settings')) {
                        return null;
                    }
                    return (<Link to={`/settings/role/menu/${_id}`}>设置权限</Link>)
                }
            }
        ];

        return this.renderPage({loading, rowSelection: false, columns, a_pagination: false}, data, operates)
    }

}