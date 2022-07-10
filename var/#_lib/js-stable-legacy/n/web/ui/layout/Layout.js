//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Layout()
{
  return Class(Layout).construct(this, arguments);
}

Class(Layout)
//.inherit(Element)
//.implement(sys.LangListener)
.implement(data.Data)
//.property("visible", true)
//.property("readonly", false)
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Layout.prototype.construct = function()
{
  this.render();
};

//------------------------------------------------------------------------------

Layout.prototype.url = function(value)
{
  web.data.Data.prototype.url.call(this, value);
  
  if(typeof value === "undefined")
  {
    return this.props.url;
  }
  else
  {
    this.langUnregister("data." + this.props.url);
    this.props.url = value;
    this.langRegister("data." + this.props.url);

    return this;
  }
};

//------------------------------------------------------------------------------

Layout.prototype.render = function()
{
//  this.renderCore();
//  this.renderLang();
//  this.renderData(this.translatedData());
  
  return this;
};

//------------------------------------------------------------------------------

//ElementControl.prototype.renderCore = function()
//{
//  // only static non lang part
//};

//------------------------------------------------------------------------------

//ElementControl.prototype.renderLang = function(lang)
//{
//  // only static part
//};

//------------------------------------------------------------------------------

//ElementControl.prototype.renderData = function(data)
//{
//  // only dynamic data part
//};

//------------------------------------------------------------------------------

//ElementControl.prototype.translatedData = function()
//{
//  return this.data();
//  
////  // return current data translated by means of current lang
////  // todo
////  if(!(this.lang() && this.lang().data && this.lang().data[this.url()] && this.data()))
////  {
////    return this.data();
////  }
////  
////  var lang = this.lang().data[this.url()];
////  var data = this.data();
////  var tdata = JSON.parse(JSON.stringify(this.data()));
////  tdata.name = lang.name || data.name;
////  tdata.header = [];
////  for(var i = 0; i < data.header.length; i++)
////  {
////    tdata.header.push(lang.header[data.header[i]]);
////  }
////  
////  // todo decode
////  
////  return tdata;
//  
//  // return current data translated by means of current lang
//  if(!(this.lang() && this.lang().data && this.lang().data[this.url()] && this.data()))
//  {
//    return this.data();
//  }
//  
//  var lang = this.lang().data[this.url()];
//  var data = this.data();
//  var tdata = JSON.parse(JSON.stringify(this.data()));
//  tdata.name = lang.name || data.name;
//  tdata.fields = [];
//  for(var i = 0; i < data.fields.length; i++)
//  {
//    tdata.fields.push(lang.header[data.fields[i]]);
//  }
//  
//  for(var i = 0; i < data.data.length; i++)
//  {
//    for(var j = 0; j < data.data[i].length; j++)
//    {
//      if(lang.data[data.fields[j]] && lang.data[data.fields[j]][data.data[i][j]])
//      {
//        tdata.data[i][j] = lang.data[data.fields[j]][data.data[i][j]];
//      }
//    }
//  }
//  
//  return tdata;
//};

//------------------------------------------------------------------------------

Layout.prototype.langChanged = function(lang)
{
  this.render();
};

//------------------------------------------------------------------------------

Layout.prototype.dataChanged = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------

Layout.prototype.eventPropertiesChanged = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------
