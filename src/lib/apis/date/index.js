export default {
    locale: {
        "lang": {
            "placeholder": "选择日期",
            "rangePlaceholder": [
                "开始时间",
                "结束时间"
            ],
            "today": "今天",
            "now": "现在",
            "backToToday": "返回今天",
            "ok": "确定",
            "clear": "清除",
            "month": "月",
            "year": "年",
            "timeSelect": "选择时间",
            "dateSelect": "选择日期",
            "monthSelect": "选择月份",
            "yearSelect": "选择年",
            "decadeSelect": "选择十年",
            "yearFormat": "YYYY",
            "dateFormat": "M/D/YYYY",
            "dayFormat": "D",
            "dateTimeFormat": "M/D/YYYY HH:mm:ss",
            "monthFormat": "MMMM",
            "monthBeforeYear": true,
            "previousMonth": "上个月",
            "nextMonth": "下个月",
            "previousYear": "上一年",
            "nextYear": "下一年",
            "previousDecade": "过去十年",
            "nextDecade": "未来十年e",
            "previousCentury": "上世纪",
            "nextCentury": "下世纪"
        },
        "timePickerLocale": {
            "placeholder": "选择日期和时间"
        }
    },
    formatDuring: (mss, day)=> {
        var d = parseInt(mss / (1000 * 60 * 60 * 24), 10);
        var h = day ?
                parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 10) :
                parseInt(mss / (1000 * 60 * 60), 10);
        var m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60), 10);
        var s = parseInt((mss % (1000 * 60)) / 1000, 10);
        if (day) {
            return d + " 天 " + h + " 小时 " + m + " 分钟 " + s + " 秒 "
        }
        return [h < 10 ? '0' + h : h, m < 10 ? '0' + m : m, s < 10 ? '0' + s : s].join(' : ')
    }
}