//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementControl()
{
  return Class(ElementControl).construct(this, arguments);
}

Class(ElementControl)
.inherit(Element)
//.implement(sys.LangListener)
.implement(data.Data)
.property("method", "GET")
.property("async", true)
.property("parse", true)
.property("retries", 1)
//.property("visible", true)
//.property("readonly", false)
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ElementControl.prototype.construct = function()
{
  this.render();
};

//------------------------------------------------------------------------------

ElementControl.prototype.url = function(value)
{
  web.data.Data.prototype.url.call(this, value);
  
  if(typeof value === "undefined")
  {
    return this._classinstance._properties.url;
  }
  else
  {
    this.langUnregister("data." + this._classinstance._properties.url);
    this._classinstance._properties.url = value;
    this.langRegister("data." + this._classinstance._properties.url);

    return this;
  }
};

//------------------------------------------------------------------------------

ElementControl.prototype.render = function()
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

ElementControl.prototype.eventLangChanged = function(lang)
{
  this.render();
};

//------------------------------------------------------------------------------

ElementControl.prototype.eventDataLoad = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------

ElementControl.prototype.eventPropertiesChanged = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------
