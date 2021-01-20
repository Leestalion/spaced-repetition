import React, {Component} from 'react';
import { Text } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
//import commonColor from '../../native-base-theme/variables/commonColor';
import { withNavigation } from 'react-navigation';

const BackButton = (props) => {
    return(
        <FontAwesome.Button
            name="angle-left"
            size={26}
            color="blue"
            backgroundColor="white"
            onPress={() => props.navigation.goBack()}            
        >
            <Text>Back</Text>
        </FontAwesome.Button>
    )
};

export default withNavigation(BackButton);