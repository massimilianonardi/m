function removeCSS(url)
{
  var tags = document.getElementsByTagName("script");
  for(var i = 0; i < tags.length; i++)
  {
    if(tags[i].hasAttribute("href") && tags[i].href.indexOf(url) !== -1)
    {
      tags[i].parentNode.removeChild(tags[i]);
    }
  }
}
