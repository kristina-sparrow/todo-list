import { format } from "date-fns";
import { Storage } from "./storage";
import { Project } from "./project";
import { Task } from "./task";

function UI() {
  // LOAD ELEMENTS
  loadHomepage = () => {
    UI.loadProjects();
    UI.openProject("All", document.getElementById("button-all-project"));
  };

  loadProjects = () => {
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
  };

  loadTasks = (projectTitle) => {
    Storage.getTodoList()
      .getProject(projectTitle)
      .getTasks()
      .forEach((task) => UI.createTask(task.title, task.date));
    if (projectTitle !== "Today" && projectTitle !== "This Week") {
      UI.initAddTaskButtons();
    }
  };

  loadProjectContent = (projectTitle) => {
    const projectPreview = document.getElementById("project-preview");
    projectPreview.innerHTML = `
        <h1 id="project-title">${projectTitle}</h1>
        <div class="tasks-list" id="tasks-list"></div>`;

    if (projectTitle !== "Today" && projectTitle !== "This Week") {
      projectPreview.innerHTML += `
        <button class="button-add-task" id="button-add-task">
          <i class="fas fa-plus"></i>
          Add Task
        </button>
        <div class="add-task-popup" id="add-task-popup">
          <input
            class="input-add-task-popup"
            id="input-add-task-popup"
            type="text"
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
          </div>
        </div>`;
    }
    UI.loadTasks(projectTitle);
  };

  // CREATE ELEMENTS
  createProject = (title) => {
    const userProjects = document.getElementById("project-list");
    userProjects.innerHTML += ` 
      <button class="button-project" data-project-button>
        <div class="left-project-panel">
          <i class="fas fa-tasks"></i>
          <span>${title}</span>
        </div>
        <div class="right-project-panel">
          <i class="fas fa-times"></i>
        </div>
      </button>`;
  };

  createTask = (title, dueDate) => {
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML += `
      <button class="button-task" data-task-button>
        <div class="left-task-panel">
          <i class="far fa-circle"></i>
          <p class="task-content">${title}</p>
          <input type="text" class="input-task-name" data-input-task-name>
        </div>
        <div class="right-task-panel">
          <p class="due-date" id="due-date">${dueDate}</p>
          <input type="date" class="input-due-date" data-input-due-date>
          <i class="fas fa-times"></i>
        </div>
      </button>`;
  };

  // CLEAR ELEMENTS
  clear = () => {
    UI.clearProjectPreview();
    UI.clearProjects();
    UI.clearTasks();
  };

  clearProjectPreview = () => {
    const projectPreview = document.getElementById("project-preview");
    projectPreview.textContent = "";
  };

  clearProjects = () => {
    const projectsList = document.getElementById("projects-list");
    projectsList.textContent = "";
  };

  clearTasks = () => {
    const tasksList = document.getElementById("tasks-list");
    tasksList.textContent = "";
  };

  // ADD PROJECT EVENT LISTENERS
  initAddProjectButtons = () => {
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
  };

  openAddProjectPopup = () => {
    const addProjectPopup = document.getElementById("add-project-popup");
    const addProjectButton = document.getElementById("button-add-project");
    UI.closeAllPopups();
    addProjectPopup.classList.add("active");
    addProjectButton.classList.add("active");
  };

  closeAddProjectPopup = () => {
    const addProjectPopup = document.getElementById("add-project-popup");
    const addProjectButton = document.getElementById("button-add-project");
    const addProjectPopupInput = document.getElementById(
      "input-add-project-popup"
    );
    addProjectPopup.classList.remove("active");
    addProjectButton.classList.remove("active");
    addProjectPopupInput.value = "";
  };

  addProject = () => {
    const addProjectPopupInput = document.getElementById(
      "input-add-project-popup"
    );
    const projectTitle = addProjectPopupInput.value;
    if (projectTitle === "") {
      alert("Project title can't be empty");
      return;
    }
    if (Storage.getTodoList().contains(projectTitle)) {
      addProjectPopupInput.value = "";
      alert("Project titles must be different");
      return;
    }
    Storage.addProject(Project(projectTitle));
    UI.createProject(projectTitle);
    UI.closeAddProjectPopup();
  };

  handleAddProjectPopupInput = (e) => {
    if (e.key === "Enter") UI.addProject();
  };

  // PROJECT EVENT LISTENERS
  initProjectButtons = () => {
    const allProjectsButton = document.getElementById("button-all-project");
    const todayProjectsButton = document.getElementById("button-today-project");
    const weekProjectsButton = document.getElementById("button-week-project");
    const projectButtons = document.querySelectorAll("[data-project-button]");
    allProjectsButton.addEventListener("click", UI.openAllTasks);
    todayProjectsButton.addEventListener("click", UI.openTodayTasks);
    weekProjectsButton.addEventListener("click", UI.openWeekTasks);
    projectButtons.forEach((projectButton) =>
      projectButton.addEventListener("click", UI.handleProjectButton)
    );
  };

  openAllTasks = () => {
    UI.openProject("All", this);
  };

  openTodayTasks = () => {
    Storage.updateTodayProject();
    UI.openProject("Today", this);
  };

  openWeekTasks = () => {
    Storage.updateWeekProject();
    UI.openProject("This week", this);
  };

  handleProjectButton = (e) => {
    const projectTitle = this.children[0].children[1].textContent;
    if (e.target.classList.contains("fa-times")) {
      UI.deleteProject(projectTitle, this);
      return;
    }
    UI.openProject(projectTitle, this);
  };

  openProject = (projectTitle, projectButton) => {
    const defaultProjectButtons = document.querySelectorAll(
      ".button-default-project"
    );
    const projectButtons = document.querySelectorAll(".button-project");
    const buttons = [...defaultProjectButtons, ...projectButtons];
    buttons.forEach((button) => button.classList.remove("active"));
    projectButton.classList.add("active");
    UI.closeAddProjectPopup();
    UI.loadProjectContent(projectTitle);
  };

  deleteProject = (projectTitle, button) => {
    if (button.classList.contains("active")) UI.clearProjectPreview();
    Storage.deleteProject(projectTitle);
    UI.clearProjects();
    UI.loadProjects();
  };

  // ADD TASK EVENT LISTENERS
  initAddTaskButtons = () => {
    const addTaskButton = document.getElementById("button-add-task");
    const addTaskPopupButton = document.getElementById("button-add-task-popup");
    const cancelTaskPopupButton = document.getElementById(
      "button-cancel-task-popup"
    );
    const addTaskPopupInput = document.getElementById("input-add-task-popup");
    addTaskButton.addEventListener("click", UI.openAddTaskPopup);
    addTaskPopupButton.addEventListener("click", UI.addTask);
    cancelTaskPopupButton.addEventListener("click", UI.closeAddTaskPopup);
    addTaskPopupInput.addEventListener("keypress", UI.handleAddTaskPopupInput);
  };

  openAddTaskPopup = () => {
    const addTaskPopup = document.getElementById("add-task-popup");
    const addTaskButton = document.getElementById("button-add-task");
    UI.closeAllPopups();
    addTaskPopup.classList.add("active");
    addTaskButton.classList.add("active");
  };

  closeAddTaskPopup = () => {
    const addTaskPopup = document.getElementById("add-task-popup");
    const addTaskButton = document.getElementById("button-add-task");
    const addTaskInput = document.getElementById("input-add-task-popup");
    addTaskPopup.classList.remove("active");
    addTaskButton.classList.remove("active");
    addTaskInput.value = "";
  };

  addTask = () => {
    const projectTitle = document.getElementById("project-title").textContent;
    const addTaskPopupInput = document.getElementById("input-add-task-popup");
    const taskTitle = addTaskPopupInput.value;
    if (taskTitle === "") {
      alert("Task title can't be empty");
      return;
    }
    if (Storage.getTodoList().getProject(projectTitle).contains(taskTitle)) {
      alert("Task titles must be different");
      addTaskPopupInput.value = "";
      return;
    }
    Storage.addTask(projectTitle, Task(taskTitle));
    UI.createTask(taskTitle, "No date");
    UI.closeAddTaskPopup();
  };

  handleAddTaskPopupInput = (e) => {
    if (e.key === "Enter") UI.addTask();
  };

  // TASK EVENT LISTENERS
  initTaskButtons = () => {
    const taskButtons = document.querySelectorAll("[data-task-button]");
    const taskTitleInputs = document.querySelectorAll("[data-input-task-name]");
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
  };

  handleTaskButton = (e) => {
    if (e.target.classList.contains("fa-circle")) {
      UI.setTaskCompleted(this);
      return;
    }
    if (e.target.classList.contains("fa-times")) {
      UI.deleteTask(this);
      return;
    }
    if (e.target.classList.contains("task-content")) {
      UI.openRenameInput(this);
      return;
    }
    if (e.target.classList.contains("due-date")) {
      UI.openSetDateInput(this);
    }
  };

  setTaskCompleted = (taskButton) => {
    const projectTitle = document.getElementById("project-title").textContent;
    const taskTitle = taskButton.children[0].children[1].textContent;
    if (projectTitle === "Today" || projectTitle === "This Week") {
      const parentProjectTitle = taskTitle.split("(")[1].split(")")[0];
      Storage.deleteTask(parentProjectTitle, taskTitle.split(" ")[0]);
      if (projectTitle === "Today") {
        Storage.updateTodayProject();
      } else {
        Storage.updateWeekProject();
      }
    } else {
      Storage.deleteTask(projectTitle, taskTitle);
    }
    UI.clearTasks();
    UI.loadTasks(projectTitle);
  };

  deleteTask = (taskButton) => {
    const projectTitle = document.getElementById("project-title").textContent;
    const taskTitle = taskButton.children[0].children[1].textContent;
    if (projectTitle === "Today" || projectTitle === "This Week") {
      const mainProjectTitle = taskTitle.split("(")[1].split(")")[0];
      Storage.deleteTask(mainProjectTitle, taskTitle);
    }
    Storage.deleteTask(projectTitle, taskTitle);
    UI.clearTasks();
    UI.loadTasks(projectTitle);
  };

  openRenameInput = (taskButton) => {
    const taskTitlePara = taskButton.children[0].children[1];
    let taskTitle = taskTitlePara.textContent;
    const taskTitleInput = taskButton.children[0].children[2];
    const projectTitle =
      taskButton.parentNode.parentNode.children[0].textContent;
    if (projectTitle === "Today" || projectTitle === "This Week") {
      [taskTitle] = taskTitle.split(" (");
    }
    UI.closeAllPopups();
    taskTitlePara.classList.add("active");
    taskTitleInput.classList.add("active");
    taskTitleInput.value = taskTitle;
  };

  closeRenameInput = (taskButton) => {
    const taskTitle = taskButton.children[0].children[1];
    const taskTitleInput = taskButton.children[0].children[2];
    taskTitle.classList.remove("active");
    taskTitleInput.classList.remove("active");
    taskTitleInput.value = "";
  };

  renameTask = (e) => {
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
    if (projectTitle === "Today" || projectTitle === "This Week") {
      const mainProjectTitle = taskTitle.split("(")[1].split(")")[0];
      const mainTaskTitle = taskTitle.split(" ")[0];
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
  };

  openSetDateInput = (taskButton) => {
    const dueDate = taskButton.children[1].children[0];
    const dueDateInput = taskButton.children[1].children[1];
    UI.closeAllPopups();
    dueDate.classList.add("active");
    dueDateInput.classList.add("active");
  };

  closeSetDateInput = (taskButton) => {
    const dueDate = taskButton.children[1].children[0];
    const dueDateInput = taskButton.children[1].children[1];
    dueDate.classList.remove("active");
    dueDateInput.classList.remove("active");
  };

  setTaskDate = () => {
    const taskButton = this.parentNode.parentNode;
    const projectTitle = document.getElementById("project-title").textContent;
    const taskTitle = taskButton.children[0].children[1].textContent;
    const newDueDate = format(new Date(this.value), "dd/MM/yyyy");
    if (projectTitle === "Today" || projectTitle === "This Week") {
      const mainProjectTitle = taskTitle.split("(")[1].split(")")[0];
      const mainTaskTitle = taskTitle.split(" (")[0];
      Storage.setTaskDate(projectTitle, taskTitle, newDueDate);
      Storage.setTaskDate(mainProjectTitle, mainTaskTitle, newDueDate);
      if (projectTitle === "Today") {
        Storage.updateTodayProject();
      } else {
        Storage.updateWeekProject();
      }
    } else {
      Storage.setTaskDate(projectTitle, taskTitle, newDueDate);
    }
    UI.clearTasks();
    UI.loadTasks(projectTitle);
    UI.closeSetDateInput(taskButton);
  };

  return {
    loadHomepage,
  };
}
