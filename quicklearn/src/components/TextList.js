import React from 'react';
import {
    Text,
    List,
    ListItem,
    Body,
    Right,
    Button,
    Left,
    Icon
} from 'native-base';
import {withNavigation} from 'react-navigation';
//import commonColor from '../../native-base-theme/variables/commonColor';

class TextList extends React.Component {

    renderListItems() {
        return (
            this.props.dataSource.map((title,id) => {
                return (
                    <ListItem noIndent style={{backgroundColor:'white', paddingTop: 15, paddingBottom: 15}} button key={id}
                        onPress={() => this.props.navigation.navigate('Text', title)}
                    >
                      <Left>
                          <Text>{text.title}</Text>
                      </Left>
                      <Right>
                          <Icon name="chevron-right"/>
                      </Right>
                    </ListItem>
                );
            })
        );
    }

    render() {
        return (
            <List noIndent>
                <ListItem itemDivider style={{backgroundColor: this.props.color}}>
                    <Text style={{color: '#ffffff', fontSize: 16}}>Choose a text</Text>
                </ListItem>
                {this.renderListItems()}
            </List>
        );
    }
}


export default withNavigation(TextList);
