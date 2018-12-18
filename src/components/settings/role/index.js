import React from 'react';
import BaseComponent from '../../BaseComponent';
import {Tabs} from 'antd';

import Role from './role';
import Menu from './menu';

const TabPane = Tabs.TabPane;
export default class Stylist extends BaseComponent {
    constructor (props) {
        super(props);
        this.state = {};
        this.bindCtx('changeTabs')
    }

    changeTabs (activeKey) {
        this.setState({activeKey});
    }
    render () {
        if(!this.userRoleAuth('role','settings')){
            return this.noAccessAuth();
        }
        let {activeKey} = this.state;
        return (
            <div>
                <Tabs defaultActiveKey="willMatch" onChange={this.changeTabs}>
                    <TabPane tab={<span>账号角色</span>} key="willMatch">
                        <Role activeKey={activeKey} currentKey="willMatch"  {...this.props} />
                    </TabPane>
                    <TabPane tab={<span>菜单与权限</span>} key="abnormal">
                        <Menu activeKey={activeKey} currentKey="willMatch"  {...this.props} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}