import React, { Component } from 'react';
import firebase from 'firebase';
import { Button, Header, Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import Spinner from '../components/Spinner';
import ActionButton from 'react-native-action-button';

export default class GroupsScreen extends Component {
    state = { groups: null, loadingCompleted: false };

    componentDidMount() {
        let that = this;
        var user = firebase.auth().currentUser;
        let db = firebase.database().ref("users/" + user.uid + "/memberOf");
        db.on('value', function (snapshot) {
            that.setState({groups: snapshot.val(), loadingCompleted: true});
        })
    }

    render() {
        return (
            <View>
                <View>
                    <Header
                        leftComponent={null}
                        centerComponent={{ text: 'Golaso', style: { color: '#fff' } }}
                        rightComponent={null}
                    />
                </View>
                {!this.state.groups && !this.state.loadingCompleted &&
                <View style={styles.container}>
                    <Spinner size="large" />
                </View>
                }
                {!this.state.groups && this.state.loadingCompleted &&
                <View style={{alignContent: 'center'}}>
                </View>
                }

                {this.state.groups &&
                <View style={{alignContent: 'center'}}>
                </View>
                }

                <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        <ActionButton.Item buttonColor='#9b59b6' title="Create Group" onPress={() => console.log("notes tapped!")}>
                            <Icon name="plus" type="material-community" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#3498db' title="Join Group" onPress={() => {}}>
                            <Icon name="plus" type="material-community" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                </View>
            </View>
        )
    }
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
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});