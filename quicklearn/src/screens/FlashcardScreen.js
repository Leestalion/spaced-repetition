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
} from 'native-base';
import * as Speech from 'expo-speech';
import { sendWordsRead } from '../actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import platform from "../../native-base-theme/variables/platform";
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import AppSpinner from '../components/AppSpinner';
import firebase from 'firebase'
import algoliasearch from 'algoliasearch';
import { InstantSearch, connectInfiniteHits, connectSearchBox } from 'react-instantsearch-native';
import SearchBox from '../algolia/SearchBox';
import InfiniteHits from '../algolia/InfiniteHits';


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
          isSentenceVisible: false,
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

    refresh(){
        console.log("refresh")
        this.setState({refreshing: true,translatedWord: '',translatedSentence:'',answer:''})
        firebase.firestore().collection("users").doc(this.props.user.uid).get()
        .then(async(doc) => {
            if (!doc.exists) {
              console.log('No such document!');
            } else {
                data = doc.data().wordlist
                cards = JSON.parse(JSON.stringify(data))
                let defaultkeys = Object.keys(data)
                let value = defaultkeys.map(element => {
                  return data[element].repetition
                });
                let minimum = value.indexOf(Math.min.apply(null, value));
                
                console.log(defaultkeys.length)

                let final = defaultkeys.filter(element => {
                  return data[element].repetition == minimum
                });

                console.log(final.length)

                cardnum = 0;
                keys = new Array();
                for(var i = 0; i < 3; i++){
                  var r = Math.floor(Math.random() * final.length);
                  keys.push(final[r])
                }
                
                
                await this.setState({setcard: true, isNull:false,data: data, refreshing: false})
                //console.log(data)
                
                console.log(keys)
                console.log('keyset')
                
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            this.setState({error: err})
        });
    }

    doTranslate(text){
      this.setState({loadingWord:true})
      Keyboard.dismiss()
      this.setState({translatedWord: cards[keys[cardnum]].translatedWord, loadingWord:false})
    } 

    nextcard(isRemember){
      if(isRemember == true){
        if(cards[keys[cardnum]].remember){
          cards[keys[cardnum]].remember += 1
        }
        else{
          cards[keys[cardnum]].remember = 1
        }
      }

      //console.log(cards[keys[cardnum]].translateWord)
      this.setState({translatedWord: '',translatedSentence:'',switching: false})
      /*
      if(isRemember==true){
          cards[keys[cardnum]].view = false
      }
      */
      var day = new Date()
      var name = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
      cards[keys[cardnum]].repetition += 1
      cards[keys[cardnum]].lastTime = name
      cardnum += 1
      
      console.log("cardnum: " + cardnum + " keys.length: " + keys.length)

      if(cardnum == 3){
        const wordlist = cards
        var that = this
        firebase.firestore().collection("users").doc(this.props.user.uid).set({wordlist},{merge:true})
        .then(
            Alert.alert(
              "Good job!",
              "Success to save the data",
              [                
                { text: "OK", onPress: () => that.props.navigation.popToTop() }
              ],
              { cancelable: false }
            )
              
        )
      }
    }

    doTTS(word){
      Speech.speak(word, {language:'en'})
    }

    render() {
        if(this.state.setcard==false){
            return(
              <Container style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                  <AppSpinner/>
                  {this.state.error}
              </Container>
            )
        }
        else{      
            return (
                <ScrollView 
                style={styles.container}
                
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refresh()}
                    />
                }
                >
                  <SafeAreaView>
                    <Container>
                      <Content>
                        {/*<Tabs>
                          <Tab heading={
                            <TabHeading>
                              <MaterialCommunityIcons
                                name="cards-outline"
                                size={30}
                                style={{ marginBottom: -3 }}
                              />
                              <Text>Flashcard</Text>
                            </TabHeading>}
                          >*/}
                            {
                                this.state.isNull
                                ?
                                <Text style={styles.cardItemText}>
                                    You have no flashcards
                                </Text>
                                :
                                (
                                  cardnum < 3
                                  ?
                                  <Card>
                                    <CardItem style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
                                        <Text style={styles.cardItemText}>
                                            {keys[cardnum]}
                                        </Text>
                                    </CardItem>
                                        <Grid>
                                          <Col>
                                            {
                                              this.state.loadingWord
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
                                                onPress={() => this.doTranslate(keys[cardnum])}
                                              >
                                                  <Text>Translate</Text>
                                              </MaterialCommunityIcons.Button>
                                            }
                                          </Col>
                                          <Col>
                                            <FontAwesome5.Button
                                              style={{alignItems: 'center', justifyContent:'center'}}
                                              type="FontAwesome5"
                                              name="volume-up"
                                              color="black"
                                              backgroundColor="white"
                                              size={30}
                                              onPress={() => this.doTTS(keys[cardnum])}
                                            >
                                                <Text>Play</Text>
                                            </FontAwesome5.Button>
                                          </Col>
                                          
                                        </Grid>
                                    <Form>
                                        <Input
                                          multiline={true}
                                          style={styles.cardItemText}
                                          editable={this.state.switching}
                                          onChangeText={(translatedWord) => this.setState({translatedWord})}
                                          value={this.state.translatedWord}
                                        />
                                    </Form>

                                    <CardItem>
                                        <Left>
                                            <MaterialCommunityIcons.Button
                                            onPress={() => this.nextcard(true)}
                                            name="thumb-up"
                                            color="black"
                                            backgroundColor="pink"
                                            size={20}
                                            >
                                                <Text>Remember</Text>
                                            </MaterialCommunityIcons.Button>
                                        </Left>
                                        <Right>
                                            <MaterialCommunityIcons.Button
                                            transparent
                                            onPress={() => this.nextcard(false)}
                                            name="thumb-down"
                                            color="black"
                                            backgroundColor="lightskyblue"
                                            size={20}
                                            >
                                                <Text>Don't Remember</Text>
                                            </MaterialCommunityIcons.Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                                :
                                <Text style={styles.cardItemText}>
                                    You checked all flashcards
                                </Text>
                                )
                            }
                          {
                            !this.state.isNull && cardnum < 3
                            &&
                            <Text>Number of cards: {cardnum+1}/{keys.length}</Text>
                          }
                      </Content>
                    </Container>
                  </SafeAreaView>
                </ScrollView>                   
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

