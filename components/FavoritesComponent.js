import React, { Component } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import Swipeout from 'react-native-swipeout';
import { deleteFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        meals: state.meals,
        favorites: state.favorites
    };
};

//action creator
const mapDispatchToProps = {    
    deleteFavorite: campsiteId => (deleteFavorite(campsiteId)
    )};

class Favorites extends Component {

    static navigationOptions = {
        title: 'My Favorites'
    }

     /* Alert API's alert() method to cause an alert dialog to pop up in response to a button being pressed, then to show and configure buttons within the alert dialog to initiate further actions */
    render() {
        const { navigate } = this.props.navigation;
        const renderFavoriteItem = ({item}) => {
            const rightButton = [
                {
                    text: 'Delete', 
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Delete Favorite?',
                            'Are you sure you wish to delete the favorite campsite ' + item.name + '?',
                            [
                                { 
                                    text: 'Cancel', 
                                    onPress: () => console.log(item.name + 'Not Deleted'),
                                    style: ' cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            ];

            return (
                //Swipeout button
                <Swipeout right={rightButton} autoClose={true}>
                    <Animatable.View animation='fadeInRightBig' duration={2000}>
                    <ListItem
                        title={item.name}
                        subtitle={item.description}
                        leftAvatar={{source: {uri: baseUrl + item.image}}}
                        onPress={() => navigate('MealInfo', {mealId: item.id})}
                    />
                    </Animatable.View>
                </Swipeout>
            );
        };

        if (this.props.meals.isLoading) {
            return <Loading />;
        }
        if (this.props.meals.errMess) {
            return (
                <View>
                    <Text>{this.props.meals.errMess}</Text>
                </View>
            );
        }
        return (
            <FlatList
                data={this.props.meals.meals.filter(
                    campsite => this.props.favorites.includes(campsite.id)
                )}
                renderItem={renderFavoriteItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);