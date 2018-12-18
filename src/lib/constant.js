export const CONSTANTS = {
    Regex: {
        URL: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
        // 可靠的中国大陆11位手机号正则表达式
        mobile: /^1[34578]\d{9}$/,
        //匹配html元素
        html_tag: /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/,
        //匹配单独尖括号的html元素
        html_part: /<(\/)?[a-z]+>/g,
        //匹配银行卡号
        bank: /^(\d+)$/
    },
    TABLE_CONFIG: {
        rowKey: "_id",
        bordered: true,
        loading: false,
        pagination: false,
        size: 'small',
        showHeader: true,
        rowSelection: true,
        exportExcel: true,
        a_pagination: true
    },

    PAGINATION_CONFIG: {
        owQuickJumper: true,
        showSizeChanger: true,
        defaultCurrent: 1,
        pageSizeOptions: ['10', '15', '20', '30', '50', '100', '150', '200'],
        style: {marginTop: 10, fontSize: 12},
        showTotal: (total) => (`Total ${total} `)
    },

    ACCOUNT_STATUS: {
        normal: '正常',
        disable: '禁用'
    },

    OPLOG_COLLECTION: {
        users: '系统账号'
    },
    OPLOG_ACIONS: {
        insert: '新增',
        update: "更新",
        remove: '删除',
        login: '登录'
    }
};