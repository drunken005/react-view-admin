import React from 'react';
import {
    Form,
    Input,
    Select,
    InputNumber,
    DatePicker,
    Checkbox,
    Radio,
    Button,
    Card,
    Cascader
} from 'antd';
import _ from 'lodash';
import './index.css';

const FormItem = Form.Item,
    Option = Select.Option,
    CheckboxGroup = Checkbox.Group,
    RadioGroup = Radio.Group,
    RadioButton = Radio.Button;

const PublicForm = Form.create({
    onFieldsChange(props, changedFields) {
        let {dataSource} = props;
        let obj = {}, changedField = {};
        _.each(changedFields, ({value}, key)=> {
            obj[key] = value;
            changedField = {key, value};
        });

        dataSource = _.assign(dataSource, obj);
        _.each(dataSource, (v, k)=> {
            if (_.includes(['', null, [], undefined], v)) {
                delete dataSource[k];
            }
            if (_.isArray(v) && !v.length) {
                delete dataSource[k];
            }
        });

        props.onChange(dataSource, changedField);
    },
    mapPropsToFields(props) {
        let {dataSource = {}, fields} = props;
        let obj = {};
        _.each(fields, (v, key)=> {
            obj[key] = Form.createFormField({
                ...fields[key],
                value:  dataSource[key]
            });
        });
        return obj;
    },
    onValuesChange(_, values) {
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    let {fields, title, dataSource = {}, commit, handleSubmit, handleCancel} = props;
    return (
        <div className="uni-form">
            <Card title={title} bordered={false} style={{width: '100%', border: '1px #ececec solid'}}>
                <div>
                    <Form layout="inline" onSubmit={props.handleSubmit}>
                        {
                            _.map(fields,
                                ({label, type, required, mode, options, showTime, disabled, radioButton, deprecated, placeholder},
                                    key)=> {
                                    if (deprecated) {
                                        return;
                                    }
                                    showTime = showTime ? {format: 'HH:mm'} : false;

                                    let _validateStatus = 'success';

                                    if (required && !dataSource[key] && commit) {
                                        _validateStatus = 'error'
                                    }
                                    let _label = required ? '* ' + label : label;

                                    let _validateHelp = _validateStatus === 'error' ? `${label} is required` : '';
                                    switch (type) {
                                        case 'input':
                                            return (
                                                <FormItem label={_label}
                                                    validateStatus={_validateStatus} help={_validateHelp}
                                                    key={key + '_forItem'}>
                                                    {getFieldDecorator(key)(<Input disabled={disabled}
                                                        placeholder={placeholder || `Input ${label}`}/>)}
                                                </FormItem>
                                            );
                                        case 'select':
                                            let children = options.map(({value, label}, index)=><Option value={value}
                                                key={`${key}_ft_${value}${index}`}> {label}</Option>);
                                            if (!mode) {
                                                children = [<Option key={`${key}_ft_`} value=''> </Option>, ...children]
                                            }
                                            return (
                                                <FormItem label={_label} key={key + '_forItem'}
                                                    validateStatus={_validateStatus}
                                                    help={_validateHelp}>
                                                    {getFieldDecorator(key)(
                                                        <Select mode={mode} allowClear disabled={disabled}
                                                            key={`select_${key}`}
                                                            placeholder={placeholder || `Select ${label}${mode ? ' (multi)' : ''}`}>
                                                            {children}
                                                        </Select>)
                                                    }
                                                </FormItem>
                                            );
                                        case 'number':
                                            return (
                                                <FormItem label={_label} key={key + '_forItem'}
                                                    validateStatus={_validateStatus}
                                                    help={_validateHelp}>
                                                    {getFieldDecorator(key)(<InputNumber disabled={disabled}
                                                        placeholder={placeholder || `Input ${label}`}
                                                        style={{width: '100%'}}/>)}
                                                </FormItem>
                                            );
                                        case 'date':
                                            return (
                                                <FormItem label={_label} key={key + '_forItem'}
                                                    validateStatus={_validateStatus}
                                                    help={_validateHelp}>
                                                    {getFieldDecorator(key)(
                                                        <DatePicker
                                                            disabled={disabled}
                                                            showTime={showTime}
                                                            style={{width: '100%'}}
                                                            placeholder={placeholder || `Select ${label}`}
                                                            format={showTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'}/>)}
                                                </FormItem>
                                            );
                                        case 'checkboxes':
                                            return (
                                                <FormItem label={_label} key={key + '_forItem'}
                                                    validateStatus={_validateStatus}
                                                    help={_validateHelp}>
                                                    {getFieldDecorator(key)(<CheckboxGroup disabled={disabled}
                                                        options={options}/>)}
                                                </FormItem>
                                            );
                                        case 'radio':
                                            return (
                                                <FormItem label={_label} key={key + '_forItem'}
                                                    validateStatus={_validateStatus}
                                                    help={_validateHelp}>
                                                    {getFieldDecorator(key)(<RadioGroup
                                                        disabled={disabled}>
                                                        {options.map(({value, label, disabled}, index)=> {
                                                            return radioButton ?
                                                                   <RadioButton disabled={disabled}
                                                                       key={`rd${key + index}`}
                                                                       value={value}>
                                                                       {label}
                                                                   </RadioButton> :
                                                                   <Radio disabled={disabled} key={`rd${key + index}`}
                                                                       value={value}>
                                                                       {label}
                                                                   </Radio>;
                                                        })}
                                                    </RadioGroup>)}
                                                </FormItem>
                                            );
                                        case 'cascader':
                                            return (
                                                <FormItem label={_label} key={key + '_forItem'}
                                                    validateStatus={_validateStatus}
                                                    help={_validateHelp}>
                                                    {getFieldDecorator(key)(
                                                        <Cascader
                                                            options={options}
                                                            placeholder={placeholder || `Select ${label}`}
                                                            showSearch
                                                        />
                                                    )}
                                                </FormItem>
                                            );
                                        default:
                                            return ''
                                    }
                                })
                        }
                        <div className="form-button">
                            {
                                handleSubmit &&
                                _.isFunction(handleSubmit) &&
                                <Button type="primary" className='btn-operate' htmlType="submit">
                                    Save
                                </Button>
                            }

                            {
                                handleCancel &&
                                _.isFunction(handleCancel) &&
                                <Button type="primary" className='btn-operate' onClick={handleCancel}>
                                    Return
                                </Button>
                            }
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
});

export default PublicForm;