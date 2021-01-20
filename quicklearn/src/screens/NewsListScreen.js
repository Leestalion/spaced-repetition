import React from 'react';
import {connect} from 'react-redux';
import {AsyncStorage,Alert,ListView, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { 
    Button,
    Container,
    Content,
    Text,
    View,
    List,
    ListItem,
    Left,
    Body,
    Icon,
    Right,
    Title,
    Picker
} from 'native-base';
import {fetchTexts,resetTextState} from "../actions";
import { Entypo } from '@expo/vector-icons';
import {FileSystem} from 'expo';
import TextList from '../components/TextList';
import AppSpinner from '../components/AppSpinner';
import BackHandlerWrapper from '../components/BackHandlerWrapper';
import platform from '../../native-base-theme/variables/platform';
import firebase from 'firebase';


class NewsListScreen extends React.Component {
    static navigationOptions = {
        headerShown: false,
      };

    constructor(props){
        super(props);
        this.state = {
            title: '',
            filename: '',
            level:'',
            id: '',
          text: '',
          level: '',
          title: '',
          const: '',
          loading:false,
          isMounted: false,
        };
    }

    componentDidMount(){
       
      firebase.firestore().collection("users").doc(this.props.user.uid).collection("news").doc("jsondata").get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
            data = doc.data()
            this.SetDatasource(data.data)
            this.setState({selected: data.data})
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });

        this.setState({ isMounted: true }, () => {
            if (this.state.isMounted) {
              this.setState({ isMounted: false });
              {
                  this.props.navigation.addListener('willFocus', (playload)=>{
                    firebase.firestore().collection("users").doc(this.props.user.uid).collection("news").doc("jsondata").get()
                    .then(doc => {
                        if (!doc.exists) {
                        console.log('No such document!');
                        } else {
                            data = doc.data()
                            this.SetDatasource(data.data)
                            this.setState({selected: data.data})
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                    });
                });
              }
            }
          });
    }

    SetDatasource = async(itemValue) => {
        console.log("calcnow")
        this.setState({loading:true})
        console.log(this.state.loading)
        var that = this
        var storageRef = firebase.storage().ref(this.props.user.uid + '-wordlist.json');

        storageRef.getDownloadURL().then(function(url) {
          fetch(url)
          .then((response) => response.json())
          .then(jsondata => {
            wordlist = JSON.parse(JSON.stringify(jsondata))
            dataSource = new Array()
            const wordfamily = require('../articles/lemma.json');
      
            for(var i = 0;i<itemValue.length;i++){
                var hard = 0
                var count = 0
                var str = itemValue[i].text.toLowerCase().trim().replace(/[\n_#:;.,!?\"() ]+/g, '-').split('-');
                const words = str.filter(str => ((str >= 'a') && (str <= 'z')) || ((str >= 'A') && (str <= 'Z')))
                const finalresult = words.filter(ifnotnames)
                
                var checklist = []
                //console.log(finalresult)

                for(var j = 0;j < finalresult.length;j++){
                    if(wordfamily[finalresult[j]]){
                        finalresult[j] = wordfamily[finalresult[j]]
                    }
                    if(wordlist[finalresult[j]]){
                        if(wordlist[finalresult[j]].understand <= 0.8){
                            hard+=1
                            //console.log(finalresult[j])
                            if(checklist.includes(finalresult[j]) ==false){
                              checklist.push(finalresult[j])
                            }
                        }
                    }
                    count+=1
                }

                var percentage = Math.round((1-(hard/count))*1000)/10
                var dict = {"percentage": percentage,"hard": checklist.length}
                var newdata = Object.assign(JSON.parse(JSON.stringify(itemValue[i])), dict)
                dataSource.push(newdata)
            }

            if(dataSource.length == 0){
              that.setState({dataSource: null,loading:false})
            }
            else{
              that.setState({dataSource: dataSource,loading:false})
            }
          })
        }).catch(function(error) {
          console.log(error)
        });
    }

   renderItem = ({ item,index }) => {
    var publishers = ''
     if(this.state.selected == data.data && item.publisher != undefined){
      publishers += item.publisher[0]
      for(let i = 1;i < item.publisher.length; i++){
        publishers += ', ' + item.publisher[i]
      }
     }
     
    return (
      <ListItem style={{backgroundColor:'white', paddingTop: 15, paddingBottom: 15, marginLeft: 5 }}>
        {
          this.state.selected == data.data
          ?
          <Left>
            <Text>{item.title} {"\n\nAuthor: "}{publishers}</Text>
          </Left>
          :
          <Left>
            <Text>{item.title}</Text>
          </Left>
        }
        
        <Right>
          {
            this.state.selected == data.data
            ?
            <Entypo.Button
              style={{alignItems: 'center', justifyContent:'center'}}
              name="open-book"
              size={24}
              color="black"
              backgroundColor="white"
              onPress={() => {                
                    this.props.navigation.navigate('NewsView', {
                    title: item.title,
                    text: item.text,
                    wordlist: wordlist,
                    links: item.link,
                    images: item.image,
                    native: this.props.navigation.state.params.native
                  })
              }}
            >
              <Text>Read</Text>
            </Entypo.Button>
            :
            <Entypo.Button
              style={{alignItems: 'center', justifyContent:'center'}}
              name="open-book"
              size={24}
              color="black"
              backgroundColor="white"
              onPress={() => {                
                this.props.navigation.navigate('TextView', {
                  title: item.title, 
                  text: item.text,
                  id: item.id,
                  wordlist:wordlist,
                  native: this.props.navigation.state.params.native
                })
              }}
              >
                <Text>Read</Text>
              </Entypo.Button>
            }
            <Text>Words: {item.hard}</Text>
            <Text>{item.percentage}%</Text>
        </Right>
      </ListItem>
    );
  };

  render() {
    //const paragraphs = this.buildText();
    //var data = getpath(this.props.navigation.state.params.level)
    return (
        <View style={styles.container}>
          <Picker
              mode="dropdown"
              placeholder="Category of text"
              placeholderStyle={{ color: "#bfc6ea" }}
              selectedValue={this.state.selected}
              onValueChange={(itemValue) => {
                  this.SetDatasource(itemValue)
                  this.setState({selected:itemValue})
                  //console.log(this.state.dataSource)
              }}
              > 
                <Picker.Item label="news" value={data.data} />
                <Picker.Item label="your original data" value={data.personalize} />
          </Picker>
          {
            this.state.loading
            ?
            <Container style={{alignItems: 'center', justifyContent: 'center'}}>
                <AppSpinner/>
            </Container>
            :
            (
              this.state.dataSource == null
              ?
              <Text style={{alignItems: "center"}}>No text data in this category</Text>
              :
              <FlatList
                 data={this.state.dataSource}
                 renderItem={this.renderItem.bind(this)}
                 keyExtractor={item => item.title}
              />
            )
            
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

export default connect(mapStateToProps)(NewsListScreen)

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
        justifyContent: 'flex-start',
        marginTop: 10,
        marginBottom: 20,
    },
    btnBalance: {
        backgroundColor: '#FFD43A'
    },
    btnEasy: {
        backgroundColor: '#20B449'
    },
    btnHard: {
        backgroundColor: '#FF473A',
    },
  container: {
    alignContent: 'center',
    flex: 2,
    backgroundColor: '#fff',
  },
})