import React from 'react';

import {notification,message,Icon}  from 'antd';

const color = '#ecf6fd';

const TYPE_BACKGROUND = {
    'success': {
        background: '#27ae60',
        icon: 'check-circle-o'

    },
    'error': {
        background: '#e74c3c',
        icon: 'close-circle-o'
    },
    'info': {
        background: '#00a2d3',
        icon: 'info-circle-o'
    },
    'warning': {
        background: '#f1c40f',
        icon: 'exclamation-circle-o'
    },
};

let config = (type, description, message, placement, duration)=> {
    return {
        message: <div style={{color}}>{message}</div>,
        description: <div style={{color}}>{description}</div>,
        placement,
        style: {background: TYPE_BACKGROUND[type]['background']},
        duration,
        icon: <Icon type={TYPE_BACKGROUND[type]['icon']} style={{color}}/>
    }
};

let Notification = {
    success(description, message = '处理提示!', placement = 'topRight', duration = 4.5){
        notification.success(config('success', description, message, placement, duration))
    },
    error(description, message = '错误提示!', placement = 'topRight', duration = 4.5){
        notification.success(config('error', description, message, placement, duration))
    },
    info(description, message = '消息提示!', placement = 'topRight', duration = 4.5){
        notification.success(config('info', description, message, placement, duration))
    },
    warning(description, message = '警告提示!', placement = 'topRight', duration = 4.5){
        notification.success(config('warning', description, message, placement, duration))
    }
};

export  {
    message,
    notification,
    Notification
}
