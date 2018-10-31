import './index.css';
import React from 'react';
import BaseComponent from '../BaseComponent';
import {Form, Input, Button, Row, Col, Icon, message} from 'antd';
import {UserApis} from '../../lib/apis';

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
        this.state = {loading: false};
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let self = this;
        self.props.form.validateFields((err, values) => {
            if (!err) {
                self.login(values.username, values.password);
            }
        });
    };

    login(username, password) {
        this.setState({loading: true});
        console.log({username, password});
        this.reqwest('user/login', {method: 'post', data: {username, password}, auth: false}, (err, res)=> {
            this.setState({loading: false});
            if (err) {
                return message.error(err.msg);
            }
            UserApis.loginStorage(res);
            this.props.history.push('/');
        });
    }

    forgotPassword(){

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row className="login-row" type="flex" justify="space-around" align="middle">
                <Col span="8">
                    <Form layout="horizontal" onSubmit={this.handleSubmit} className="login-form">
                        <div className="logo">COINXP EXCHAGE MS</div>


                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}} />} placeholder="Username" />
                            )}
                        </FormItem>
                        <FormItem>

                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}} />} type="password" placeholder="Password" />
                            )}


                        </FormItem>
                        <p>
                            <Button className="btn-login" type='primary' size="large"
                                    loading={this.state.loading} htmlType='submit'>LOGIN</Button>
                        </p>
                        <div className="forget-password">
                            <a href="" onClick={this.forgotPassword} className="floatLeft">Forgot password?</a>
                            <a href="" onClick={this.forgotPassword} className="floatRight">First login?</a>
                        </div>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default Login;