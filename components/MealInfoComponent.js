import React, { Component } from 'react';
import { Text, View, ScrollView, Modal, Button, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

//redux
const mapStateToProps = state => {
    return {
        meals: state.meals,
        comments: state.comments,
        favorites: state.favorites,
    };
};

//redux
const mapDispatchToProps = {
    postFavorite: mealId => (postFavorite(mealId)),
    postComment: (mealId, rating, author, text) => (postComment(mealId, rating, author, text))
};

//RenderComment function
// function RenderComments({ comments }) {

//     const renderCommentItem = ({ item }) => {
//         return (
//             <View style={{ margin: 10 }}>
//                 <Text style={{ fontSize: 14 }}>{item.text}</Text>
//                 <Rating style={{ fontSize: 12 }}>{item.rating} Stars</Rating>
//                 <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
//             </View>
//         );
//     };

//     return (
//         <Animatable.View
//             animation='fadeInUp'
//             duration={2000}
//             delay={1000}>
//             <Card title='Comments'>
//                 <FlatList
//                 data={comments}
//                 renderItem={renderCommentItem}
//                 keyExtractor={item => item.id.toString()}
//             />
//         </Card>
//         </Animatable.View>
//     );
// }

//RenderCampsite function
function RenderMeal(props) {

    const { meal } = props;

    const view = React.createRef();

    const recognizeDrag = ({dx}) => (dx < -200) ? true : false;

    // const recognizeComment = ({dx}) => (dx > 200) ? true : false;

    /*PanResponder api -- the PanResponder and two panHandlers, onStartShouldSetPanResponder and onPanResponderEnd, to cause the campsite information Card in the CampsiteInfo component to respond to a drag gesture of more than 200 pixels to the left.gestureState=movement of finger */
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            view.current.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'canceled'));
        },    
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end', gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + meal.name + ' to favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                );
            }
            return true;
        }
    });

    const shareMeal = (title, message, url) => {
        Share.share({
            title: title,
            message: `${title}: ${message} ${url}`,
            url: url
        },{
            dialogTitle: 'Share ' + title
        });
    };


    if (meal) {
        return (
            <Animatable.View 
                  animation='fadeInDown' 
                  duration={2000} 
                  delay={1000}
                  ref={view}
                  {...panResponder.panHandlers}>  
            <Card
                // featuredTitle={campsite.name}
                image={{ uri: baseUrl + meal.image }}>
                <Text style={{ margin: 10 }}>
                    {meal.time }
                </Text>
                <Text style={{ margin: 10 }}>
                    {meal.temp }
                </Text>
                <Text style={{ margin: 10 }}>
                    {meal.calories }
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ?
                            console.log('Already set as a favorite') : props.markFavorite()}
                    />
                    <Icon
                            name={'share'}
                            type='font-awesome'
                            color='#5637DD'
                            style={styles.cardItem}
                            raised
                            reverse
                            onPress={() => shareMeal(meal.name, meal.temp,meal.time, meal.calories, baseUrl + meal.image)} 
                        />
                </View>
            </Card>
            </Animatable.View>
        );
    }
    return <View />;
}

//class CampsiteComponent
class MealInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {

            rating: 5,
            author: '',
            text: '',
            favorite: false,
            showModal: false
         
        };
    }

    markFavorite(mealId) {
        this.props.postFavorite(mealId);
    }

    //navigation options, you click on this link 
    static navigationOptions = {
        title: "Meal Info"
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment(mealId) {
        this.props.postComment(mealId, this.state.rating, this.state.author, this.state.text)
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            text: '',
            favorite: false,
            showModal: false 
        });
    }

 

    render() {
        const mealId = this.props.navigation.getParam('mealId');
        const meal = this.props.meals.meals.filter(meal => meal.id === mealId)[0];
        // const comments = this.props.comments.comments.filter(comment => comment.mealId === mealId);

        return (

            <ScrollView>
                <RenderMeal meal={meal}
                    favorite={this.props.favorites.includes(mealId)}
                    markFavorite={() => this.markFavorite(mealId)}
                    onshowModal={() => this.toggleModal()}
                />
                {/* <RenderComments comments={comments} /> */}
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>

                    <View style={styles.modal}>

                        <Rating
                            type='star'
                            showRating
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={(rating) => this.setState({ rating: rating })}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={author => this.setState({ author: author })}
                            value={this.state.author}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={text => this.setState({ text: text })}
                            value={this.state.text}
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                title='Submit'
                                color='#5637dd'
                                onPress={() => {
                                    this.handleComment(mealId);
                                    this.resetForm();
                                }}
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button
                                title='Cancel'
                                color='#808080'
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: {
        justifyContent: 'center',
        margin: 20,

    }

});

export default connect(mapStateToProps, mapDispatchToProps)(MealInfo);