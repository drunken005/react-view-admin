import '../stylesheet/table.css';
import React from 'react';
import {Component} from 'react';
import {Table, Pagination, Button, Icon} from 'antd';
import {Notification} from './antd_extension';
import _ from 'lodash';
// import random from 'randomstring';
import {CONSTANTS} from '../lib/constant';
import {RestfulApis} from '../lib/apis';

// import TableExport from 'tableexport';

class BaseComponent extends Component {
    constructor(props, options) {
        super(props);
        this.state = {
            data: {},
            query: {},
            option: {page: 1, pageSize: 20},
            loading: true
        };
    }

    bindCtx(...nameList) {
        if (_.isArray(nameList[0])) {
            nameList = nameList[0];
        }
        nameList.forEach(name =>
            this[name] = this[name].bind(this)
        );
    }

    loginOut() {
        localStorage.clear();
        this.props.history.push('/login');
    }

    reqwest(path, data, cb) {
        RestfulApis.reqwest(path, data, (err, res) => {
            if (err && err.statusCode === 10104) {
                Notification.error(err.msg);
                this.loginOut();
            } else {
                cb(err, res);
            }
        });
    }

    onPageChange(page, pageSize) {
        let option = {page, pageSize};
        this.setState({option});
    }

    renderOperates(operates) {
        return operates && operates.length ? operates.map(({name, icon, loading, fn}, index) => {
            return (
                <Button className='btn-operate' type="primary" key={`btn${index}`} onClick={fn} loading={loading}>
                    {icon ? <Icon type={icon}/> : null}{name}
                </Button>
            )
        }) : null
    }

    renderList(tableOption, data, operates) {
        let {option} = this.state;
        let newTableOption = _.assign({}, CONSTANTS.TABLE_CONFIG, tableOption);
        let {exportExcel, a_pagination, Title} = newTableOption; // Title 表格的标题，title 已经被内置占用
        !newTableOption.rowSelection && delete newTableOption.rowSelection;
        // let btn = random.generate(5);
        return (
            <div>
                {
                    Title ? <h2 style={{marginTop: 50}}>{Title}</h2> : null
                }
                {
                    exportExcel && <div className="operate-div">
                        {this.renderOperates(operates)}
                        {/*<Button id={btn} name="export-csv" className="ant-btn-export"*/}
                        {/*onClick={()=> {*/}
                        {/*this.exportExcel('csv', btn)*/}
                        {/*}}>*/}
                        {/*<Icon type="download"/>Export*/}
                        {/*</Button>*/}
                    </div>
                }
                <Table className="cxp_table" {...newTableOption}
                       dataSource={data && data.list ? data.list : []}/>
                {
                    a_pagination && <Pagination showQuickJumper
                                                onShowSizeChange={this.onShowSizeChange}
                                                current={option && option.page ? option.page : 0}
                                                pageSize={option && option.pageSize ? option.pageSize : (data ? data.total : 0)}
                                                showSizeChanger={true}
                                                onChange={this.onPageChange}
                                                defaultCurrent={1}
                                                pageSizeOptions={['10', '20', '30', '50', '100', '150', '200']}
                                                total={data ? data.total : 0}
                                                style={{marginTop: 10, fontSize: 12}}
                                                showTotal={(total) => (`总 ${total} 条`)}
                    />
                }

            </div>
        )
    }

}

export default BaseComponent;