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
    Picker,
    Icon,
    List,
    ListItem,
} from 'native-base';
import { sendWordsRead } from '../actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { MaterialCommunityIcons, FontAwesome  } from '@expo/vector-icons'
import platform from "../../native-base-theme/variables/platform";
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import AppSpinner from '../components/AppSpinner';
import firebase from 'firebase'
import algoliasearch from 'algoliasearch';
import { InstantSearch, connectInfiniteHits, connectSearchBox } from 'react-instantsearch-native';
import SearchBox from '../algolia/SearchBox';
import InfiniteHits from '../algolia/InfiniteHits';

function highlight(text,word){
  if(cards[word].original){
    word = cards[word].original
  }
  console.log(word)
  var highlightText = new Object();
  var arr = new Array()
  var dict = new Object()
  value = ''
  for(var i = 0;i < text.length;i++){
    if(text[i].replace(/[_:;.,!?\"() ]+/g, '').toLowerCase() == word){
        var separate = text[i].split(text[i].replace(/[_:;.,!?\"() ]+/g, ''))
        value+=separate[0]
        dict["isHighlighted"] = false
        dict["value"] = value
        arr.push(dict)
        dict = {}
        value = ''
        dict["isHighlighted"] = true
        dict["value"] = text[i].replace(/[_:;.,!?\"() ]+/g, '')
        arr.push(dict)
        dict = {}
        if(separate[1] == undefined){
          value = ''
        }
        else{
          value = separate[1]
        }
      }
      else{
        value += text[i]
      }
      value += ' '
    }    
  

  dict["isHighlighted"] = false
  dict["value"] = value
  arr.push(dict)

  if(Platform.OS === 'ios'){
    return(
      <TextInput style={styles.getStartedText} editable={false} multiline>
        {arr.map(({ value, isHighlighted }, index)=>{
          const style = {
            backgroundColor: isHighlighted ? 'yellow' : 'transparent',
            marginTop: 10,
            fontSize: 18,
            color: 'black',
            lineHeight:30,
            marginHorizontal: 10,
            textAlign:'justify'
          };
          //console.log(index)
          //console.log(isHighlighted)
          //console.log(value)
          return(
            <TextInput key={index} style={style} editable={false} multiline>
                {value}
            </TextInput>
          )
        })}
      </TextInput>
    )
  }
  else{
    return(
      <Text style={styles.getStartedText}>
        {arr.map(({ value, isHighlighted }, index)=>{
          const style = {
            backgroundColor: isHighlighted ? 'yellow' : 'transparent',
            marginTop: 10,
            fontSize: 18,
            color: 'black',
            lineHeight:30,
            marginHorizontal: 10,
            textAlign:'justify'
          };
          //console.log(index)
          //console.log(isHighlighted)
          return(
            <Text key={index} style={style}>
                {value}
            </Text>
          )
        })}
      </Text>
    )
  }
}

class OnlineTestScreen extends Component {
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
          acceptPassword: false,
          answers: [],
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
        firebase.firestore().collection("users").doc(this.props.user.uid).get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
              data = doc.data().test1
              this.setState({selected: data.day1, setcard: true, selectedIndex: data.day1.number})
              //this.SetDatasource(data.day1)
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }

    

    SetDatasource(itemValue){
        cards = JSON.parse(JSON.stringify(itemValue.words))
        console.log(cards)
        defaultkeys = Object.keys(itemValue.words)
        var dataSource = new Array();
        for(var i = 0;i<defaultkeys.length;i++){
          var element = new Object();
          element.word = defaultkeys[i]
          element.sentence = cards[defaultkeys[i]].sentence
          element.answer = ""
          dataSource.push(element)
        }
        console.log('keyset')
        this.setState({acceptPassword: true,dataSource: dataSource})
    }

    senddata(){
      var path = "day" + this.state.selectedIndex
      var test1 = data
      test1[path].done = true;
      test1[path].word = cards;
      console.log(test1)
      var URL = 'https://script.google.com/macros/s/AKfycbzx0zk0UFWRLTpAGvsDIaBJMBox2CAs5999Iiz5-58GDyCecuY/exec?uid=' + this.props.user.uid + '&message=I took today\'s test'
      fetch(URL)
      firebase.firestore().collection("users").doc(this.props.user.uid).set({test1},{merge:true})
      .then(
          this.setState({selected: '', password: '', selectedIndex: '', dataSource: null, acceptPassword: false})          
      )
      Alert.alert('Done')
    }

    renderHeader = () => {
      //View to set in Header
      return (
        <View>
          <Text style={styles.getStartedText}> Type the meaning of highlighted word. </Text>
        </View>
      );
    };

    renderItem = ({ item,index }) => {
      return (
        
        <ListItem style={{backgroundColor:'white', paddingTop: 15, paddingBottom: 15, marginLeft: 0 }}>
          <Form>
            <Text style={styles.getStartedText}>No. {index+1}</Text>
            {highlight(item.sentence.split(/ {1,}/g),item.word)}
            <Item floatingLabel>
                <Label>Your Answer</Label>
                <Input 
                    onChangeText={(answer) => cards[item.word].answer = answer}
                    value={cards[item.word].answer}
                />
            </Item>
          </Form>
        </ListItem>
      );
    };

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
                    <Container style={{flexGrow: 1}}>
                        <Content style={{flexGrow: 1}}>
                            <View style={{flexGrow: 1}}>
                            
                              <Text style={styles.getStartedText}>
                                Select the test you want to take
                              </Text>
                        
                                <Picker
                                    mode="dropdown"
                                    placeholder="Press here"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    selectedValue={this.state.selected}
                                    onValueChange={async(itemValue) => {
                                        await this.setState({ selected: itemValue, password: '', selectedIndex: itemValue.number})                                      
                                        
                                    }}
                                    > 
                                        <Picker.Item label="Day1" value={data.day1} />
                                        <Picker.Item label="Day2" value={data.day2} />
                                        <Picker.Item label="Day3" value={data.day3} />
                                        <Picker.Item label="Day4" value={data.day4} />
                                </Picker>
                                
                              
                                {
                                    !this.state.selected.done
                                    ?

                                    (
                                      this.state.acceptPassword
                                      ?
                                      (
                                        this.state.dataSource == null
                                        ?
                                        <Text style={{alignItems: "center"}}>No text data in this category</Text>
                                        :
                                        <View>
                                          <FlatList
                                            ListHeaderComponent={this.renderHeader}
                                            data={this.state.dataSource}
                                            renderItem={this.renderItem.bind(this)}
                                            keyExtractor={item => item.word}
                                          />
                                          <FontAwesome.Button
                                            style={{alignItems: 'center', justifyContent:'center'}}
                                            name="send"
                                            color="black"
                                            backgroundColor="orangered"
                                            size={30}
                                            onPress={() => {
                                              Keyboard.dismiss()
                                              Alert.alert(
                                                'Are you sure to send your answer?',
                                                'You can take this test only one time.\n Please don\'t forget to take a screen shot of your answer to backup',
                                                [
                                                  {
                                                    text: 'OK',
                                                    onPress: () => this.senddata()},
                                                  {
                                                    text: 'Cancel',
                                                    onPress: () => console.log('cancel pressed'),
                                                    style: 'destructive',
                                                  },
                                                ],
                                              )
                                            }}
                                          >
                                            <Text>Finish and send results</Text>
                                          </FontAwesome.Button>
                                        </View>
                                      )
                                      :
                                          <Form>
                                              <Item 
                                                  floatingLabel
                                                  success={this.state.selected.password == this.state.password ? true : false}
                                                  error={this.state.selected.password != this.state.password ? true : false}
                                              >
                                                  <Label>Password</Label>
                                                  <Input 
                                                      secureTextEntry={true}
                                                      onChangeText={(password) => this.setState({password})}
                                                      value={this.state.password}
                                                  />
                                                  {
                                                      this.state.selected.password == this.state.password
                                                      ?
                                                      <Icon name='checkmark-circle' />
                                                      :
                                                      <Icon name='close-circle' />
                                                  }
                                              </Item>
                                              {
                                                  this.state.selected.password == this.state.password
                                                  &&
                                                  <MaterialCommunityIcons.Button
                                                      style={{alignItems: 'center', justifyContent:'center'}}
                                                      name="play-circle-outline"
                                                      color="black"
                                                      backgroundColor="lightgreen"
                                                      size={30}
                                                      onPress={() => {
                                                          Keyboard.dismiss()                                                          
                                                          this.SetDatasource(this.state.selected)  
                                                      }}
                                                  >
                                                      <Text>Start</Text>
                                                  </MaterialCommunityIcons.Button>
                                              }
                                          </Form>
                                      )
                                    :
                                    <Text style={styles.getStartedText}>
                                        You have already submitted
                                    </Text>
                                }

                            </View>
                          </Content>
                    </Container>                 
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

export default connect(mapStateToProps)(OnlineTestScreen);


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

