import React from 'react';
import BaseComponent from '../../../BaseComponent';
import {Notification} from '../../../antd_extension';
import {Modal, Checkbox, Button} from 'antd';
import _ from 'lodash';
import './index.css';

const confirm = Modal.confirm;

const CheckboxGroup = Checkbox.Group;

export default class SettingsRoleMenuForm extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            disabled: true,
            roles: []
        };
        this.bindCtx('handleCancel', 'toggleDisable', 'onChange')
    }


    loadData() {
        if (!this.userRoleAuth('roleSettings', 'settings')) {
            return;
        }
        let self = this;
        let {_id} = this.props.match.params;
        if (!_id || _id === 'new') {
            return;
        }
        self.reqwest(`role/${_id}`, {}, (err, data) => {
            if (data) {
                self.setState({data, roles: data.roles || []});
            }
        })
    }


    componentDidMount() {
        this.loadData();
    }

    componentWillUpdate(nextProps, nextState) {

    }

    onChange(checkedValues) {
        this.setState({roles: checkedValues})

    }


    handleCancel(e) {
        e.preventDefault();
        this.props.history.push('/settings/role');
    };

    toggleDisable(disabled) {
        if (!this.userRoleAuth('roleSettings', 'settings')) {
            return Notification.error('No access permission');
        }
        let {roles, data} = this.state;
        let self = this;
        if (disabled) {
            self.setState({disabled: !disabled});
        } else {
            if (!_.difference(roles, data.roles).length && roles.length === data.roles.length) {

                return Notification.error('数据没有发生更改');
            }
            let modifier = {$set: {roles}};
            confirm({
                title: '确定提交更改吗?',
                onOk() {
                    self.reqwest(`role/${data._id}`, {method: 'put', data: {modifier}}, (err, res) => {
                        if (err) {
                            console.log(err);
                            return Notification.error(err.msg);
                        }
                        Notification.success(`更新权限成功!`);
                        self.loadData();
                        self.setState({disabled: !disabled});
                    });
                },
                onCancel() {
                }
            });

        }
    }

    render() {
        if (!this.userRoleAuth('roleSettings', 'settings')) {
            return this.noAccessAuth();
        }
        let {data, disabled, roles} = this.state;
        if (!data || !data.name) {
            return null;
        }
        return (
            <div>
                <h3>{data.name} 权限配置</h3>

                {
                    data.menus.map((menu) => {
                        return (
                            <div className='cxp_roles' key={menu._id}>
                                <div style={{fontSize: 13}}>{menu.desc}</div>
                                <CheckboxGroup disabled={disabled} style={{fontSize: 12}} options={menu.sub_menus}
                                               value={roles}
                                               onChange={this.onChange}
                                />
                            </div>
                        )
                    })
                }

                <div className='cxp_roles'>
                    <Button type="primary" onClick={() => {
                        this.toggleDisable(disabled)
                    }}>
                        {disabled ? '编辑' : '保存'}
                    </Button>

                    <Button style={{marginLeft: '10px'}} type="primary" onClick={this.handleCancel}>
                        返回
                    </Button>

                </div>
            </div>
        );
    }
}



