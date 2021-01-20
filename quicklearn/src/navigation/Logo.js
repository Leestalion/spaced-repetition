import React, {Component} from 'react';
import {
    Image,
    Platform,
} from 'react-native';
import { Button } from 'native-base';
import { withNavigation } from 'react-navigation';

const logo = require('../../assets/images/icon.png');

class Logo extends React.Component {
    render(){
        return (
            <Button transparent onPress={() => this.props.navigation.navigate('Main')}>
                <Image
                    source={logo}
                    resizeMode="contain"
                    style={{
                        height: 30,
                        width: 30,
                        marginTop: Platform.OS === 'android' ? 6 : 0,
                    }}
                />
            </Button>
        )
    }
}

export default withNavigation(Logo);