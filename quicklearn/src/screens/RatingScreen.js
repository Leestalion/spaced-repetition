import React, { Component } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Modal,
  AsyncStorage,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { 
  Picker,
  Button,
  Container,
  Content,
  Text,
  View,
  ListItem,
  Left,
  Body,
  Right,
  Spinner,
} from 'native-base';
import { WebBrowser } from 'expo';
import {connect} from 'react-redux';
import { sendWordsRead } from '../actions';
import { MonoText } from '../components/StyledText';
import {CheckBox, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import platform from '../../native-base-theme/variables/platform';
import AppSpinner from '../components/AppSpinner';
import firebase from 'firebase'


const stopwords = [
  'a','about','above','after','again','against','all','am','an','and','any','are','aren\'t','as','at','be','because','been','before','being','below','between','both','but',
  'by','can','can\'t','cannot','could','couldn\'t','did', 'didn\'t','do','does','doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few','for', 'from', 'further', 'had',
  'hadn\'t', 'has', 'hasn\'t', 'have','haven\'t', 'having','he', 'he\'d','he\'ll','he\'s','her','here','here\'s','hers','herself','him','himself','his','how','how\'s','i',
  'i\'d','i\'ll','i\'m','i\'ve','if','in','into','is','isn\'t','it','it\'s','its','itse\'lf','let\'s','me','more','most','mustn\'t','my','myself','no','nor','not','of','off',
  'on','once','only','or','other','ought','our','ours','ourselves','out','over','own','same','shan\'t','she','she\'d','she\'ll','she\'s','should','shouldn\'t','so','some',
  'such','se','than','that','that\'s','the','their','theirs','them','themselves','then','there','there\'s','these','they','they\'d','they\'ll','they\'re','they\'ve','this','those',
  'through','to','too','under','until','up','very','was','wasn\'t','we','we\'d','we\'ll','we\'re','we\'ve','were','weren\'t','what','what\'s','when','when\'s','where','where\'s',
  'which','while','who','who\'s','whom','why','why\'s','with','won\'t','would','wouldn\'t','you','you\'d','you\'ll','you\'re','you\'ve','your','yours','yourself','yourselves',
];

class RatingScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  

  constructor(props) {
    super(props)
    this.state = {
      difficulty:'',
      selected: '',
      Update: 0,
      loading: false,
      Putnow: false,
      uploadStatus: "",
    }
    
  }

  componentDidMount(){
    var getday = new Date()
    today = getday.getFullYear() + "/" + (getday.getMonth()+1) + "/" + getday.getDate()
    this.doGet()
  }

  doGet = async() =>{
    this.setState({loading: true})
    var that = this
    var storageRef = firebase.storage().ref(this.props.user.uid + '-wordlist.json');
    storageRef.getDownloadURL().then(function(url) {
      fetch(url)
      .then((response) => response.json())
      .then(jsondata => {
        mywordlist = JSON.parse(JSON.stringify(jsondata))
        console.log('wordlist loaded')
        that.question(mywordlist)
    }).catch(function(error) {
      console.log(error)
    });
  })
  }

  question = async(myword) =>{
    await this.setState({
      text: this.props.navigation.state.params.text,
      level: this.props.navigation.state.params.level,
      title: this.props.navigation.state.params.title,
      id: this.props.navigation.state.params.id,
      time: this.props.navigation.state.params.time,
      unknownlist: this.props.navigation.state.params.unknownlist,
      unknownkeys: this.props.navigation.state.params.unknownkeys,
    })

    const str = this.state.text.toLowerCase().trim().replace(/[_:;.,!?\"() ]+/g, '*');

    console.log("Make str");
    const words = str.split('*');
    
    const words2 = words.filter(words => words.length > 1 && words.match(/^[a-zA-Z]+$/));
    console.log("Make result");

    const words3 = words2.filter(ifnotstopwords)
    const finalresult = words3.filter(ifnotnames)

    this.setState({
      numWords: finalresult.length,
    })
    //const level = this.props.navigation.state.params.level

    //const Qlistfalse = []
    //const Qlisttrue = []

    EasyQ = [].concat(this.state.unknownlist)
    BalanceQ = [].concat(this.state.unknownlist)
    HardQ = [].concat(this.state.unknownlist)

    const keycheck = [].concat(this.state.unknownkeys)

    var countNewwords = 0
    
    const wordfamily = require('../articles/lemma.json');
    console.log("Make quiz");

    for(let i = 0; i < finalresult.length; i++){
      const copy = finalresult[i].toString()
      if(wordfamily[finalresult[i]]){
        finalresult[i] = wordfamily[finalresult[i]]
      }
      if(myword[finalresult[i]]){
        //console.log(keycheck.indexOf(finalresult[i]))
        if(keycheck.indexOf(finalresult[i]) == -1){
          keycheck.push(finalresult[i])
          var value = finalresult[i].toString()

          var Exp =new RegExp('[\.#\n\t][A-Za-z0-9 ,\"\'\-]*(' + copy + ')[A-Za-z0-9 ,\"\'\-]*[_:;\.!?\"\'()\n\t]',"ig")
          var sentence = this.state.text.match(Exp)

          //console.log(sentence)
          var pushdata = {
            "word":value,
            "rank":myword[finalresult[i]].rank,
            "parts":myword[finalresult[i]].parts,
            "understand":myword[finalresult[i]].understand,
            "read":myword[finalresult[i]].read,
            "checked":false
          }
          var sentencelist = []
          if(sentence != null){            
            /*for(let i = 0;i<sentence.length;i++){
              sentencelist.push(sentence[i].replace(/[_:;.,!?\"() \n\t\#]+/, ''))
            }*/
            pushdata["sentence"] = sentence[0].replace(/[_:;.,!?\"() \n\t\#]+/, '')
          }

          if(finalresult[i] != copy){
            //console.log(finalresult[i] + "," + copy)
            pushdata["original"] = copy
            //console.log(pushdata)
          }

          if(myword[finalresult[i]].read == false){
            countNewwords += 1
            myword[finalresult[i]].read = true
          }

          if(myword[finalresult[i]].understand <= 0.85){
            HardQ.push(pushdata)
            if(myword[finalresult[i]].understand <= 0.80){
              BalanceQ.push(pushdata)
              if(myword[finalresult[i]].understand <= 0.75){
                EasyQ.push(pushdata)
              }
            }
          }
        }
      }
    }
    console.log(countNewwords)
    console.log("End quiz");

    console.log(EasyQ)
    this.setState({loading: false, numNewwords: countNewwords, wordlist: myword})
    //console.log('dataSource'+this.state.dataSource)
  }

  setquestion(itemValue){
    this.setState({difficulty:itemValue})
    switch(itemValue){
      case 'easy':
        list = EasyQ
        console.log(list)
        this.setState({dataSource: EasyQ})
        break;
      case 'balance':
        list = BalanceQ
        console.log(list)
        this.setState({dataSource: BalanceQ})
        break;
      case 'hard':
        list = HardQ
        this.setState({dataSource: HardQ})
        break;
    }
    //console.log('dataSource'+this.state.dataSource)
  }

  doCheck(str){
    //console.log("Before" + JSON.stringify(list))
    //復習リストに入れるための処理
    for(var i = 0;i<list.length;i++){
      if(list[i].word == str){
        console.log(list[i].word)
        //checkがtrueなら未知単語
        list[i].checked = !list[i].checked
        //既知単語リストに入る場合今日の日付を追加
        if(list[i].checked && list[i].lastTime != today){
          list[i].lastTime = today
        }
        else if(!list[i].checked && list[i].repetition == undefined){
          //誤入力の場合は初期化
          delete list[i].lastTime
        }
        
        break;
      }
    }

    //console.log("After" + JSON.stringify(list))
    this.setState({dataSource:list,Update: this.state.Update + 1})
  }

  doPut(){
    this.setState({Putnow:true})

    //await AsyncStorage.setItem('ExpResult_' + this.props.user.uid + '_' + this.state.id, JSON.stringify(data));
    //console.log('put data!-' + 'ExpResult_' + this.props.user.uid + '_' + this.state.id);
    const { popToTop } = this.props.navigation;
    console.log(this.state.difficulty)    

    firebase.firestore().collection("users").doc(this.props.user.uid).get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
        var id = this.state.id
        
        //今回読んだテキストのデータを保存
        var data = doc.data().data;

        var newdata = new Object()
        if(isNaN(id)){
          var check = -1
          for(let i = 0;i < Object.keys(data["news"]).length;i++){
            if(data["news"]["N-"+(i+1)].title == this.state.title){
              //console.log('newdata: ' + data["news"]["N-"+(i+1)].title)
              check = i+1
              break;
            }
          }
          
          newdata["title"] = this.state.title
          newdata["difficulty"] = this.state.difficulty
          newdata["time"] = this.state.time
          console.log(check)
          if(check == -1){
            data["news"]['N-'+(Object.keys(data["news"]).length+1)] = newdata
          }
          else{
            data["news"]['N-'+check] = newdata
          }          
        }
        else{
          newdata = {
            [id]:{
              difficulty:this.state.difficulty,
              time: this.state.time,
            },
          }
        }
        Object.assign(data,newdata)

        console.log("list: "+JSON.parse(JSON.stringify(list)))
        //未知単語リストに今回得られた未知単語を追加
        var obj1 = doc.data().unknownwords;

        var newwordlist = this.state.wordlist
        var unknownwords = {}

        //wordlistの更新
        for(var i = 0; i < list.length;i++){
          var valuewordlist = {}

          valuewordlist["rank"] = list[i].rank
          valuewordlist["parts"] = list[i].parts
          if(list[i].checked == false){
            valuewordlist["understand"] = 1
          }
          else{
            valuewordlist["understand"] = 0
          }

          newwordlist[list[i].word] = valuewordlist
          console.log(valuewordlist)
          var value = Object.assign({},valuewordlist)
          delete value["read"]

          if(list[i].checked == true){
            value["view"] = true
            if(list[i].sentence){
              value["sentence"] = list[i].sentence
            }
            else{
              continue
            }
            //console.log(list[i].word)
            if(list[i].original != undefined){
              value["original"] = list[i].original
              //console.log(value)
            }

            if(obj1[list[i].word]){
              if(obj1[list[i].word].lastTime == undefined){
                value["lastTime"] = list[i].lastTime
                value["repetition"] = 0
              }
              else{
                value["lastTime"] = obj1[list[i].word].lastTime
                value["repetition"] = obj1[list[i].word].repetition
              }
            }
            else{
              value["lastTime"] = list[i].lastTime
              value["repetition"] = 0
            }
      
            

            //未知単語リストの生成
            unknownwords[list[i].word] = value
          }
        }

        Object.assign(unknownwords,obj1)
        
        var stats = doc.data().stats;
        var statsNew = doc.data().statsNew;

        var day = new Date()
        var name = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()

        if(!stats[name]){
          if(Math.floor(this.state.numWords/1000) > 0){
            var URL = 'https://script.google.com/macros/s/AKfycbzx0zk0UFWRLTpAGvsDIaBJMBox2CAs5999Iiz5-58GDyCecuY/exec?uid=' + this.props.user.uid + '&message=I read ' + this.state.numWords + ' words today'
            fetch(URL)  
            console.log("send notification")
          }
          stats[name] = this.state.numWords
          statsNew[name] = this.state.numNewwords
          day.setDate( day.getDate() - 7 );
          var deldate = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
          delete stats[deldate]
          delete statsNew[deldate]
        }
        else{
          if(Math.floor(stats[name]/1000) != Math.floor((stats[name]+this.state.numWords)/1000)){
            console.log("send notification")
            var URL = 'https://script.google.com/macros/s/AKfycbzx0zk0UFWRLTpAGvsDIaBJMBox2CAs5999Iiz5-58GDyCecuY/exec?uid=' + this.props.user.uid + '&message=I read ' + 1000*Math.floor((stats[name]+this.state.numWords)/1000) + ' words today'
            fetch(URL)  
          }
          stats[name] += this.state.numWords
          statsNew[name] += this.state.numNewwords
        }

        console.log(statsNew)
        //console.log(newwordlist["goof"])
        //console.log(unknownwords["goof"])

        firebase.firestore().collection("users").doc(this.props.user.uid).update({stats})
        firebase.firestore().collection("users").doc(this.props.user.uid).update({statsNew})

        firebase.firestore().collection("users").doc(this.props.user.uid).set({unknownwords},{merge:true})

        firebase.firestore().collection("users").doc(this.props.user.uid).set({data},{merge:true})

        var blob = new Blob([JSON.stringify(newwordlist)], { type: 'application\/json' });
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
              that.setState({uploadStatus: 'Error: ' + error})
              // Handle unsuccessful uploads
          }, function(){
            console.log('put data')
            popToTop()
          })
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
    this.setState({uploadStatus: err})
  });
};

  setProgress = () => {
    this.setState({uploadStatus: progress})
  }

  renderItem = ({ item,index }) => {
    //console.log('item' + item.title)
    return (
      <ListItem style={{justifyContent:'center',backgroundColor:'white', marginLeft: 0 }}>
        {/*<Left>
          <Text style={{fontSize: 18 ,marginLeft:20}}>{item.word}</Text>
        </Left>*/}
          <CheckBox
            center
            title={item.word}
            checked={item.checked}
            onPress={() => this.doCheck(item.word)}
          />
          
      </ListItem>
    );
  };

  render() {
      return (
        <View style={styles.container}>
          {
          this.state.loading
          ?
          <Text style={styles.getStartedText}>Loading your wordlist </Text>
          :
          <Text style={styles.getStartedText}>How was this text?</Text>
          }
          {
            this.state.loading
            ?
            <Container style={{alignItems: 'center', justifyContent: 'center'}}>
                <AppSpinner/>
            </Container>
          :
          <Text style={styles.getStartedText}>Please tell me your review!</Text>
          }
          {
            (!this.state.loading && Platform.OS == 'android')
            &&
              <Picker
                mode="dropdown"
                placeholder="Select one"
                placeholderStyle={{ color: "#bfc6ea" }}
                selectedValue={this.state.difficulty}
                textStyle={{ fontSize: 18 }}
                onValueChange={(itemValue) => {
                  this.setquestion(itemValue)
                }}
                > 
                  <Picker.Item label="Select one"/>
                  <Picker.Item label="Too Easy" value='easy' />
                  <Picker.Item label="Well Balanced" value='balance' />
                  <Picker.Item label="Too Hard" value='hard' />
              </Picker>
          }

          {
            (!this.state.loading && Platform.OS == 'ios')
            &&
              <Picker
                mode="dropdown"
                placeholder="Select one"
                placeholderStyle={{ color: "#bfc6ea" }}
                selectedValue={this.state.difficulty}
                textStyle={{ fontSize: 18 }}
                onValueChange={(itemValue) => {
                  this.setquestion(itemValue)
                }}
                > 
                  <Picker.Item label="Too Easy" value='easy' />
                  <Picker.Item label="Well Balanced" value='balance' />
                  <Picker.Item label="Too Hard" value='hard' />
              </Picker>
          }
            {
              this.state.dataSource == undefined
              ?
              null
              :
              <Text style={styles.getStartedText}>Please check the unknown words</Text>
            }
            
            <FlatList
                   data={this.state.dataSource}
                   renderItem={this.renderItem.bind(this)}
                   keyExtractor={item => item.word}
                   execData={this.state.Update}
            />
            {
              this.state.dataSource == undefined
              ?
              null
              :
              <Button 
                    block
                    style={[styles.btn, styles.btnBalance]}
                    onPress={() => {
                      this.doPut()
                    }}
                >
                    <Text>Go back to the title list</Text>
                    {
                      this.state.Putnow
                      &&
                      <Spinner />
                    }
                    {
                      this.state.Putnow
                      &&
                      <Text>{this.state.uploadStatus}</Text>
                    }
                    
              </Button>
            }
            
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

export default connect(mapStateToProps, {sendWordsRead})(RatingScreen);

function ifnotstopwords(value, index, ar){
  for(var i = 0;i < stopwords.length; i++ ){
      if(value.toLowerCase() == stopwords[i]){
          return false;
      }
  }
  return true;
}

function ifnotnames(value, index, ar){
  var names = require('../articles/namelist.json');
  if(names.indexOf(value) != -1){
    return false
  }
  return true;
}

const styles = StyleSheet.create({
  btn: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'black'
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
});
