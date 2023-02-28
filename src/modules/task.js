export default class Task {
  constructor(title, date = "No date", doneStatus = false) {
    this.title = title;
    this.date = date;
    this.doneStatus = doneStatus;
  }

  getTitle() {
    return this.title;
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }

  getDate() {
    return this.date;
  }

  setDate(dueDate) {
    this.date = dueDate;
  }

  getDoneStatus() {
    return this.doneStatus;
  }

  setDoneStatus(newStatus) {
    this.doneStatus = newStatus;
  }

  getDateFormatted = () => {
    const month = this.date.split("/")[0];
    const day = this.date.split("/")[1];
    const year = this.date.split("/")[2];
    return `${month}/${day}/${year}`;
  };
}
