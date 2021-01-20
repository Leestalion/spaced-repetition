import React, {Component} from 'react';
import {fetchSingleText} from '../actions';
import {connect} from 'react-redux';
import { 
    Platform,
    StyleSheet, 
    ScrollView, 
    AsyncStorage, 
    TextInput, 
    RefreshControl,
    Modal, 
    SafeAreaView, 
    Alert,
    Linking,
    Keyboard,
    KeyboardAvoidingView,
    FlatList,
    Switch,
    TouchableOpacity,
    Clipboard,
    Image,
  } from 'react-native';
import {
    Container,
    Content,
    Card,
    CardItem, 
    Text,
    View,
    Button,
    Body,
    Form,
    Label,
    Item,
    Input,
    Left,
    Right,
    Tab,
    Tabs,
    ScrollableTab,
    TabHeading,
    Icon,
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Speech from 'expo-speech';
import { sendWordsRead } from '../actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons'
import platform from "../../native-base-theme/variables/platform";
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import AppSpinner from '../components/AppSpinner';
import firebase from 'firebase'
import algoliasearch from 'algoliasearch';
import { InstantSearch, connectInfiniteHits, connectSearchBox } from 'react-instantsearch-native';
import SearchBox from '../algolia/SearchBox';
import InfiniteHits from '../algolia/InfiniteHits';

// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = "2WZLVNX78I";
const ALGOLIA_ADMIN_KEY = "0f4a19ceec9e5d68cd960f10ea824c4b";
const ALGOLIA_SEARCH_KEY = "05cbb0b44b0864b59541ddda65247810";

const ALGOLIA_INDEX_NAME = 'textdata';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
var index = client.initIndex('textdata');

var answerlist = []
var sortlist = new Array(); //並び替えのための配列
class FlashcardScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
          id: '',
          text: '',
          level: '',
          title: '',
          viewword: '',
          translatedWord: '',
          translatedSentence: '',
          question: '',
          loadingWord: false,
          loadingSentence: false,
          fetching: false,
          setcard: false,
          isNull: false,
          answer: '',
          refreshing: false,
          switching: false,
          correct: 0,
        };
        
    }

    root = {
      Root: View,
      props: {
        style: {
          flex: 1,
        },
      },
    };

    componentDidMount(){
      this.refresh()
    }


    makenewcards(){
      
        var unknownwords = cards
        
        /*if(this.state.correct >= 25){
          var URL = 'https://script.google.com/macros/s/AKfycbzx0zk0UFWRLTpAGvsDIaBJMBox2CAs5999Iiz5-58GDyCecuY/exec?uid=' + this.props.user.uid + '&message=I get ' + this.state.correct + ' on a test!'
          fetch(URL)
          console.log("send notification")
        }*/
        //this.setState({correct: 0})
        //console.log(unknownwords)

        for(var i = 0;i < keys.length;i++){
          unknownwords[keys[i]].sentence = data[keys[i]].sentence
        }
        firebase.firestore().collection("users").doc(this.props.user.uid).set({unknownwords},{merge:true})
        .then(
            this.refresh()
        )
        Alert.alert('Updated flashcards')
    }

    refresh(){
      console.log("refresh")
      this.setState({refreshing: true,translatedWord: '',translatedSentence:'',answer:''})
      firebase.firestore().collection("users").doc(this.props.user.uid).get()
      .then(async(doc) => {
          if (!doc.exists) {
          console.log('No such document!');
          } else {
              info = doc.data().userinfo
              data = doc.data().unknownwords
              cards = JSON.parse(JSON.stringify(data))
              defaultkeys = Object.keys(data)
              keys = new Array();
              sortlist = new Array();//並び替えのための配列
              answerlist = new Array();
              cardnum = 0
              console.log(defaultkeys.length)
              if(defaultkeys.length!=0){
                  for(var i = 0;i < defaultkeys.length;i++){
                      if(data[defaultkeys[i]].view){
                        if(data[defaultkeys[i]].original){
                          cards[defaultkeys[i]].sentence = cards[defaultkeys[i]].sentence.trim().replace(new RegExp(data[defaultkeys[i]].original,"ig"), '(     )');
                          answerlist.push(data[defaultkeys[i]].original)
                        }
                        else{
                          cards[defaultkeys[i]].sentence = cards[defaultkeys[i]].sentence.trim().replace(new RegExp(defaultkeys[i],"ig"), '(     )');
                          answerlist.push(defaultkeys[i])
                        }
                        keys.push(defaultkeys[i])
                      }
                      else{
                        delete cards[defaultkeys[i]]
                      }
                  }
                  if(keys.length==0){
                      this.setState({setcard: true, isNull: true, refreshing: false})
                  }
                  else{
                    for(var i = 0; i < keys.length;i++){
                      sortlist.push(i)
                    }

                    for(var i = sortlist.length - 1; i > 0; i--){
                      var r = Math.floor(Math.random() * (i + 1));
                      var tmp = sortlist[i];
                      sortlist[i] = sortlist[r];
                      sortlist[r] = tmp;
                    }
                  }
                  console.log(data)
                  await this.setState({setcard: true, native: info.native, data: data, question: cards[keys[sortlist[cardnum]]].sentence,answer: answerlist[sortlist[cardnum]].slice(0,1), refreshing: false})
              }
              else{
                  await this.setState({setcard: true, isNull: true, refreshing: false})
              }
              //console.log(data)
              
              
              console.log('keyset')
          }
      })
      .catch(err => {
          console.log('Error getting document', err);
      });
  }

    doTranslate(text){
      this.setState({loadingSentence:true})
      var that = this  
      Keyboard.dismiss()
      if(cards[keys[sortlist[cardnum]]].translatedSentence){
        console.log('aaa')
        that.setState({translatedSentence: cards[keys[sortlist[cardnum]]].translatedSentence, loadingSentence:false})           
      }
      else{
        var URL = 'https://script.google.com/macros/s/AKfycbzSytw34AJHTQw-09gjssPE8Q9s9sLJv2HN6wQheM_9g4egOExa/exec?text=' + text + '&source=en&target=' + this.state.native
        fetch(URL).then((response) => response.json())
        .then(jsondata => {
          that.setState({translatedSentence: JSON.parse(JSON.stringify(jsondata)).translated, loadingSentence:false})           
          cards[keys[sortlist[cardnum]]].translatedSentence = JSON.parse(JSON.stringify(jsondata)).translated
        })
      }
    } 

    nextcard = async(isRemember) =>{
      if(isRemember == false){
        if(cards[keys[sortlist[cardnum]]].misanswer){
          if(cards[keys[sortlist[cardnum]]].misanswer.indexOf(this.state.answer) == -1){
            cards[keys[sortlist[cardnum]]].misanswer.push(this.state.answer)
          }
          else{
            cards[keys[sortlist[cardnum]]].misanswer = new Array()
            cards[keys[sortlist[cardnum]]].misanswer.push(this.state.answer)
          }
        }
      }
      else{
        await this.setState({correct: this.state.correct+1})
        if(cards[keys[sortlist[cardnum]]].remember){
          cards[keys[sortlist[cardnum]]].remember += 1
        }
        else{
          cards[keys[sortlist[cardnum]]].remember = 1
        }
      }

      this.setState({translatedWord: '',translatedSentence:''})
      /*
      if(isRemember==true){
          cards[keys[sortlist[cardnum]]].view = false
      }
      */
      cards[keys[sortlist[cardnum]]].repetition += 1
      cardnum += 1
      
      console.log("cardnum: " + cardnum + " keys.length: " + keys.length)

      if(keys.length > cardnum){
        console.log(cards[keys[cardnum]].sentence)
        this.setState({question: cards[keys[sortlist[cardnum]]].sentence,answer: answerlist[sortlist[cardnum]].slice(0,1)})
    }
      else{
          console.log("remake")
          cardnum = 0
          this.makenewcards()
      }
        
    }

    doTTS(word){
      Speech.speak(word, {language:'en'})
    }

    render() {
        if(this.state.setcard==false){
            return(
                <View style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
                    <AppSpinner/>
                </View>
            )
        }

        else{      
            return (
                <KeyboardAwareScrollView
                  style={styles.container}
                  
                  refreshControl={
                      <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={() => this.refresh()}
                      />
                  }
                >
                  <View>
                            {
                                this.state.isNull
                                ?
                                <Text style={styles.cardItemText}>
                                    You have no fill-in-the-blank quiz form
                                </Text>
                                :
                                <Card>
                                  <CardItem style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
                                      <Text style={styles.cardItemText}>
                                          {this.state.question}
                                      </Text>
                                  </CardItem>
                                  <Grid>
                                    <Col>
                                      {
                                        this.state.loadingSentence
                                        ?
                                        <View style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
                                            <AppSpinner/>
                                        </View>
                                        :
                                        <MaterialCommunityIcons.Button
                                          style={{alignItems: 'center', justifyContent:'center'}}
                                          name="google-translate"
                                          color="black"
                                          backgroundColor="white"
                                          size={30}
                                          onPress={() => this.doTranslate(data[keys[sortlist[cardnum]]].sentence)}
                                        >
                                            <Text>Translate</Text>
                                        </MaterialCommunityIcons.Button>
                                      }
                                    </Col>
                                    <Col>
                                      <FontAwesome5.Button
                                        style={{alignItems: 'center', justifyContent:'center'}}
                                        name="volume-up"
                                        color="black"
                                        backgroundColor="white"
                                        size={30}
                                        onPress={() => this.doTTS(cards[keys[sortlist[cardnum]]].sentence)}
                                      >
                                          <Text>Play</Text>
                                      </FontAwesome5.Button>
                                    </Col>
                                    {/*<Col>
                                        {
                                          this.state.translatedSentence != ''
                                          &&
                                          <View style={{alignItems: 'center', justifyContent:'center'}}>
                                            <Text>Edit tranlated sentence</Text>
                                            <Switch
                                              onValueChange = {(value) => {
                                                this.setState({ switching: value })
                                              }}
                                              value = {this.state.switching}
                                              style={styles.container}
                                            />
                                          </View>
                                        }
                                    </Col>*/}
                                      </Grid>

                                  <Form>
                                      <Input
                                        style={styles.cardItemText}
                                        multiline
                                        clearButtonMode='always'
                                        editable={this.state.switching}
                                        onChangeText={(translatedSentence) => this.setState({translatedSentence})}
                                        value={this.state.translatedSentence}
                                  />

                                  
                                    <Item 
                                      floatingLabel
                                      success={keys[sortlist[cardnum]] != this.state.answer ? true : false}
                                      error={keys[sortlist[cardnum]] != this.state.answer ? true : false}
                                    >
                                      <Label>Your answer</Label>
                                      <Input
                                        placeholder='Answer'
                                        autoCorrect={false}
                                        onChangeText={(answer) => this.setState({answer})}
                                        value={this.state.answer}/>
                                      {
                                        keys[sortlist[cardnum]] != this.state.answer
                                        ?
                                        <Icon name='checkmark-circle' />
                                        :
                                        <Icon name='close-circle' />
                                      }
                                    </Item>
                                  </Form>
                                  <Text></Text>
                                    {
                                      //answerlist[sortlist[cardnum]] != this.state.answer
                                      keys[sortlist[cardnum]] != this.state.answer
                                      ?
                                      <MaterialCommunityIcons.Button 
                                        style={{alignItems: 'center', justifyContent:'center'}}
                                        name="emoticon-dead-outline"
                                        color="black"
                                        backgroundColor="orangered"
                                        size={30}
                                        onPress={() => {
                                          Keyboard.dismiss()
                                          Alert.alert(
                                            'The answer is',
                                            keys[sortlist[cardnum]],
                                            [
                                              {text: 'OK', onPress: () => this.nextcard(false)},
                                            ],
                                          )
                                        }}
                                      >
                                        <Text>Give up</Text>
                                      </MaterialCommunityIcons.Button>
                                      :
                                      <MaterialCommunityIcons.Button
                                        style={{alignItems: 'center', justifyContent:'center'}}
                                        name="emoticon-excited-outline"
                                        color="black"
                                        backgroundColor="lightgreen"
                                        size={30}
                                        onPress={() => {
                                          Keyboard.dismiss()
                                          this.nextcard(true)
                                        }}
                                      >
                                        <Text>Next question</Text>
                                      </MaterialCommunityIcons.Button>
                                    }         
                                </Card>
                            }
                            {
                              !this.state.isNull
                              &&
                              <Text>Number of cards: {cardnum+1}/{keys.length}</Text>
                            }
                            {
                              this.state.translatedSentence != ''
                              &&
                              <View>
                                {console.log('https://www.deepl.com/translator#en/' + this.state.native + '/' + this.state.original)}
                                <Text style={styles.getStartedText}>If you are not satisfied with translation quality...</Text>
                                <TouchableOpacity onPress={() => Linking.openURL(encodeURI('https://www.deepl.com/translator#en/' + this.state.native + '/' + this.state.original))}>
                                  <Text style={styles.getStartedText}>Try to use 
                                    <Image style={{height: 30,width: 60}}
                                        source={require('../../assets/images/deepl_logo.png')}
                                    />
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            }
                  </View>
                </KeyboardAwareScrollView>                   
            );
        }
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

export default connect(mapStateToProps)(FlashcardScreen);


/*
const Hits = connectInfiniteHits(({ hits, hasMore, refine }) => {
  

  return (
    <FlatList
      data={hits}
      onEndReached={() => hasMore && refine()} 
      onEndReachedThreshold={10}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => {
        console.log(item)
        //if(item._snippetResult.matchLevel == "full"){
          return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text>
                {item.id}
                {item.title}
              </Text>
              <Text>
                {JSON.stringify(item._snippetResult)}
              </Text>
            </View>
          </View>
        );
      //}
      }
        
        
      }
    />
    /*
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text>
          {hits.id}
          {hits.title}
        </Text>
        <Text>
          {JSON.stringify(hits._snippetResult)}
        </Text>
      </View>
    </View>
  );
});

const SearchBox = connectSearchBox(({ refine, currentRefinement }) => { 
  var that = this
  return (
    <TextInput
      style={{
        height: 60,
        borderWidth: 1,
        padding: 10,
        margin: 10,
        flex: 1,
      }}
      onChangeText={searchtext => this.setState({searchtext})}
      value={currentRefinement}
      placeholder={'Search a product...'}
      clearButtonMode={'always'}
      spellCheck={true}
      autoCorrect={false}
      autoCapitalize={'none'}
    />
    
  );
});
*/
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

  container: {
    flex: 10,
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
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
    fontSize: 18,
    color: 'black',
    lineHeight:30,
    marginLeft: 10,
    marginRight: 10,
    textAlign:'justify'
    //color: 'rgba(96,100,109, 1)',
  },
  cardItemText: {
    marginTop: 10,
    fontSize: 18,
    color: 'black',
    lineHeight:30,
    marginLeft: 10,
    marginRight: 10,
    textAlign:'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent:'center'
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
  },
  spinnerContainer: {
    justifyContent: 'center',
    flex: 1,
    },
    paragraph: {
        marginVertical: 8,
    }
});

