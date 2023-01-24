import { Project } from "./project";
import { Task } from "./task";

function todoList() {
  let projects = [Project("All"), Project("Today"), Project("This Week")];

  setProjects = (newProjects) => {
    projects = newProjects;
  };

  getProjects = () => {
    return projects;
  };

  getProject = (projectTitle) => {
    return projects.find((project) => project.getTitle() === projectTitle);
  };

  contains = (projectTitle) => {
    return projects.some((project) => project.getTitle() === projectTitle);
  };

  addProject = (newProject) => {
    if (projects.find((project) => project.title === newProject.title)) return;
    projects.push(newProject);
  };

  deleteProject = (projectTitle) => {
    const projectToDelete = projects.find(
      (project) => project.getTitle() === projectTitle
    );
    projects.splice(projects.indexOf(projectToDelete), 1);
  };

  updateTodayProject = () => {
    this.getProject("Today").tasks = [];
    projects.forEach((project) => {
      if (project.getTitle() === "Today" || project.getTitle() === "This Week")
        return;
      const todayTasks = project.getTasksToday();
      todayTasks.forEach((task) => {
        const taskTitle = `${task.getTitle()} (${project.getTitle()})`;
        this.getProject("Today").addTask(
          Task(
            taskTitle,
            task.getDescription(),
            task.getDate(),
            task.getStatus()
          )
        );
      });
    });
  };

  updateWeekProject = () => {
    this.getProject("This Week").tasks = [];
    projects.forEach((project) => {
      if (project.getTitle() === "Today" || project.getTitle() === "This week")
        return;
      const weekTasks = project.getTasksThisWeek();
      weekTasks.forEach((task) => {
        const taskTitle = `${task.getTitle()} (${project.getTitle()})`;
        this.getProject("This Week").addTask(
          Task(
            taskTitle,
            task.getDescription(),
            task.getDate(),
            task.getStatus()
          )
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
  };

  return {
    setProjects,
    getProjects,
    getProject,
    contains,
    addProject,
    deleteProject,
    updateTodayProject,
    updateWeekProject,
  };
}

export { todoList };
