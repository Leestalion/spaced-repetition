import React from 'react';
import { View, Text } from 'react-native';
import { Item, Input, Label, Icon } from 'native-base';

const styles = {
    defaultStyle:{
        marginBottom: 8,
    },
    error: {
        color : 'red'
    },
    label:{
        color: '#ffffff'
    }
};

export const renderInput = ({
                                input, secureTextEntry, placeholder, meta: { touched, error, warning, dirty } , style, label, floatingLabel
                            }) => {
    let hasError= false;
    if(error){
        hasError= true;
    }

    return (
        <View>
            <Item
               // rounded
                floatingLabel={floatingLabel}
                error={hasError && touched}
                style={{...styles.defaultStyle , style}}
            >
                <Label style={styles.label}>{label}</Label>
                <Input placeholder={placeholder} secureTextEntry={secureTextEntry} {...input} style={{color:'white'}} />
            </Item>
            {hasError && touched && <Text style={styles.error}>{error}</Text>}
        </View>

    );
};
