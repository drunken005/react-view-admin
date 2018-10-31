
import React from 'react';
import BaseComponent from '../../../BaseComponent'
import {DatePicker} from 'antd';
import {DateApis} from '../../../../lib/apis'
import _ from 'lodash';

export default class DateRangePicker extends BaseComponent {

    constructor (props) {
        super(props);
        let {key} = this.props.filter;
        this.state = {
            endOpen: false,
            [key]: {}
        };
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.end;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const startValue = this.state.start;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        let {key} = this.props.filter;
        let data = this.state[key];
        let select = _.assign(data, {[field]: value});

        _.each(select, (v, k)=> {
            if (!v) {
                delete select[k];
            }
        });

        this.setState({[key]: select});
        this.props.onChange({[key]: select}, key)
    };

    onStartChange = (value, dateString) => {
        this.onChange('start', dateString);
    };

    onEndChange = (value, dateString) => {
        this.onChange('end', dateString);
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    };

    render () {
        const {endOpen} = this.state;
        const {label, format} = this.props.filter;
        let dataFormat = format === 'time' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
        let showTime = format === 'time';
        return (
            <div>
                <label>{label}</label>
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime={showTime}
                    locale={DateApis.locale}
                    format={dataFormat}
                    placeholder="开始"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime={showTime}
                    format={dataFormat}
                    placeholder="结束"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                />
            </div>
        );
    }
}