import React from 'react';
import _ from 'lodash';
import {Input, Select, DatePicker, Button, Cascader,Switch} from 'antd';
import {DateApis} from '../../../lib/apis'
import DateRangePicker from './range_picker';
import './index.css';

const Option = Select.Option;

export default class Filter extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            search: {}
        };
        // this.bindCtx('changeFunc', 'dateRangePickerChange');
        this.changeFunc = this.changeFunc.bind(this);
        this.dateRangePickerChange = this.dateRangePickerChange.bind(this);
    }

    switchOnChange (value, key) {
        let search = _.assign({}, this.state.search, {[key]: value});
        this.setState({search: search});
        this.props.searchChange(search)
    }

    changeFunc (event) {
        event.preventDefault();
        let value = event.target.value.trim();

        var search = _.assign({}, this.state.search, {[event.target.id]: value});
        if (!value) {
            delete search[event.target.id];
        }
        this.setState({search: search});
        this.props.searchChange(search)
    }

    dateChangeFunc (date, dateString, key) {
        var search = _.assign({}, this.state.search, {[key]: dateString});
        if (!dateString) {
            delete search[key];
        }
        this.setState({search: search});
        this.props.searchChange(search)
    }

    selectChange (value, key) {
        let search = _.assign({}, this.state.search, {[key]: value});
        if (!value || !value.length) {
            delete search[key];
        }
        this.setState({search: search});
        this.props.searchChange(search)
    }

    dateRangePickerChange (data, key) {
        var search = _.assign({}, this.state.search, data);
        if (_.isEmpty(data[key])) {
            delete search[key];
        }
        this.setState({search: search});
        this.props.searchChange(search)
    }

    renderContent () {
        let {filters} = this.props;

        if (!filters || !filters.length) {
            return null;
        }
        let that = this;

        return filters.map(({label, type, options, key, format, placeholder, fn, defaultValue, color, defaultChecked}, index)=> {
            let dataFormat = format === 'time' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
            switch (type) {
                case 'input_text':
                    placeholder = placeholder || `Input ${label}`;
                    return (
                        <span className="search_span" key={key + index}>
                            <label>{label}</label>
                            <Input placeholder={placeholder} onBlur={that.changeFunc} id={key}/>
                        </span>
                    );
                case 'select':
                    return (
                        <span className="search_span" key={key + index}>
                             <label>{label}</label>
                             <Select allowClear defaultValue={defaultValue} placeholder={`Select ${label}`} onChange={(value)=> {
                                 that.selectChange(value, key)
                             }} id={key}>
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
                        </span>
                    );
                case 'select_multiple':
                    return (
                        <span className="search_span" key={key + index}>
                             <label style={{color: color}}>{label}</label>
                             <Select mode="multiple" allowClear defaultValue={[]} placeholder={`选择${label}(可多选)`}
                                 onChange={(value)=> {
                                     that.selectChange(value, key)
                                 }} id={key}>
                                 {

                                     options.map(({value, label})=> {
                                         return (
                                             <Option value={value} key={value}>
                                                 {label}
                                             </Option>
                                         )
                                     })
                                 }
                             </Select>
                        </span>
                    );

                case 'date':
                    return (
                        <span className="search_span" key={key + index}>
                             <label>{label}</label>
                             <DatePicker onChange={(date, dateString)=> {
                                 that.dateChangeFunc(date, dateString, key)
                             } } placeholder={`选择${label}`} locale={DateApis.locale}
                                 format={dataFormat} id={key}/>
                        </span>
                    );
                case 'textarea':
                    return (
                        <span className="search_span" key={key + index}>
                            <label>{label}</label>
                            <Input placeholder={`输入${label}多个可使用逗号或回车进行分割`} onBlur={that.changeFunc} type='textarea'
                                rows={1} id={key}/>
                        </span>
                    );
                case 'cascader':
                    return (
                        <span className="search_span" key={key + index}>
                             <label>{label}</label>
                           <Cascader options={options} placeholder={`选择${label}`} onChange={(value)=> {
                               that.selectChange(value, key)
                           }} changeOnSelect showSearch/>
                        </span>
                    );
                case 'button':
                    return (
                        <Button type="primary" size='small' key={key + index} onClick={()=>fn()}>{label}</Button>
                    );

                case 'dateRangePicker':
                    return (
                        <span className="search_span" key={key + index}>
                           <DateRangePicker filter={{label, type, options, key, format}}
                               onChange={that.dateRangePickerChange}/>
                        </span>
                    );
                case 'switch':
                    return (
                        <span className="search_span" key={key + index}>
                          <label>{label}</label><Switch defaultChecked={(defaultChecked === undefined || defaultChecked == null) ? true : defaultChecked}
                              // checkedChildren={`${label}`}
                              // unCheckedChildren={`${label}`}
                              onChange={(value)=> {
                                  that.switchOnChange(value, key)
                              }}
                          />
                        </span>
                    );

                default:
                    return (
                        <span className="search_span" key={key + index}>
                            <label>{label}</label>
                            <Input placeholder={`输入${label}`} onBlur={that.changeFunc} id={key}/>
                        </span>
                    );
            }
        })
    }

    render () {
        return (
            <div>
                {this.renderContent()}
            </div>);
    }
}