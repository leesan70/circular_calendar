import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  Paragraph,
  Card,
  IconButton,
} from 'react-native-paper'

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

export default function TodoList({ selectedIndex, displayData }) {
  const selectedItem = displayData[selectedIndex];
  const todoList = selectedItem ? [selectedItem] : displayData;
  return todoList.map(displayItem => {
    return isTodoItem(displayItem) ?
      <TodoItem key={getKey(displayItem)} displayItem={displayItem}/> :
      <FreeItem key={getKey(displayItem)} displayItem={displayItem}/>
  });
}

const styles = StyleSheet.create({
  freeItem: {
    margin: 4,
    backgroundColor: 'whitesmoke',
  },
  todoItem: {
    margin: 4,
  }
});