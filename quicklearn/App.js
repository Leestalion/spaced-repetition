import React from 'react';
import {Provider} from 'react-redux';
import {BackHandler, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {store, persistor} from './src/store';
import * as Font from 'expo';
import AppNavigator from './src/navigation/AppNavigator';
import {createAppContainer} from 'react-navigation';
import {reduxifyNavigator} from 'react-navigation-redux-helpers';
import {connect} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react'
import {Notifications, DangerZone } from 'expo';
import './fixtimerbug'


const AppWithNav = createAppContainer(AppNavigator);
const mapStateToProps = (state) => ({
    state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(AppWithNav);

export default class App extends React.Component {
    state = {fontLoaded: false};

    componentDidMount() {
/*
        //リスナー登録
        this._notificationSubscription = Notifications.addListener(this._handleNotification);

        //badge消したり
        Notifications.getBadgeNumberAsync().then(badgeNumber => {
          console.log(badgeNumber)
          if(badgeNumber !==0){
            Notifications.setBadgeNumberAsync(badgeNumber - 1);
          }
        })    */
      }

      
    
      _handleNotification = notification => {
        if(notification.origin === 'selected'){
          //バックグラウンドで通知
          console.log('Tap notification selected')
        }else if(notification.origin === 'received'){
          //フォアグラウンドで通知
          console.log('Tap notification received')
        }
      }


    render() {
        //if (this.state.fontLoaded) {
            return (
                <Provider store={store}>
                    <SafeAreaView style={styles.container}>
                        <PersistGate loading={null} persistor={persistor}>
                            <AppWithNavigationState/>
                        </PersistGate>
                    </SafeAreaView>
                </Provider>
            );
        //}
        //return null
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
