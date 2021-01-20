import React from 'react';
import {Dimensions, WebView} from 'react-native';

export default class VideoPlayer extends React.Component {

    render() {
        const {width, height} = Dimensions.get('window');

        return (
            <WebView
                style={{height, width}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{uri: 'https://www.youtube.com/embed/' + this.props.id}}
            />
        );
    }
}