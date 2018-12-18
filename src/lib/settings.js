const {
    REACT_APP_RESTFUL,
    REACT_APP_RESTFUL_KEY
} = process.env;

export const SETTINGS = {
    RESTFUL_URL: {
        authCheck: REACT_APP_RESTFUL + 'api/',
        noAuthCheck: REACT_APP_RESTFUL + 'app/'
    },
    APP_KEY: REACT_APP_RESTFUL_KEY
};
