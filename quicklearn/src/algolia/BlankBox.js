import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import {Button,Text} from 'native-base';
import PropTypes from 'prop-types';
import { connectSearchBox } from 'react-instantsearch-native';
import { from } from 'rxjs';
import firebase from 'firebase'

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#252b33',
  },
  input: {
    height: 48,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

function makenewcards(){
  const unknownwords = cards
  firebase.firestore().collection("users").doc("DWnMu0p9meRTxh0TwvHdHHOGumT2").set({unknownwords},{merge:true})
  .then(
      refresh()
  )
  Alert.alert('Updated flashcards')
}

function refresh(){
  console.log("refresh")
  firebase.firestore().collection("users").doc("DWnMu0p9meRTxh0TwvHdHHOGumT2").get()
  .then(doc => {
      keys = []
      if (!doc.exists) {
      console.log('No such document!');
      } else {
          info = doc.data().userinfo
          data = doc.data().unknownwords
          cards = {}
          defaultkeys = Object.keys(data)
          keys = []
          cardnum = 0
          if(defaultkeys.length!=0){
              for(var i = 0;i < defaultkeys.length;i++){
                  if(data[defaultkeys[i]].view){
                      cards[defaultkeys[i]] = data[defaultkeys[i]]
                      keys.push(defaultkeys[i])
                  }
              }
              console.log(keys)
          }
          
          return keys
          console.log('keyset')
      }
  })
  .catch(err => {
      console.log('Error getting document', err);
  });
}

function nextcard(isRemember){
  /*
  if(isRemember==true){
      cards[keys[cardnum]].view = false
  }
  */
  cards[keys[cardnum]].repetition += 1
  cardnum += 1
  
  console.log("cardnum: " + cardnum + " keys.length: " + keys.length)

  if(keys.length > cardnum){
      console.log("nextcard")
  }
  else{
      console.log("remake")
      makenewcards()
  }
  
}

const BlankBox = ({ currentRefinement, refine }) => {
  const cards = refresh()
  var cardnum = 0
  console.log(cards)
  refine(cards[cardnum])
  return(    
    <View style={styles.container}>
      <Button 
              block
              onPress={() => refine(cards[cardnum])}
            >
              <Text>My information</Text>
            </Button>
      <TextInput
        style={styles.input}
        onChangeText={value => {
          {
            value == cards[cardnum]
            ?
            nextcard(false)
            :
            Alert.alert(
              'Wrong answer',
              [
                {
                  text: 'Try again',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Next question',
                  onPress: () => nextcard(false),
                },
              ],
              {cancelable: false},
            )
          }
        }}
        value={currentRefinement}
        placeholder=""
      />
    </View>
  )
};

BlankBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectSearchBox(BlankBox);
