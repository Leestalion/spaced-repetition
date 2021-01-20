import React, {Component} from 'react';
import {Image, View, Dimensions, } from 'react-native';
import {Button, Text, Icon} from 'native-base';
import Carousel from 'react-native-snap-carousel';
const {width} = Dimensions.get('window');
import {withNavigation} from 'react-navigation';

class VideosCarousel extends Component {

    renderItem = ({item, index}) => {
        return (
            <View>
                <Image
                    source={{uri: `https://img.youtube.com/vi/${item.youtubeId}/0.jpg`}}
                    style={{
                        alignContent:'center',
                        width: width - 80,
                        height: 200,
                    }}

                />
                <Text
                    style={{
                        paddingTop: 8,
                        paddingLeft: 8,
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'white',
                        position: 'absolute',
                    }}
                >
                    {item.title}

                </Text>
                <Button
                    full
                    style={{
                        backgroundColor: '#6FB98F'
                    }}
                    onPress={() => this.props.navigation.navigate('VideoPlay', item)}
                >
                    <Text>Watch it</Text>
                    <Icon name="play" type="Feather"/>
                </Button>
            </View>
        );
    }

    render() {
        return (
            <View>
            <Carousel
                layout={this.props.layout}
                ref={(c) => {
                    this._carousel = c;
                }}
                data={this.props.videos}
                renderItem={this.renderItem}
                sliderWidth={width - 20}
                itemWidth={width - 80}
            />
            </View>
        );
    }
}

export default withNavigation(VideosCarousel);
