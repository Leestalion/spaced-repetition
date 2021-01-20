import {
    FETCH_VIDEOS,
    FETCH_VIDEOS_SUCCESS,
    FETCH_VIDEOS_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
    videos: [],
    videosLoading: false,
    errorMessage: '',
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_VIDEOS:
            return {...state, videosLoading: true};
        case FETCH_VIDEOS_SUCCESS:
            return {...state, videos: action.payload, videosLoading: false};
        case FETCH_VIDEOS_FAIL:
            return {...state, errorMessage: action.payload, videosLoading: false};
        default:
            return state;
    }
}
