import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable';
import { SearchBar } from 'react-native-elements';


//redux
const mapStateToProps = state => {
    return {
        meals: state.meals
        
    };
};

class Directory extends Component {
    state = {
        search: '',
      };
      updateSearch = search => {
        this.setState({ search });
      };
//navigation options, you click on this link sidebar
    static navigationOptions = {
        title: 'Directory'
    };

    render() {
        const { navigate } = this.props.navigation;
        const renderDirectoryItem = ({ item }) => {
            return (
                
                <Animatable.View animation='fadeInRightBig' duration={2000}>
                <Tile
                    title={item.name}
                    titleStyle={{alignSelf:"center"}}
                    caption={item.temp}
                    onPress={() => navigate('MealInfo', { mealId: item.id })}
                    imageSrc={{ uri: baseUrl + item.image }}
                />
                </Animatable.View>
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
            data={this.props.meals.meals}
            renderItem={renderDirectoryItem}
            keyExtractor={item => item.id.toString()}
        />
    );
}
}

const styles = StyleSheet.create({
container: {
    flex: 1,
},
drawerHeader: {
    backgroundColor: '#5637DD',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
},
drawerHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
},
drawerImage: {
    margin: 10,
    height: 60,
    width: 60
},
stackIcon: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 24
}
});

export default connect(mapStateToProps)(Directory);