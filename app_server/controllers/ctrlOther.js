module.exports.about = function(req,res){
    res.render("generic-text",{title:"About"});
}

module.exports.angularApp = function(req,res){
    res.render("index",{title:"Loc8r"})
};