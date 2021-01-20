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
  FlatList
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
  List,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {CheckBox, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@expo/vector-icons'
import {fetchTexts,resetTextState} from "../actions";
import {withNavigation} from 'react-navigation';
import { MonoText } from '../components/StyledText';
import TextList from '../components/TextList';
import AppSpinner from '../components/AppSpinner';
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import platform from '../../native-base-theme/variables/platform';
import firebase from 'firebase'
import "firebase/firestore";

class SetWordListScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
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
      gender: '',
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
      Putnow:false,
    }
    console.log('Set - User ID: ' + this.props.user.uid);
    console.log(Platform.OS)
    if (Platform.OS !== 'web') {
      window = undefined
    }

    
    this.doGet()
  }

  componentDidMount() {
    console.log('OK - Did1')
    data = require('../articles/test.json');
    list = [data.a,data.b,data.c,data.d,data.e,data.f,data.g,data.h,data.i]
    this.setState({dataSource:data.a})
    console.log('OK - Did2')
  }
/*
  requiredMessage = input => {
    return input === '' ? <FormValidationMessage>Input</FormValidationMessage> : <View/>
  };

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
*/

doAlert = () => {
  const { popToTop } = this.props.navigation;
  Alert.alert(
    'Save your data',
    [
      {text: 'Let\'s start vocabulometer!' , onPress: () => {
        popToTop()
      }},
    ],
    {cancelable: false},
  )
}

  doPut = async(mode) =>{
      //await this.revUndifined()
      const { popToTop } = this.props.navigation;
      this.setState({Putnow:true})

      var userinfo = {
        age:this.state.age,
        native:this.state.native,
        gender: this.state.gender,
        entertainment: this.state.entertainment,
        economy: this.state.economy,
        environment: this.state.environment,
        lifestyle: this.state.lifestyle,
        politics: this.state.politics,
        science: this.state.science,
        sport: this.state.sport,
      };

      

      if(mode == 0){
        var unknownwords = {}

        firebase.firestore().collection("users").doc(this.props.user.uid).set({userinfo})
        /*firebase.firestore().collection("users").doc(this.props.user.uid).collection("news").doc("jsondata").set({
          data: [],
          personalize: [],
        },{merge:true})*/

        var day = new Date()
        var stats = {}
        var statsNew = {}
        for(var i = 0;i < 7;i++){
          var name = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
          stats[name] = 0
          statsNew[name] = 0
          day.setDate( day.getDate() -1 );
        }
        firebase.firestore().collection("users").doc(this.props.user.uid).set({stats},{merge:true})
        firebase.firestore().collection("users").doc(this.props.user.uid).set({statsNew},{merge:true})

        const jsonlist = require('../articles/gre-wordlist.json');
        var wordlist = require('../articles/gre-wordlist.json');
        /*
        var wordkeys = Object.keys(jsonlist)
        for(var i = 0;i < wordkeys.length;i++){
          wordlist[wordkeys[i]] = 0
        }*/
        firebase.firestore().collection("users").doc(this.props.user.uid).set({wordlist},{merge:true})

        var blob = new Blob([JSON.stringify(jsonlist)], { type: 'application\/json' });

        var uploadTask = firebase.storage().ref(this.props.user.uid + '-wordlist.json').put(blob);
        var that = this
        uploadTask.on('state_changed',function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          that.setState({uploadStatus: Math.round(progress * 10) / 10 + '%'})
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
          }, function(error) {
              // Handle unsuccessful uploads
          }, function(){
            console.log('put data')
            popToTop()
          })
        /*
        var listlength = Object.keys(wordfreqlist).length
        const keys = Object.keys(wordfreqlist)
        var threshold = Math.round(listlength * (Number(this.state.skill) - 2) * 0.05)
        var range = Math.round(listlength*0.01)
        console.log(listlength)
        console.log(threshold)
        for(var i = threshold + Math.round(range/2); i >= threshold - Math.round(range/2);i--){
          wordfreqlist[keys[i]]["understand"] = 0.8
          wordfreqlist[keys[i]]["read"] = false
        }

        let prob1 = 0.81
        let count1 = 0
        for(var i = threshold - Math.round(range/2); i >= 0;i--){
          wordfreqlist[keys[i]]["understand"] = prob1
          wordfreqlist[keys[i]]["read"] = false
          count1 = count1 + 1
          if(count1 > range){
            if(prob1<1){
              prob1 = Math.round((prob1 + 0.01) * 1000) / 1000
            }
            count1 = 0
          }
        }
        console.log(wordfreqlist[keys[threshold]])
        
        let prob2 = 0.79
        let count2 = 0
        for(var i = threshold + Math.round(range/2); i < listlength; i++){
          wordfreqlist[keys[i]]["understand"] = prob2
          wordfreqlist[keys[i]]["read"] = false
          count2 = count2 + 1
          if(count2 > range){
            if(prob2>0){
              prob2 = Math.round((prob2 - 0.01) * 1000) / 1000
            }
            count2 = 0
          }
        }

        var blob = new Blob([JSON.stringify(wordfreqlist)], { type: 'application\/json' });

        var uploadTask = firebase.storage().ref(this.props.user.uid + '-wordlist.json').put(blob);
        var that = this
        uploadTask.on('state_changed',function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          that.setState({uploadStatus: Math.round(progress * 10) / 10 + '%'})
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
          }, function(error) {
              // Handle unsuccessful uploads
          }, function(){
            console.log('put data')
            popToTop()
          })
        */
      }
      else{
        firebase.firestore().collection("users").doc(this.props.user.uid).update({userinfo})
        popToTop()
      }
  }

  doGet = () =>{
    firebase.firestore().collection("users").doc(this.props.user.uid).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
          var obj = doc.data().userinfo;
          console.log(obj.age);
          console.log(obj.gender);
          //console.log(obj.wordlist["go"]);
          this.setState({
            age:obj.age,
            native:obj.native,
            gender: obj.gender,
            entertainment: obj.entertainment,
            economy: obj.economy,
            environment: obj.environment,
            lifestyle: obj.lifestyle,
            politics: obj.politics,
            science: obj.science,
            sport: obj.sport,
            skill:obj.skill,
          });
          this.setState({const: true})
          console.log(this.state.native);
          console.log(this.state.age);
          console.log(this.state.science);
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });  
  }

    isContinue = async() => {
      let count = 0;
      for(var i = 0;i < list[0].length;i++){
          if(list[this.state.grade][i].understand == true){
              count++
          }
      }
      if(count > 2){
          this.setState({continue:false,skill:this.state.grade+3})
          Alert.alert('Set your vocabulary level')
      }
      else{
        console.log('continue')
        await this.setState({grade:this.state.grade+1})
        this.setState({dataSource:list[this.state.grade]})
        const scrollResponder = this.refs.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollTo({x: 0, y:810});
      }
    }

    doCheck(str){
      for(var i = 0;i<list[0].length;i++){
        if(list[this.state.grade][i].word == str){
          list[this.state.grade][i].understand = !list[this.state.grade][i].understand
          break;
        }
      }
      this.setState({dataSource:list[this.state.grade],Update: this.state.Update + 1})
      console.log(this.state.Update)
    }

    renderItem = ({ item,index }) => {
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
    return (
      <ScrollView style={{ flex: 1 ,backgroundColor:'white'}} ref="scrollView">
        <SafeAreaView>
          <Text style={styles.getStartedText}>Please tell me about yourself</Text>
          <Form>
            <Item fixedLabel>
              <Label>Age</Label>
              <Input 
                onChangeText={age => this.setState({age})}
                keyboardType='numeric'
                value={this.state.age}/>
            </Item>
            
            <Item fixedLabel>
              <Label>Gender</Label>
              {
                Platform.OS == 'android'
                ?
                <Picker
                mode="dropdown"
                placeholder="Select one"
                placeholderStyle={{ color: "#bfc6ea" }}
                selectedValue={this.state.gender}
                textStyle={{ fontSize: 18 }}
                onValueChange={(itemValue) => {
                  this.setState({gender: itemValue})
                }}
                >
                  <Picker.Item label="Select one" value='male'/>
                  <Picker.Item label="Male" value='male' />
                  <Picker.Item label="Female" value='female' />
                  <Picker.Item label="Custom" value='custom' />
                  <Picker.Item label="Rather not say" value='no' />
                </Picker>
                :
                <Picker
                mode="dropdown"
                placeholder="Select one"
                placeholderStyle={{ color: "#bfc6ea" }}
                selectedValue={this.state.gender}
                textStyle={{ fontSize: 18 }}
                onValueChange={(itemValue) => {
                  this.setState({gender: itemValue})
                }}
                >
                  <Picker.Item label="Male" value='male' />
                  <Picker.Item label="Female" value='female' />
                  <Picker.Item label="Custom" value='custom' />
                  <Picker.Item label="Rather not say" value='no' />
                </Picker>
              }
              
            </Item>
            <Item fixedLabel>
              <Label>Interests{"\n"}(multiple choice)</Label>
              <List>
                <ListItem>
                  <CheckBox
                    title='Entertainment'
                    checked={this.state.entertainment}
                    onPress={() => this.setState({entertainment: !this.state.entertainment})}
                  />
                </ListItem>
                <ListItem>
                  <CheckBox
                    title='Economy'
                    checked={this.state.economy}
                    onPress={() => this.setState({economy: !this.state.economy})}
                  />
                </ListItem>
                <ListItem>
                  <CheckBox
                  title='Environment'
                  checked={this.state.environment}
                  onPress={() => this.setState({environment: !this.state.environment})}
                  />
                </ListItem>
                <ListItem>
                  <CheckBox
                  title='Lifestyle'
                  checked={this.state.lifestyle}
                  onPress={() => this.setState({lifestyle: !this.state.lifestyle})}
                  />
                </ListItem>
                <ListItem>
                  <CheckBox
                    title='Politics'
                    checked={this.state.politics}
                    onPress={() => this.setState({politics: !this.state.politics})}
                  />
                </ListItem>
                <ListItem>
                  <CheckBox
                    title='Science'
                    checked={this.state.science}
                    onPress={() => this.setState({science: !this.state.science})}
                  />
                </ListItem>
                <ListItem>
                  <CheckBox
                    title='Sport'
                    checked={this.state.sport}
                    onPress={() => this.setState({sport: !this.state.sport})}
                  />
                </ListItem>
              </List>
            </Item>
            <Item fixedLabel>
              <Label>Native language</Label>
              {
                Platform.OS == 'android'
                ?
                <Picker
                mode="dropdown"
                placeholder="Select one"
                placeholderStyle={{ color: "#bfc6ea" }}
                selectedValue={this.state.native}
                textStyle={{ fontSize: 18 }}
                onValueChange={(itemValue) => {
                  this.setState({native: itemValue})
                }}
                >
                  <Picker.Item label="Select one" value='ja'/>
                  <Picker.Item label="Japanese" value='ja' />
                  <Picker.Item label="French" value='fr' />
                  <Picker.Item label="German" value='de' />
                  <Picker.Item label="English" value='en'/>
                  <Picker.Item label="Other" value='en' />
                </Picker>
                :
                <Picker
                mode="dropdown"
                placeholder="Select one"
                placeholderStyle={{ color: "#bfc6ea" }}
                selectedValue={this.state.native}
                textStyle={{ fontSize: 18 }}
                onValueChange={(itemValue) => {
                  this.setState({native: itemValue})
                }}
                >
                  <Picker.Item label="Japanese" value='ja' />
                  <Picker.Item label="French" value='fr' />
                  <Picker.Item label="German" value='de' />
                  <Picker.Item label="English" value='en'/>
                  <Picker.Item label="Other" value='en' />
                </Picker>
              }
              
              {/*
              <Input 
                onChangeText={(native) => this.setState({native})}
                value={this.state.native}/>
              <Text style={{marginLeft: 20,color: 'gray'}}>Current State: {this.state.native}</Text>*/}
            </Item>

            {/*
              this.props.navigation.state.params.mode==0
              &&
              <FontAwesome.Button  name="info" color="gray" backgroundColor="white" style={{marginLeft: 10}}>
                <Text style={{color: 'gray'}}>
                  Measure your grade level by using the San Diego Quick Assessment of Reading Ability
                </Text>
              </FontAwesome.Button>
            */}
            
            {/*
              this.props.navigation.state.params.mode==0
              &&
              <Item fixedLabel>
              <Label>English skill</Label>
              <List>
                {
                  this.state.continue
                  &&
                  <ListItem>
                    <Text style={{textAlign:'center',color: 'gray'}}>
                      Please check the unknown words
                    </Text>
                  </ListItem>
                }
                {
                  this.state.continue
                  ?
                  <FlatList
                    data={this.state.dataSource}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={item => item.word}
                    execData={this.state.Update}
                  />
                  :
                  <Text>{this.state.skill}</Text>
                }
              </List>
            </Item>
            */}
            
          </Form>
          {/*mode: 0 => new user, 1 => current user*/}
            {/*
              (this.state.continue && this.props.navigation.state.params.mode==0) 
              &&
              <Button 
              block
              style={[styles.btn, styles.btnInfo]}
              onPress={() => {
                this.isContinue()
              }}
            >
              <Text>Next page</Text>
            </Button>
            */}
            {
              (this.state.age != '' && this.state.native != "")
              ?
              <Button 
                block
                style={[styles.btn, styles.btnInfo]}
                onPress={() => this.doPut(this.props.navigation.state.params.mode)}
              >

                {
                  this.state.Putnow
                  ?
                  <Text>Save your data. Just a minute...</Text>
                  :
                  <Text>Submit the data</Text>
                }

                {
                  this.state.Putnow
                  &&
                  <AppSpinner/>
                }
                {/*
                  this.state.Putnow
                  &&
                  <Text>{this.state.uploadStatus}</Text>
                */}
              </Button>
              :
              <Text style={styles.getStartedText}>Please fill in all items</Text>
            }
            </SafeAreaView>
          
          </ScrollView>              
    );
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


export default connect(mapStateToProps)(SetWordListScreen)

//export default withNavigation(TextSelectScreen)

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
    btnInfo:{
      backgroundColor: 'green'
  },
  container: {
    flex: 1,
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
    flex: 0,
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
