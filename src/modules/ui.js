import { format } from "date-fns";
import Storage from "./storage";
import Project from "./project";
import Task from "./task";

export default class UI {
  // LOAD ELEMENTS
  static loadHomepage() {
    UI.loadProjects();
    UI.initProjectButtons();
    UI.openProject("All", document.getElementById("button-all-project"));
    document.addEventListener("keydown", UI.handleKeyboardInput);
  }

  static loadProjects() {
    Storage.getTodoList()
      .getProjects()
      .forEach((project) => {
        if (
          project.title !== "All" &&
          project.title !== "Today" &&
          project.title !== "This Week"
        ) {
          UI.createProject(project.title);
        }
      });
    UI.initAddProjectButtons();
  }

  static loadTasks(projectTitle) {
    UI.clearTasks();
    Storage.getTodoList()
      .getProject(projectTitle)
      .getTasks()
      .forEach((task) => UI.createTask(task.title, task.date, task.doneStatus));
    if (
      projectTitle !== "All" &&
      projectTitle !== "Today" &&
      projectTitle !== "This Week"
    ) {
      UI.initAddTaskButtons();
    }
  }

  static loadProjectContent(projectTitle) {
    const projectPreview = document.getElementById("project-preview");
    projectPreview.innerHTML = `
        <h1 id="project-title">${projectTitle}</h1>
        <div class="project-preview__divider"></div>
        <div class="tasks-list" id="tasks-list"></div>`;
    if (
      projectTitle !== "All" &&
      projectTitle !== "Today" &&
      projectTitle !== "This Week"
    ) {
      projectPreview.innerHTML += `
        <button class="button-add-task" id="button-add-task">
          <i class="fas fa-plus"></i>
          Add Task
        </button>
        <div class="add-task-popup" id="add-task-popup">
          <input
            class="input-add-task-title-popup"
            id="input-add-task-title-popup"
            type="text"
            placeholder="Describe task..."
          />
          <div class="add-task-popup-buttons">
          <button class="button-add-task-popup" id="button-add-task-popup">
            Add
          </button>
          <button
            class="button-cancel-task-popup"
            id="button-cancel-task-popup"
          >
            Cancel
          </button>
        </div>`;
    }
    UI.loadTasks(projectTitle);
  }

  // CREATE ELEMENTS
  static createProject(title) {
    const userProjects = document.getElementById("projects-list");
    userProjects.innerHTML += ` 
      <button class="button-project" data-project-button>
          <span class="project-title-sidebar"><i class="fa-solid fa-check"></i>${title}</span>
          <i class="fas fa-times"></i>
      </button>`;
    UI.initProjectButtons();
  }

  static createTask(title, dueDate, doneStatus) {
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML += `
      <button class="button-task ${doneStatus}" data-task-button>
        <div class="left-task-panel">
          <i class="far fa-circle"></i>
          <i class="fa-solid fa-circle-check"></i>
          <p class="task-title">${title}</p>
          <input type="text" class="input-task-title" data-input-task-title>
        </div>
        <div class="right-task-panel">
          <p class="due-date" id="due-date">${dueDate}</p>
          <input type="date" class="input-due-date" data-input-due-date>
          <i class="fas fa-times"></i>
        </div>
      </button>`;
    UI.initTaskButtons();
  }

  // CLEAR ELEMENTS
  static clear() {
    UI.clearProjectPreview();
    UI.clearProjects();
    UI.clearTasks();
  }

  static clearProjectPreview() {
    const projectPreview = document.getElementById("project-preview");
    projectPreview.textContent = "";
  }

  static clearProjects() {
    const projectsList = document.getElementById("projects-list");
    projectsList.textContent = "";
  }

  // NEED TO UPDATE TO CLEAR TASKS FOR SPECIFIC PROJECT TITLE FOR DELETE TASK FUNCTION TO WORK
  static clearTasks() {
    const tasksList = document.getElementById("tasks-list");
    tasksList.textContent = "";
  }

  static closeAllPopups() {
    UI.closeAddProjectPopup();
    if (document.getElementById("button-add-task")) {
      UI.closeAddTaskPopup();
    }
    if (
      document.getElementById("tasks-list") &&
      document.getElementById("tasks-list").innerHTML !== ""
    ) {
      UI.closeAllInputs();
    }
  }

  static closeAllInputs() {
    const taskButtons = document.querySelectorAll("[data-task-button]");
    taskButtons.forEach((button) => {
      UI.closeRenameInput(button);
      UI.closeSetDateInput(button);
    });
  }

  static handleKeyboardInput(e) {
    if (e.key === "Escape") UI.closeAllPopups();
  }

  // ADD PROJECT EVENT LISTENERS
  static initAddProjectButtons() {
    const addProjectButton = document.getElementById("button-add-project");
    const addProjectPopupButton = document.getElementById(
      "button-add-project-popup"
    );
    const cancelProjectPopupButton = document.getElementById(
      "button-cancel-project-popup"
    );
    const addProjectPopupInput = document.getElementById(
      "input-add-project-popup"
    );
    addProjectButton.addEventListener("click", UI.openAddProjectPopup);
    addProjectPopupButton.addEventListener("click", UI.addProject);
    cancelProjectPopupButton.addEventListener("click", UI.closeAddProjectPopup);
    addProjectPopupInput.addEventListener(
      "keypress",
      UI.handleAddProjectPopupInput
    );
  }

  static openAddProjectPopup() {
    const addProjectPopup = document.getElementById("add-project-popup");
    const addProjectButton = document.getElementById("button-add-project");
    UI.closeAllPopups();
    addProjectPopup.classList.add("active");
    addProjectButton.classList.add("active");
  }

  static closeAddProjectPopup() {
    const addProjectPopup = document.getElementById("add-project-popup");
    const addProjectButton = document.getElementById("button-add-project");
    const addProjectPopupInput = document.getElementById(
      "input-add-project-popup"
    );
    addProjectPopup.classList.remove("active");
    addProjectButton.classList.remove("active");
    addProjectPopupInput.value = "";
  }

  static addProject() {
    const addProjectPopupInput = document.getElementById(
      "input-add-project-popup"
    );
    const projectTitle = addProjectPopupInput.value;
    if (projectTitle === "") {
      alert("Project title can't be empty");
    } else if (Storage.getTodoList().contains(projectTitle)) {
      alert("Project titles must be different");
    } else {
      Storage.addProject(new Project(projectTitle));
      UI.createProject(projectTitle);
      UI.closeAddProjectPopup();
    }
  }

  static handleAddProjectPopupInput(e) {
    if (e.key === "Enter") UI.addProject();
  }

  // PROJECT EVENT LISTENERS
  static initProjectButtons() {
    const allProjectButton = document.getElementById("button-all-project");
    const todayProjectButton = document.getElementById("button-today-project");
    const weekProjectButton = document.getElementById("button-week-project");
    const projectButtons = document.querySelectorAll("[data-project-button]");
    allProjectButton.addEventListener("click", UI.openAllTasks);
    todayProjectButton.addEventListener("click", UI.openTodayTasks);
    weekProjectButton.addEventListener("click", UI.openWeekTasks);
    projectButtons.forEach((projectButton) =>
      projectButton.addEventListener("click", UI.handleProjectButton)
    );
  }

  static openAllTasks() {
    Storage.updateAllProject();
    UI.openProject("All", this);
  }

  static openTodayTasks() {
    Storage.updateTodayProject();
    UI.openProject("Today", this);
  }

  static openWeekTasks() {
    Storage.updateWeekProject();
    UI.openProject("This Week", this);
  }

  static handleProjectButton(e) {
    const projectTitle = this.children[0].textContent;
    if (e.target.classList.contains("fa-times")) {
      UI.deleteProject(projectTitle, this);
      return;
    }
    UI.openProject(projectTitle, this);
  }

  static openProject(projectTitle, projectButton) {
    const defaultProjectButtons = document.querySelectorAll(
      ".button-default-project"
    );
    const projectButtons = document.querySelectorAll(".button-project");
    const buttons = [...defaultProjectButtons, ...projectButtons];
    buttons.forEach((button) => button.classList.remove("active"));
    projectButton.classList.add("active");
    UI.closeAddProjectPopup();
    UI.loadProjectContent(projectTitle);
  }

  static deleteProject(projectTitle, button) {
    if (button.classList.contains("active")) UI.clearProjectPreview();
    Storage.deleteProject(projectTitle);
    UI.clearProjects();
    UI.loadProjects();
  }

  // ADD TASK EVENT LISTENERS
  static initAddTaskButtons() {
    const addTaskButton = document.getElementById("button-add-task");
    const addTaskPopupButton = document.getElementById("button-add-task-popup");
    const cancelTaskPopupButton = document.getElementById(
      "button-cancel-task-popup"
    );
    const addTaskTitlePopupInput = document.getElementById(
      "input-add-task-title-popup"
    );
    addTaskButton.addEventListener("click", UI.openAddTaskPopup);
    addTaskPopupButton.addEventListener("click", UI.addTask);
    cancelTaskPopupButton.addEventListener("click", UI.closeAddTaskPopup);
    addTaskTitlePopupInput.addEventListener(
      "keypress",
      UI.handleAddTaskPopupInput
    );
  }

  static openAddTaskPopup() {
    const addTaskPopup = document.getElementById("add-task-popup");
    const addTaskButton = document.getElementById("button-add-task");
    UI.closeAllPopups();
    addTaskPopup.classList.add("active");
    addTaskButton.classList.add("active");
  }

  static closeAddTaskPopup() {
    const addTaskPopup = document.getElementById("add-task-popup");
    const addTaskButton = document.getElementById("button-add-task");
    const addTaskTitleInput = document.getElementById(
      "input-add-task-title-popup"
    );
    addTaskPopup.classList.remove("active");
    addTaskButton.classList.remove("active");
    addTaskTitleInput.value = "";
  }

  static addTask() {
    const projectTitle = document.getElementById("project-title").textContent;
    const addTaskTitlePopupInput = document.getElementById(
      "input-add-task-title-popup"
    );
    const taskTitle = addTaskTitlePopupInput.value;
    if (taskTitle === "") {
      alert("Task title can't be empty");
      return;
    }
    if (Storage.getTodoList().getProject(projectTitle).contains(taskTitle)) {
      alert("Task titles must be different");
      addTaskTitlePopupInput.value = "";
      return;
    }
    Storage.addTask(projectTitle, new Task(taskTitle, "No date", false));
    UI.createTask(taskTitle, "No date", false);
    UI.closeAddTaskPopup();
  }

  static handleAddTaskPopupInput(e) {
    if (e.key === "Enter") UI.addTask();
  }

  // TASK EVENT LISTENERS
  static initTaskButtons() {
    const taskButtons = document.querySelectorAll("[data-task-button]");
    const taskTitleInputs = document.querySelectorAll(
      "[data-input-task-title]"
    );
    const dueDateInputs = document.querySelectorAll("[data-input-due-date]");
    taskButtons.forEach((taskButton) =>
      taskButton.addEventListener("click", UI.handleTaskButton)
    );
    taskTitleInputs.forEach((taskTitleInput) =>
      taskTitleInput.addEventListener("keypress", UI.renameTask)
    );
    dueDateInputs.forEach((dueDateInput) =>
      dueDateInput.addEventListener("change", UI.setTaskDate)
    );
  }

  static handleTaskButton(e) {
    if (
      e.target.classList.contains("fa-circle") ||
      e.target.classList.contains("fa-circle-check")
    ) {
      UI.toggleTaskCompleted(this);
      return;
    }
    if (e.target.classList.contains("fa-times")) {
      UI.deleteTask(this);
      return;
    }
    if (e.target.classList.contains("task-title")) {
      UI.openRenameInput(this);
      return;
    }
    if (e.target.classList.contains("due-date")) {
      UI.openSetDateInput(this);
    }
  }

  static toggleTaskCompleted(taskButton) {
    const projectTitle = document.getElementById("project-title").textContent;
    const taskTitle = taskButton.children[0].children[2].textContent;
    if (
      projectTitle === "All" ||
      projectTitle === "Today" ||
      projectTitle === "This Week"
    ) {
      const parentProjectTitle = taskTitle.split("(")[1].split(")")[0];
      const childTaskTitle = taskTitle.split(" (")[0];
      const newStatus = !Storage.getTaskStatus(
        parentProjectTitle,
        childTaskTitle
      );
      Storage.setTaskStatus(parentProjectTitle, childTaskTitle, newStatus);
      if (projectTitle === "Today") {
        Storage.updateTodayProject();
      } else if (projectTitle === "This Week") {
        Storage.updateWeekProject();
      } else {
        Storage.updateAllProject();
      }
    } else {
      const newStatus = !Storage.getTaskStatus(projectTitle, taskTitle);
      Storage.setTaskStatus(projectTitle, taskTitle, newStatus);
    }
    UI.clearTasks();
    UI.loadTasks(projectTitle);
  }

  static deleteTask(taskButton) {
    const projectTitle = document.getElementById("project-title").textContent;
    const taskTitle = taskButton.children[0].children[2].textContent;
    if (
      projectTitle === "All" ||
      projectTitle === "Today" ||
      projectTitle === "This Week"
    ) {
      const mainProjectTitle = taskTitle.split("(")[1].split(")")[0];
      const mainTaskTitle = taskTitle.split(" (")[0];
      Storage.deleteTask(projectTitle, taskTitle);
      Storage.deleteTask(mainProjectTitle, mainTaskTitle);
      if (projectTitle === "Today") {
        Storage.updateTodayProject();
      } else if (projectTitle === "This Week") {
        Storage.updateWeekProject();
      } else {
        Storage.updateAllProject();
      }
    } else {
      Storage.deleteTask(projectTitle, taskTitle);
    }
    UI.clearTasks();
    UI.loadTasks(projectTitle);
  }

  static openRenameInput(taskButton) {
    const taskTitlePara = taskButton.children[0].children[2];
    let taskTitle = taskTitlePara.textContent;
    const taskTitleInput = taskButton.children[0].children[3];
    const projectTitle =
      taskButton.parentNode.parentNode.children[0].textContent;
    if (
      projectTitle === "All" ||
      projectTitle === "Today" ||
      projectTitle === "This Week"
    ) {
      [taskTitle] = taskTitle.split(" (");
    }
    UI.closeAllPopups();
    taskTitlePara.classList.add("active");
    taskTitleInput.classList.add("active");
    taskTitleInput.value = taskTitle;
  }

  static closeRenameInput(taskButton) {
    const taskTitle = taskButton.children[0].children[2];
    const taskTitleInput = taskButton.children[0].children[3];
    taskTitle.classList.remove("active");
    taskTitleInput.classList.remove("active");
    taskTitleInput.value = "";
  }

  static renameTask(e) {
    if (e.key !== "Enter") return;
    const projectTitle = document.getElementById("project-title").textContent;
    const taskTitle = this.previousElementSibling.textContent;
    const newTaskTitle = this.value;
    if (newTaskTitle === "") {
      alert("Task title can't be empty");
      return;
    }
    if (Storage.getTodoList().getProject(projectTitle).contains(newTaskTitle)) {
      this.value = "";
      alert("Task titles must be different");
      return;
    }
    if (
      projectTitle === "All" ||
      projectTitle === "Today" ||
      projectTitle === "This Week"
    ) {
      const mainProjectTitle = taskTitle.split("(")[1].split(")")[0];
      const mainTaskTitle = taskTitle.split(" (")[0];
      Storage.renameTask(
        projectTitle,
        taskTitle,
        `${newTaskTitle} (${mainProjectTitle})`
      );
      Storage.renameTask(mainProjectTitle, mainTaskTitle, newTaskTitle);
    } else {
      Storage.renameTask(projectTitle, taskTitle, newTaskTitle);
    }
    UI.clearTasks();
    UI.loadTasks(projectTitle);
    UI.closeRenameInput(this.parentNode.parentNode);
  }

  static openSetDateInput(taskButton) {
    const dueDate = taskButton.children[1].children[0];
    const dueDateInput = taskButton.children[1].children[1];
    UI.closeAllPopups();
    dueDate.classList.add("active");
    dueDateInput.classList.add("active");
  }

  static closeSetDateInput(taskButton) {
    const dueDate = taskButton.children[1].children[0];
    const dueDateInput = taskButton.children[1].children[1];
    dueDate.classList.remove("active");
    dueDateInput.classList.remove("active");
  }

  static setTaskDate() {
    const taskButton = this.parentNode.parentNode;
    const projectTitle = document.getElementById("project-title").textContent;
    const taskTitle = taskButton.children[0].children[2].textContent;
    const newDueDate = format(
      new Date(new Date(this.value).valueOf() + 1000 * 60 * 60 * 24),
      "MM/dd/yyyy"
    );
    if (
      projectTitle === "All" ||
      projectTitle === "Today" ||
      projectTitle === "This Week"
    ) {
      const mainProjectTitle = taskTitle.split("(")[1].split(")")[0];
      const mainTaskTitle = taskTitle.split(" (")[0];
      Storage.setTaskDate(projectTitle, taskTitle, newDueDate);
      Storage.setTaskDate(mainProjectTitle, mainTaskTitle, newDueDate);
      if (projectTitle === "Today") {
        Storage.updateTodayProject();
      } else if (projectTitle === "This Week") {
        Storage.updateWeekProject();
      } else {
        Storage.updateAllProject();
      }
    } else {
      Storage.setTaskDate(projectTitle, taskTitle, newDueDate);
    }
    UI.clearTasks();
    UI.loadTasks(projectTitle);
    UI.closeSetDateInput(taskButton);
  }
}
