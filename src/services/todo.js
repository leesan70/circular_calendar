import AsyncStorage from '@react-native-community/async-storage';
import { deserializeData } from './serialize';

export async function checkTodoAddable(todo) {
  const { startDate, endDate } = todo;
  const date = startDate.clone();
  while (date.isSameOrBefore(endDate)) {
    const dateString = date.startOf('day').format('YYYY-MM-DD');
    const data = await AsyncStorage.getItem(dateString) || '[]';
    const deserializedData = deserializeData(data);
    if (deserializedData.map(item => checkTodosOverlap(todo, item)).includes(true)) {
      return false;
    }
    date.add(1, 'day');
  }
  return true;
}

export async function checkTodoEditable(existingTodo, editedTodo) {
  // Check if editedTodo startDate and endDate do not overlap with todos, other than the existingTodo
  const { startDate, endDate, title, content} = editedTodo;
  
  const date = startDate.clone();
  while (date.isSameOrBefore(endDate)) {
    const dateString = date.startOf('day').format('YYYY-MM-DD');
    const data = await AsyncStorage.getItem(dateString) || '[]';
    const deserializedData = deserializeData(data);
    if (deserializedData.map(item => !isSameTodo(item, existingTodo) && checkTodosOverlap(editedTodo, item)).includes(true)) {
      return false;
    }
    date.add(1, 'day');
  }
  return true;
}

export function checkTodosOverlap(todo1, todo2) {
  const { startDate:startDate1, endDate: endDate1 } = todo1;
  const { startDate:startDate2, endDate: endDate2 } = todo2;
  const lessStart = startDate1.isBefore(startDate2) ? startDate1 : startDate2;
  const afterStart = startDate1.isBefore(startDate2) ? startDate2 : startDate1;
  const lessEnd = endDate1.isBefore(endDate2) ? endDate1 : endDate2;
  const afterEnd = endDate1.isBefore(endDate2) ? endDate2 : endDate1;
  return afterStart < lessEnd;
}

export function isSameTodo(todo1, todo2) {
  return todo1.title === todo2.title &&
   todo1.content === todo2.content &&
   todo1.startDate && todo1.startDate.isSame(todo2.startDate) &&
   todo1.endDate && todo1.endDate.isSame(todo2.endDate)
}
