import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  Header,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Pie from '../components/Pie';
import PieController from '../components/PieController';
import TodoList from '../components/TodoList';
import Theme from '../theme';
import importedData from '../../resources/data';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
  },
  floating_button: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 10,
  },
});

const height = 220;

function getData(date) {
  return importedData.todoItemList;
}

export default class ScheduleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getData(),
      selectedIndex: -1,
      date: moment(),
      is12HrMode: false,
      showAM: false,
    };
    this.onPieItemPress = this.onPieItemPress.bind(this);
    this.onPieItemLongPress = this.onPieItemLongPress.bind(this);
    this.onBackgroundPress = this.onBackgroundPress.bind(this);
    this.onHrModePress = this.onHrModePress.bind(this);
    this.onAMPMPress = this.onAMPMPress.bind(this);
    this.prepareDisplayData = this.prepareDisplayData.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { date, ...rest } = this.state;
    const { date:nextDate, ...nextRest } = nextState;
    // Re-render only when there's difference in minutes in dates or when any other state changes.
    return nextDate.minute() !== date.minute() ||
      rest.data != nextRest.data ||
      rest.selectedIndex !== nextRest.selectedIndex ||
      rest.is12HrMode !== nextRest.is12HrMode ||
      rest.showAM !== nextRest.showAM;
  }

  tick() {
    this.setState({
      date: moment(),
    });
  }

  onPieItemPress(index) {
    this.setState({
      selectedIndex: index,
    });
  }

  onPieItemLongPress(index) {
    this.onPieItemPress(index);
  }

  onBackgroundPress() {
    this.setState({
      selectedIndex: -1,
    });
  }

  onHrModePress(hrModeIndex) {
    const is12HrMode = hrModeIndex === 0;
    this.setState({
      is12HrMode,
    });
  }

  onAMPMPress(AMPMIndex) {
    const showAM = AMPMIndex === 0;
    this.setState({
      showAM,
    });
  }

  prepareDisplayData() {
    const { data, date } = this.state;
    const displayData = [];
    const startOfDay = date.clone().startOf('day');
    const endOfDay = date.clone().endOf('day');
    // Empty data means free time all day
    if (!data || !data.length) {
      return [{
        startDate: startOfDay,
        endDate: endOfDay,
      }];
    }
    let lastFreeTimeStart = startOfDay.clone();
    for (let i = 0; i < data.length; i += 1) {
      // Add free time before this todo, if
      // 1) this todo started after startOfDay
      // 2) the previous todo didn't end at this todo's startDate
      if (data[i].startDate.isAfter(startOfDay) && lastFreeTimeStart.isBefore(data[i].startDate)) {
        displayData.push({
          startDate: lastFreeTimeStart,
          endDate: data[i].startDate,
        });
      }
      // Add this todo
      displayData.push(data[i]);
      lastFreeTimeStart = data[i].endDate;
    }
    // Add free time ending at the endOfDay, if appropriate.
    if (lastFreeTimeStart.isBefore(endOfDay)) {
      displayData.push({
        startDate: lastFreeTimeStart,
        endDate: endOfDay,
      });
    }
    return displayData;
  }

  render() {
    const background = 'white';
    const { width } = Dimensions.get('window');
    const {
      selectedIndex,
      is12HrMode,
      showAM,
      date,
    } = this.state;
    const { navigation } = this.props;
    const displayData = this.prepareDisplayData();
    const dateString = date.format('MMM Do YYYY');

    return (
      <Fragment>
        <Header
          leftComponent={{
            icon: 'menu',
            onPress: () => alert('Implement Side Drawer!')
          }}
          centerComponent={{
            text: dateString,
            style: { fontWeight: 'bold' }
          }}
          rightComponent={{
            icon: 'home',
            onPress: () => this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
          }}
          backgroundColor='white'
          containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
        />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView 
            style={[styles.container, { backgroundColor: background }]}
            contentContainerStyle={styles.content}
            ref="scrollView"
          >
            <View style={styles.container}>
              <PieController
                is12HrMode={is12HrMode}
                showAM={showAM}
                onHrModePress={this.onHrModePress}
                onAMPMPress={this.onAMPMPress}
              />
              <Pie
                pieWidth={150}
                pieHeight={150}
                onPieItemPress={this.onPieItemPress}
                onPieItemLongPress={this.onPieItemPress}
                onBackgroundPress={this.onBackgroundPress}
                colors={Theme.colors}
                width={width}
                height={height}
                displayData={displayData}
                selectedIndex={selectedIndex}
                is12HrMode={is12HrMode}
                showAM={showAM}
                date={date}
              />
              <TodoList selectedIndex={selectedIndex} displayData={displayData} />
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.floating_button}>
            <Icon
              name="plus-circle"
              size={70}
              color="#694fad"
              resizeMode="contain"
              onPress={() => navigation.navigate('MyModal', {
                addTodo: (todoItem) => {
                  const { data } = this.state;
                  const newData = data.slice();
                  newData.push(todoItem);
                  this.setState({
                    data: newData
                  });
                },
              })}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </Fragment>
    );
  }
}
