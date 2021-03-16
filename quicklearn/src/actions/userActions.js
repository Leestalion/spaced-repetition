import {
    LOGOUT_SUCCESS,
    LOGIN_FAIL,
    LOGIN,
    LOGIN_SUCCESS,
    FETCH_USER_INFOS,
    SETUP,
} from '../actions/types';
import {NavigationActions} from 'react-navigation';
import firebase from 'firebase'
const BASE_URL = "http://vocabulometer.herokuapp.com/api";

const navigateToHome =
    NavigationActions.navigate({
        routeName: 'Main',
    });

const redirectLogin =
    NavigationActions.navigate({
        routeName: 'Login',
    });

const redirectCreate =
    NavigationActions.navigate({
        routeName: 'CreateAccount',
    });


export const setup = (user) => { // TODO get token in redux in component that calls this fetch and pass is as an argument   
    return (dispatch) => {
            dispatch({
                type: SETUP,
                payload: {
                    user: user.user,
                    token: user.token,
                }
            })
        }
    
};

export const login = (user) => { // TODO get token in redux in component that calls this fetch and pass is as an argument
    return {
        type: LOGIN_SUCCESS,
        payload: {
            user: user.user,
            token: user.token,
            info: user.info,
        }
    }
        
        /*

        fetch(`${BASE_URL}/users/auth/local`, {
            method: 'post',
            mode: 'cors',
            body: JSON.stringify(credentials),
            headers: {'content-type': 'application/json'},
        })
            .then((res) => {
                if (res.status !== 200) {
                    dispatch(redirectLogin);
                    console.log('ici 200');
                    dispatch({
                        type: LOGIN_FAIL,
                        payload: 'Identifiants incorrects',
                    });
                    //throw new Error ('coucou');
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                console.log(data.token);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        user: data.user,
                        token: data.token,
                    },
                });
                dispatch(navigateToHome);
            })
            .catch((e) => {
                console.log(e);
                dispatch({
                    type: LOGIN_FAIL,
                    payload: 'Passwords incorrects',
                });
            })*/
    
};


export const logout = () => {
    return{
        type: LOGOUT_SUCCESS,
    };
};

export const sendWordsRead = (userToken, words) => {
    return (dispatch) => {

        // console.log(words);
        fetch(`${BASE_URL}/users/current/word`, {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Bearer ' + userToken,
                'content-type': 'application/json'
            }),
            body: JSON.stringify({words: words, language: 'english'}),
        })
            .then((res) => res.json())
            .then(res => {
                console.log(res);
            })
            .catch(e => console.log(e))
    };
};

//TODO FETCH USER SCORE
export const fetchUserStats = (userToken, wordsLimit = 500) => {
    return (dispatch) => {
        const fetchParams = {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + userToken,
                'content-type': 'application/json'
            }),
        };

        const queryParams = `?limit=${wordsLimit}&language=english`;

        // FETCH TOTAL WORDS READ
        fetch(`${BASE_URL}/users/current/stats/words_read${queryParams}`, fetchParams)
            .then((res) => res.json())
            .then(res => {
                console.log('FETCH WORDS_READ', res);
                const wordsRead = res;


                fetch(`${BASE_URL}/users/current/stats/new_words_read${queryParams}`, fetchParams)
                    .then((res) => res.json())
                    .then(res => {
                        console.log('FETCH NEW_WORDS_READ', res);
                        const newWordsRead = res;


                        fetch(`${BASE_URL}/users/current/stats/new_recent_words_read${queryParams}`, fetchParams)
                            .then((res) => res.json())
                            .then(res => {
                                console.log('FETCH NEW_RECENTE_WORDS_READ', res);

                                console.log( {
                                    wordsRead,
                                    newWordsRead,
                                    newRecentWordsRead: res
                                });
                                dispatch({
                                    type: FETCH_USER_INFOS,
                                    payload: {
                                        wordsRead,
                                        newWordsRead,
                                        newRecentWordsRead: res
                                    }
                                })
                            })
                            .catch(e => console.log(e))
                    })
                    .catch(e => console.log(e))
            })
            .catch(e => console.log(e))
    }
};