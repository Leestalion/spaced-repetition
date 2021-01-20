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
  Textarea,
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

class CameraScreen extends Component {
    constructor(props){
        super(props);
        this.state = { 
            title: '',
            text: '',
            isModalVisible: false,
        };
    }

    doPut(){
      var mydata = new Object()
      mydata.title = this.state.title
      mydata.text = this.state.text
      firebase.firestore().collection("users").doc(this.props.user.uid).collection("news").doc("jsondata").set({
        personalize: firebase.firestore.FieldValue.arrayUnion(mydata),
      },{merge:true}).then(()=>{
        this.setState({title: '',text: ''})
        Alert.alert('Done!')
      })
    }

    doTrim(text){
      var firstText = text.replace(/ *\./g,'. ').replace(/ *,/g,', ').replace(/ *:/g,': ').replace(/ *;/g,'; ').replace(/ *\!/g,'! ').replace(/ *\?/g,'? ').replace(/ {2,}/g,' ')
      var trimmedText = firstText.replace(/\“ /g,'\“').replace(/ \”/g,'\”')
      console.log(trimmedText)
      this.setState({text: trimmedText})
    }
  

  render() {
    
      return (
        <KeyboardAwareScrollView style={{ flex: 1 ,backgroundColor:'white'}} ref="scrollView">
            <Text style={styles.getStartedText}>Add text data</Text>
            <Form>
              <Item floatingLabel>
                <Label>Title</Label>
                <Input 
                  onChangeText={title => this.setState({title})}
                  value={this.state.title}/>
              </Item>
              {
                this.state.text.length > 0
                &&
                <Button 
                  block
                  style={[styles.btn, styles.btnInfo]}
                  onPress={() => this.doTrim(this.state.text)}
                >
                  <Text>Trim</Text>
                </Button>
              }
              {
                (this.state.title != '' && this.state.text != '')
                &&
                <Button 
                  block
                  style={[styles.btn, styles.btnInfo]}
                  onPress={() => this.doPut()}
                >
  
                  {
                    this.state.Putnow
                    ?
                    <Text>Save your data. Just a minute...</Text>
                    :
                    <Text>Register this data</Text>
                  }
  
                  {
                    this.state.Putnow
                    &&
                    <AppSpinner/>
                  }
                </Button>
              }
              <Item>
                <Label>Text</Label>
                <Input 
                  style={{
                    marginRight: 10,
                    fontSize: 22,
                    color: 'black',
                    //color: 'rgba(96,100,109, 1)',
                  }}
                  multiline
                  autoCorrect={true}
                  spellCheck={true}
                  onChangeText={text => this.setState({text})}
                  value={this.state.text}
                />
              </Item>
            </Form>            
            </KeyboardAwareScrollView>       
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


export default connect(mapStateToProps)(CameraScreen)

//export default withNavigation(TextSelectScreen)

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%',
      },
      icon: {
        flex: 0,
        color: 'white',
        fontSize: 40,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
      },
      spinnerStyle: {
        flex: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        alignSelf: 'flex-start',
      },
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
