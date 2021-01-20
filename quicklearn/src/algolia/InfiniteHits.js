import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, FlatList,Text,Modal } from 'react-native';
import {Button,Left,Body,Right,ListItem,Container, Content} from 'native-base'
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import Highlight from './Highlight';
import HighlightText from './HighlightText';
import AppSpinner from '../components/AppSpinner';
import platform from '../../native-base-theme/variables/platform';

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
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 10,
    flexDirection: 'column',
  },
  titleText: {
    fontWeight: 'bold',
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
  modalView: {
    marginHorizontal: 20,
    marginVertical: 20,
  }
});

const InfiniteHits = ({hits, hasMore, refine }) => {
  const [loading,setLoading] = useState(false)
  const [data,setData] = useState()
  return(
      <Container>
        <View style={{flex: 1}}>
          <Content>
            <FlatList
              data={hits}
              keyExtractor={item => item.objectID}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              onEndReached={() => hasMore && refine()}
              renderItem={({ item,index }) => (
                <ListItem style={{backgroundColor:'white', paddingTop: 15, paddingBottom: 15, marginLeft: 0 }}>
                  <Left style={{flex:1}}>
                    <Text>{item.id}</Text>
                  </Left>
                  <Body style={{flex:4}}>
                    <Highlight attribute="title" hit={item} />
                  </Body>
                  <Right style={{flex:1}}>
                    {
                      loading
                      ?
                      <AppSpinner/>
                      :
                      <Button 
                      rounded light
                      onPress={async() => {
                        setLoading(true)
                        await setData(hits[index])
                        setLoading(false)
                      }}>
                        <Text>  Read  </Text>
                      </Button>
                    }
                    
                  </Right>
                </ListItem>
              )}
            />
          </Content>
        </View>
        {
          loading
          &&
          <Container style={{alignItems: 'center', justifyContent: 'center'}}>
            <AppSpinner/>
          </Container>
        }
        {
          data
          &&
          <View style={{flex: 2}}>
            <Content>
              <HighlightText attribute="text" hit={data} />
              <Button 
                block success
                onPress={async() => {
                  setData()
                }}>
                  <Text>  Close  </Text>
              </Button>
            </Content>
          </View>
        }
        
      </Container>
  )
};

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);
