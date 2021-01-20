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
    ActivityIndicator,
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
import { WebView } from 'react-native-webview';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Speech from 'expo-speech';
import { sendWordsRead } from '../actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import platform from "../../native-base-theme/variables/platform";
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import AppSpinner from '../components/AppSpinner';
import firebase from 'firebase'
import algoliasearch from 'algoliasearch';
import { InstantSearch, connectInfiniteHits, connectSearchBox } from 'react-instantsearch-native';
import SearchBox from '../algolia/SearchBox';
import InfiniteHits from '../algolia/InfiniteHits';

class NewsBrowseScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
          webview: null,
          canGoBack: false,
          canGoForward: false,
          canDownload: false,
          loading: true,
          fileload: false,
          isModalVisible: false,
          uri: 'https://news.yahoo.com/',
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

    handleWebViewNavigationStateChange = newNavState => {
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }
        const { url } = newNavState;

        this.setState({url: url})
        if (!url){
            return
        } else {
            console.log(newNavState)
            if (newNavState.loading != this.state.loading) this.setState({loading: !this.state.loading});
            if (newNavState.canGoBack != this.state.canGoBack) this.setState({canGoBack: !this.state.canGoBack});
            if (newNavState.canGoForward != this.state.canGoForward) this.setState({canGoForward: !this.state.canGoForward});
            console.log('loading: ' + this.state.loading + ', canGoBack: ' + this.state.canGoBack + ', canGoForward: ' + this.state.canGoForward)
        }
        // handle certain doctypes
        if (url.includes('.pdf')) {
          this.webview.stopLoading();
          // open a modal with the PDF viewer
        }
    
        if (url.includes('.html')){
          this.setState({canDownload: true})
        }
        else{
          this.setState({canDownload: false})
        }
        // one way to handle a successful form submit is via query strings
        if (url.includes('?message=success')) {
          this.webview.stopLoading();
          // maybe close this view?
        }
    
        // one way to handle errors is via query string
        if (url.includes('?errors=true')) {
          this.webview.stopLoading();
        }
      };

      doDownload(){
        this.setState({fileload: true})
        Keyboard.dismiss()
        var that = this
        var URL = 'https://vocameter-scraping.herokuapp.com/?url=' + this.state.url
        fetch(URL).then((response) => response.json())
        .then(jsondata => {
          console.log(jsondata)
          that.setState({fileload:false})
          Alert.alert(
            'Do you want to save this data?',
            'Downloaded data is below\n Title: ' + jsondata.title,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
              },
              {
                text: 'Yes',
                onPress: () => {
                  firebase.firestore().collection("users").doc(this.props.user.uid).collection("news").doc('jsondata').get()
                  .then(doc => {
                    if (!doc.exists) {
                      console.log('No such document!');
                    } else {
                      var day = new Date()
                      var name = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
                      
                      var textdata = new Array()
                      textdata.push(jsondata)
                      firebase.firestore().collection("users").doc(this.props.user.uid).collection("news").doc('jsondata').set({
                        data: firebase.firestore.FieldValue.arrayUnion(jsondata)
                      },{merge: true})
                      .then(()=>{
                        Alert.alert('Done!')
                      })
                    }
                  }).catch(err => {
                    console.log('Error getting document', err);
                    this.setState({uploadStatus: err})
                  });
                },
                style: 'cancel',
              },
            ],
            {cancelable: false},
          )
        }).catch(err => {
          console.log('Error getting document', err);
          this.setState({uploadStatus: err})
        });
      }

    renderContent() { 
        return (
            <WebView
              style={styles.container}
              ref={ref => (this.webview = ref)}
              source={{ uri: 'https://news.yahoo.com/' }}
              onNavigationStateChange={this.handleWebViewNavigationStateChange.bind(this)}
            />
        );
    }

    render(){
        return (
            <View style={styles.container}>
              <Grid style={{flex: 0.05}}>
                <Col>
                  <Text>{this.state.url}</Text>                  
                </Col>
                <Col>
                  { this.state.loading && <ActivityIndicator/> }
                </Col>
              </Grid>
              { this.renderContent() }
              <Grid style={{flex: 0.1}}>
                <Col>
                {
                  this.state.canGoBack
                  &&
                  <MaterialIcons.Button
                  style={{alignItems: 'center', justifyContent:'center'}}
                  type="MaterialIcons"
                  name="keyboard-arrow-left"
                  color="black"
                  backgroundColor="white"
                  size={30}
                  onPress={() => this.webview.goBack()}
                  >
                    <Text></Text>
                  </MaterialIcons.Button>
                }
                </Col>
                <Col>
                  {
                    this.state.fileload
                    ?
                    <AppSpinner/>
                    :
                    <MaterialIcons.Button
                    disabled={!this.state.canDownload}
                    style={{alignItems: 'center', justifyContent:'center'}}
                    type="MaterialIcons"
                    name="file-download"
                    color={this.state.canDownload ? "black" : "white"}
                    backgroundColor={this.state.canDownload ? "skyblue" : "white"}
                    size={30}
                    onPress={() => this.doDownload()}
                    >
                      <Text style={{
                        color: this.state.canDownload ? "black" : "white",
                      }}>
                        Download
                      </Text>
                    </MaterialIcons.Button>
                  }
                </Col>
                <Col>
                  {
                    this.state.canGoForward
                    &&
                    <MaterialIcons.Button
                    style={{alignItems: 'center', justifyContent:'center'}}
                    type="MaterialIcons"
                    name="keyboard-arrow-right"
                    color="black"
                    backgroundColor="white"
                    size={30}
                    onPress={() => this.webview.goForward()}
                    >
                      <Text></Text>
                    </MaterialIcons.Button>
                  }
                </Col>
              </Grid>
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

export default connect(mapStateToProps)(NewsBrowseScreen);


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

