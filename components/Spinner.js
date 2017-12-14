import React, { Component } from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native'

class Spinner extends Component {
    render() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size={this.props.size} color={this.props.color} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
});

export default Spinner;