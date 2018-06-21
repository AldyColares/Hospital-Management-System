let classController = {};

classController.error404 = function (req, res) {
  res.status(404).render("404");
}

export default classController;