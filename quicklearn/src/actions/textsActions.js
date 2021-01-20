import {
    FETCH_TEXTS_SUCCESS,
    FETCH_TEXTS,
    FETCH_TEXTS_FAIL,
    FETCH_SINGLE_TEXT,
    FETCH_SINGLE_TEXT_FAIL,
    FETCH_SINGLE_TEXT_SUCCESS,
} from '../actions/types';

const BASE_URL = "http://vocabulometer.herokuapp.com/api";

export const fetchTexts = (userToken, difficulty, limit = 20) => {

    let apiEndpoint;

    switch (difficulty) {
        case 'easy':
            apiEndpoint = `${BASE_URL}/datasets/english/local/recommendation?recommender=easy&limit=${limit}`;
            break;
        case 'hard':
            apiEndpoint = `${BASE_URL}/datasets/english/local/recommendation?recommender=hard&limit=${limit}`;
            break;
        case 'review':
            apiEndpoint = `${BASE_URL}/datasets/english/local/recommendation?recommender=review&limit=${limit}`;
            break;
        default:
            throw new Error('Miss difficulty argument');
    }

    return (dispatch) => {
        fetch(apiEndpoint, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + userToken,
            }),
        })
            .then((res) => {
                dispatch({
                    type: FETCH_TEXTS,
                    payload: difficulty,
                });
                const {status} = res;
                res.json()
                    .then((data) => {
                        console.log(`sucess get texts`);
                        console.log(data.texts);
                        if (status === 200) {
                            dispatch({
                                type: FETCH_TEXTS_SUCCESS,
                                payload: {
                                    texts: data.texts,
                                    level: difficulty
                                },
                            });
                        } else {
                            fetchTextsFail(dispatch, 'Erreur', difficulty);
                        }
                    })
                    .catch((e) => {
                        fetchTextsFail(dispatch, 'Erreur', difficulty);
                    })
            })
            .catch((e) => {
                fetchTextsFail(dispatch, 'Erreur', difficulty);
            })
    }
};

export const resetTextState = (level) => {
    return(dispatch) => {
        dispatch({
            type: FETCH_TEXTS,
            payload:level,
        });
    }
};

const fetchTextsFail = (dispatch, msg, level) => {
    dispatch({
        type: FETCH_TEXTS_FAIL,
        payload: {
            msg,
            level
        }
    });
};

export const fetchSingleText = (userToken, textId) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_SINGLE_TEXT,
        });

        console.log('textActions', textId);

        fetch(`${BASE_URL}/texts/${textId}`, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + userToken,
            }),
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                dispatch({
                    type: FETCH_SINGLE_TEXT_SUCCESS,
                    payload: res,
                });
            })
            .catch((e) => {
                console.log(e);
                dispatch({
                    type: FETCH_SINGLE_TEXT_FAIL,
                    payload: e,
                });
            });
    }
};