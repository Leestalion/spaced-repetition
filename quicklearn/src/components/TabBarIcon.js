import React from 'react';
import {FontAwesome5} from '@expo/vector-icons'

import Colors from '../../constants/Colors';

export default class TabBarIcon extends React.Component {
    render() {
        return (
            <FontAwesome5
                name={this.props.name}
                size={26}
                style={{ marginBottom: -3 }}
                color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
        );
    }
}