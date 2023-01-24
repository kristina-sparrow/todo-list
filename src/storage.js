import { Project } from "./project";
import { Task } from "./task";
import { todoList } from "./todo";

function Storage() {
  saveTodoList = (data) => {
    localStorage.setItem("list", JSON.stringify(data));
  };

  getTodoList = () => {
    const list = Object.assign(
      todoList(),
      JSON.parse(localStorage.getItem("list"))
    );

    list.setProjects(
      list.getProjects().map((project) => Object.assign(Project(), project))
    );

    list
      .getProjects()
      .forEach((project) =>
        project.setTasks(
          project.getTasks().map((task) => Object.assign(Task(), task))
        )
      );

    return list;
  };

  addProject = (project) => {
    const list = getTodoList();
    list.addProject(project);
    saveTodoList(list);
  };

  deleteProject = (projectTitle) => {
    const list = getTodoList();
    list.deleteProject(projectTitle);
    saveTodoList(list);
  };

  addTask = (projectTitle, task) => {
    const list = getTodoList();
    list.getProject(projectTitle).addTask(task);
    saveTodoList(list);
  };

  deleteTask = (projectTitle, taskTitle) => {
    const list = getTodoList();
    list.getProject(projectTitle).deleteTask(taskTitle);
    saveTodoList(list);
  };

  renameTask = (projectTitle, taskTitle, newTaskTitle) => {
    const list = getTodoList();
    list.getProject(projectTitle).getTask(taskTitle).setTitle(newTaskTitle);
    saveTodoList(list);
  };

  editTaskDescription = (projectTitle, taskTitle, newTaskDescription) => {
    const list = getTodoList();
    list
      .getProject(projectTitle)
      .getTask(taskTitle)
      .setDescription(newTaskDescription);
    saveTodoList(list);
  };

  setTaskDate = (projectTitle, taskTitle, newDueDate) => {
    const list = getTodoList();
    list.getProject(projectTitle).getTask(taskTitle).setDate(newDueDate);
    saveTodoList(list);
  };

  updateTodayProject = () => {
    const list = getTodoList();
    list.updateTodayProject();
    saveTodoList(list);
  };

  updateWeekProject = () => {
    const list = getTodoList();
    list.updateWeekProject();
    saveTodoList(list);
  };

  return {
    saveTodoList,
    getTodoList,
    addProject,
    deleteProject,
    addTask,
    deleteTask,
    renameTask,
    setTaskDate,
    updateTodayProject,
    updateWeekProject,
  };
}

export { Storage };
