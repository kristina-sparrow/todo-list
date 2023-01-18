function project(title) {
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
  return {
    getTitle,
    setTitle,
    addTask,
    deleteTask,
    getTasks,
  };
}

export { project };
