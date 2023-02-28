import { compareAsc, toDate } from "date-fns";
import Project from "./project";
import Task from "./task";

export default class TodoList {
  constructor() {
    this.projects = [];
    this.projects.push(new Project("All"));
    this.projects.push(new Project("Today"));
    this.projects.push(new Project("This Week"));
  }

  setProjects(newProjects) {
    this.projects = newProjects;
  }

  getProjects() {
    return this.projects;
  }

  getProject(projectTitle) {
    return this.projects.find((project) => project.getTitle() === projectTitle);
  }

  contains(projectTitle) {
    return this.projects.some((project) => project.getTitle() === projectTitle);
  }

  addProject(newProject) {
    if (this.projects.find((project) => project.title === newProject.title))
      return;
    this.projects.push(newProject);
  }

  deleteProject(projectTitle) {
    const projectToDelete = this.projects.find(
      (project) => project.getTitle() === projectTitle
    );
    this.projects.splice(this.projects.indexOf(projectToDelete), 1);
  }

  updateTodayProject() {
    this.getProject("Today").tasks = [];
    this.projects.forEach((project) => {
      if (
        project.getTitle() === "All" ||
        project.getTitle() === "Today" ||
        project.getTitle() === "This Week"
      )
        return;
      const todayTasks = project.getTasksToday();
      todayTasks.forEach((task) => {
        const taskTitle = `${task.getTitle()} (${project.getTitle()})`;
        this.getProject("Today").addTask(
          new Task(taskTitle, task.getDate(), task.getDoneStatus())
        );
      });
    });
  }

  updateWeekProject() {
    this.getProject("This Week").tasks = [];
    this.projects.forEach((project) => {
      if (
        project.getTitle() === "All" ||
        project.getTitle() === "Today" ||
        project.getTitle() === "This Week"
      )
        return;
      const weekTasks = project.getTasksThisWeek();
      weekTasks.forEach((task) => {
        const taskTitle = `${task.getTitle()} (${project.getTitle()})`;
        this.getProject("This Week").addTask(
          new Task(taskTitle, task.getDate(), task.getDoneStatus())
        );
      });
    });

    this.getProject("This Week").setTasks(
      this.getProject("This Week")
        .getTasks()
        .sort((taskA, taskB) =>
          compareAsc(
            toDate(new Date(taskA.getDateFormatted())),
            toDate(new Date(taskB.getDateFormatted()))
          )
        )
    );
  }

  updateAllProject() {
    this.getProject("All").tasks = [];
    this.projects.forEach((project) => {
      if (
        project.getTitle() === "All" ||
        project.getTitle() === "Today" ||
        project.getTitle() === "This Week"
      )
        return;
      const allTasks = project.getTasks();
      allTasks.forEach((task) => {
        const taskTitle = `${task.getTitle()} (${project.getTitle()})`;
        this.getProject("All").addTask(
          new Task(taskTitle, task.getDate(), task.getDoneStatus())
        );
      });
    });
  }
}
