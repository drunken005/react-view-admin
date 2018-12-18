import './index.css';
import logo from '../../public/images/logo-o.png';
import React from 'react';
import BaseComponent from '../BaseComponent';
import {Layout, Menu, Icon, Breadcrumb, Dropdown, message} from 'antd';
import {Link, Redirect} from 'react-router-dom';
import {UserApis, RoleApi} from '../../lib/apis';
import {CXP_MENUS} from '../../lib/menu';

const {Header, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class App extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            refreshMenu: false,
            mode: 'inline',
            selectMenu: ['HOME'],
            loginOut: false
        };

        this.bindCtx('onCollapse', 'handleClick', 'toggle', 'onSelect', 'loginOut');
    }

    componentWillMount() {
    }

    signOut() {
        let {_id} = UserApis.userProfile();
        this.reqwest(`user/loginout`, {method: 'post', data: {userId: _id}}, (err, data) => {
            if (err) {
                return message.error(err.msg);
            }
            if (data) {
                localStorage.clear();
                this.setState({loginOut: true});
            }
        });
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

    onSelect(select) {
        let keys = select.key.split('_');
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
        let {username, name} = UserApis.userProfile();
        const menu = (
            <Menu>
                <Menu.Item>
                    <div>Signed in as <b>{username}</b></div>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item onClick={() => {
                    this.signOut()
                }}>
                    <span>退出登录</span>
                </Menu.Item>
            </Menu>
        );
        return (
            <Layout>
                <Header>
                    <div className='header-a'><img src={logo} alt='logo'/></div>
                    <div className='header-b'>DEMO</div>

                    <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                        <span className="ant-dropdown-link"
                              style={{float: 'right', cursor: 'pointer'}}>{name || username} <Icon
                            type="down"/></span>
                    </Dropdown>
                    {/*<span style={{float: 'right'}}>{username}</span>*/}

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
                        <Menu theme="dark" mode={mode} inlineCollapsed={collapsed} defaultSelectedKeys={['0']}
                              onSelect={this.onSelect} onClick={this.handleClick}>
                            {
                                CXP_MENUS.map(({icon, name, route, role, children, auth}, index) => {

                                    if (!RoleApi.userRoleAuth(role, role) && role !== 'all') return "";

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
                                            <SubMenu key={index} title={
                                                <p className="sub-menu-p">
                                                    <Icon type={icon}/><span>{name}</span>
                                                </p>}>
                                                {
                                                    children.map((two_menu, two_index) => {
                                                        if (!RoleApi.userRoleAuth(two_menu.role, role)) return "";

                                                        if (two_menu.isGroup) {
                                                            return (
                                                                <MenuItemGroup key={index + '_' + two_index}
                                                                               title={two_menu.name}>
                                                                    {
                                                                        two_menu.children &&
                                                                        two_menu.children.length &&
                                                                        two_menu.children.map((three_menu, three_index) => {
                                                                            if (!auth) return "";

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
                                                                            if (!RoleApi.userRoleAuth(three_menu.role, role)) return "";

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
                        <div style={{background: '#ffff'}}>
                            {
                                selectMenu && selectMenu.length && selectMenu.indexOf('主页') < 0 ?
                                    <Breadcrumb className="cxp-breadcrumb">
                                        {
                                            selectMenu && selectMenu.length && selectMenu.map((item, index) => {
                                                return (<Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>)
                                            })
                                        }
                                    </Breadcrumb> : null
                            }

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
