var classController = {};
classController.index = function(req, res){
    res.render('index', {nome:"hello world 2"});
}

classController.error404 = function(req, res){
    res.status(404).render("404");
}

module.exports = classController;