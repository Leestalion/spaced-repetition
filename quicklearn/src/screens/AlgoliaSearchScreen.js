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
import { MaterialIcons } from '@expo/vector-icons'
import platform from "../../native-base-theme/variables/platform";
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import AppSpinner from '../components/AppSpinner';
import firebase from 'firebase'
import algoliasearch from 'algoliasearch';
import { InstantSearch, connectInfiniteHits, connectSearchBox, StatusBar } from 'react-instantsearch-native';
//import BlankBox from '../algolia/BlankBox';
import SearchBox from '../algolia/SearchBox';
import InfiniteHits from '../algolia/InfiniteHits';

// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = "2WZLVNX78I";
const ALGOLIA_ADMIN_KEY = "0f4a19ceec9e5d68cd960f10ea824c4b";
const ALGOLIA_SEARCH_KEY = "05cbb0b44b0864b59541ddda65247810";

const ALGOLIA_INDEX_NAME = 'textdata';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
var index = client.initIndex('textdata');

class AlgoliaSearchScreen extends Component {
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
    }

    root = {
      Root: View,
      props: {
        style: {
          flex: 1,
        },
      },
    };

    componentWillUnmount(){
      search.client.clearCache()
      console.log("unmount")
    }

    render() {
        return (
            <View 
            style={styles.container}
            /*
            refreshControl={
                <RefreshControl
                refreshing={!this.state.setcard}
                onRefresh={() => this.refresh()}
                />
            }*/
            >
                <InstantSearch
                    searchClient={client}
                    indexName="textdata"
                    root={this.root}
                >
                <SearchBox />
                <InfiniteHits />
                </InstantSearch>
            </View>                   
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

export default connect(mapStateToProps)(AlgoliaSearchScreen);


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
