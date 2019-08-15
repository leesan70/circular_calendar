import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
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
        subtitle={
          displayItem.startDate.format('LT') + " - " + displayItem.endDate.format('LT')
        }
        // left={(props) => <Avatar.Icon {...props} icon="folder" />}
        right={(props) => (
          <IconButton {...props} icon="more-vert" onPress={() => {alert('Implement edit/delete for todos!')}} />
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
  done: PropTypes.bool,
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