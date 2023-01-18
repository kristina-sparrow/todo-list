import project from "./project";
import task from "./task";

function todoList() {
  let projects = [project("All"), project("Today"), project("This Week")];
  setProjects = function (newProjects) {
    projects = newProjects;
  };
  getProjects = function () {
    return projects;
  };
  getProject = function (projectName) {
    return projects.find((project) => project.getTitle() === projectName);
  };
  contains = function (projectName) {
    return projects.some((project) => project.getTitle() === projectName);
  };
  addProject = function (newProject) {
    if (projects.find((project) => project.title === newProject.title)) return;
    projects.push(newProject);
  };
  deleteProject = function (projectName) {
    const projectToDelete = projects.find(
      (project) => project.getTitle() === projectName
    );
    projects.splice(projects.indexOf(projectToDelete), 1);
  };
  return {
    setProjects,
    getProjects,
    getProject,
    contains,
    addProject,
    deleteProject,
  };
}

export { todoList };
