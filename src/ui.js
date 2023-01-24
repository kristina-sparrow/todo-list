import { format } from "date-fns";
import { Storage } from "./storage";
import { Project } from "./project";
import { Task } from "./task";

function UI() {
  // LOAD ELEMENTS
  loadHomepage = () => {
    UI.loadProjects();
    UI.openProject("All", document.getElementById("all-button"));
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
        <h1 id="project-name">${projectTitle}</h1>
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

  return {
    loadHomepage,
  };
}
