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
} from 'native-base';
import { sendWordsRead } from '../actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/MaterialIcons'
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



class OriginalcardScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
          id: '',
          text: '',
          level: '',
          title: '',
          viewword: '',
          translate: '',
          loading: false,
          fetching: false,
          setcard: false,
          isNull: false,
        };
        this.refresh()
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
      //firebase.firestore().collection("users").doc(this.props.user.uid).set({original},{merge:true})
    }

    makenewcards(){
        var original = cards
        firebase.firestore().collection("users").doc(this.props.user.uid).set({original},{merge:true})
        .then(
            this.refresh()
        )
        Alert.alert('Updated flashcards')
    }

    refresh(){
        console.log("refresh")
        firebase.firestore().collection("users").doc(this.props.user.uid).get()
        .then(doc => {
            keys = []
            if (!doc.exists) {
            console.log('No such document!');
            } else {
                info = doc.data().userinfo
                data = doc.data().original
                cards = {}
                defaultkeys = Object.keys(data)
                sortlist = new Array();//並び替えのための配列
                keys = []
                cardnum = 0
                if(defaultkeys.length!=0){
                    for(var i = 0;i < defaultkeys.length;i++){
                        cards[defaultkeys[i]] = data[defaultkeys[i]]
                        keys.push(defaultkeys[i])                        
                    }
                    console.log(cards)
                    if(keys.length==0){
                        this.setState({isNull: true})
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
                }
                else{
                    this.setState({isNull: true})
                }
                
                this.setState({setcard: true, native: info.native})
                
                console.log('keyset')
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    }

    doTranslate(text){
      this.setState({loadingWord:true})
      Keyboard.dismiss()
      var that = this
      console.log(cards[keys[sortlist[cardnum]]].translatedWord)
      if(cards[keys[sortlist[cardnum]]].translatedWord){
        that.setState({translatedWord: cards[keys[sortlist[cardnum]]].translatedWord, loadingWord:false})
      }
    } 

    nextcard(isRemember){
        this.setState({translate: ''})
        
        /*
        if(isRemember==true){
            cards[keys[cardnum]].view = false
        }
        */

       if(isRemember == true){
        if(cards[keys[sortlist[cardnum]]].remember){
          cards[keys[sortlist[cardnum]]].remember += 1
        }
        else{
          cards[keys[sortlist[cardnum]]].remember = 1
        }
      }

      //console.log(cards[keys[sortlist[cardnum]]].translateWord)
      this.setState({translatedWord: '',translatedSentence:'',switching: false})
      /*
      if(isRemember==true){
          cards[keys[sortlist[cardnum]]].view = false
      }
      */
      cards[keys[sortlist[cardnum]]].repetition += 1
      cardnum += 1
        
        console.log("cardnum: " + cardnum + " keys.length: " + keys.length)

        if(keys.length > cardnum){
            console.log("nextcard")
            
        }
        else{
            console.log("remake")
            cardnum = 0
            this.makenewcards()
        }
        
    }

    seatch_words(word){
      index
      .search({
        query:word
      })
      .then(responses => {
        // Response from Algolia:
        // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
        console.log(JSON.parse(JSON.stringify(responses.hits)));
      });
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
                <ScrollView 
                style={styles.container}
                
                refreshControl={
                    <RefreshControl
                    refreshing={!this.state.setcard}
                    onRefresh={() => this.refresh()}
                    />
                }
                >
                    <Container>
                        <Content>
                          <View>
                            {
                                this.state.isNull
                                ?
                                <Text style={styles.cardItemText}>
                                    You have no flashcards
                                </Text>
                                :
                                <Card>
                                    <CardItem style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
                                        <Text style={styles.cardItemText}>
                                            {keys[sortlist[cardnum]]}
                                        </Text>
                                    </CardItem>
                                    {
                                        this.state.loading
                                        ?
                                        <View style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
                                            <AppSpinner/>
                                        </View>
                                        :
                                        <Icon.Button
                                        style={{alignItems: 'center', justifyContent:'center'}}
                                        type="MaterialIcons"
                                        name="g-translate"
                                        color="black"
                                        backgroundColor="white"
                                        size={30}
                                        onPress={() => this.doTranslate()}
                                        >
                                            <Text>Translate</Text>
                                        </Icon.Button>
                                    }
                                    

                                    <CardItem style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
                                        <Text style={styles.cardItemText}>
                                            {this.state.translatedWord}
                                        </Text>
                                    </CardItem>

                                    <CardItem>
                                        <Left>
                                            <Icon.Button
                                            onPress={() => this.nextcard(true)}
                                            name="thumb-up"
                                            color="black"
                                            backgroundColor="pink"
                                            size={20}
                                            >
                                                <Text>Remember</Text>
                                            </Icon.Button>
                                        </Left>
                                        <Right>
                                            <Icon.Button
                                            transparent
                                            onPress={() => this.nextcard(false)}
                                            name="thumb-down"
                                            color="black"
                                            backgroundColor="lightskyblue"
                                            size={20}
                                            >
                                                <Text>Not Remember</Text>
                                            </Icon.Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                            }
                            <Text>Number of cards: {cardnum+1}/{keys.length}</Text>
                            </View>
                          </Content>
                            
                    </Container>
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

export default connect(mapStateToProps)(OriginalcardScreen);


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

