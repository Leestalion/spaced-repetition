import React from 'react';
import {
    Container,
    Content,
    Text,
    Button,
    Grid,
    Row,
    Spinner,
    StyleProvider,
    Form,
    Input,
    Label,
    Item
} from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import {
    Platform,
    StyleSheet,
    Keyboard,
    Image,
    ImageBackground,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import AppSpinner from '../components/AppSpinner';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {renderInput} from '../helpers/formHelper';
import { FontAwesome } from '@expo/vector-icons'
import {login} from '../actions';
import firebase from 'firebase'

const styles = StyleSheet.create({
    fieldContainer: {
        paddingVertical: 32,
        flex: 1,
    },
    backgroundLogin: {
        width: '100%',
        height: '80%',
        flex: 1,
    },
    title: {
        fontSize: Platform.OS === 'ios' ? 36 : 34,
        color: 'black',
        paddingHorizontal: 40,
        paddingBottom: 32,
        //textShadowColor:'#0d0d0d',
        //textShadowOffset:{width: 2, height: 2},
        //textShadowRadius:15,
    },
    errorMessage: {
        color: 'black',
        fontSize: 20,
        marginTop: 16,
        textAlign: 'center',
        fontWeight: "500",
    },
    buttonSignIn: {
        marginTop: 16,
    },
});



class LoginScreen extends React.Component {
    static navigationOptions = {
        headerShown: false,
      };
    
      constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            login:false,
            register:false,
        }
      }

      

    async register(email, password) {
        try {
            Keyboard.dismiss();
            this.setState({register:true})
        await firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            Alert.alert(error.message)
          });
          this.setState({register:false})
        var user = firebase.auth().currentUser;
        
        if(user){
            user.sendEmailVerification().then(function() {
                Alert.alert('Send an e-mail to verify your acccount')
              }).catch(function(error) {
                Alert.alert(error.message)
              });
        }
        } catch (e) {
        console.error(e.message);
        }
        
    }

    signin(email, password){
        Keyboard.dismiss();
        this.setState({login:true})
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                if(user.user.emailVerified == false){
                    Alert.alert(
                        "Please verify your email address",
                        "Would you like to send verification mail again?",
                        [
                          {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                            
                          },
                          {
                            text: 'Yes',
                            onPress: () => {
                                user.user.sendEmailVerification().then(function() {
                                    Alert.alert('Send an e-mail to verify your acccount')
                                  }).catch(function(error) {
                                    Alert.alert(error.message)
                                  })
                            },
                            style: 'cancel',
                          },
                        ],
                        {cancelable: true},
                    )
                }
                else{
                    this.props.login(user);
                    //var URL = 'https://script.google.com/macros/s/AKfycbzx0zk0UFWRLTpAGvsDIaBJMBox2CAs5999Iiz5-58GDyCecuY/exec?uid=' + user.uid + '&message=I login!'
                    //fetch(URL)
                    //console.log("send notification")
                    this.props.navigation.navigate('Main')
                }
                
            }).catch(function(error) {
                Alert.alert(error.message)
            });
            this.setState({login:false})
    }

    renderErrorMessage() {
        if (this.props.errorMessage && this.props.submitSucceeded) {
            return <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>;
        }
        return null;
    }

    
    render() {

        //console.log(platform);
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content
                        padder
                        contentContainerStyle={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            paddingBottom: 64,
                        }}>
                <Image source={require('../../assets/images/logo.jpg')}
                                 style={styles.backgroundLogin}/>
                                
                    
                        <KeyboardAvoidingView
                            enabled
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 24 }
                            behavior= {Platform.OS === 'ios' ? "padding" : null}
                        >

                            <Text style={styles.title}>TRAIN YOUR ENGLISH SKILLS</Text>
                            <Form>
                                <Item floatingLabel>
                                <Label>Email</Label>
                                <Input 
                                    autoCapitalize="none"
                                    onChangeText={email => this.setState({email})}
                                    value={this.state.email}/>
                                </Item>
                                <Item floatingLabel>
                                <Label>Password</Label>
                                <Input 
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({password})}
                                    value={this.state.password}/>
                                </Item>
                            </Form>
                            <Button
                                full
                                success
                                rounded
                                iconRight
                                disabled={this.props.loginLoading}
                                onPress={() => this.signin(this.state.email,this.state.password)}
                                style={styles.buttonSignIn}
                            >
                                <Text>Sign in</Text>
                                {
                                    this.state.login &&
                                    <AppSpinner/>
                                }
                            </Button>
                            <Button
                                full
                                success
                                rounded
                                iconRight
                                disabled={this.props.loginLoading}
                                onPress={() => this.register(this.state.email,this.state.password)}
                                style={styles.buttonSignIn}
                            >
                                <Text>Create new account</Text>
                                {
                                    this.state.register &&
                                    <AppSpinner/>
                                }
                            </Button>
                        </KeyboardAvoidingView>

                    </Content>
                    
                    
                </Container>
            </StyleProvider>
        )
    }
}


const validate = (formProps) => {

    const errors = {};

    if (!formProps.username) {
        errors.username = 'Required username';
    }

    if (!formProps.password) {
        errors.password = 'Required password';
    }

    return errors;
};

LoginScreen = reduxForm({
    form: 'login',
    validate
})(LoginScreen);

const mapStateToProps = ({user}) => {
    const {
        errorMessage,
        loginLoading,
    } = user;

    return {
        errorMessage,
        loginLoading,
    };
};

export default connect(mapStateToProps, {login})(LoginScreen);
