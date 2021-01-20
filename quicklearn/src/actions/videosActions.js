import {
    FETCH_VIDEOS,
    FETCH_VIDEOS_FAIL,
    FETCH_VIDEOS_SUCCESS,
} from "./types";

const BASE_URL = "http://vocabulometer.herokuapp.com/api";

export const fetchVideos = (userToken, limit = 20) => {

    const apiEndpoint = `${BASE_URL}/datasets/english/youtube/recommendation?recommender=hard&limit=${limit}`;

    return (dispatch) => {
        dispatch({
            type: FETCH_VIDEOS,
        });
        fetch(apiEndpoint, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + userToken,
            }),
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                for(const item of res.texts){
                  item.youtubeId = item.uri.slice(32);
                }
                console.log(res);

                dispatch({
                    type: FETCH_VIDEOS_SUCCESS,
                    payload: res.texts,
                });
            })
            .catch((e) => {
                console.log(e);
                dispatch({
                    type: FETCH_VIDEOS_FAIL,
                    payload: e,
                });
            });
    }
};