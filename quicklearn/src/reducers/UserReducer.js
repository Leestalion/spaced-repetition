import {
    LOGOUT_SUCCESS,
    LOGIN_FAIL,
    LOGIN,
    LOGIN_SUCCESS,
    FETCH_USER_INFOS,
    SETUP,
} from '../actions/types';

const INITIAL_STATE = {
    user: {},
    info: {},
    loginLoading: false,
    userStatsLoading: true,
    token: null,
    errorMessage: '',
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGIN:
            return {...state, loginLoading: true, errorMessage: ''};
        case LOGIN_SUCCESS:
            return {...state, info: action.payload.info, token: action.payload.token, user: action.payload.user, loginLoading: false};
        case LOGIN_FAIL:
            return {...state, errorMessage: action.payload, loginLoading: false};
        case LOGOUT_SUCCESS:
            return {...state, token: null};
        case FETCH_USER_INFOS:
            return {
                ...state,
                user: {
                    ...state.user,
                    wordsRead: action.payload.wordsRead,
                    newWordsRead: action.payload.newWordsRead,
                    newRecentWordsRead: action.payload.newRecentWordsRead,
                },
                userStatsLoading: false,
            };
        case SETUP:
            return {...state, token: action.payload.token, user: action.payload.user, loginLoading: false};
        default:
            return state;
    }
}
