import React, {Component} from 'react';
import {fetchSingleText} from '../actions';
import {connect} from 'react-redux';
import { 
    Platform,
    StyleSheet, 
    ScrollView, 
    FlatList,
    AsyncStorage, 
    TextInput, 
    Switch,
    Card,
    CardItem, 
    Modal, 
    SafeAreaView, 
    Alert,
    Linking,
    Keyboard,
    KeyboardAvoidingView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Image
  } from 'react-native';
import {
    Container,
    Content,
    Text,
    View,
    Button,
    Left,
    Body,
    Right,
    Form,
    Label,
    Item,
    Input,
    List,
    ListItem,
    Tab,
    Tabs,
    TabHeading,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { sendWordsRead } from '../actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import platform from "../../native-base-theme/variables/platform";
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import AppSpinner from '../components/AppSpinner';

const wordfamily = require('../articles/lemma.json');

function sort_object(obj) {
  items = Object.keys(obj).map(function(key) {
      return [key, obj[key]];
  });
  items.sort(function(first, second) {
      return first[1] - second[1];
  });
  sorted_obj={}
  $.each(items, function(k, v) {
      use_key = v[0]
      use_value = v[1]
      sorted_obj[use_key] = use_value
  })
  return(sorted_obj)
}
function highlight(text,words){
    var highlightText = new Object();
    var arr = new Array()
    var dict = new Object()
    var value = ''

    for(var i = 0;i < text.length;i++){
      //console.log("text["+i+"] "+text[i].trim().replace(/[_:;.,!?\"() ]+/g, ''))
      if(wordfamily[text[i].trim().replace(/[_:;.,!?\"() ]+/g, '')]){
        var check = wordfamily[text[i].trim().replace(/[_:;.,!?\"() ]+/g, '')]
      }
      else{
        var check = text[i].trim().replace(/[_:;.,!?\"() ]+/g, '')
      }
  
      if(words[check]){      
        if(words[check].understand <= 0.8){
          var separate = text[i].split(text[i].replace(/[_:;.,!?\"() ]+/g, ''))
          //console.log(separate)
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
      }
      else{
        if(check=='newline'){
          value+='\n'
          continue;
        }
        else{
          value += text[i]
        }
      }
  
      value += ' '
    }
  
   /* 
    var arr = new Array()
    var dict = new Object()
    var value = text[0] + ' '
    var current = highlightText[text[0]]
  
    for(var i = 1;i < text.length;i++){   
      //console.log("text["+i+"] "+text[i])   
      if(highlightText[text[i].replace(/[_:;.,!?\"() ]+/g, '')] == true){
        dict["isHighlighted"] = false
        dict["value"] = value
        arr.push(dict)
        dict = {}
        value = ''
        dict["isHighlighted"] = true
        dict["value"] = text[i].replace(/[_:;.,!?\"() ]+/g, '')
        arr.push(dict)
        dict = {}
        if(text[i] == text[i].replace(/[_:;.,!?\"() ]+/g, '')){
          value = ''
        }
        else{
          value = text[i].replace(text[i].replace(/[_:;.,!?\"() ]+/g, ''),'')
        }
      }
      else{
        value += text[i]
      }
  
      value += ' '
    }*/
  
    dict["isHighlighted"] = false
    dict["value"] = value
    arr.push(dict)
  
    //console.log(arr)
  
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

class NewsViewScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
          text: '',
          level: '',
          title: '',
          unknownlist: [],
          unknownkeys: [],
          listUpdate: 0,
          setText: false,
          inputtext:'',
          inputUnknown:'',
          translate: '',
          fetching: false,
          switching: false,
          translationMode: false,
        };
        
    }

    componentDidMount(){
      this.setText()
    }

  setText = async() => {
    var Ref = new Object()
    var notRef = new Array()
    var orilinks = this.props.navigation.state.params.links
    const linksText = Object.keys(orilinks)
    const text = this.props.navigation.state.params.text
    for(let i = 0;i < linksText.length; i++){
      if(text.indexOf(linksText[i]) != -1){
        Ref[text.indexOf(linksText[i])] = linksText[i]
      }
      else{
        notRef.push(linksText[i])
      }
    }

    var refkeys = Object.keys(Ref)
    refkeys.sort(function(a,b){
      return a-b;
    });

    var linksKeys = new Array
    for(let i = 0;i < refkeys.length; i++){
      linksKeys.push(Ref[refkeys[i]] + '[' + (i+1) + ']')
    }

    linksKeys = linksKeys.concat(notRef)

    console.log(linksKeys)
    await this.setState({
      text: text,
      title: this.props.navigation.state.params.title,
      native: this.props.navigation.state.params.native,
      wordlist: this.props.navigation.state.params.wordlist,
      links: this.props.navigation.state.params.links,
      linksKeys: linksKeys,
      images: this.props.navigation.state.params.images,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    })

    
    await this.setState({setText:true})
  }
  
    doTranslate(){
      this.setState({loading:true})
      Keyboard.dismiss()
      var that = this
      var URL = 'https://script.google.com/macros/s/AKfycbzSytw34AJHTQw-09gjssPE8Q9s9sLJv2HN6wQheM_9g4egOExa/exec?text=' + this.state.inputtext + '&source=en&target=' + this.state.native
      fetch(URL).then((response) => response.json())
      .then(jsondata => {
        that.setState({translate: JSON.parse(JSON.stringify(jsondata)).translated, loading:false})
    })
  }

  registerWord = (word) =>{
    var unknownlist = this.state.unknownlist
    var unknownkeys = this.state.unknownkeys
    var copy = word
    if(wordfamily[word]){
      word = wordfamily[word]
    }

    if(this.state.wordlist[word]){
      var data = this.state.wordlist[word]
      if(unknownlist.indexOf(word) == -1){
        Alert.alert(
          'Do you want to register \n\"' + word + '\"\n as an unknown one?',
          null,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
            },
            {
              text: 'Yes',
              onPress: () => {
                var Exp =new RegExp('[.#\n\t][A-Za-z0-9 ,\"\'\-]*(' + copy + ')[A-Za-z0-9 ,\"\'\-]*[_:;.!?\"\'()\n\t]',"ig")
                var sentence = this.state.text.match(Exp)

                var pushdata = {
                  "word":word,
                  "rank":data.rank,
                  "parts":data.parts,
                  "understand":data.understand,
                  "lastTime":today,
                  "checked":true
                }
                console.log('Sentence: ' + sentence)

                if(sentence != null){
                  var sentencelist = []
                  /*for(let i = 0;i<sentence.length;i++){
                    sentencelist.push(sentence[i].replace(/[_:;.,!?\"() \n\t\#]+/, ''))
                  }*/
                  pushdata["sentence"] = sentence[0].replace(/[_:;.,!?\"() \n\t\#]+/, '')          
                  if(word != copy){
                    console.log(word + "," + copy)
                    pushdata["original"] = copy
                    //console.log(pushdata)
                  }

                  console.log(pushdata.sentence)
                  unknownlist.push(pushdata)
                  unknownkeys.push(word)
                  this.setState({unknownlist: unknownlist, unknownkeys: unknownkeys, listUpdate: this.state.listUpdate + 1, inputUnknown:''})
                }
                else{
                  Alert.alert(
                    'Fail to register',
                    'There are no sentences including \"' + word + '\"',
                  )
                }
              },
              style: 'cancel',
            },
          ],
          {cancelable: false},
        )
      }else{
        Alert.alert(
          'Fail to register',
          '\"' + word + '\" has already registered',
        )
      }
    }
    else{
      Alert.alert(
        'Fail to register',
        word + 'is not a vocabulary word',
      )
    }
  }

  renderItem = ({ item,index }) => {
    return (
      <ListItem style={{backgroundColor:'white', paddingTop: 15, paddingBottom: 15, marginLeft: 0 }}>
        <Text style={styles.getStartedText}>{item}</Text>
      </ListItem>
    );
  };

  renderImage = ({ item,index }) => { 
    console.log(item)
    return (
      <ListItem style={{justifyContent:'center',backgroundColor:'white'}}>
            <Image
                source={{ uri: item}}
                style={{ width: this.state.width, height: this.state.height/4, alignSelf: 'center' }}
                resizeMode='contain'
            />
          </ListItem>
    );
  };

  renderLink = ({ item,index }) => {
    var linkname = item.replace(/\[[0-9]+\]/,"")
    return (
        <ListItem style={{justifyContent:'center',backgroundColor:'white'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
                Linking.openURL(this.state.links[linkname])
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>        
        </ListItem>
    );
  };

  render() {
    if(this.state.setText==false){
      return(
          <View style={{alignContent: 'center',alignItems: 'center', justifyContent:'center'}}>
              <AppSpinner/>
          </View>
      )
    }
    else{ 
      var timeStart = new Date()
      return (
        <Container>
          <Tabs>
            <Tab heading={
              <TabHeading>
                <MaterialCommunityIcons
                  name="file-document-box-outline"
                  size={30}
                  style={{ marginBottom: -3 }}
                />
                <Text>Text</Text>
            </TabHeading>
            }>
              <View style={{flex:1}}>
                <Content>
                  <List>                  
                    <ListItem>
                      <Body>
                        <Text>
                          Highlight your unknown words
                        </Text>
                      </Body>
                      <Right>
                        <Switch
                          style={{alignItems: 'center'}}
                          onValueChange = {() => this.setState({switching: !this.state.switching})}
                          value = {this.state.switching}
                        />
                      </Right>
                    </ListItem>
                  </List>
                </Content>
              </View>
              <View style={{flex:10}}>
                <Content>                        
                  {/*console.log("easyquiz" + JSON.stringify(easyquiz))*/}
                  {
                    !this.state.setText
                    ? 
                    <AppSpinner/>
                    :
                    <ScrollView>
                      {
                        this.state.switching
                        ?
                        highlight(this.state.text.replace(/\r?\n/g,' newline ').split(/ {1,}/g),this.state.wordlist)
                        :
                        
                        Platform.OS === 'ios'
                        ?
                        <TextInput style={styles.getStartedText} editable={false} multiline>
                          {this.state.text}
                        </TextInput>
                        :
                        <Text style={styles.getStartedText}>
                          {this.state.text}
                        </Text>
                        
                      }
                      <Button 
                        block success
                        onPress={() => {
                          var timeStop = new Date()
                          var ms = timeStop.getTime() - timeStart.getTime();
                          var s = ms / 1000
                          this.props.navigation.navigate('Rating', {
                            title: this.state.title,
                            text:this.state.text,
                            level:this.state.level,
                            id:'news',
                            time: s,
                            unknownlist: this.state.unknownlist,
                            unknownkeys: this.state.unknownkeys,
                          })
                        }}
                      >
                        <Text>Finish</Text>
                      </Button>
                    </ScrollView> 
                  }
                </Content>
              </View>
            </Tab>
            <Tab heading={
              <TabHeading>
                <MaterialCommunityIcons
                  name="image-area"
                  size={30}
                  style={{ marginBottom: -3 }}
                />
                <Text>Images</Text>
              </TabHeading>
            }>      
              <FlatList 
                data={this.state.images}
                renderItem={this.renderImage.bind(this)}
                keyExtractor={(item,index) => index.toString()}
              />
            </Tab>
            <Tab heading={
              <TabHeading>
                <MaterialCommunityIcons
                  name="link-variant"
                  size={30}
                  style={{ marginBottom: -3 }}
                />
                <Text>Links</Text>
              </TabHeading>
            }>
              <FlatList 
                data={this.state.linksKeys}
                renderItem={this.renderLink.bind(this)}
                keyExtractor={(item,index) => index.toString()}
              />
            </Tab>
            <Tab heading={
              <TabHeading>
                <MaterialCommunityIcons
                  name="google-translate"
                  size={30}
                  style={{ marginBottom: -3 }}
                />
                <Text>Translate</Text>
              </TabHeading>
            }>
              <Content>
                  <Grid>
                    <Col>
                      <Form>
                        <Item floatingLabel>
                          <Label>Word(s)</Label>
                          <Input 
                            autoCapitalize="none"
                            onChangeText={inputtext => this.setState({inputtext})}
                            clearButtonMode="always"
                            value={this.state.inputtext}
                          />
                        </Item>
                      </Form>
                    </Col>
                    <Col style={{marginTop: 15}}>
                      {
                        this.state.loading
                        ?
                        <View style={{alignItems: 'center',justifyContent:'center'}}>
                          <AppSpinner/>
                        </View>
                        :
                        <MaterialIcons.Button
                          style={{alignItems: 'center', justifyContent:'center'}}
                          name="g-translate"
                          color="black"
                          backgroundColor="lightskyblue"
                          size={30}
                          onPress={() => this.doTranslate()}
                        >
                          <Text>Translate</Text>
                        </MaterialIcons.Button>
                      }          
                    </Col>
                  </Grid>
                    <Text style={styles.getStartedText}>
                      {this.state.translate}
                    </Text>
              {/*
            </Tab>
            <Tab heading={
              <TabHeading>
                <MaterialCommunityIcons
                  name="pencil"
                  size={30}
                  style={{ marginBottom: -3 }}
                />
                <Text>Register</Text>
              </TabHeading>
            }>*/}
                  <Form>
                    <Item floatingLabel>
                      <Label>Word(s)</Label>
                      <Input 
                        autoCapitalize="none"
                        onChangeText={inputUnknown => this.setState({inputUnknown})}
                        clearButtonMode='always'
                        value={this.state.inputUnknown}/>
                    </Item>
                  </Form>
                  <MaterialCommunityIcons.Button
                    style={{alignItems: 'center', justifyContent:'center'}}
                    type="MaterialIcons"
                    name="square-edit-outline"
                    color="black"
                    backgroundColor="lightskyblue"
                    size={30}
                    onPress={() => {
                      Keyboard.dismiss()
                      this.registerWord(this.state.inputUnknown)
                    }}
                  >
                    <Text>Register the unknown word</Text>
                  </MaterialCommunityIcons.Button>
                  {
                    this.state.unknownlist.length == 0
                    ?
                    <Text style={styles.getStartedText}>No words are registered</Text>
                    :
                    <Text style={styles.getStartedText}>The unknownwords you registered</Text>
                  }
                  <FlatList 
                    data={this.state.unknownkeys}
                    execData={this.state.listUpdate}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item) => item}
                  />
                </Content>
            </Tab>
          </Tabs>
        </Container>
      );
    }
  }
}

const mapStateToProps = ({text, user}) => {
    const {
        singleText,
        singleTextLoading,
    } = text;
    const {token} = user;

    return {
        singleText,
        singleTextLoading,
        token,
    };
};


export default connect(mapStateToProps, {sendWordsRead})(NewsViewScreen);

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
    marginHorizontal: 10,
    textAlign:'justify',
    //color: 'rgba(96,100,109, 1)',
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
    },
});

