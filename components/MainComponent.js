import React, { Component } from 'react';
import Home from './HomeComponent';
import Directory from './DirectoryComponent';
import MealInfo from './MealInfoComponent'
import Favorites from './FavoritesComponent';
import { View, Platform, StyleSheet, Text, ScrollView, Image, Alert, ToastAndroid   } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems  } from 'react-navigation';
import { Icon } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import { connect } from 'react-redux';
import { fetchMeals, fetchComments, fetchPromotions, fetchPartners } from '../redux/ActionCreators';
import NetInfo from '@react-native-community/netinfo';
import MealSubmit from './MealSubmit'


const mapDispatchToProps = {
    fetchMeals,
    fetchComments,
    fetchPromotions,
    fetchPartners
};


//DirectoryNavigator
const DirectoryNavigator = createStackNavigator(
{
    Directory: {
        screen: Directory,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <Icon
                name='cutlery'
                type='font-awesome'
                iconStyle={styles.stackIcon}
                onPress={() => navigation.toggleDrawer()}
            />
        })
    },
    MealInfo: { screen: MealInfo }
}, 
{
    initialRouteName: 'Directory',
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#00A8E8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        }
    }
}
);

// 
const MealSubmitNavigator = createStackNavigator(
    {
        MealSubmit: {
            screen: MealSubmit,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <Icon
                    name='home'
                    type='font-awesome'
                    iconStyle={styles.stackIcon}
                    onPress={() => navigation.toggleDrawer()}
                />
            })
        },
        MealSubmit: { screen: MealSubmit }
    }, 
    {
        initialRouteName: 'MealSubmit',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#00A8E8'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
    );



// 




//HomeNavigator
const HomeNavigator = createStackNavigator(
{
    Home: { screen: Home }
},
{
    navigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: '#00A8E8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        },
        headerLeft: <Icon
            name='home'
            type='font-awesome'
            iconStyle={styles.stackIcon}
            onPress={() => navigation.toggleDrawer()}
        />
    })
}
);

//FavoritesNavigator
const FavoritesNavigator = createStackNavigator(
{
    Favorites: { screen: Favorites }
},
{
    navigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: '#00A8E8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        },
        headerLeft: <Icon
            name='heart'
            type='font-awesome'
            iconStyle={styles.stackIcon}
            onPress={() => navigation.toggleDrawer()}
        />
    })
}
);

//CustomDrawerContentComponent
const CustomDrawerContentComponent = props => (
<ScrollView>
    <SafeAreaView 
        style={styles.container}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={styles.drawerHeader}>
            <View style={{flex: 1}}>
                {/* <Image source={require('./images/logo.png')} style={styles.drawerImage} /> */}
            </View>
            <View style={{flex: 2}}>
                <Text style={styles.drawerHeaderText}>Meal Book</Text>
            </View>
        </View>
        <DrawerItems {...props} />
    </SafeAreaView>
</ScrollView>
);


//mainNavigator
const MainNavigator = createDrawerNavigator(
{
  
    Home: { 
        screen: HomeNavigator,
        navigationOptions: {
            drawerLabel: 'Featured Meals',
            drawerIcon: ({tintColor}) => (
                <Icon
                    name='home'
                    type='font-awesome'
                    size={24}
                    color={tintColor}
                />
            )
        }},
    Directory: { 
        screen: DirectoryNavigator,
        navigationOptions: {
            drawerIcon: ({tintColor}) => (
                <Icon
                    name='cutlery'
                    type='font-awesome'
                    size={24}
                    color={tintColor}
                />
            )
        }},
    Favorites: {
        screen: FavoritesNavigator,
        navigationOptions: {
            drawerLabel: 'My Favorites',
            drawerIcon: ({tintColor}) => (
                <Icon
                    name='heart'
                    type='font-awesome'
                    size={24}
                    color={tintColor}
                />
            )
        }
    },
    MealSubmit: {
        screen: MealSubmitNavigator,
        navigationOptions: {
            drawerLabel: 'Search Meal',
            drawerIcon: ({tintColor}) => (
                <Icon
                    name='sign-in'
                    type='font-awesome'
                    size={24}
                    color={tintColor}
                />
            )
        }
    }
   
},

{
    initialRouteName: 'Home',
    drawerBackgroundColor: '#FFFFFF',
    contentComponent: CustomDrawerContentComponent
}
);

class Main extends Component {

//life cycle method
componentDidMount() {
    this.props.fetchMeals();
    this.props.fetchComments();
    this.props.fetchPromotions();
    this.props.fetchPartners();

    NetInfo.fetch().then(connectionInfo => {
        (Platform.OS === 'ios') ?
            Alert.alert('Initial Network Connectivity Type:', connectionInfo.type)
            : ToastAndroid.show('Initial Network Connectivity Type: ' +
                connectionInfo.type, ToastAndroid.LONG);
    });
    
    //this method calls call back function NetInfo.addEventListener
    this.unsubscribeNetInfo = NetInfo.addEventListener(connectionInfo => {
        this.handleConnectivityChange(connectionInfo);
    });
}

//life cycle method call unsubscribeNetInfo
componentWillUnmount() {
    this.unsubscribeNetInfo();
}

handleConnectivityChange = connectionInfo => {
    let connectionMsg = 'You are now connected to an active network.';
    switch (connectionInfo.type) {
        case 'none':
            connectionMsg = 'No network connection is active.';
            break;
        case 'unknown':
            connectionMsg = 'The network connection state is now unknown.';
            break;
        case 'cellular':
            connectionMsg = 'You are now connected to a cellular network.';
            break;
        case 'wifi':
            connectionMsg = 'You are now connected to a WiFi network.';
            break;
    }
    (Platform.OS === 'ios') ? Alert.alert('Connection change:', connectionMsg)
        : ToastAndroid.show(connectionMsg, ToastAndroid.LONG);
}


render() {
    return (
   <View style={{
       flex: 1,
       paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
              <MainNavigator />
        </View>
    )
}
}

//styelsheet
const styles = StyleSheet.create({
container: {
    flex: 1,
},
drawerHeader: {
    backgroundColor: '#00A8E8',
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

console.disableYellowBox = true;

export default connect(null, mapDispatchToProps)(Main);