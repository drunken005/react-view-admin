import _ from 'lodash';
import hash from 'hash.js';
import sha512 from 'hash.js/lib/hash/sha/512';
import crytoApi from '../crypto';
import {SETTINGS} from '../../settings';

export default {
    signature(str, algorithm = 'sha256') {
        if (!str) {
            return null;
        }
        if (algorithm === 'sha256') {
            return hash.sha256().update(str).digest('hex')
        }

        if (algorithm === 'sha512') {
            sha512().update(str).digest('hex');
        }
    },

    loginStorage(loginData) {
        if(!loginData){
            throw new Error('Login user info is null');
        }
        let user = crytoApi.encrypt(JSON.stringify(loginData), [SETTINGS.APP_KEY, loginData._id].join('__'));
        localStorage.setItem('COINXP.userId', loginData._id);
        localStorage.setItem('COINXP.user', user);
    },

    getItem(key) {
        if (!key) {
            console.error('key is undefined');
            return false;
        }
        let userId = localStorage.getItem('COINXP.userId');
        if (key === 'userId') {
            return userId;
        }
        let userEncrypt = localStorage.getItem('COINXP.user');
        if (!userEncrypt) {
            return null;
        }

        let user = crytoApi.decrypt(userEncrypt, [SETTINGS.APP_KEY, userId].join('__'));
        user = JSON.parse(user);
        return user[key];
    },

    fakeAuth() {
        let tokenExpires = this.getItem('tokenExpires') || '';
        tokenExpires = tokenExpires.replace(/-/g, '/').replace(/\.\d+$/, '');
        return this.getItem('userId') &&
            new Date(tokenExpires) >
            new Date();
    },

    userProfile(obj) {
        let userId = localStorage.getItem('COINXP.userId');
        let userEncrypt = localStorage.getItem('COINXP.user');
        if (!userId || !userEncrypt) {
            return null;
        }
        let user = obj || JSON.parse(crytoApi.decrypt(userEncrypt, [SETTINGS.APP_KEY, userId].join('__')));
        if (!user) {
            return null;
        }
        return user;
    },

    userWechatAvatar(user) {
        if (!user || !user.services) {
            return null;
        }
        let {services} = user;
        return services.wechat.headimgurl;
    },

    userRealName(user) {

    },

    userField(user, filed, shortAddress) {
        if (!user) {
            return null
        }
        let {realName, shipAddress, profile, mobile} = user;

        if (filed === 'wechatName') {
            if (profile && profile.wechatNickname) {
                return profile.wechatNickname
            }
            return "";
        }

        let getAddress = (shipAddress) => {
            if (!shipAddress || !shipAddress.length) {
                return null;
            }
            let address = _.find(shipAddress, {defaultAddress: true});

            return address || shipAddress[0];
        };

        let address = getAddress(shipAddress);

        if (filed === 'realName') {
            if (realName) {
                return user.realName;
            }
            return address ? address.name : null
        }
        if (filed === 'address') {
            // console.log(filed,address);
            if (!address) {
                return null;
            }

            let {province, city, name, detail, county, phone} = address;
            if (shortAddress) {
                return [province, city, county, detail].join(' ')
            }
            return _.assign(address, {full: [province, city, county, detail, name, phone].join(' ')})
        }

        if (filed === 'mobile') {
            if (mobile) {
                return mobile;
            }
            if (!address) {
                return null;
            }
            let {phone} = address;
            return phone;
        }
        return null;
    },

    formatAddress(address, noSpace, shortAddress,) {
        if (!address || _.isEmpty(address)) {
            return ''
        }
        let {province, city, county, detail, name, phone} = address;
        if (noSpace) {
            if (shortAddress) {
                return [province, city, county, detail].join('')
            } else {
                return [province, city, county, detail, name, phone].join('')
            }
        } else {
            if (shortAddress) {
                return [province, city, county, detail].join(' ')
            } else {
                return [province, city, county, detail, name, phone].join(' ')
            }
        }
    },

    setRole(roles = '') {
        return sessionStorage.setItem('roles', JSON.stringify(roles));
    },

    ckRole(role = '') {
        const result = sessionStorage.getItem('roles');
        const {roles = []} = JSON.parse(result) || {};

        return roles.includes(role) || roles.includes('admin');
    }
}