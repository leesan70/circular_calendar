import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default class CalendarScreen extends Component {
  render() {
    return (
      <View style={styles.calendar}>
        <Calendar 
          onDayPress={(day) => {
            this.props.navigation.navigate('ScheduleMain', {
              dataDate: moment(day.dateString).startOf('day'),
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});