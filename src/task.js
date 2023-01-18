function task(title, description, date) {
  let favorite = false;
  let status = false;
  getTitle = function () {
    return title;
  };
  setTitle = function (newTitle) {
    title = newTitle;
  };
  getDescription = function () {
    return description;
  };
  setDescription = function (newDescription) {
    description = newDescription;
  };
  getDate = function () {
    return date;
  };
  setDate = function (newDate) {
    date = newDate;
  };
  getFavorite = function () {
    return favorite;
  };
  toggleFavorite = function () {
    favorite = favorite === "false" ? "true" : "false";
  };
  getStatus = function () {
    return status;
  };
  toggleStatus = function () {
    status = status === "false" ? "true" : "false";
  };

  return {
    getTitle,
    setTitle,
    getDescription,
    setDescription,
    getDate,
    setDate,
    getFavorite,
    toggleFavorite,
    getStatus,
    toggleStatus,
  };
}

export { task };
