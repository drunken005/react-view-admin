
import _ from 'lodash';
import hash from 'hash.js';
import sha512  from 'hash.js/lib/hash/sha/512';

export default {
    singnature(str, algorithm = 'sha256'){
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
    
    loginStorage(loginData){
        let login = _.pick(loginData, ['id', 'token', 'tokenExpires', 'user']);
        _.each(login, (v, k)=> {
            if (k === 'user') {
                localStorage.setItem(['COINXP', k].join('.'), JSON.stringify(v));
            } else {
                localStorage.setItem(['COINXP', k].join('.'), v);
            }
        });
    },
    
    getItem(key){
        if (!key) {
            console.error('key is undefined');
            return false;
        }
        if (key === 'user') {
            return JSON.parse(localStorage.getItem('COINXP.user'))
        }
        return localStorage.getItem(['COINXP', key].join('.'));
        
    },
    
    fakeAuth(){
        let tokenExpires = localStorage.getItem('COINXP.tokenExpires') || '';
        tokenExpires = tokenExpires.replace(/-/g, '/').replace(/\.\d+$/, '');
        return localStorage.getItem('COINXP.token') &&
               localStorage.getItem('COINXP.id') &&
               new Date(tokenExpires) >
               new Date();
    },
    
    userProfile(obj){
        
        let user = obj || this.getItem('user');
        if (!user) {
            return null;
        }
        return user;
    },
    
    userWechatAvatar(user){
        if (!user || !user.services) {
            return null;
        }
        let {services} = user;
        return services.wechat.headimgurl;
    },
    
    userRealName(user){
        
    },
    
    userField(user, filed, shortAddress){
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
        
        let getAddress = (shipAddress)=> {
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
    
    formatAddress(address, noSpace, shortAddress,){
        if (!address || _.isEmpty(address)) {
            return ''
        }
        let {province, city, county, detail, name, phone} = address;
        if(noSpace){
            if(shortAddress){
                return [province, city, county, detail].join('')
            }else{
                return [province, city, county, detail, name, phone].join('')
            }
        }else{
            if(shortAddress){
                return [province, city, county, detail].join(' ')
            }else{
                return [province, city, county, detail, name, phone].join(' ')
            }
        }
    },
    
    setRole (roles = '') {
        return sessionStorage.setItem('roles', JSON.stringify(roles));
    },
    
    ckRole (role = '') {
        const result = sessionStorage.getItem('roles');
        const {roles = []} = JSON.parse(result) || {};
        
        return roles.includes(role) || roles.includes('admin');
    }
}