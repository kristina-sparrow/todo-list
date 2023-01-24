export default class Task {
  constructor(title, description, date = "No date") {
    this.title = title;
    this.description = description;
    this.date = date;
  }

  getTitle() {
    return this.title;
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }

  getDescription() {
    return this.description;
  }

  setDescription(newDescription) {
    this.description = newDescription;
  }

  getDate() {
    return this.date;
  }

  setDate(dueDate) {
    this.date = dueDate;
  }

  getDateFormatted = () => {
    const day = this.date.split("/")[0];
    const month = this.date.split("/")[1];
    const year = this.date.split("/")[2];
    return "${month}/${day}/${year}";
  };
}
