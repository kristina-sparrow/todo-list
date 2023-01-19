import { toDate, isToday, isThisWeek, subDays } from "date-fns";

function Project(title) {
  let tasks = [];

  getTitle = () => {
    return title;
  };

  setTitle = (newTitle) => {
    title = newTitle;
  };

  addTask = (newTask) => {
    tasks.push(newTask);
  };

  deleteTask = (taskToDelete) => {
    tasks = tasks.filter((task) => task !== taskToDelete);
  };

  getTasks = () => {
    return tasks;
  };

  setTasks = (newTasks) => {
    tasks = newTasks;
  };

  contains = (taskName) => {
    return tasks.some((task) => task.getTitle() === taskName);
  };

  getTasksToday = () => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted());
      return isToday(toDate(taskDate));
    });
  };

  getTasksThisWeek = () => {
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
