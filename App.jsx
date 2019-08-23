import moment from 'moment';
import React, { Component } from 'react';
import { Switch, View, YellowBox, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView, ScrollView } from 'react-navigation';
import CalendarScreen from './src/screens/CalendarScreen';
import ModalScreen from './src/screens/ModalScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import AsyncStorage from '@react-native-community/async-storage';

// Temporary ignore due to dependencies using componentWillReceiveProps, componentWillUpdate, ViewPagerAndroid
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps', 'Warning: componentWillUpdate', 'Warning: ViewPagerAndroid']);

class CustomDrawerContentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideFreeItems: false,
    };
    this.onHideFreeItemsToggle = this.onHideFreeItemsToggle.bind(this);
  }

  async componentDidMount() {
    const hideFreeItems = await AsyncStorage.getItem("hideFreeItems") === "true";
    this.setState({ hideFreeItems });
  }

  async onHideFreeItemsToggle() {
    const { hideFreeItems } = this.state;
    await AsyncStorage.setItem("hideFreeItems", !hideFreeItems === true ? "true" : "false");
    this.setState({ hideFreeItems: !hideFreeItems });
  }

  render() {
    const { hideFreeItems } = this.state;
    return (
      <ScrollView>
        <SafeAreaView style={{ flex: 1, marginTop: 10, marginLeft: 20 }} forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ alignSelf: "center" }}>Hide Free Items</Text>
            <Switch
              style={{ marginLeft: 80 }}
              trackColor={{ true: "#694fad" }}
              value={hideFreeItems}
              onChange={this.onHideFreeItemsToggle}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
};

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
    contentComponent: CustomDrawerContentComponent,
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

const AppContainer = createAppContainer(RootStack);

export default function App() {
  return <AppContainer />;
}
