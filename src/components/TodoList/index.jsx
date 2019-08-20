import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Card, IconButton, Paragraph } from 'react-native-paper';

function getKey(displayItem) {
  return displayItem.startDate.unix();
}

function isTodoItem(displayItem) {
  return displayItem.hasOwnProperty('title');
}

function FreeItem({ displayItem }) {
  return (
    <Card style={styles.freeItem}>
      <Card.Title
        title="Free Time"
        subtitle={
          displayItem.startDate.format('LT') + " - " + displayItem.endDate.format('LT')
        }
      />
    </Card>
 );
}

function TodoItem({ displayItem }) {
  return (
    <Card style={styles.todoItem}>
      <Card.Title
        title={displayItem.title}
        subtitle={(() => {
          let startDateStr;
          let endDateStr;
          if (!displayItem.startDate.isSame(displayItem.endDate, 'day')) {
            startDateStr = displayItem.startDate.format('MM.DD hh:mm');
            endDateStr = displayItem.endDate.format('MM.DD hh:mm');
          } else {
            startDateStr = displayItem.startDate.format('LT');
            endDateStr = displayItem.endDate.format('LT');
          }
          return startDateStr + " - " + endDateStr;
        })()}
        right={(props) => (
          <IconButton {...props} icon="more-vert" onPress={() => {
            Alert.alert(
              'Edit / Delete',
              '',
              [
                {
                  text: 'Edit',
                  onPress: () => alert('Edit')
                },
                {
                  text: 'Delete',
                  onPress: () => alert('Delete'),
                  
                },
                {
                  text: 'Cancel',
                  onPress: () => alert('Cancel'),
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          }} />
        )}
      />
      <Card.Content>
        <Paragraph>
          {displayItem.content}
        </Paragraph>
      </Card.Content>
    </Card>
  );
}

export default class TodoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { displayData, selectedIndex } = this.props;
    const { displayData:nextDisplayData, selectedIndex:nextSelectedIndex } = nextProps;
    return selectedIndex !== nextSelectedIndex ||
      JSON.stringify(displayData) !== JSON.stringify(nextDisplayData);
  }

  render() {
    const { displayData, selectedIndex } = this.props;
    const selectedItem = displayData[selectedIndex];
    const todoList = selectedItem ? [selectedItem] : displayData;
    return todoList.map(displayItem => {
      return isTodoItem(displayItem) ?
        <TodoItem key={getKey(displayItem)} displayItem={displayItem}/> :
        <FreeItem key={getKey(displayItem)} displayItem={displayItem}/>
    });
  }
}

const todoShape = PropTypes.shape({
  startDate: PropTypes.instanceOf(moment).isRequired,
  endDate: PropTypes.instanceOf(moment).isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
});

TodoList.propTypes = {
  displayData: PropTypes.arrayOf(todoShape),
  selectedIndex: PropTypes.number.isRequired,
};

TodoList.defaultProps = {
  displayData: [],
};

const styles = StyleSheet.create({
  freeItem: {
    margin: 4,
    backgroundColor: 'whitesmoke',
  },
  todoItem: {
    margin: 4,
  }
});