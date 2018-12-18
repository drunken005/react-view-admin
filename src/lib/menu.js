export const CXP_MENUS = [
    {
        icon: 'home',
        name: '主页',
        role: 'all',
        route: '',
    },
    {
        icon: 'setting',
        name: '系统设置',
        role: 'settings',
        children: [
            {
                name: '账号管理',
                route: 'settings/account',
                role: 'account'
            },
            {
                name: '角色&权限',
                route: 'settings/role',
                role: 'role'
            },
            {
                name: '操作日志',
                route: 'settings/oplog',
                role: 'oplog'
            }
        ]
    }
];