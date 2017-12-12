import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import LoginScreen from './screens/LoginScreen';
import GroupsScreen from './screens/GroupsScreen';
import * as firebase from 'firebase';
import Spinner from './components/Spinner';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDgwgCwLlzGC8mIphRU40Z32clFxyX1AuI",
    authDomain: "golaso-188317.firebaseapp.com",
    databaseURL: "https://goalso-188317.firebaseio.com/",
    storageBucket: "golaso-188317.appspot.com"
};

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    loadingUserCompleted: false
  };

  componentWillMount() {
      var that = this;
      firebase.initializeApp(firebaseConfig);firebase.auth().onAuthStateChanged(function(user) {
          that.authStatusChanged(user)});
      console.log("Firebase Initialized");
  }

  authStatusChanged(user) {
      this.setState({ loadingUserCompleted: true });
      if (user !== null) {
          this.setState({success: true});
      }
  }

  render() {
      var user = firebase.auth().currentUser;

      if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
          {!this.state.loadingUserCompleted && <Spinner size="large" />}
          {this.state.loadingUserCompleted && user && <GroupsScreen/>}
          {this.state.loadingUserCompleted && !user && <LoginScreen/>}
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
