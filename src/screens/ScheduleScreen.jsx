import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Pie from '../components/Pie';
import Theme from '../theme';
import importedData from '../../resources/data';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'whitesmoke',
    marginTop: 21,
  },
  chart: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  calendar: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  chart_title: {
    paddingTop: 15,
    textAlign: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    fontSize: 18,
    backgroundColor: 'white',
    color: 'grey',
    fontWeight: 'bold',
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

function getData(date) {
  return importedData.todoItemList;
}

export default class ScheduleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getData(),
      highlightedIndex: 0,
      date: moment(),
      is12HrMode: true,
      showAM: false,
    };
    this.onPieItemPress = this.onPieItemPress.bind(this);
    this.onPieItemLongPress = this.onPieItemLongPress.bind(this);
    this.prepareDisplayData = this.prepareDisplayData.bind(this);
  }

  onPieItemPress(index) {
    this.setState({
      highlightedIndex: index,
    });
  }

  onPieItemLongPress(index) {
    this.onPieItemPress(index);
  }

  prepareDisplayData() {
    const { data, date } = this.state;
    const displayData = [];
    // TODO: DO WORK HERE
    const startOfDay = date.clone().startOf('day');
    const endOfDay = date.clone().endOf('day');
    // Empty data means free time all day
    if (!data || !data.length) {
      // TODO: Discard title, content, done for free times.
      return [{
        startDate: startOfDay,
        endDate: endOfDay,
        title: 'Placeholder',
        content: 'Placeholder',
        done: false,
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
          title: 'Placeholder',
          content: 'Placeholder',
          done: false,
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
        title: 'Placeholder',
        content: 'Placeholder',
        done: false,
      });
    }
    return displayData;
  }

  render() {
    const height = 200;
    const { width } = Dimensions.get('window');
    const {
      highlightedIndex,
      is12HrMode,
      showAM,
      date,
    } = this.state;
    const { navigation } = this.props;
    const displayData = this.prepareDisplayData();
    const displayItem = displayData[highlightedIndex];
    const dateString = date.format('MMM Do YYYY');

    return (
      <Fragment>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.chart_title}>{dateString}</Text>
            <Pie
              pieWidth={150}
              pieHeight={150}
              onPieItemPress={this.onPieItemPress}
              onPieItemLongPress={this.onPieItemPress}
              colors={Theme.colors}
              width={width}
              height={height}
              displayData={displayData}
              highlightedIndex={highlightedIndex}
              is12HrMode={is12HrMode}
              showAM={showAM}
              date={date}
            />
            <Text style={styles.chart_title}>
              {displayItem.title}
            </Text>
            <Text>
              {displayItem.content}
            </Text>
            <Text>
              {`Start Date: ${displayItem.startDate.format('h:mm a (MMMM Do)')}`}
            </Text>
            <Text>
              {`End Date: ${displayItem.endDate.format('h:mm a (MMMM Do)')}`}
            </Text>
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
      </Fragment>
    );
  }
}
