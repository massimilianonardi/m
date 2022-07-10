function removeJS(url)
{
  var tags = document.getElementsByTagName("script");
  for(var i = 0; i < tags.length; i++)
  {
    if(tags[i].hasAttribute("src") && tags[i].src.indexOf(url) !== -1)
    {
      tags[i].parentNode.removeChild(tags[i]);
    }
  }
}
