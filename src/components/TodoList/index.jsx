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

function TodoItem({ displayItem, directToEdit, deleteTodo }) {
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
                  onPress: () => directToEdit(displayItem),
                },
                {
                  text: 'Delete',
                  onPress: () => deleteTodo(displayItem),
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
              ],
              {cancelable: true},
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
    const { displayData, selectedIndex, hideFreeItems } = this.props;
    const { displayData:nextDisplayData, selectedIndex:nextSelectedIndex, hideFreeItems:nextHideFreeItems } = nextProps;
    return selectedIndex !== nextSelectedIndex ||
      JSON.stringify(displayData) !== JSON.stringify(nextDisplayData) ||
      hideFreeItems !== nextHideFreeItems;
  }

  render() {
    const { displayData, selectedIndex, directToEdit, deleteTodo, hideFreeItems } = this.props;
    const selectedItem = displayData[selectedIndex];
    const todoList = selectedItem ? [selectedItem] : displayData;
    return todoList.map(displayItem => {
      return isTodoItem(displayItem) ?
        <TodoItem
          key={getKey(displayItem)}
          displayItem={displayItem}
          directToEdit={directToEdit}
          deleteTodo={deleteTodo}
        /> :
        !hideFreeItems && <FreeItem key={getKey(displayItem)} displayItem={displayItem}/>
    }).filter(component => component !== null);
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