import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import moment from 'moment';

export default class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#000',
        alignItems: 'center',
      }}>
        <View style={{
          height: '80%',
          width: '95%',
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text>Testing a modal</Text>
          <Button
            onPress={() => {
              const currDate = moment();
              const y = currDate.year();
              const m = currDate.month();
              const d = currDate.date();
              this.props.navigation.getParam('addTodo')({
                startDate: moment([y, m, d, 20, 0]),
                endDate: moment([y, m, d, 21, 0]),
                title: 'New Todo',
                content: 'Wow! You added a new todo!',
                done: false,
              });
              this.props.navigation.goBack();
            }}
            title="Add Todo"/>
          <Button onPress={() => this.props.navigation.goBack()} title="Go Back" />
        </View>
      </View>
    );
  }
}
