export const CXP_MENUS = [
    {
        icon: 'home',
        name: 'HOME',
        route: '',
        role: ''
    },
    {
        icon: 'interation',
        name: '交易所管理',
        role: 'exchange',
        children: [
            {
                name: '交易所信息管理',
                route: 'exchange/info',
                role: 'exchanges'
            },
            {
                name: '交易所费率管理',
                route: 'exchangeList',
                role: 'exchanges'
            }
        ]
    },
    {
        icon: 'dollar',
        name: '交易管理',
        route: 'mail',
        role: 'mail',
        children: [
            {
                name: '交易币种管理',
                route: 'stylister',
                role: 'stylister',
            },

            {
                name: '交易对管理',
                route: 'upload',
                role: 'upload',
            }

        ]
    },
    {
        icon: 'team',
        name: '用户管理',
        route: 'user',
        role: 'users',
        children: [
            {
                name: '用户信息查询',
                route: 'user',
                role: 'user'
            },
            {
                name: '冻结用户',
                route: 'user',
                role: 'user'
            }
        ]
    },

    {
        icon: 'setting',
        name: '系统设置',
        route: 'settings',
        role: 'settings',
        children: [
            {
                name: '管理员设置',
                route: 'settings',
                role: 'settings'
            },
            {
                name: '交易所账号设置',
                route: 'settings',
                role: 'settings'
            },
            {
                name: '操作日志查询',
                route: 'settings',
                role: 'settings'
            }
        ]
    }
];