import moment from 'moment';

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  return new Date(currentDate);
};

export const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return currentDate.getTime() > dueDate.getTime();
};

export const isTaskExpiringToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return currentDate.getDate() === dueDate.getDate();
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

export const formatDueDate = (dueDate) => {
  if (!(dueDate instanceof Date)) {
    return ``;
  }
  return moment(dueDate).format(`D MMMM`);
};

export const isDatesEqual = (dateA, dateB) => {
  return moment(dateA).isSame(dateB, `day`);
};
