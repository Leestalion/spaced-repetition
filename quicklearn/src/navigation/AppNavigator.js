import React from 'react';
import { createSwitchNavigator } from 'react-navigation'
import { createStackNavigator, createAppContainer} from 'react-navigation-stack';
import RightNav from './RightNav';
import Logo from './Logo';
import BackButton from './BackButton';
import MainTabNavigator from './MainTabNavigator';
import FlashcardScreen from  '../screens/FlashcardScreen';
import ContactScreen from '../screens/ContactScreen';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from "../screens/LoginScreen";

const AppStack = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
      navigationOptions: () => ({
        initialRouteName: 'Main',
        headerRight: () => <RightNav/>,
        headerTitle: () => <Logo/>, // Logo instead of header title
        headerStyle: {
            backgroundColor: '#FFF'
        },
      })
    },

    Flashcard: {
      screen: FlashcardScreen,
      navigationOptions: () => ({
        headerTitle: () => <Logo/>, // Logo instead of header title
        headerLeft: () => null,
        headerStyle: {
            backgroundColor: '#FFF'
        },
      })
    },
  
    Contact: ContactScreen,
  },

  {
    navigationOptions: () => ({
      initialRouteName: 'Main',
      headerRight: () => <RightNav/>,
      headerTitle: () => <Logo/>, // Logo instead of header title
      headerLeft: () => <BackButton/>,
      headerStyle: {
          backgroundColor: '#FFF'
      },
    })
  },
);

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: () => ({
        headerShown: false
      })
    },
  }
);


export default createSwitchNavigator(
  {
    Landing: LandingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Landing',
  }
);