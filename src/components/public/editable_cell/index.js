import React from 'react';
import BaseComponent  from '../../BaseComponent'
import _ from 'lodash';
import {Input, Icon, Select, message} from 'antd';
import './index.css'
const Option = Select.Option;

export default class EditableCell extends BaseComponent {
    constructor (props) {
        super(props);
        this.state = {
            value: this.props.value,
            editable: false,
            data: props.data
        };
    }

    handleChange = (event) => {
        event.preventDefault();
        let value = event.target.value.trim();

        var data = _.assign({}, this.state.data, {[event.target.id]: value});
        if (!value) {
            delete data[event.target.id];
        }
        this.setState({data});
    };
    check = () => {
        let {data} = this.state;
        let {settings, extra, cellEditChange} = this.props;

        let nullFields = [];

        settings.forEach(({key, type, require, label})=> {
            if (require && (!data || !data[key])) {
                type === 'input_text' && document.getElementById(key).focus();
                nullFields.push(label + '不能为空!');
            }
        });

        if (nullFields.length) {
            return message.error(nullFields.join(' '));
        }

        this.setState({editable: false});
        cellEditChange(_.omit(extra, 'placeholder'), data);
    };
    edit = () => {
        this.setState({editable: true});
    };

    selectChange = (value, key)=> {
        let data = _.assign({}, this.state.data, {[key]: value});
        if (!value) {
            delete data[key];
        }
        this.setState({data});
    };

    renderForm (settings, editable, data) {
        let that = this;
        if (!settings || !settings.length) {
            return null
        }
        return settings.map(({label, key, options, type}, index)=> {
            switch (type) {
                case 'input_text':
                    return (
                        <Input value={data ? data[key] : ''} defaultValue={data ? data[key] : ''} id={key}
                            style={{width: '40%'}} key={key + index}
                            onChange={this.handleChange}
                            onPressEnter={this.check}
                            placeholder={`填写${label}`}
                        />
                    );
                case 'select':
                    return (
                        <Select allowClear style={{width: '40%'}} key={key + index + 'se'} id={key}
                            defaultValue={data ? data[key] : ''}
                            placeholder={`选择${label}`}
                            onChange={(value)=> {
                                that.selectChange(value, key)
                            }}>
                            <Option value=""> </Option>
                            {
                                options.map(({value, label}, o_index)=> {
                                    return (
                                        <Option value={value} key={value + index + o_index}>
                                            {label}
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    );
                default:
                    return (
                        <Input value={data[key]} id={key}
                            onChange={this.handleChange}
                            onPressEnter={this.check}
                            placeholder={`填写${label}`}
                        />
                    );
            }
        })

    }

    render () {
        const {editable, data} = this.state;
        let {settings, extra} = this.props;
        let values = [];
        if (data) {
            values = _.map(settings, ({type, key, options})=> {
                if (type === 'select') {
                    let obj = _.find(options, {value: data[key]});
                    return obj ? obj.label : '';
                }
                return data[key]
            });
        }
        values = _.compact(values);
        let value = values && values.length ? values.join(' ') : `填写${extra.placeholder}`;
        return (
            <div className="editable-cell">
                {
                    editable ?
                    <div className="editable-cell-input-wrapper">
                        {this.renderForm(settings, editable, data)}
                        <Icon
                            type="check-circle"
                            className="editable-cell-icon-check"
                            onClick={this.check}
                        />
                    </div>
                        :
                    <div className="editable-cell-text-wrapper">
                        {
                            <a onClick={this.edit}>{value}</a>
                        }
                    </div>
                }
            </div>
        );
    }
}
