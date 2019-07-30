export function isValidAngles(startAngle, endAngle) {
  return startAngle < endAngle
    && startAngle >= 0 && startAngle < 2 * Math.PI
    && endAngle > 0 && endAngle <= 2 * Math.PI;
}

export function getHandleAngle(date, is12HrMode, showAM) {
  const startOfDay = date.clone().startOf('day');
  const noon = startOfDay.clone().add(12, 'hours');
  const endOfDay = date.clone().endOf('day');
  const refDateStart = is12HrMode && !showAM ? noon : startOfDay;
  const refDateEnd = is12HrMode && showAM ? noon : endOfDay;
  const adjDate = date.isBefore(refDateStart) ? refDateStart : date;

  const startTimestamp = refDateStart.valueOf();
  const endTimestamp = refDateEnd.valueOf();
  const totalMilliseconds = endTimestamp - startTimestamp;

  const angle = 360 * (adjDate.valueOf() - startTimestamp) / totalMilliseconds;
  return angle;
}

export function getAnglesFromDates(startDate, endDate, is12HrMode, showAM, refDate) {
  const startOfDay = refDate.clone().startOf('day');
  const noon = startOfDay.clone().add(12, 'hours');
  const endOfDay = refDate.clone().endOf('day');
  const refDateStart = is12HrMode && !showAM ? noon : startOfDay;
  const refDateEnd = is12HrMode && showAM ? noon : endOfDay;
  const adjStartDate = startDate.isBefore(refDateStart) ? refDateStart : startDate;
  const adjEndDate = endDate.isAfter(refDateEnd) ? refDateEnd : endDate;

  const startTimestamp = refDateStart.valueOf();
  const endTimestamp = refDateEnd.valueOf();
  const totalMilliseconds = endTimestamp - startTimestamp;

  const startAngle = 2 * Math.PI * (adjStartDate.valueOf() - startTimestamp) / totalMilliseconds;
  const endAngle = 2 * Math.PI * (adjEndDate.valueOf() - startTimestamp) / totalMilliseconds;

  return isValidAngles(startAngle, endAngle) ? { startAngle, endAngle } : null;
}

export function getAnglesFromTodo(todo, is12HrMode, showAM, refDate) {
  const { startDate, endDate } = todo;
  return getAnglesFromDates(startDate, endDate, is12HrMode, showAM, refDate);
}
