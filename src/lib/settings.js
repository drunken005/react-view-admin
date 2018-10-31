const {
    REACT_APP_RESTFUL,
} = process.env;

export const SETTINGS = {
    RESTFUL_URL: {
        authCheck: REACT_APP_RESTFUL + 'api/',
        noAuthCheck: REACT_APP_RESTFUL + 'app/'
    }
};
