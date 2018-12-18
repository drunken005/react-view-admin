import '../stylesheet/table.css';
import React from 'react';
import BaseComponent from './BaseComponent';
import Filter from './public/filter';
import {Table, Pagination, Button, Icon} from 'antd';
import _ from 'lodash';
import {CONSTANTS} from "../lib/constant";

export default class ListComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            condition: {},
            option: {page: 1, pageSize: 10},
            sort: {createdAt: -1},
            data: {},
            loading: false
        };
        this.bindCtx('handleTableChange', 'selectedRow', 'searchChange', 'onShowSizeChange', 'onPageChange')
    }

    //Table sort change
    handleTableChange(pagination, filters, sorter) {
        if (!_.isEmpty(sorter)) {
            this.setState({sort: {[sorter.field]: sorter.order === 'ascend' ? 1 : -1}})
        }
    }

    selectedRow(selectedRowKeys, selectedRows) {
        this.setState({selectedRowKeys, selectedRows});
    }

    searchChange(data) {
        let {pageSize} = this.state.option;
        this.setState({condition: data, option: {page: 1, pageSize}});
    }

    //Set page size
    onShowSizeChange(page, pageSize) {
        this.setState({option: {page, pageSize}})
    }

    //Pagination change onclick event
    onPageChange(page, pageSize) {
        let option = {page, pageSize};
        this.setState({option});
    }

    renderTitle(Title) {
        if (!Title) {
            return null;
        }
        return <h2 style={{marginTop: 10}}>{Title}</h2>;
    }

    renderOperates(exportExcel, operates) {
        operates = _.filter(operates, (op) => op.show);
        if (!exportExcel && !operates.length) {
            return null;
        }
        let operatesDiv = operates.map(({name, icon, loading, fn, show}, index) => {
            if (!show) {
                return null;
            }
            return (
                <Button className='btn-operate' type="primary" key={`btn${index}`} onClick={fn} loading={loading}>
                    {icon ? <Icon type={icon}/> : null}{name}
                </Button>
            )
        });
        return (
            <div className="operate-div">
                {operatesDiv}
                {/*<Button id={btn} name="export-csv" className="ant-btn-export"*/}
                {/*onClick={()=> {*/}
                {/*this.exportExcel('csv', btn)*/}
                {/*}}>*/}
                {/*<Icon type="download"/>Export*/}
                {/*</Button>*/}
            </div>
        )
    }

    renderPagination(pagination, total = 0) {
        let {option} = this.state;
        if (!pagination) {
            return null;
        }

        let options = {
            onShowSizeChange: this.onShowSizeChange,
            current: option && option.page ? option.page : 0,
            pageSize: option && option.pageSize ? option.pageSize : total,
            onChange: this.onPageChange,
            total: total,
        };

        let paginationOptions = _.assign({}, CONSTANTS.PAGINATION_CONFIG, options);

        return (
            <Pagination showQuickJumper {...paginationOptions}/>
        )


    }

    renderFilter(filters) {
        if (!filters || !filters.length) {
            return null;
        }
        return <Filter searchChange={this.searchChange} filters={filters}/>
    }

    renderTable(data, tableOption, operates) {
        let {selectedRowKeys} = this.state;
        let dataSource = data && data.list ? data.list : [];
        let newTableOption = _.assign({}, CONSTANTS.TABLE_CONFIG, tableOption, {dataSource});
        if (newTableOption.rowSelection) {
            newTableOption.rowSelection = {
                type: 'checkbox',
                onChange: this.selectedRow,
                selectedRowKeys
            }
        }
        !newTableOption.rowSelection && delete newTableOption.rowSelection;

        let total = data && data.total ? data.total : 0;
        return (
            <div>
                {this.renderTitle(newTableOption.Title)}
                {this.renderOperates(newTableOption.exportExcel, operates)}
                <Table className="cxp_table" onChange={this.handleTableChange} {...newTableOption}/>
                {this.renderPagination(newTableOption.a_pagination, total)}
            </div>
        )
    }


    /**
     * Render list and table page
     * @param tableOption Table options
     * @param data Table data
     * @param operates Operator buttons
     * @param filters Data filter keys
     * @returns {*}
     */
    renderPage(tableOption, data, operates = [], filters = []) {
        return (
            <div style={{paddingBottom:100}}>
                {
                    this.renderFilter(filters)
                }
                {
                    this.renderTable(data, tableOption, operates)
                }
            </div>
        )
    }
}