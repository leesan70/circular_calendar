import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

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

export default function CalendarScreen() {
  return (
    <View style={styles.calendar}>
      <Calendar />
    </View>
  );
}
