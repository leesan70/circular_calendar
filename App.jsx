import moment from 'moment';
import React from 'react';
import { View, YellowBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import CalendarScreen from './src/screens/CalendarScreen';
import ModalScreen from './src/screens/ModalScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';

// Temporary ignore due to dependencies using componentWillReceiveProps, ViewPagerAndroid
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps', 'Warning: ViewPagerAndroid']);

const AppNavigator = createMaterialTopTabNavigator({
  Schedule: {
    screen: ScheduleScreen,
    params: {
      dataDate: moment().startOf('day'),
    },
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
  tabBarPosition: 'bottom',
  initialRouteName: 'Schedule',
  tabBarOptions: {
    showIcon: true,
    activeTintColor: '#f0edf6',
    inactiveTintColor: '#3e2465',
    indicatorStyle: { backgroundColor: '#f0edf6' },
    style: { backgroundColor: '#694fad' },
  },
});

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
    headerMode: 'none',
    cardStyle: {
      // backgroundColor: 'transparent',
      // opacity: 0.9,
    },
  },
);

const AppContainer = createAppContainer(RootStack);

export default function App() {
  return <AppContainer />;
}
