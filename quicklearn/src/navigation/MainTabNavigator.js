import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome5 } from '@expo/vector-icons'
import TabBarIcon from '../components/TabBarIcon';
import TextSelectScreen from '../screens/TextSelectScreen';
import TitleListScreen from '../screens/TitleListScreen';
import OnlineTestScreen from  '../screens/OnlineTestScreen';
import StatsScreen from '../screens/StatsScreen';
import Colors from '../../constants/Colors';

const TextStack = createStackNavigator({
  TextSelect: TextSelectScreen,
});

TextStack.navigationOptions = {
  initialRouteName: 'TextSelect',
  header: null,
  tabBarLabel: 'Training',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="book"
    />
  ),
};

const OnlineTestStack = createStackNavigator({
  OnlineTest:{
    screen: OnlineTestScreen,
    navigationOptions: {
      headerShown: false
    }
  },
});

OnlineTestStack.navigationOptions = {
  headerShown: false,
  tabBarLabel: 'Test',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'envelope-open-text'}
    />
  ),
};


const StatsStack = createStackNavigator({
  Stats: {
    screen: StatsScreen,
    navigationOptions: {
      headerShown: false,
    }
  }
});

StatsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'graduation-cap'}
    />
  ),
};

export default createBottomTabNavigator(
  {
    TextStack,
    //FlashcardStack,    
    //FillinBlankStack,
    //OnlineTestStack,
    //SearchStack,   
    //NewsBrowseStack, 
    //CameraStack,
    //VideoStack,
    StatsStack,    
  },
  {
    navigationOptions: {
      tabBarOptions: {
        labelStyle: {
          fontSize: 12,
        },
        style: {
          backgroundColor:  '#FFF',
        },
      }
    },
  }
);
