import React, { Component } from 'react';
import firebase from 'firebase';
import Spinner from "../components/Spinner";


export default class HomeScreen extends React.Component {
    state = { groups: {}, };

    render() {
        return (
          <Spinner size="large"/>
        )
    }
}