import moment from 'moment';

const currDate = moment();
const y = currDate.year();
const m = currDate.month();
const d = currDate.date();

export default {
  todoItemList: [
    {
      startDate: moment([y, m, d, 9, 45]),
      endDate: moment([y, m, d, 12, 10]),
      title: 'hello',
      content: 'the very first todo',
      done: false,
    },
    {
      startDate: moment([y, m, d, 13, 5]),
      endDate: moment([y, m, d, 14, 10]),
      title: 'nono',
      content: 'second todo',
      done: false,
    },
    {
      startDate: moment([y, m, d, 15, 0]),
      endDate: moment([y, m, d, 16, 0]),
      title: 'helloooo',
      content: 'third todo',
      done: false,
    },
    {
      startDate: moment([y, m, d, 17, 5]),
      endDate: moment([y, m, d, 18, 35]),
      title: 'hahha',
      content: 'fourth todo',
      done: false,
    },
  ],
};
