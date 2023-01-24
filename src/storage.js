import Project from "./project";
import Task from "./task";
import TodoList from "./todo";

export default class Storage {
  static saveTodoList(data) {
    localStorage.setItem("list", JSON.stringify(data));
  }

  static getTodoList() {
    const list = Object.assign(
      new TodoList(),
      JSON.parse(localStorage.getItem("list"))
    );

    list.setProjects(
      list.getProjects().map((project) => Object.assign(new Project(), project))
    );

    list
      .getProjects()
      .forEach((project) =>
        project.setTasks(
          project.getTasks().map((task) => Object.assign(new Task(), task))
        )
      );

    return list;
  }

  static addProject(project) {
    const list = getTodoList();
    list.addProject(project);
    saveTodoList(list);
  }

  static deleteProject(projectTitle) {
    const list = getTodoList();
    list.deleteProject(projectTitle);
    saveTodoList(list);
  }

  static addTask(projectTitle, task) {
    const list = getTodoList();
    list.getProject(projectTitle).addTask(task);
    saveTodoList(list);
  }

  static deleteTask(projectTitle, taskTitle) {
    const list = getTodoList();
    list.getProject(projectTitle).deleteTask(taskTitle);
    saveTodoList(list);
  }

  static renameTask(projectTitle, taskTitle, newTaskTitle) {
    const list = getTodoList();
    list.getProject(projectTitle).getTask(taskTitle).setTitle(newTaskTitle);
    saveTodoList(list);
  }

  static editTaskDescription(projectTitle, taskTitle, newTaskDescription) {
    const list = getTodoList();
    list
      .getProject(projectTitle)
      .getTask(taskTitle)
      .setDescription(newTaskDescription);
    saveTodoList(list);
  }

  static setTaskDate(projectTitle, taskTitle, newDueDate) {
    const list = getTodoList();
    list.getProject(projectTitle).getTask(taskTitle).setDate(newDueDate);
    saveTodoList(list);
  }

  static updateTodayProject() {
    const list = getTodoList();
    list.updateTodayProject();
    saveTodoList(list);
  }

  static updateWeekProject() {
    const list = getTodoList();
    list.updateWeekProject();
    saveTodoList(list);
  }
}
