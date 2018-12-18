import {SETTINGS} from '../../settings';
import UserApis from '../user';
import _ from 'lodash';

const {authCheck, noAuthCheck} = SETTINGS.RESTFUL_URL;
const mode = "cors", credentials = 'include';

export default {

    requireResponse(response) {
        if (response.status > 300) {
            return {error: `请求失败[${response.status}],${response.url}`}
        }
        return response.json()
    },

    handleResponse(result, cb) {
        // process.env.NODE_ENV === 'development' && console.log('response>>>', result);
        if (result && result.statusCode === 200) {
            return cb(null, result.data);
        }

        if (result && result.statusCode > 10000) {
            return cb(result, null);
        }

        if (result.error) {
            return cb({detail: '', errorType: '', msg: result.error, statusCode: 500}, null);
        }
    },

    reqwest(path, {method = 'GET', data = {}, auth = true}, cb) {
        method = method.toUpperCase();
        let request = {method, mode};
        let url = (auth ? authCheck : noAuthCheck) + path,
            headers = {"Content-Type": "application/json", authorization: SETTINGS.APP_KEY};

        if (auth) {
            // headers.token = UserApis.getItem('token');
            if (method !== 'GET' && path !== 'user/updpwd') {
                let {_id, name} = UserApis.userProfile();
                _.assign(data, {handler: {_id, name}});
            }

        }
        request.credentials = credentials;
        request.headers = headers;

        // let request = {credentials, method, mode, headers};

        if (method !== 'GET') {
            request.body = JSON.stringify(data);
        } else {
            let params = _.map(data, (v, k) => [[k], JSON.stringify(v)].join('='));
            if (params.length) {
                url = [url, encodeURIComponent(params.join('&'))].join('?');
            }
        }
        fetch(url, request).then(response => this.requireResponse(response)).then(
            data => this.handleResponse(data, cb));
    }
}