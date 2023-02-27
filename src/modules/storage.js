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
    const list = Storage.getTodoList();
    list.addProject(project);
    Storage.saveTodoList(list);
  }

  static deleteProject(projectTitle) {
    const list = Storage.getTodoList();
    list.deleteProject(projectTitle);
    Storage.saveTodoList(list);
  }

  static addTask(projectTitle, task) {
    const list = Storage.getTodoList();
    list.getProject(projectTitle).addTask(task);
    Storage.saveTodoList(list);
  }

  static deleteTask(projectTitle, taskTitle) {
    const list = Storage.getTodoList();
    list.getProject(projectTitle).deleteTask(taskTitle);
    Storage.saveTodoList(list);
  }

  static renameTask(projectTitle, taskTitle, newTaskTitle) {
    const list = Storage.getTodoList();
    list.getProject(projectTitle).getTask(taskTitle).setTitle(newTaskTitle);
    Storage.saveTodoList(list);
  }

  static editTaskDescription(projectTitle, taskTitle, newTaskDescription) {
    const list = Storage.getTodoList();
    list
      .getProject(projectTitle)
      .getTask(taskTitle)
      .setDescription(newTaskDescription);
    Storage.saveTodoList(list);
  }

  static setTaskDate(projectTitle, taskTitle, newDueDate) {
    const list = Storage.getTodoList();
    list.getProject(projectTitle).getTask(taskTitle).setDate(newDueDate);
    Storage.saveTodoList(list);
  }

  static updateTodayProject() {
    const list = Storage.getTodoList();
    list.updateTodayProject();
    Storage.saveTodoList(list);
  }

  static updateWeekProject() {
    const list = Storage.getTodoList();
    list.updateWeekProject();
    Storage.saveTodoList(list);
  }
}
