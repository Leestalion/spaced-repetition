import React, {Component} from 'react';
import {connect} from "react-redux";
import {View,Platform,Alert} from 'react-native';
import {Button, Icon} from 'native-base';
import {logout} from "../actions";
import {withNavigation} from 'react-navigation';
import firebase from 'firebase'
class RightNav extends Component {

      signout(){
        firebase.auth().signOut()
        .then(_ => {
            this.props.logout()
            this.props.navigation.navigate('Login')
        })
      }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <Button
                    iconRight={Platform.OS === 'ios'} // RightIcon renders better on ios because no underlay onPress color on button
                    transparent
                    onPress={() => this.props.navigation.navigate('Contact')}
                >
                    <Icon type="Feather" name='info' color="#6FB98F" style={{fontSize: 20}}/>
                </Button>
                <Button
                    iconRight={Platform.OS === 'ios'}
                    transparent
                    onPress={() => this.signout()}
                >
                    <Icon type="Feather" name='log-out' style={{fontSize: 17}}/>
                </Button>
            </View>
        );
    }
}

const mapStateToProps = ({user}) => {
    const {token} = user;
    return {token};
};

const mapDispatchToProps = {
    logout
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RightNav));