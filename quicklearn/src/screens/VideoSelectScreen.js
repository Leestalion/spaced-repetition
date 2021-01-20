import React from 'react';
import {StyleSheet, Platform, Dimensions,ScrollView} from 'react-native';
import {
  Button,
  Text,
  Container,
  Content,
  H1,
  H3,
  Grid,
  Col,
  Row,
  Icon,
  Card,
  CardItem,
  Body,
  ActionSheet,
} from 'native-base';
import VideosCarousel from '../components/VideosCarousel';
import {connect} from 'react-redux';
import {fetchVideos} from "../actions";
import AppSpinner from "../components/AppSpinner"

class VideoSelectScreen extends React.Component {

  static navigationOptions = {
    headerShown: false
  };
/*
  componentWillMount(){
    this.props.fetchVideos(this.props.token)
  }
*/
  render() {
    if (this.props.videosLoading){
      return (
          <Container style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
              <AppSpinner/>
          </Container>
      );
    }
    return(
      <ScrollView style={styles.container}>
        <Content>
          <Card>
            <CardItem>
                <Grid style={{minHeight: 40}}>
                    <Row size={20} paddingBottom={10} paddingTop={10}>
                        <H1>Easy</H1>
                    </Row>
                </Grid>
            </CardItem>
            <CardItem>
              <VideosCarousel
                layout={'default'}
                videos={this.props.videos}
                /*videos={
                  [
                    {
                      id: 'CwMevU8PTmg',
                      uri: 'https://www.youtube.com/watch?v=ruy7cjTNG6U',
                      title: 'Super video bro',
                    },
                    {
                      id: 'UyoYf7rZVGI',
                      uri: 'https://www.youtube.com/watch?v=UyoYf7rZVGI',
                      title: 'Super video bro',
                    },
                    {
                      id: '2sML2bq_WGw',
                      uri: 'https://www.youtube.com/watch?v=2sML2bq_WGw',
                      title: 'Super video bro',
                    },
                  ]
                }*/
              />
            </CardItem>
          </Card>
        </Content>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    token,
    user,
  } = state.user;

  const {
    videos,
    videosLoading,
  } = state.video;

  return {
    token,
    user,
    videos,
    videosLoading,
  };
};

export default connect(mapStateToProps, {fetchVideos})(VideoSelectScreen)

const styles = StyleSheet.create({
  btn: {
      width: '100%',
      justifyContent: 'flex-start'
  },
  btnRevise: {
      backgroundColor: '#FFD43A'
  },
  btnEasy: {
      backgroundColor: '#20B449'
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
  color: 'rgba(96,100,109, 1)',
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
