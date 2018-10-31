import Raact from 'react';
import {Table} from 'antd';
import BaseComponent from '../../BaseComponent';

export default class UniTable extends BaseComponent {
    constructor (props) {
        super(props);
    }

    renderBody () {
        return (
            <div>
                <Table {...tableOption} columns={columns} loading={loading}
                    dataSource={data && data.list ? data.list : []}/>
                <Pagination showQuickJumper
                    onShowSizeChange={onShowSizeChange}
                    pageSize={pageSize}
                    onChange={this.onPageChange}
                    defaultCurrent={1}
                    total={data ? data.total : 0}
                    style={{marginTop: 10}}
                />
            </div>
        )
    }

    render () {
        return (this.renderBody())
    }

}