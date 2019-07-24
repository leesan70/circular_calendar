import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  View,
} from 'react-native';
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
    const { data } = this.state;
    const displayData = data.slice();
    // TODO: DO WORK HERE
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
    const displayData = this.prepareDisplayData();
    const displayItem = displayData[highlightedIndex];
    const dateString = date.format('MMM Do YYYY');

    return (
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
    );
  }
}
