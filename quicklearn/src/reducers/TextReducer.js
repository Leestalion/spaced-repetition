import {
    FETCH_TEXTS_SUCCESS,
    FETCH_TEXTS,
    FETCH_TEXTS_FAIL, FETCH_SINGLE_TEXT, FETCH_SINGLE_TEXT_SUCCESS, FETCH_SINGLE_TEXT_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
    easyTexts: [],
    hardTexts: [],
    recommendedTexts: [],

    easyTextsLoading: true,
    hardTextsLoading: true,
    recommendedTextsLoading: true,

    singleText: {},
    singleTextLoading: true,

    errorMessage: '',
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_TEXTS:
            switch (action.payload) {
                case 'easy':
                    return {...state, easyTextsLoading: true};
                case 'hard':
                    return {...state, hardTextsLoading: true};
                case 'review':
                    return {...state, recommendedTextsLoading: true};
                default:
                    return {...state};
            }
        case FETCH_TEXTS_SUCCESS:
            switch (action.payload.level) {
                case 'easy':
                    return {...state, easyTexts: action.payload.texts, easyTextsLoading: false};
                case 'hard':
                    return {...state, hardTexts: action.payload.texts, hardTextsLoading: false};
                case 'review':
                    return {...state, recommendedTexts: action.payload.texts, recommendedTextsLoading: false};
                default:
                    return {...state};
            }
        case FETCH_TEXTS_FAIL:
            switch (action.payload.level) {
                case 'easy':
                    return {...state, errorMessage: action.payload.msg, easyTextsLoading: false};
                case 'hard':
                    return {...state, errorMessage: action.payload.msg, hardTextsLoading: false};
                case 'review':
                    return {...state, errorMessage: action.payload.msg, recommendedTextsLoading: false};
                default:
                    return {...state};
            }
        case FETCH_SINGLE_TEXT:
            return {...state, singleTextLoading: true};
        case FETCH_SINGLE_TEXT_SUCCESS:
            return {...state, singleText: action.payload, singleTextLoading: false};
        case FETCH_SINGLE_TEXT_FAIL:
            return {...state, singleTextLoading: false};
        default:
            return state;
    }
}
