import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome5 } from '@expo/vector-icons'
import TabBarIcon from '../components/TabBarIcon';
import TextSelectScreen from '../screens/TextSelectScreen';
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
