import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, KeyboardAvoidingView} from 'react-native';
import BarChart from '../components/BarChart';
import {Container, Content, H1, Grid, Col, List, ListItem, Card, CardItem, Text, Form, Label, Item, Input} from 'native-base';
import {fetchUserStats, fetchVideos} from "../actions";
import {connect} from "react-redux";
import AppSpinner from '../components/AppSpinner';
import firebase from 'firebase'

class StatsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          refreshing: false,
          const: '',
          reads: '',
          loading: true,
        };
    }

    componentDidMount(){
      this.getData()
    }

    getData(){
        this.setState({refreshing: true})
        console.log('No');
        firebase.firestore().collection("users").doc(this.props.user.uid).get()
        .then(doc => {
            console.log(doc.exists)
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                console.log('0')
                
                
                stats = doc.data().stats
                statsNew = doc.data().statsNew

                let dates = new Array()
                let datesNew = new Array()

                var day = new Date()
                day.setDate( day.getDate() -6 );
                console.log('0')
                for(var i = 0;i < 7;i++){
                    var name = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
                    dates.push(name)
                    datesNew.push(name)
                    day.setDate( day.getDate() +1 );
                }
                
                let data = []
                let dataNew = []
                var readwords = 0
                var readNewwords = 0

                for(var i = 0;i < dates.length;i++){
                    if(stats[dates[i]]){
                        data.push(stats[dates[i]])
                    }
                    else{
                        data.push(0) 
                    }
                    readwords += data[i]
                }

                for(var i = 0;i < datesNew.length;i++){
                    if(statsNew[datesNew[i]]){
                        dataNew.push(statsNew[datesNew[i]])
                    }
                    else{
                        dataNew.push(0)
                    }
                    readNewwords += dataNew[i]
                }

                console.log(data)

                this.setState({reads: readwords, Newreads: readNewwords, dates:dates, data: data, datesNew:datesNew, dataNew: dataNew, loading: false, refreshing: false})
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    }

    render() {

        //let wordsReadDates = this.getData().dates;
        //let wordsReadData = this.getData().data;

        if (this.state.loading == true){
            return (
                <Container style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                    <AppSpinner/>
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
                    onRefresh={() => this.getData()}
                    />
                }>
    
                    <View style={styles.barContainer}>
                        <Text style={{paddingHorizontal: 8, paddingBottom: 8}}>Words read: {this.state.reads}</Text>
                        <BarChart dates={this.state.dates} data={this.state.data}/>
                    </View>
    
                    <View style={styles.barContainer}>
                        <Text style={{paddingHorizontal: 8, paddingBottom: 8}}>New words read: {this.state.Newreads}</Text>
                        <BarChart dates={this.state.datesNew} data={this.state.dataNew}/>
                    </View>
    
    {/*
                    <View style={styles.barContainer}>
                        {
                            newRecentWordsRead.words.length > 0
                                ? <H1 style={{paddingHorizontal: 8, paddingBottom: 8}}>New recents words read</H1>
                                : null
                        }
                        <List>
                            {
                                newRecentWordsRead.words.slice(0, 20).map((item, index) => {
                                    return (
                                        <ListItem noIndent style={{backgroundColor: 'white'}} key={index}>
                                            <Text style={{textAlign: 'left'}}>
                                                {item._id}
                                            </Text>
                                            
                                            <Text style={{textAlign: 'right'}}>
                                                {item.level}
                                            </Text>
                                            
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
    
                    </View>*/}
                </ScrollView>
            )
        }


    }
}

const styles = StyleSheet.create({
    barContainer: {
        marginVertical: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
});


const mapStateToProps = (state) => {
    const {
      info,
      token,
      user,
    } = state.user;
  
    return {
      info,
      token,
      user,
    }
  };

export default connect(mapStateToProps)(StatsScreen)