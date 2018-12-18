import ListComponent from '../../ListComponent';
import _ from 'lodash';
import {CONSTANTS} from '../../../lib/constant';


const filters = [

    {
        label: '处理对象',
        key: 'coll',
        type: 'select',
        options: _.map(CONSTANTS.OPLOG_COLLECTION, (v, k) => ({label: v, value: k}))
    },
    {
        label: '操作事件',
        key: 'action',
        type: 'select',
        options: _.map(CONSTANTS.OPLOG_ACIONS, (v, k) => ({label: v, value: k}))

    }
];

export default class OpLogs extends ListComponent {
    constructor(props) {
        super(props);
        this.state = {
            condition: {},
            option: {page: 1, pageSize: 10},
            sort: {createdAt: -1},
            data: {},
            loading: false
        };
    }

    loadData(props, state) {
        if (!this.userRoleAuth('account', 'settings')) {
            return;
        }
        let {option, condition, sort} = state;
        option.sort = sort;
        this.setState({loading: true});
        this.reqwest('oplog', {data: {condition, option}}, (err, res) => {
            this.setState({loading: false});
            if (err) {
                return console.log(err);
            }
            this.setState({data: res});
        })
    }

    componentDidMount() {
        let {props, state} = this;
        this.loadData(props, state)
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.condition !==
            nextState.condition ||
            this.state.option !==
            nextState.option ||
            this.state.sort !==
            nextState.sort) {
            this.loadData(nextProps, nextState)
        }
    }

    render() {
        if (!this.userRoleAuth('account', 'settings')) {
            return this.noAccessAuth();
        }
        let self = this;
        let {data, loading} = self.state;
        const columns = [
            {
                title: '处理对象',
                dataIndex: 'coll',
                sorter: true,
                key: 'coll',
                render: (text, doc) => {
                    return CONSTANTS.OPLOG_COLLECTION[text] || text;
                }
            },
            {
                title: '操作事件',
                dataIndex: 'action',
                key: 'action',
                sorter: true,
                render: (text, doc) => {
                    return CONSTANTS.OPLOG_ACIONS[text] || text;
                }
            },
            {
                title: '处理条件',
                dataIndex: 'condition',
                key: 'condition',
            },
            {
                title: '操作值',
                dataIndex: 'data',
                key: 'data',
                width: 300
            },
            {
                title: 'IP地址',
                dataIndex: 'ipAddress',
                key: 'ipAddress'
            },
            {
                title: 'HTTP请求路径',
                dataIndex: 'path',
                key: 'path',
                render: (text, {method, path}) => {
                    return [method, path].join('-');
                }
            },
            {
                title: '处理人',
                dataIndex: 'handler',
                key: 'handler',
                render: (text, doc) => {
                    let value = '';
                    if (doc.handler) {
                        let handler = doc.handler;
                        if (handler.name) {
                            value = handler.name;
                        } else if (handler._id) {
                            value = handler._id;
                        }
                    }
                    return value;
                }
            },
            {
                title: '日期',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: true
            },
        ];
        return this.renderPage({loading, columns, exportExcel: false}, data, [], filters)
    }
}