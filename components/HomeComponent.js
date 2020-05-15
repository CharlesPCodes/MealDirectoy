import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import { Card, Tile} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';


//redux
const mapStateToProps = state => {
    return {
        meals: state.meals,
        promotions: state.promotions,
        partners: state.partners
        
    };
};

function RenderItem(props) {
    const {item} = props;


    if (props.isLoading) {
        return <Loading />;
    }
    if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }

    if (item) {
        
        return (
            
            <Card
            //    featuredTitle={item.name}
                image={{uri: baseUrl + item.image}}>
                <Text
                    style={{margin: 10}}>
                    {item.name}
                </Text>
                <Text
                    style={{margin: 10}}>
                    {item.time}
                </Text>
                <Text
                    style={{margin: 10}}>
                    {item.temp}
                </Text>
            </Card>
        );
    }
    return <View />;
}

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scaleValue: new Animated.Value(0)
        };
    }
   
    //animate method
    animate() {
        Animated.timing(
            this.state.scaleValue,
            {
                toValue: 1,
                duration: 1500
            }
        ).start();
    }

    //react life cycle method
    componentDidMount() {
        this.animate();
    }

    static navigationOptions = {
        title: 'Featured Meals'
    }

    render() {
        return (
            //animated api
            <Animated.ScrollView style={{transform: [{scale: this.state.scaleValue}]}}>
                <RenderItem
                    item={this.props.meals.meals.filter(meal => meal.featured)[0]}
                    isLoading={this.props.meals.isLoading}
                    errMess={this.props.meals.errMess}
                />
                <RenderItem
                    item={this.props.meals.meals.filter(meal => meal.featured)[1]}
                    isLoading={this.props.meals.isLoading}
                    errMess={this.props.meals.errMess}
                />
               <RenderItem
                    item={this.props.meals.meals.filter(meal => meal.featured)[2]}
                    isLoading={this.props.meals.isLoading}
                    errMess={this.props.meals.errMess}
                />
            </Animated.ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);