import './index.css';
import React from 'react';
import BaseComponent from '../BaseComponent';
import {Form, Input, Button, Row, Col, Icon, message, Modal} from 'antd';
import {UserApis} from '../../lib/apis';
import _ from 'lodash';
import logo from '../../public/images/logo-big.png'

const FormItem = Form.Item;

class Login extends BaseComponent {
    constructor(props, options) {
        super(props);
    }

    render() {
        const WrappedNormalLoginForm = Form.create()(LoginForm);
        return <WrappedNormalLoginForm history={this.props.history}/>
    }
}

class LoginForm extends BaseComponent {
    constructor(props, options) {
        super(props);
        this.state = {loading: false, modalVisible: false};
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let self = this;
        self.props.form.validateFields((err, values) => {
            if (!err) {
                let password = {digest: UserApis.signature(values.password)};
                self.login(values.username, password);
            }
        });
    };


    resetPassword() {
        let newpwd = document.getElementById('newpwd').value;
        let confirmpwd = document.getElementById('confirmpwd').value;
        newpwd = _.trim(newpwd);
        confirmpwd = _.trim(confirmpwd);
        if (!newpwd) {
            return message.error('未输入任何密码');
        }
        if (!confirmpwd) {
            return message.error('请再次输入密码');
        }
        if (newpwd !== confirmpwd) {
            return message.error('两次密码不一致');
        }
        if (confirmpwd.length < 8) {
            return message.error('密码必须超过8个字符');
        }
        if ((/^\d+(\d+)?$/.test(confirmpwd) || /^[a-zA-Z]+$/.test(confirmpwd))) {
            return message.error('密码必须是数字,字母,符号的组合');
        }

        let password = {digest: UserApis.signature(confirmpwd)};
        this.reqwest('user/updpwd', {method: 'post', data: {password}}, (err, res) => {
            this.setState({loading: false});
            if (err) {
                return message.error(err.msg);
            }
            message.success('重置密码成功,请重新登录!');
            this.openOrCloseModal(true);
        });

    }

    login(username, password) {
        this.setState({loading: true});
        this.reqwest('user/login', {method: 'post', data: {username, password}, auth: false}, (err, res) => {
            this.setState({loading: false});
            if (err) {
                return message.error(err.msg);
            }
            if (res && res.firstLogin) {
                return this.openOrCloseModal(false)
            }
            UserApis.loginStorage(res);
            this.props.history.push('/');
        });
    }

    openOrCloseModal(modalVisible) {
        this.setState({modalVisible: !modalVisible})
    }


    resetPasswordModal() {
        let {modalVisible} = this.state;
        let self = this;
        return (
            <Modal
                title='First login. Please reset new password.'
                visible={modalVisible}
                maskClosable={false}
                centered={true}
                closable={false}
                destroyOnClose={true}
                wrapClassName="vertical-center-modal"
                width={500}
                okText="Reset"
                onCancel={() => message.error('首次登陆，请修改密码')}
                onOk={() => self.resetPassword()}
            >
                <div>
                    <div>
                        New password: <Input id='newpwd' type='password' placeholder='Enter new password'/>
                    </div>
                    <div style={{marginTop: 10}}>
                        Confirm password <Input id='confirmpwd' type='password'
                                                placeholder='Enter confirm password'/>
                    </div>
                </div>
            </Modal>
        )
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Row className="login-row" type="flex" justify="space-around" align="middle">
                <Col span="8">
                    <Form layout="horizontal" onSubmit={this.handleSubmit} className="login-form">
                        <div className="logo">
                            <img src={logo} alt='logo' style={{width: 310, height: 120}}/>
                        </div>


                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                       placeholder="Password"/>
                            )}
                        </FormItem>
                        <p>
                            <Button className="btn-login" type='primary' size="large"
                                    loading={this.state.loading} htmlType='submit'>LOGIN</Button>
                        </p>
                        <div className="forget-password">
                            <button type='button' onClick={() => message.info('请联系COINXP系统管理员')}
                                    className="floatRight link-button">Forgot password?
                            </button>
                        </div>
                    </Form>
                    {this.resetPasswordModal()}
                </Col>
            </Row>
        );
    }
}

export default Login;