function importCSS(url)
{
  var script = document.createElement("link");
  script.type = "text/css";
  script.rel = "stylesheet";
  script.href = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}
