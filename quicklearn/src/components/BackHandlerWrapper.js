import React, { Component } from 'react';
import {BackHandler, View} from "react-native";
import {withNavigation} from "react-navigation";

class BackHandlerWrapper extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.goBack(); // works best when the goBack is async
        return true;
    };

    render(){
        return null;
    }
}

export default withNavigation(BackHandlerWrapper);
