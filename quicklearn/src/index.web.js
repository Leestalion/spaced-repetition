import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import App from './src/App'

AppRegistry.registerComponent('App', () => App);

// 以下の行がRN Web特有。RN用のindex.jsとの違いはこれだけ。
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });