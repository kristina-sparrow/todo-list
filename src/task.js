function Task(
  title,
  description,
  date = "No date",
  favorite = false,
  status = false
) {
  getTitle = () => {
    return title;
  };

  setTitle = (newTitle) => {
    title = newTitle;
  };

  getDescription = () => {
    return description;
  };

  setDescription = (newDescription) => {
    description = newDescription;
  };

  getDate = () => {
    return date;
  };

  setDate = (newDate) => {
    date = newDate;
  };

  getDateFormatted = () => {
    const day = date.split("/")[0];
    const month = date.split("/")[1];
    const year = date.split("/")[2];
    return "${month}/${day}/${year}";
  };

  getFavorite = () => {
    return favorite;
  };

  toggleFavorite = () => {
    favorite = favorite === "false" ? "true" : "false";
  };

  getStatus = () => {
    return status;
  };

  toggleStatus = () => {
    status = status === "false" ? "true" : "false";
  };

  return {
    getTitle,
    setTitle,
    getDescription,
    setDescription,
    getDate,
    setDate,
    getDateFormatted,
    getFavorite,
    toggleFavorite,
    getStatus,
    toggleStatus,
  };
}

export { Task };
