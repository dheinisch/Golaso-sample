import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Spinner from '../components/Spinner';
import firebase from 'firebase';
import { FormLabel, FormInput, Button, Header, Icon } from 'react-native-elements'

export default class LoginScreen extends Component {
    state = { email: '', password: '', msg: '', loading: false, success: false };

    onLoginPress() {
        this.setState({ msg: '', loading: true });
        var that = this;

        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => { that.setState({ msg: '', loading: false }); })
            .catch((error) => {
                var errorCode = error.code;
                if (errorCode === 'auth/wrong-password') {
                    that.setState({msg: 'Wrong password.', loading: false});
                }
                if (errorCode === 'auth/invalid-email') {
                    that.setState({msg: 'Invalid email.', loading: false});
                }
                if (errorCode === 'auth/user-not-found') {
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then(() => {
                            that.setState({msg: 'Check your email to continue', loading: false});
                        })
                        .catch((error) => {
                            var errorCode = error.code;
                            if (errorCode === 'auth/email-already-in-use') {
                            }
                            that.setState({msg: 'Wrong email or password.', loading: false});
                        });
                }
            });
    }

    renderButtonOrSpinner() {
        if (this.state.loading) {
            return <Spinner size="small"/>;
        }

        return <Button
            onPress={this.onLoginPress.bind(this)}
            title="Log in" />;
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={null}
                    centerComponent={{ text: 'Golaso', style: { color: '#fff' } }}
                    rightComponent={null}
                />
                <FormLabel>Email</FormLabel>
                {/*<Icon name="email-outline" type="material-community" style={styles.actionButtonIcon} />*/}
                <FormInput
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}/>
                <FormLabel>Password</FormLabel>
                <FormInput
                    value={this.state.password}
                    autoCorrect={false}
                    secureTextEntry
                    onChangeText={password => this.setState({ password })}/>
                <Text style={styles.errorTextStyle}>{this.state.msg}</Text>
                {this.renderButtonOrSpinner()}
            </View>
        );
    }
}

const styles = {
    errorTextStyle: {
        color: '#E64A19',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    }
};
