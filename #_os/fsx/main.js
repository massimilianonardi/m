
console.log(this, m);

var s = new m.store.Store();
var z = new m.store.Store();
z.path("3");
s.path("5");
s.data(7);
s.path("3");
s.data(9);

//new m.store.Service().method("GET").command("http://google.com");
new m.store.Service().method("GET").command("http://www.etalabs.net/sh_tricks.html");

//new m.store.File().command();
//new m.store.File().command("readdir", ["."]);

window.onload = function()
{
new m.ui.CSS().path("app/lib/m/js.css");
new m.ui.Element("input").parent(0);
};
