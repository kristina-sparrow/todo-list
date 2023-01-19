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

  getProject = (projectName) => {
    return projects.find((project) => project.getTitle() === projectName);
  };

  contains = (projectName) => {
    return projects.some((project) => project.getTitle() === projectName);
  };

  addProject = (newProject) => {
    if (projects.find((project) => project.title === newProject.title)) return;
    projects.push(newProject);
  };

  deleteProject = (projectName) => {
    const projectToDelete = projects.find(
      (project) => project.getTitle() === projectName
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
        const taskName = `${task.getTitle()} (${project.getTitle()})`;
        this.getProject("Today").addTask(
          Task(
            taskName,
            task.getDescription(),
            task.getDate(),
            task.getFavorite(),
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
        const taskName = `${task.getName()} (${project.getName()})`;
        this.getProject("This Week").addTask(
          Task(
            taskName,
            task.getDescription(),
            task.getDate(),
            task.getFavorite(),
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
