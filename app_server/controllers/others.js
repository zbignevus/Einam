module.exports.about = function(req, res){
  res.render('generic-text', {
    title: "Apie Einam",
    content:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo \n ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis \n parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec. "
  });
};
module.exports.sandbox = function(req, res){
  res.render('sandbox', {title: "Sandbox"});
};
module.exports.angularApp = function(req, res){
  res.render('layout', {title: "Einam"});
};
