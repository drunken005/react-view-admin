import React from 'react';
import {Link} from 'react-router-dom'
import ListComponent from '../../ListComponent';
import _ from 'lodash';
import {CONSTANTS} from '../../../lib/constant';
import {Notification} from '../../antd_extension';
import {Modal, Badge} from 'antd';

const confirm = Modal.confirm;

const filters = [

    {
        label: '用户编号',
        key: 'num',
        type: 'input_text'
    },
    {
        label: '姓名',
        key: 'name',
        type: 'input_text'

    },
    {
        label: '状态',
        key: 'status',
        type: 'select',
        options: _.map(CONSTANTS.ACCOUNT_STATUS, (v, k) => ({label: v, value: k}))
    }
];

export default class SettingsAccount extends ListComponent {
    constructor(props) {
        super(props);
        this.state = {
            condition: {},
            option: {page: 1, pageSize: 10},
            sort: {createdAt: -1},
            data: {},
            loading: false
        };
        this.bindCtx(
            'createAccount',
            'disableUser',
            'enableUser',
            'initializePassword');
    }

    loadData(props, state) {
        if (!this.userRoleAuth('account', 'settings')) {
            return;
        }
        let {option, condition, sort} = state;
        option.sort = sort;
        this.setState({loading: true});
        this.reqwest('user', {data: {condition, option}}, (err, res) => {
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

    createAccount() {
        this.props.history.push(`/settings/account/edit/new`);
    }

    disableUser() {
        this.setUserStatus('disable')
    }

    enableUser() {
        this.setUserStatus('normal')
    }

    initializePassword(userId, name) {
        if (!this.userRoleAuth('initializePassword', 'settings')) {
            return Notification.error('无权执行此操作.');
        }
        if (!userId) {
            return Notification.error('选择用户出错，稍后再试.');
        }
        let self = this;
        confirm({
            title: `确定初始化账号${name}的密码吗？`,
            content: '',
            onOk() {
                self.reqwest('user/initpwd', {
                    method: 'post',
                    data: {userId}
                }, (err, res) => {
                    if (err) {
                        return Notification.error(err.msg)
                    }
                    Notification.success(`初始化密码成功，密码为：${res.defaultPwd}`)
                });
            },
            onCancel() {
            },
        });
    }

    setUserStatus(op) {
        if (!this.userRoleAuth('setStatus', 'settings')) {
            return Notification.error('无权执行此操作.');
        }
        let self = this;
        let {selectedRowKeys, selectedRows} = self.state;
        if (!selectedRowKeys || !selectedRowKeys.length) {
            return Notification.warning('未选择任何用户.')
        }
        let normal = _.compact(_.map(selectedRows, doc => doc.status === 'normal' ? doc.num : null));
        let disable = _.compact(_.map(selectedRows, doc => doc.status === 'disable' ? doc.num : null));

        if (op === 'normal' && normal && normal.length) {
            return Notification.error(normal.join(', ') + ' 状态正常不可执行此操作');
        }

        if (op === 'disable' && disable && disable.length) {
            return Notification.error(disable.join(', ') + ' 已被禁用不可执行此操作');
        }
        confirm({
            title: `确定${op === 'normal' ? '恢复' : '禁用'}选中用户吗`,
            content: '',
            onOk() {
                self.reqwest('user/status/setUserStatus', {
                    method: 'put',
                    data: {ids: selectedRowKeys, status: op}
                }, (err, res) => {
                    if (err) {
                        return Notification.error(err.msg)
                    }
                    self.setState({selectedRowKeys: []});
                    self.loadData(self.props, self.state);
                    Notification.success(`${op} user status success.`)
                });
            },
            onCancel() {
            },
        });
    }

    render() {
        if (!this.userRoleAuth('account', 'settings')) {
            return this.noAccessAuth();
        }
        let self = this;
        let {data, loading} = self.state;
        const operates = [
            {
                name: '添加账号',
                icon: 'plus-circle',
                fn: self.createAccount,
                loading,
                show: self.userRoleAuth('createAccount', 'settings')
            },
            {
                name: '禁用',
                fn: self.disableUser,
                loading,
                show: self.userRoleAuth('setStatus', 'settings')
            },
            {
                name: '启用',
                fn: self.enableUser,
                loading,
                show: self.userRoleAuth('setStatus', 'settings')
            }
        ];
        const columns = [
            {
                title: '编号',
                dataIndex: 'num',
                sorter: true,
                key: 'num',
                render: (text, {_id, isAdmin}) => {
                    if (isAdmin) {
                        if (!self.userRoleAuth('admin', 'admin')) {
                            return text;
                        } else {
                            return (<Link to={`/settings/account/edit/${_id}`}>{text}</Link>)
                        }
                    }

                    if (!self.userRoleAuth('createAccount', 'settings')) {
                        return text;
                    }
                    return (<Link to={`/settings/account/edit/${_id}`}>{text}</Link>)
                }
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                sorter: true
            },
            {
                title: '登录名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile'
            },
            {
                title: '角色',
                dataIndex: 'roleName',
                key: 'roleName'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text) => {
                    if (text === 'disable') {
                        return <span><Badge status="error"/>{CONSTANTS.ACCOUNT_STATUS[text]}</span>
                    }
                    return CONSTANTS.ACCOUNT_STATUS[text];
                }
            },
            {
                title: '注册时间',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: true
            },
            {
                title: '',
                dataIndex: 'password',
                key: 'password',
                render: (text, {_id, isAdmin, name}) => {
                    if (isAdmin) {
                        if (!self.userRoleAuth('admin', 'admin')) {
                            return null;
                        } else {
                            return (<button className='link-button' onClick={() => {
                                self.initializePassword(_id, name)
                            }}>初始化密码</button>)
                        }
                    }

                    if (!self.userRoleAuth('initializePassword', 'settings')) {
                        return null;
                    }
                    return (<button className='link-button' onClick={() => {
                        self.initializePassword(_id, name)
                    }}>初始化密码</button>)
                }
            }
        ];
        return this.renderPage({loading, columns}, data, operates, filters)
    }
}