import { toDate, isToday, isThisWeek, subDays } from "date-fns";

function Project(title) {
  let tasks = [];

  getTitle = function () {
    return title;
  };

  setTitle = function (newTitle) {
    title = newTitle;
  };

  addTask = function (newTask) {
    tasks.push(newTask);
  };

  deleteTask = function (taskToDelete) {
    tasks = tasks.filter((task) => task !== taskToDelete);
  };

  getTasks = function () {
    return tasks;
  };

  setTasks = function (newTasks) {
    tasks = newTasks;
  };

  contains = function (taskName) {
    return tasks.some((task) => task.getTitle() === taskName);
  };

  getTasksToday = function () {
    return tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted());
      return isToday(toDate(taskDate));
    });
  };

  getTasksThisWeek = function () {
    return tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted());
      return isThisWeek(subDays(toDate(taskDate), 1));
    });
  };

  return {
    getTitle,
    setTitle,
    addTask,
    deleteTask,
    getTasks,
    setTasks,
    contains,
    getTasksToday,
    getTasksThisWeek,
  };
}

export { Project };
