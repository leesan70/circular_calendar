import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer, createDrawerNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import DrawerContent from '../components/Drawer';
import { CalendarScreen, ModalScreen, ScheduleScreen } from '../screens';

const DrawerNavigator = createDrawerNavigator(
  {
    ScheduleMain: {
      screen: ScheduleScreen,
      params: {
        dataDate: moment().startOf('day'),
      },
    }
  },
  {
    contentComponent: DrawerContent,
    hideStatusBar: true,
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    overlayColor: '#6b52ae',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
  }
);

const AppNavigator = createMaterialTopTabNavigator({
  Schedule: {
    screen: DrawerNavigator,
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
  },
);

export default AppContainer = createAppContainer(RootStack);
