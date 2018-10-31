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
        rowSelection: {type: 'checkbox'},
        exportExcel: true,
        a_pagination: true
    }
};