import React, { Component } from 'react';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import {View, StyleSheet, TextInput, TouchableOpacity, Text} from 'react-native';
import Spinner from '../components/Spinner';
import ActionButton from 'react-native-action-button';
import CustomListView from "../components/CustomListView";

const trophyImage = require('../assets/images/world-cup.png');

export default class GroupsScreen extends Component {

    state = { groups: null, loadingCompleted: false };

    componentDidMount() {
        this.fetchData();
    }

    buildGroups(data) {
        if (data !== null) {
            let groups = {};
            Object.keys(data).map(function (key, index) {
                groups[index] = {text: key, image: trophyImage};
            });

            this.setState({ groups: groups });
        }
    }

    fetchData() {
        let that = this;
        let user = firebase.auth().currentUser;
        let db = firebase.database().ref("users/" + user.uid + "/memberOf");
        db.once('value', function (snapshot) {
            that.buildGroups(snapshot.val());
            if (!that.state.loadingCompleted) {
                that.setState({loadingCompleted: true});
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>

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
                    <CustomListView
                        data={this.state.groups}
                        onPressRow={this.rowPressed}
                    />
                }

                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#9b59b6' title="Create Group" onPress={() => this.onNewGroup()}>
                        <Icon name="plus" type="material-community" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Join Group" onPress={() => this.toggleJoinGroupModal()}>
                        <Icon name="plus" type="material-community" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
    }

    rowPressed(rowIndex) {
        console.log("Row pressed " + rowIndex);
    }

    onNewGroup() {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputWrap: {
        flexDirection: "row",
        marginVertical: 10,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#CCC"
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
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
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});