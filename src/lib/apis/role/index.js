import _ from 'lodash';
import UserApi from '../user';

export default {
    userRoleAuth(role, group) {
        if ('string' !== typeof group || !role) {
            return false
        }
        role = _.isArray(role) ? role : [role];
        if (!role.length) {
            return false;
        }

        let user = UserApi.userProfile();

        if (!user) {
            return false;
        }
        let {roles} = user;
        if (!roles || !roles.length) {
            return false;
        }

        let isAdmin = _.find(roles, (doc) => doc.group === 'admin');
        if (isAdmin && isAdmin.items && isAdmin.items.indexOf('admin') >= 0) {
            return true;
        }

        let userRole = _.find(roles, (doc) => doc.group === group);

        if (!userRole || !userRole.items || !userRole.items.length) {
            return false;
        }
        let {items} = userRole;

        items = items && items.length ? [userRole.group].concat(items) : [userRole.group];

        if (!_.intersection(items, role).length) {
            return false;
        }
        return true;
    }
};