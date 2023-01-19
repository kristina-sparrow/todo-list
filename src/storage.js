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

  deleteProject = (projectName) => {
    const list = getTodoList();
    list.deleteProject(projectName);
    saveTodoList(list);
  };

  addTask = (projectName, task) => {
    const list = getTodoList();
    list.getProject(projectName).addTask(task);
    saveTodoList(list);
  };

  deleteTask = (projectName, taskName) => {
    const list = getTodoList();
    list.getProject(projectName).deleteTask(taskName);
    saveTodoList(list);
  };

  renameTask = (projectName, taskName, newTaskName) => {
    const list = getTodoList();
    list.getProject(projectName).getTask(taskName).setName(newTaskName);
    saveTodoList(list);
  };

  setTaskDate = (projectName, taskName, newDueDate) => {
    const list = getTodoList();
    list.getProject(projectName).getTask(taskName).setDate(newDueDate);
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
