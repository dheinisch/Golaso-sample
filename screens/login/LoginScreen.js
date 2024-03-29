import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import firebase from 'firebase';
import Spinner from '../../components/Spinner';
import { NavigationActions } from 'react-navigation'
const { width, height } = Dimensions.get("window");

const mark = require("../../assets/images/mark.png");
const lockIcon = require("../../assets/images/lock.png");
const personIcon = require("../../assets/images/person.png");

export default class LoginScreen extends Component {

    state = { email: '', password: '', msg: '', loading: false, initUserCompleted: false, userIsVerified: false };

    componentDidMount() {
        let that = this;
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            that.handleUserLoggedIn(user);
            that.unsubscribe();
            that.setState({ initUserCompleted: true});
            if (this.state.userIsVerified) {
                that.loginCompleted();
            }
        })
    }

    loginCompleted() {
        const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Groups'})
            ]
        });
        this.props.navigation.dispatch(resetAction)
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                {this.state.initUserCompleted &&
                    <View style={styles.markWrap}>
                        <Image source={mark} style={styles.mark} resizeMode="contain"/>
                    </View>
                }
                {this.state.initUserCompleted &&
                    <View style={styles.wrapper}>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <Image source={personIcon} style={styles.icon} resizeMode="contain"/>
                            </View>
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#000"
                                style={styles.input}
                                onChangeText={email => this.setState({email})}
                            />
                        </View>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <Image source={lockIcon} style={styles.icon} resizeMode="contain"/>
                            </View>
                            <TextInput
                                placeholderTextColor="#000"
                                placeholder="Password"
                                style={styles.input}
                                secureTextEntry
                                onChangeText={password => this.setState({password})}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={.5}>
                            <View>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </View>
                        </TouchableOpacity>
                        {!this.state.loading &&
                        <TouchableOpacity activeOpacity={.5} onPress={() => this.onSignInPress()}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Sign In</Text>
                            </View>
                        </TouchableOpacity>
                        }
                        {this.state.loading &&
                        <TouchableOpacity activeOpacity={.5}>
                            <View style={styles.button}>
                                <Spinner size='small' color="#fff"/>
                            </View>
                        </TouchableOpacity>
                        }

                    </View>
                }
                {this.state.initUserCompleted &&
                    <View style={styles.container}>
                        <View style={styles.signupWrap}>
                            <Text style={styles.accountText}>Don't have an account?</Text>
                            <TouchableOpacity activeOpacity={.5} onPress={() => navigate('Signup')}>
                                <View>
                                    <Text style={styles.signupLinkText}>Sign Up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                {!this.state.initUserCompleted &&
                    <Spinner size='large' color='#000'/>
                }

            </View>
        );
    }

    onSignInPress() {
        this.setState({ loading: true });

        const { email, password } = this.state;
        let that = this;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                that.handleUserLoggedIn(user);
                that.setState({ loading: false });
            })
            .catch((error) => {
                let errorCode = error.code;
                if (errorCode === 'auth/wrong-password') {
                    that.setState({ loading: false });
                    Alert.alert(password + " is incorrect.");
                }
                if (errorCode === 'auth/invalid-email') {
                    that.setState({ loading: false });
                    Alert.alert(email + " is incorrect.");
                }
                if (errorCode === 'auth/user-not-found') {
                    that.setState({ loading: false });
                    Alert.alert("User doesn't exist. Please Sign Up.");
                }
            });
    }

    handleUserLoggedIn(user) {
        if (user !== null && user.emailVerified) {
            this.setState({ userIsVerified: true });
        } else if (user !== null && !user.emailVerified && this.state.initUserCompleted) {
            Alert.alert(user.displayName + " Please check " + user.email + " to continue...");
        }
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    markWrap: {
        flex: 1,
        paddingVertical: 30,
    },
    mark: {
        width: null,
        height: null,
        flex: 1,
    },
    background: {
        width,
        height,
    },
    wrapper: {
        paddingVertical: 30,
    },
    inputWrap: {
        flexDirection: "row",
        marginVertical: 10,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#CCC"
    },
    iconWrap: {
        paddingHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        height: 20,
        width: 20,
        tintColor: "#000"
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "#FF3366",
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
    },
    forgotPasswordText: {
        color: "#000",
        backgroundColor: "transparent",
        textAlign: "right",
        paddingRight: 15,
    },
    signupWrap: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    accountText: {
        color: "#000"
    },
    signupLinkText: {
        color: "#0000ff",
        marginLeft: 5,
    }
});