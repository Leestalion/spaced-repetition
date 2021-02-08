import React from 'react';
import {connect} from 'react-redux';
import Base64 from '../helpers/atob';
import { Container } from 'native-base';
import firebase from 'firebase';
import {login} from '../actions';
import AppSpinner from '../components/AppSpinner';
import {Notifications, DangerZone } from 'expo';

class LandingScreen extends React.Component {
    
    componentDidMount(){
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyCMOmW_G8cNmZUP8cxmYr8Xfw-7bVhL9HY",
                authDomain: "spaced-repetition-51bdc.firebaseapp.com",
                projectId: "spaced-repetition-51bdc",
                storageBucket: "spaced-repetition-51bdc.appspot.com",
                messagingSenderId: "721915131287",
                appId: "1:721915131287:web:c921649be76d0b01ba00d2",
                measurementId: "G-QD0BB2G9X9"
              });
        }

/* 
        text = require('../articles/textdata2.json')
        firebase.firestore().collection("articles").doc('level2').set({text})

        text = require('../articles/textdata3.json')
        firebase.firestore().collection("articles").doc('level3').set({text})

        text = require('../articles/textdata4.json')
        firebase.firestore().collection("articles").doc('level4').set({text})

        text = require('../articles/textdata5.json')
        firebase.firestore().collection("articles").doc('level5').set({text})

        text = require('../articles/textdata6.json')
        firebase.firestore().collection("articles").doc('level6').set({text})

        text = require('../articles/textdata7.json')
        firebase.firestore().collection("articles").doc('level7').set({text})

        text = require('../articles/textdata8.json')
        firebase.firestore().collection("articles").doc('level8').set({text})

        text = require('../articles/textdata9.json')
        firebase.firestore().collection("articles").doc('level9').set({text})

        text = require('../articles/textdata10.json')
        firebase.firestore().collection("articles").doc('level10').set({text})

        namelist = require('../articles/namelist.json')
        firebase.firestore().collection("articles").doc('namelist').set({namelist})
        transfer = require('../articles/lemma.json')
        firebase.firestore().collection("articles").doc('transfer').set({transfer},{merge: true})
*/

        console.log("landing")
        firebase.auth().onAuthStateChanged((user) => {
            
            if (!user) {
                console.log("nouser")
                this.props.navigation.navigate('Auth');
            } else {
                var check = 0
                //this.props.navigation.navigate('App')
                console.log("yesuser")
                firebase.firestore().collection("users").doc(user.uid).get()
                .then(doc =>{
                    if(!doc.exists){
                        console.log("yesuser1")
                        this.props.navigation.navigate('Auth')
                    }
                    else{
                        this.props.login({user})
                        //var URL = 'https://script.google.com/macros/s/AKfycbzx0zk0UFWRLTpAGvsDIaBJMBox2CAs5999Iiz5-58GDyCecuY/exec?uid=' + user.uid + '&message=I login!'
                        //fetch(URL)
                        this.props.navigation.navigate('App')
                    }
                  })
                .catch(err => {
                    console.log('Error getting document', err);
                    this.props.navigation.navigate('Auth')
                });  
                
                
            }
        })
      }

    render() {
        return (
            <Container style={{alignItems: 'center', justifyContent: 'center'}}>
                <AppSpinner/>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    const {
      token,
      user,
    } = state.user;
    
    //const {token} = user;
  
    return {
      token,
      user,
    }
  };

export default connect(mapStateToProps,{login})(LandingScreen)
