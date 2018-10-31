import './index.css';
import React from 'react';
import BaseComponent from '../BaseComponent';
import {Layout, Menu, Icon, Breadcrumb} from 'antd';
import {Link, Redirect} from 'react-router-dom';
import {UserApis} from '../../lib/apis';
import {CXP_MENUS} from '../../lib/menu';

const {Header, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const formatMenu = ({_id, roles = []}) => {
    const doMenu = (mList = [], parent = {}) => {
        mList.forEach((menu) => {
            let limit = [];
            let {route = '', children} = menu;
            let role = route.replace(/\//g, '').toLowerCase();
            if (roles.includes(role) || !role || roles.includes('admin')) {
                parent.limit = limit = [_id];
            }

            menu.limit = limit;

            if (children) {
                return doMenu(children, menu);
            }
        });
    };

    return doMenu(CXP_MENUS);
};


class App extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            refreshMenu: false,
            mode: 'inline',
            login: false,
            selectMenu: ['HOME']
        };

        this.bindCtx('onCollapse', 'handleClick', 'toggle','onSelect');

    }


    componentWillMount() {
        let {_id} = UserApis.getItem('user');
        formatMenu({_id, roles: ['admin']});
    }


    onCollapse(collapsed) {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    }

    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
            mode: !this.state.collapsed ? 'vertical' : 'inline',
        });
    }

    handleClick(e) {
        this.setState({
            current: e.key
        });
    }

    onSelect ({key}) {
        let keys = key.split('_');
        let selectMenu = [];
        if (keys.length === 1) {
            selectMenu.push(CXP_MENUS[keys[0]].name);
        } else if (keys.length === 2) {
            selectMenu.push(CXP_MENUS[keys[0]].name);
            selectMenu.push(CXP_MENUS[keys[0]].children[keys[1]].name);
        } else if (keys.length === 3) {
            selectMenu.push(CXP_MENUS[keys[0]].name);
            selectMenu.push(CXP_MENUS[keys[0]].children[keys[1]].name);
            selectMenu.push(CXP_MENUS[keys[0]].children[keys[1]].children[keys[2]].name);
        }
        this.setState({selectMenu})
    };

    render() {
        if (!UserApis.fakeAuth()) {
            return (<Redirect to="/login"/>)
        }
        let {children} = this.props;
        let {collapsed, mode, selectMenu} = this.state;
        let {username} = UserApis.userProfile();
        let {_id} = UserApis.getItem('user');
        const isLimit = (limit = []) => !limit.includes(_id);
        return (
            <Layout>
                <Header>
                    <div className='header-a'>COINXP</div>
                    <div className='header-b'>EXCHANGE MS</div>
                    <span style={{float: 'right'}}>{username}</span>
                </Header>
                <Layout style={{height: '100%', width: '100%', position: 'fixed', top: 50, left: 0}}>
                    <Sider collapsed={collapsed} onCollapse={this.onCollapse}>
                        <div onClick={this.toggle} className='toggle'>
                            {
                                mode === 'inline' ?
                                    <Icon className="trigger uni-menu-trigger-full"
                                          type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
                                    :
                                    <Icon className="trigger uni-menu-trigger"
                                          type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
                            }
                        </div>
                        <Menu theme="dark" mode={mode} inlineCollapsed={collapsed}  defaultSelectedKeys={['0']} onSelect={this.onSelect} onClick={this.handleClick}>
                            {
                                CXP_MENUS.map(({icon, name, route, role, children, limit}, index) => {
                                    if (isLimit(limit)) return "";

                                    if (!children || !children.length) {
                                        return (
                                            <Menu.Item key={index}>
                                                <Link to={'/' + route}>
                                                    <p className="sub-menu-p">
                                                        <Icon type={icon}/>
                                                        <span className="nav-text">{name}</span>
                                                    </p>
                                                </Link>
                                            </Menu.Item>
                                        )
                                    } else {
                                        return (
                                            <SubMenu key={index}
                                                     title={<p className="sub-menu-p"><Icon
                                                         type={icon}/><span>{name}</span>
                                                     </p>}>
                                                {
                                                    children.map((two_menu, two_index) => {
                                                        if (isLimit(two_menu.limit)) return "";

                                                        if (two_menu.isGroup) {
                                                            return (
                                                                <MenuItemGroup key={index + '_' + two_index}
                                                                               title={two_menu.name}>
                                                                    {
                                                                        two_menu.children &&
                                                                        two_menu.children.length &&
                                                                        two_menu.children.map((three_menu, three_index) => {
                                                                            if (isLimit(three_menu.limit)) return "";

                                                                            return (
                                                                                <Menu.Item key={[
                                                                                    index, two_index, three_index
                                                                                ].join('_')}>
                                                                                    <Link
                                                                                        to={'/' + (three_menu.route || '')}
                                                                                        key={'group_link+' +
                                                                                        index +
                                                                                        two_index +
                                                                                        three_index}>
                                                                                        {three_menu.name}
                                                                                    </Link>
                                                                                </Menu.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </MenuItemGroup>
                                                            )
                                                        } else if (two_menu.children && two_menu.children.length) {
                                                            return (
                                                                <SubMenu key={index + '_' + two_index}
                                                                         title={two_menu.name}>
                                                                    {
                                                                        two_menu.children &&
                                                                        two_menu.children.length &&
                                                                        two_menu.children.map((three_menu, three_index) => {
                                                                            if (isLimit(three_menu.limit)) return "";

                                                                            return (
                                                                                <Menu.Item
                                                                                    key={[
                                                                                        index, two_index, three_index
                                                                                    ].join('_')}>
                                                                                    <Link
                                                                                        to={'/' + (three_menu.route || '')}
                                                                                        key={'three_link+' +
                                                                                        index +
                                                                                        two_index +
                                                                                        three_index}>
                                                                                        {three_menu.name}
                                                                                    </Link>
                                                                                </Menu.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </SubMenu>
                                                            )
                                                        } else {
                                                            return (
                                                                <Menu.Item key={index + '_' + two_index}>
                                                                    <Link to={'/' + (two_menu.route || '')}
                                                                          key={'link' + index + '' + two_index}>
                                                                        {two_menu.name}
                                                                    </Link>
                                                                </Menu.Item>
                                                            )
                                                        }
                                                    })
                                                }
                                            </SubMenu>
                                        )
                                    }
                                })
                            }
                        </Menu>
                    </Sider>
                    <Content className={collapsed ? 'vertical-content' : 'inline-content'}>
                        <div style={{background: '#ffff', height: '100%'}}>
                            <Breadcrumb className="cxp-breadcrumb">
                                {
                                    selectMenu && selectMenu.length && selectMenu.map((item, index)=> {
                                        return (<Breadcrumb.Item key={'b_i' + index}>{item}</Breadcrumb.Item>)
                                    })
                                }
                            </Breadcrumb>
                            <div style={{padding: 10}}>
                                {children}
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default App;
