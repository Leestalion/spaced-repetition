import React from 'react';
import {StyleSheet, Image, BackHandler} from 'react-native';
import {
    Text,
    Container,
    Content,
    Card,
    CardItem,
    Grid,
    Col,
    Row,
    Button,
    H1,
    List,
    ListItem,
    View,
} from 'native-base';
import BackHandlerWrapper from '../components/BackHandlerWrapper';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    labelGray: {
        color: '#979797',
        fontSize: 10
    },
    imgSize: {
        width: '100%',
        height: 100,
        marginTop: 20,
    },
    txtCurrent: {
        fontSize: 14,
    },
    txtGlobal: {
        fontSize: 14,
        marginBottom: 10,
        marginTop: 5,
    },
    itemTeam: {
        width: '100%',
    },
    team: {
        width: '100%',
        marginBottom: 20,
    }
});

export default class ContactScreen extends React.Component {


    render() {
        return (
            <View style={styles.container}>
                <Container>
                    <BackHandlerWrapper/>
                    <Content padder>
                        <Card paddingBottom={20}>
                            <CardItem>
                                <Grid style={{minHeight: 60}}>
                                    <Row size={20} paddingBottom={10} paddingTop={10}>
                                        <H1>About the app</H1>
                                    </Row>
                                    <Row size={10}>
                                        <Text style={styles.labelGray}>TEAM</Text>
                                    </Row>
                                    <Row size={20}>
                                        <List style={styles.team}>
                                            <ListItem>
                                                <Text style={styles.txtCurrent}>Kohei Yamaguchi</Text>
                                            </ListItem>
                                        </List>
                                    </Row>
                                    <Row size={10}>
                                        <Text style={styles.labelGray}>HISTORY</Text>
                                    </Row>
                                    <Row size={20}>
                                        <Text style={styles.txtGlobal}>The project was to develop the mobile application
                                            corresponding to the Vocabulometer project described below.</Text>
                                    </Row>
                                </Grid>
                            </CardItem>
                            <CardItem>
                                <Grid style={{minHeight: 60}}>
                                    <Row size={20} paddingBottom={10} paddingTop={10}>
                                        <H1>About project</H1>
                                    </Row>
                                    <Row size={10}>
                                        <Text style={styles.labelGray}>TEAM</Text>
                                    </Row>
                                    <Row size={20}>
                                        <List style={styles.team}>
                                            <ListItem>
                                                <Text style={styles.txtCurrent}>Olivier AUGEREAU</Text>
                                            </ListItem>
                                            <ListItem>
                                                <Text style={styles.txtCurrent}>Clément JACQUET</Text>
                                            </ListItem>
                                            <ListItem>
                                                <Text style={styles.txtCurrent}>Nicholas JOURNET</Text>
                                            </ListItem>
                                        </List>
                                    </Row>
                                    <Row size={10}>
                                        <Text style={styles.labelGray}>HISTORY</Text>
                                    </Row>
                                    <Row size={20}>
                                        <Text style={styles.txtGlobal}>This project has been developed by a student from
                                            the Intelligent Media Processing laboratory, in the Osaka Prefecture
                                            University. </Text>
                                    </Row>
                                    <Row size={20}>
                                        <Text style={styles.txtGlobal}>This website has been created for research
                                            purpose, as part of exploring how to use new technology devices such as
                                            eye-trackers to enhance people's lives. </Text>
                                    </Row>
                                    <Row size={20}>
                                        <Text style={styles.txtGlobal}>Eye gaze analysis algorithms and some texts are
                                            taken from a prototype built by University of Bordeaux students. </Text>
                                    </Row>
                                </Grid>
                            </CardItem>
                            <CardItem>
                                <Grid>
                                    <Row>
                                        <Image resizeMode={'contain'} source={require('../../assets/images/bordeaux.png')}
                                               style={styles.imgSize}/>
                                    </Row>
                                    <Row>
                                        <Image resizeMode={'contain'} source={require('../../assets/images/imlab_logo.png')}
                                               style={styles.imgSize}/>
                                    </Row>
                                    <Row>
                                        <Image resizeMode={'contain'} source={require('../../assets/images/opu_logo.png')}
                                               style={styles.imgSize}/>
                                    </Row>
                                </Grid>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            </View>
        );
    }
}
