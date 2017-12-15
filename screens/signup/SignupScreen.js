import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native'
import Spinner from "../../components/Spinner";
import firebase from 'firebase';

const personIcon = require("../../assets/images/person.png");
const lockIcon = require("../../assets/images/lock.png");
const emailIcon = require("../../assets/images/email.png");

export default class SignupScreen extends Component {

    state = { email: '', password: '', username: '', loading: false };

    render() {
        return (
            <View style={styles.container}>
                    <View style={styles.inputsContainer}>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={personIcon}
                                    style={styles.inputIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <TextInput
                                style={[styles.input]}
                                placeholder="Name"
                                placeholderTextColor="#000"
                                underlineColorAndroid='transparent'
                                onChangeText={username => this.setState({ username })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={emailIcon}
                                    style={styles.inputIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <TextInput
                                style={[styles.input]}
                                placeholder="Email"
                                placeholderTextColor="#000"
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={lockIcon}
                                    style={styles.inputIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <TextInput
                                secureTextEntry={true}
                                style={[styles.input]}
                                placeholder="Password"
                                placeholderTextColor="#000"
                                onChangeText={password => this.setState({ password })}
                            />
                        </View>
                    </View>
                    <View style={styles.footerContainer}>
                        {!this.state.loading &&
                        <TouchableOpacity onPress={() => this.onSignupPress()}>
                            <View style={styles.signup}>
                                <Text>Join</Text>
                            </View>
                        </TouchableOpacity>
                        }
                        {this.state.loading &&
                        <TouchableOpacity>
                            <View style={styles.signup}>
                                <Spinner size='small' color='#FFF'/>
                            </View>
                        </TouchableOpacity>
                        }
                    </View>
            </View>
        );
    }

    onSignupPress() {
        this.setState({ loading: true });

        const { email, password } = this.state;
        let that = this;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                user.updateProfile({
                    displayName: that.state.username
                }).then(() => {
                    user.sendEmailVerification().then(() => {
                        if (user !== null && !user.emailVerified) {
                            Alert.alert(user.displayName + " Please check " + user.email + " to continue...");
                        }
                        setTimeout(this.props.navigation.goBack, 0)
                    })
                }).catch(() => {
                    //TODO
                });
                that.setState({ loading: false });
            })
            .catch((error) => {
                let errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                }
                that.setState({ loading: false });
            });
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bg: {
        paddingTop: 30,
        width: null,
        height: null
    },
    headerContainer: {
        flex: 1,
    },
    inputsContainer: {
        flex: 3,
        marginTop: 50,
    },
    inputWrap: {
        flexDirection: "row",
        marginVertical: 10,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#CCC"
    },
    footerContainer: {
        flex: 1
    },
    headerIconView: {
        marginLeft: 10,
        backgroundColor: 'transparent'
    },
    headerBackButtonView: {
        width: 25,
        height: 25,
    },
    backButtonIcon: {
        width: 25,
        height: 25,
        tintColor: "#000"
    },
    headerTitleView: {
        backgroundColor: 'transparent',
        marginTop: 25,
        marginLeft: 25,
    },
    titleViewText: {
        fontSize: 40,
        flex: 1,
        color: '#000',
    },
    inputs: {
        paddingVertical: 20,
    },
    inputContainer: {
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent',
        flexDirection: 'row',
        height: 75,
    },
    iconContainer: {
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputIcon: {
        width: 30,
        height: 30,
        tintColor: "#000"
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
    },
    signup: {
        backgroundColor: '#FF3366',
        paddingVertical: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    signin: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    greyFont: {
        color: '#D8D8D8'
    }
})