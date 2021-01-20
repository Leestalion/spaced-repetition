import React, { Component } from 'react';
import {connect} from 'react-redux';
import { 
  Platform,
  StyleSheet, 
  ScrollView, 
  AsyncStorage, 
  TextInput, 
  Card,
  CardItem, 
  Modal, 
  SafeAreaView, 
  Alert,
  Linking,
  KeyboardAvoidingView,
  FlatList,
  Keyboard
} from 'react-native';
import { 
  Picker,
  Button,
  Container,
  Content,
  Text,
  View,
  Input,
  Item,
  Left,
  Right,
  Body,
  ListItem,
  Form,
  Label,
} from 'native-base';
import {Notifications, DangerZone } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Localization from 'expo-localization';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {CheckBox, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import {fetchTexts,resetTextState} from "../actions";
import {withNavigation} from 'react-navigation';
import { MonoText } from '../components/StyledText';
import TextList from '../components/TextList';
import AppSpinner from '../components/AppSpinner';
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import platform from '../../native-base-theme/variables/platform';
import {logout} from "../actions";
import firebase from 'firebase'

class TextSelectScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      easy: '',
      balance: '',
      hard: '',
      isMounted: false,
      const: '',
      age:'',
      native:'',
      isFemale: false,
      entertainment: false,
      economy: false,
      environment: false,
      lifestyle: false,
      politics: false,
      science: false,
      sport: false,
      skill:'',
      grade:0,
      Update:0,
      continue:true,
      makemail:false,
      modalVisible: false,
      delete: false,
      loading: true,
      message: "",
    }
    if (Platform.OS !== 'web') {
      window = undefined
    }
    console.log('User ID: ' + this.props.user.uid);
    this.doGet()
  }

  componentDidMount() {
    data = require('../articles/test.json');
    list = [data.a,data.b,data.c,data.d,data.e,data.f,data.g,data.h,data.i]
    this.setState({dataSource:data.a})
    console.log('const:' + this.state.const);
    
    //if(this.state.const == true){
      this.setState({ isMounted: true }, () => {
        if (this.state.isMounted) {
          this.setState({ isMounted: false });
          {
              this.props.navigation.addListener('willFocus', (playload)=>{
              console.log('User ID: ' + this.props.user.uid);
              console.log('const:' + this.state.const);
              if (Platform.OS !== 'web') {
                window = undefined
              }
              this.doGet()
            });
          }
        }
      });
    //}
  }
/*
  requiredMessage = input => {
    return input === '' ? <FormValidationMessage>Input</FormValidationMessage> : <View/>
  };

  getDeviceToken = async () => {
    console.log("getdevicetoken")
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      // パーミッションダイアログを表示します
      console.log("if1")
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log("if2")
      return;
    }

    const deviceToken = await Notifications.getExpoPushTokenAsync();
    if (deviceToken) {
      console.log("if3")
      
      this.updateUserToken(deviceToken);
    }
  }
*/
  updateUserToken = async (deviceToken) => {
    const locale =　Localization.locale;

    console.log(deviceToken)

    try {
      firebase.firestore().collection("users").doc(this.props.user.uid).update({
        deviceToken: deviceToken,
        locale: locale,
      });

      return true;
    } catch ({ message }) {
      return { error: message };
    }
  }



  revUndifined(){
    if(this.state.entertainment == undefined){
      this.setState({entertainment: false})
    }
    if(this.state.economy == undefined){
      this.setState({economy: false})
    }
    if(this.state.environment == undefined){
      this.setState({environment: false})
    }
    if(this.state.lifestyle == undefined){
      this.setState({lifestyle: false})
    }
    if(this.state.politics == undefined){
      this.setState({politics: false})
    }
    if(this.state.science == undefined){
      this.setState({science: false})
    }
    if(this.state.sport == undefined){
      this.setState({sport: false})
    }
  }

  doGet = async() =>{

    if(this.props.user.uid == undefined){
      this.props.navigation.navigate('Auth')
    }

      firebase.firestore().collection("users").doc(this.props.user.uid).get()
    .then(async(doc) => {
      if (!doc.exists) {
        this.props.navigation.navigate('SetWordList',{mode: 0})
      }
      else{
        //await this.getDeviceToken();

        //Notifications.addListener(this.subscribeNotification);

        
        var obj = doc.data().userinfo;

        let data = doc.data().wordlist

        let keys = Object.keys(data);
        
        
        
        /*for(var i = 0;i < keys.length;i++){
          if(data[keys[i]].view ==true){
            if(data[keys[i]].original){
              console.log(data[keys[i]].original)
            }
            else{
              console.log(keys[i])
            }
            console.log(keys[i])
          }
        }
        for(var i = 0;i < keys.length;i++){
          if(data[keys[i]].view ==true){
            console.log(data[keys[i]].sentence)
          }
        }
        for(var i = 0;i < keys.length;i++){
          if(data[keys[i]].view ==true){
            //console.log(data[keys[i]].translateSentence)
            console.log(data[keys[i]].translateWord)
          }
        }
        for(var i = 0;i < keys.length;i++){
          if(data[keys[i]].view ==true){
            console.log(data[keys[i]].rank)
          }
        }*/
        this.setState({skill:obj.skill, native: obj.native, loading: false,deviceToken: doc.data().deviceToken})
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
      this.props.navigation.navigate('SetWordList',{mode: 0})
    });  
    
  }

    isContinue = async() => {
      let count = 0;
      for(var i = 0;i < list[0].length;i++){
          if(list[this.state.grade][i].understand == false){
              count++
          }
      }
      if(count > 2){
          this.setState({continue:false,skill:this.state.grade+3})
      }
      else{
        console.log('continue')
        await this.setState({grade:this.state.grade+1})
        this.setState({dataSource:list[this.state.grade]})
      }
    }

    doCheck(str){
      //console.log("Before" + JSON.stringify(list))
      for(var i = 0;i<list[0].length;i++){
        if(list[this.state.grade][i].word == str){
          list[this.state.grade][i].understand = !list[this.state.grade][i].understand
          break;
        }
      }
      //console.log("After" + JSON.stringify(list))

      this.setState({dataSource:list[this.state.grade],Update: this.state.Update + 1})
      console.log(this.state.Update)
    }

    doNavigatelevel(level){
      if(level < 3){
        return 3
      }
      else if(level>10){
        return 10
      }
      else{
        return level
      }
    }

    delete_user = async(password) => {
      this.setState({delete:true})
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(user.email,password);
      console.log(credential)
      user.reauthenticateWithCredential(credential).then(() => {
        firebase.firestore().collection("users").doc(this.props.user.uid).delete()
        firebase.firestore().collection("users").doc(this.props.user.uid).collection("news").doc("jsondata").delete()
        firebase.storage().ref(this.props.user.uid + '-wordlist.json').delete().then(function() {
          console.log('delete storage')                     
        }).catch(function(error) {
          Alert.alert('Fail to delete your account',error)
        });

        user.delete().then(_ => {
          Alert.alert(
            'Successfully deleted',
            null,
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.logout()
                  this.props.navigation.navigate('Auth')
                }
              },
            ],
            {cancelable: false},
          )
        }).catch(function(error) {
          Alert.alert('Fail to delete your account',error)
        })
      }).catch(function(error) {
        Alert.alert('Fail to reauthenticate your account',error)
      });
      
    }
    sendNotification(){
      Keyboard.dismiss()
      var that = this
      var URL = 'https://script.google.com/macros/s/AKfycbxj7y_mO7utFyJlD9Is6t26OWeI8D-ay1DFbJAsmAWomSbYlm8m/exec?uid=' + this.props.user.uid + '&message=' + this.state.message
      fetch(URL).then(      
        Alert.alert(
          "Complete to send notification",
          null,
          [                
            { text: "OK", onPress: () => that.setState({message: ""}) }
          ],        
        )
      )
    }

    renderItem = ({ item,index }) => {
      //console.log('item' + item.title)
      return (
        <ListItem style={{backgroundColor:'white', justifyContent:'center', marginLeft: 0 }}>
            <CheckBox
              title={item.word}
              checked={item.understand}
              onPress={() => this.doCheck(item.word)}
            />
        </ListItem>
      );
    };   

  
  render() {
    const {age,native,gender} = this.state;
    if(this.state.loading==true){
      return(
          <View style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
              <AppSpinner/>
              <Text>Loading your data. Please wait a second...</Text>
          </View>
      )
    }
    else{   
      return (
        <View style={styles.container}>
            <Text style={styles.getStartedText}>Welcome!</Text>
            <Button
              block
              style={[styles.btn, styles.btnInfo]}
              onPress={() => this.props.navigation.navigate('Flashcard')}
            >
              <Text>Start learning</Text>
            </Button>  
              
            <Item floatingLabel>
                <Label>Send message to your partner</Label>
                <Input 
                    onChangeText={message => this.setState({message})}
                    value={this.state.message}/>
              </Item>
              {
                this.state.message != ""
                &&
                <Button
                  block
                  style={[styles.btn, styles.btnBalance]}
                  onPress={() => this.sendNotification()}
                >
                  <Text>Send notification</Text>
                </Button> 
              }              
              
            <Text style={styles.developmentModeText}>{'\n'}ver 1.0.2</Text>
        </View>
      );
    }
  }
}/*
<View style={styles.container}>
            <Text style={styles.getStartedText}>Welcome!</Text>
            <Button
              block
              style={[styles.btn, styles.btnInfo]}
              onPress={() => this.props.navigation.navigate('Flashcard')}
            >
              <Text>Start learning</Text>
            </Button>            
              <Item floatingLabel>
                <Label>Send message to your partner</Label>
                <Input 
                    onChangeText={message => this.setState({message})}
                    value={this.state.message}/>
              </Item>
              {
                this.state.message != ""
                &&
                <Button
                  block
                  style={[styles.btn, styles.btnBalance]}
                  onPress={() => this.sendNotification()}
                >
                  <Text>Send notification</Text>
                </Button> 
              }
            <Text style={{textAlign: "flex-end"}}>{'\n'}ver 1.0.0</Text>
        </View>*/
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

const mapDispatchToProps = {
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(TextSelectScreen)

const styles = StyleSheet.create({
    btn: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: 'yellowgreen'
    },
    btnBalance: {
        backgroundColor: 'blue'
    },
    btnEasy: {
        backgroundColor: 'green'
    },
    btnHard: {
        backgroundColor: '#FF473A',
    },

    btnNews: {
      backgroundColor: 'skyblue',
  },
    btnInfo:{
      backgroundColor: 'green'
  },
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    marginTop: 10,
    fontSize: 24,
    color: 'black',
    //color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  vocabLevel: {
    marginTop: 10,
    fontSize: 20,
    color: 'black',
    //color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    alignItems: 'center',
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  paddingButton: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginVertical: 0,
    maxHeight: 60,
  },
  input: {
    margin: 10,
    fontSize: 20
  },
  Pickerselect: {
    fontSize: 18,
    color: 'blue'
  }
});
