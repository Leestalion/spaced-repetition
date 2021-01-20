import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Container, Content } from 'native-base';
import VideoPlayer from '../components/VideoPlayer';
import BackHandlerWrapper from '../components/BackHandlerWrapper';

export default class VideoScreen extends React.Component {

    render() {
        const video = this.props.navigation.state.params;
        return (
                <Container>
                    <Content>
                        <BackHandlerWrapper/>
                        <VideoPlayer
                            id={video.youtubeId}
                            uri={video.uri}
                        />
                    </Content>
                </Container>
        );
    }
}

