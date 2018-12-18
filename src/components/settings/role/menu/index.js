import React from 'react';
import ListComponent from '../../../ListComponent';
import {Table, Modal, Input} from 'antd'
import {Notification} from "../../../antd_extension";
import _ from 'lodash';
import {message} from "antd/lib/index";

const confirm = Modal.confirm;

export default class MenuComponent extends ListComponent {
    constructor(props) {
        super(props);
        this.state = {
            condition: {root: true},
            option: {page: 1, pageSize: 10},
            sort: {_id: 1},
            data: {},
            subData: {},
            loading: false,
            expandedRowKeys: [],
            modalVisible: false,
            record: null
        };
        this.bindCtx('expandedRowRender', 'onExpand', 'createMenus', 'removeMenu', 'openOrCloseModal')
    }

    loadSubMenus(group) {
        let {option, sort} = this.state;
        option.sort = sort;
        let condition = {group};
        this.setState({loading: true});
        this.reqwest('role/menus', {data: {condition, option}}, (err, res) => {
            this.setState({loading: false});
            if (err) {
                return console.log(err);
            }
            this.setState({subData: res});
        })
    }

    loadData(props, state) {
        if (!this.userRoleAuth('roleMenus', 'settings')) {
            return;
        }
        let {option, condition, sort} = state;
        option.sort = sort;
        this.setState({loading: true});
        this.reqwest('role/menus', {data: {condition, option}}, (err, res) => {
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

    onExpand(expanded, record) {
        this.setState({expandedRowKeys: expanded ? [record._id] : []});
        if (expanded) {
            this.loadSubMenus(record._id);
        }
    }

    createMenus() {
        if (!this.userRoleAuth('roleMenus', 'settings')) {
            return Notification.success('No access permission');
        }
        let {modalVisible, record} = this.state;
        let desc = document.getElementById('desc').value;
        let name = document.getElementById('name').value;
        desc = _.trim(desc);
        name = _.trim(name);

        if (!desc || !name) {
            return message.error('权限标识和名称必填.');
        }
        let data = {group: record._id, name, desc};
        const self = this;
        self.reqwest(`role/menus`, {method: 'post', data}, (err, res) => {
            if (err) {
                console.log(err);
                return Notification.error(err.msg);
            }
            Notification.success(`新增权限处理成功!`);
            self.setState({modalVisible, record: null});
            self.loadSubMenus(record._id);
        });
    }

    removeMenu(menu) {
        if (!this.userRoleAuth('roleMenus', 'settings')) {
            return Notification.success('No access permission');
        }
        if (!menu || !menu._id) {
            return Notification.error('未选择任何数据.');
        }
        const self = this;
        confirm({
            title: `确定删除 ${menu.desc} 权限吗`,
            onOk() {
                self.setState({loading: true, tip: '数据上传中....'});
                self.reqwest(`role/menus/${menu._id}`, {method: 'delete', data: {}}, (err, res) => {
                    self.setState({loading: false});
                    if (err) {
                        console.log(err);
                        return Notification.error(err.msg);
                    }
                    Notification.success(`删除权限处理成功!`);
                    self.loadSubMenus(menu.group);
                });
            },
            onCancel() {
            }
        });

    }

    openOrCloseModal(modalVisible, record) {
        return this.setState({modalVisible: !modalVisible, record});
    }

    expandedRowRender() {
        const columns = [
            {
                title: '编号',
                dataIndex: '_id',
                key: '_id'
            },
            {
                title: '权限名',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '标识',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action',
                render: (text, doc) => {
                    if (doc.name === 'admin' || !this.userRoleAuth('roleMenus', 'settings')) {
                        return '--'
                    }
                    return (
                        <button className='link-button' onClick={() => this.removeMenu(doc)}>删除</button>
                    )
                }
            },

        ];
        let {subData} = this.state;
        if (!subData || !subData.list || !subData.list.length) {
            return null;
        }
        return (
            <Table
                columns={columns}
                dataSource={subData.list}
                pagination={false}
                size={'small'}
            />
        );
    };

    renderModal() {
        let {modalVisible, record} = this.state;
        if (!record) {
            return null;
        }
        let self = this;
        return (
            <div>
                <Modal
                    title='新增权限'
                    visible={modalVisible}
                    maskClosable={false}
                    wrapClassName="vertical-center-modal"
                    width={500}
                    okText="Save"
                    onOk={() => self.createMenus()}
                    onCancel={() => self.openOrCloseModal(modalVisible, null)}
                >
                    <div style={{fontSize: 12}}>
                        <div>
                            权限组: <Input style={{fontSize: 12}} id='group' placeholder='权限名称' value={record.desc}
                                        disabled/>
                        </div>
                        <div style={{marginTop: 10}}>
                            权限名称: <Input style={{fontSize: 12}} id='desc' placeholder='权限名称'/>
                        </div>
                        <div style={{marginTop: 10}}>
                            权限标识: <Input style={{fontSize: 12}} id='name' placeholder='权限标识(只支持英文关键字)'/>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

    render() {
        if (!this.userRoleAuth('roleMenus', 'settings')) {
            return this.noAccessAuth();
        }
        const self = this;
        let {data, loading, expandedRowKeys, modalVisible} = self.state;
        const columns = [
            {
                title: '编号',
                dataIndex: '_id',
                key: '_id'
            },
            {
                title: '权限组名称',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '标识',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action',
                render: (tx, doc) => {
                    if (doc.name === 'admin' || !this.userRoleAuth('roleMenus', 'settings')) {
                        return '--'
                    }
                    return (
                        <button className='link-button'
                                onClick={() => this.openOrCloseModal(modalVisible, doc)}>添加子权限</button>
                    )
                }
            }

        ];

        return (
            <div>
                {this.renderPage({
                    loading,
                    rowSelection: false,
                    columns,
                    a_pagination: false,
                    expandedRowRender: this.expandedRowRender,
                    onExpand: this.onExpand,
                    expandedRowKeys,
                    exportExcel: false
                }, data)}
                {this.renderModal()}
            </div>
        );
    }

}