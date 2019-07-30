import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScheduleScreen from './src/screens/ScheduleScreen';
import CalendarScreen from './src/screens/CalendarScreen';

const AppNavigator = createMaterialBottomTabNavigator({
  Schedule: {
    screen: ScheduleScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Icon style={[{ color: tintColor }]} size={25} name="account-box" />
        </View>
      ),
    },
  },
  Calendar: {
    screen: CalendarScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Icon style={[{ color: tintColor }]} size={25} name="calendar" />
        </View>
      ),
    },
  },
}, {
  initialRouteName: 'Schedule',
  activeColor: '#f0edf6',
  inactiveColor: '#3e2465',
  barStyle: { backgroundColor: '#694fad' },
});

class ModalScreen extends React.Component {
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

const RootStack = createStackNavigator(
  {
    Main: {
      screen: AppNavigator,
    },
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      // backgroundColor: 'transparent',
      opacity: 0.9,
    },
  },
);

const AppContainer = createAppContainer(RootStack);

export default function App() {
  return <AppContainer />;
}
