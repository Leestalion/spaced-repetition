import React, {Component} from 'react';
import {Modal, Image, ScrollView, StyleSheet, TouchableHighlight, Platform} from 'react-native';
import {
    View,
    Text,
    Button,
    StyleProvider,
} from 'native-base';
import Swiper from 'react-native-deck-swiper';
import {connect} from 'react-redux';
import { sendWordsRead } from '../actions';
import BackHandler  from '../components/BackHandlerWrapper';
import {FontAwesome} from '@expo/vector-icons';
//import SwiperFlatList from 'react-native-swiper-flatlist';
//import {Tag} from 'en-pos'

var stopwords = [
    'a',
    'about',
    'above',
    'after',
    'again',
    'against',
    'all',
    'am',
    'an',
    'and',
    'any',
    'are',
    'aren\'t',
    'as',
    'at',
    'be',
    'because',
    'been',
    'before',
    'being',
    'below',
    'between',
    'both',
    'but',
    'by',
    'can',
    'can\'t',
    'cannot',
    'could',
    'couldn\'t',
    'did',
    'didn\'t',
    'do',
    'does',
    'doesn\'t',
    'doing',
    'don\'t',
    'down',
    'during',
    'each',
    'few',
    'for',
    'from',
    'further',
    'had',
    'hadn\'t',
    'has',
    'hasn\'t',
    'have',
    'haven\'t',
    'having',
    'he',
    'he\'d',
    'he\'ll',
    'he\'s',
    'her',
    'here',
    'here\'s',
    'hers',
    'herself',
    'him',
    'himself',
    'his',
    'how',
    'how\'s',
    'i',
    'i\'d',
    'i\'ll',
    'i\'m',
    'i\'ve',
    'if',
    'in',
    'into',
    'is',
    'isn\'t',
    'it',
    'it\'s',
    'its',
    'itse\'lf',
    'let\'s',
    'me',
    'more',
    'most',
    'mustn\'t',
    'my',
    'myself',
    'no',
    'nor',
    'not',
    'of',
    'off',
    'on',
    'once',
    'only',
    'or',
    'other',
    'ought',
    'our',
    'ours',
    'ourselves',
    'out',
    'over',
    'own',
    'same',
    'shan\'t',
    'she',
    'she\'d',
    'she\'ll',
    'she\'s',
    'should',
    'shouldn\'t',
    'so',
    'some',
    'such',
    'than',
    'that',
    'that\'s',
    'the',
    'their',
    'theirs',
    'them',
    'themselves',
    'then',
    'there',
    'there\'s',
    'these',
    'they',
    'they\'d',
    'they\'ll',
    'they\'re',
    'they\'ve',
    'this',
    'those',
    'through',
    'to',
    'too',
    'under',
    'until',
    'up',
    'very',
    'was',
    'wasn\'t',
    'we',
    'we\'d',
    'we\'ll',
    'we\'re',
    'we\'ve',
    'were',
    'weren\'t',
    'what',
    'what\'s',
    'when',
    'when\'s',
    'where',
    'where\'s',
    'which',
    'while',
    'who',
    'who\'s',
    'whom',
    'why',
    'why\'s',
    'with',
    'won\'t',
    'would',
    'wouldn\'t',
    'you',
    'you\'d',
    'you\'ll',
    'you\'re',
    'you\'ve',
    'your',
    'yours',
    'yourself',
    'yourselves',
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -30,
    },
    card: {
        padding: 16,
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        backgroundColor: "white"
    },
    text: {
        paddingVertical: 8,
        fontSize: 16,
        lineHeight: 32,
        textAlign: 'justify'
      },
    pageNumber: {
        alignSelf: 'flex-end',
    },
});

class PageSwiper extends Component {

    state = {
        modalVisible: false,
        cardIndex: 0,
        readIndex: 0,
    };

    sendWordsRead(cardIndex){
        console.log('send');

        var str = this.props.data[cardIndex].trim().replace(/[_:;.,!?\"() ]+/g, '-');
        console.log(str);
        const words = str.split('-');
        
        const result = words.filter(words => words.length > 1 && words.match(/^[a-zA-Z]+$/));
        console.log(result);

        const finalresult = result.filter(ifnotstopwords)
        console.log(finalresult);
/*
        var tags = new Tag(result).initial().smooth().tags;
        console.log(tags);
        */

        const finalWordsArray = [];
        for(const wordArray of words ){
            finalWordsArray.push(...wordArray);
        }
        let arr = [];
        //console.log(finalWordsArray);
        arr.push(...finalWordsArray.filter((word,pos,self) => self.indexOf(word) == pos));
        //console.log(arr);
        this.props.sendWordsRead(this.props.token, result);
    }

    onSwiped = (cardIndex,direction) => {
        if(direction !== 'right' && this.state.readIndex <= cardIndex){
            this.sendWordsRead(this.state.cardIndex);
            this.state.readIndex += 1;
        }
        
        this.setState({
            cardIndex : direction === 'left' ?  cardIndex +1 : cardIndex -1
        })
    };

    render() {
        //if (Platform.OS === 'ios'){
            const finalData = Array.from(this.props.data);
            console.log(this.state.cardIndex);
            console.log(this.props.level);
            return (
            
                <View style={styles.container}>
                        
                    <BackHandler/>
                    <Swiper
                        goBackToPreviousCardOnSwipeRight
                        disableRightSwipe={this.state.cardIndex === 0}
                        cards={finalData}
                        onSwipedLeft={ (cardIndex) => this.onSwiped(cardIndex, 'left')}
                        onSwipedRight={ (cardIndex) => this.onSwiped(cardIndex,'right')}
                        showSecondCard={false}
                        cardVerticalMargin={50}
                        useViewOverflow={Platform.OS === 'ios'}
                        renderCard={(card, index) => {
                            return (
                                <ScrollView contentContainerStyle={styles.card}>
                                    <Text style={styles.text}>{card}</Text>
                                    {
                                        index !== this.props.data.length
                                            ? <Text
                                                style={styles.pageNumber}>{`Page ${index + 1} / ${this.props.data.length}`}</Text>
                                            : null
                                    }
                                </ScrollView>
                            )
                        }}
                        onSwipedAll={() => {
                            this.props.navigation.navigate('Rating', {level: this.props.level});                        
                        }}
                        backgroundColor={'transparent'}
                        stackSize={this.props.data.length}>

                    </Swiper>
                
                    
                </View>
            );
        /*}else{
            const finalData = Array.from(this.props.data);
            console.log('android')
            console.log(this.state.cardIndex);
            console.log(this.props.level);
            console.log(this.props.data);
            return (
                
        
                <View style={styles.container}>
                        
                    <BackHandler/>
                    
                    <SwiperFlatList
                        data={finalData}
                        renderItem={(data, index) => {
                            console.log('swiperflatlist')
                            this.onSwiped(index,'right')
                            return (
                                <View contentContainerStyle={styles.card}>
                                    <Text style={styles.text}>{data}</Text>
                                    {
                                        index !== this.props.data.length
                                            ? <Text
                                                style={styles.pageNumber}>{`Page ${index + 1} / ${this.props.data.length}`}</Text>
                                            : null
                                    }
                                </View>
                            )
                        }}
                        renderAll={() => {
                            this.props.navigation.navigate('Rating', {level: this.props.level});                        
                        }}
                    />
                
                    
                </View>
            );
        }*/
        
        
    }
}

const mapStateToProps = ({user}) => {
    const {token} = user;
    return {token};
};

export default connect(mapStateToProps, {sendWordsRead})(PageSwiper);

function ifnotstopwords(value, index, ar){

    for(var i = 0;i < stopwords.length; i++ ){
        if(value.toLowerCase() == stopwords[i]){
            return false;
        }
    }
    
    return true;

}
