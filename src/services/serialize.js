import moment from 'moment';

function serializeTodo(todo) {
  const { startDate, endDate, ...rest } = todo;
  return JSON.stringify({
    startDate: todo.startDate.valueOf(),
    endDate: todo.endDate.valueOf(),
    ...rest,
  });
}

function deserializeTodo(todoJSON) {
  const rawTodo = JSON.parse(todoJSON);
  const { startDate, endDate, ...rest } = rawTodo;
  return {
    startDate: moment(rawTodo.startDate),
    endDate: moment(rawTodo.endDate),
    ...rest,
  };
}

export function serializeData(data) {
  return JSON.stringify(data.map(todo => serializeTodo(todo)));
}

export function deserializeData(JSONstring) {
  const rawTodos = JSON.parse(JSONstring);
  return rawTodos.map(todoJSON => deserializeTodo(todoJSON));
}
