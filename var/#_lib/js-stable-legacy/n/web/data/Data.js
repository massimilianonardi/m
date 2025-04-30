//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Data()
{
  return Class(Data).construct(this, arguments);
}

Class(Data)
.inherit(Server)
//.property("url")
//.property("params")
.property("data")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//Data.prototype.construct = function()
//{
//};

//------------------------------------------------------------------------------

Data.prototype.url = function(value, autoload)
{
//  console.log(arguments.length, value);
//  if(typeof value === "undefined" && arguments.length !== 0)
//  {
//    throw new TypeError();
//  }
  if(typeof value === "undefined")
//  if(arguments.length === 0)
  {
    return this._classinstance._properties.url;
  }
  else
  {
    m.sys.DataSource().unregister(this, this._classinstance._properties.url);
    this._classinstance._properties.url = value;
    m.sys.DataSource().register(this, this._classinstance._properties.url);

    if(typeof this.eventPropertiesChanged === "function")
    {
      this.eventPropertiesChanged("url");
    }
    
    if(typeof autoload === "undefined" || autoload === true)
    {
      this.get();
    }

    return this;
  }
};

//------------------------------------------------------------------------------

Data.prototype.get = function()
{
  if(typeof this._classinstance._properties.url !== "undefined" && this._classinstance._properties.url !== null)
  {
    this.load();
  }
  else
  {
    this.eventDataLoad(this.data());
  }
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.set = function(data)
{
  if(typeof this._classinstance._properties.url !== "undefined" && this._classinstance._properties.url !== null)
  {
    this._classinstance._properties.params = this._classinstance._properties.params || {};
    this._classinstance._properties.params.data = JSON.stringify(data);
    this.save();
    delete this._classinstance._properties.params.data;
  }
  else
  {
    this.data(data);
  }
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.load = function()
{
  this.method("GET");
  this.execute();
};

//------------------------------------------------------------------------------

Data.prototype.save = function()
{
  this.method("POST");
  this.execute();
};

//------------------------------------------------------------------------------

Data.prototype.success = function(data, mime, method, xhr)
{
  if(method === "GET")
  {
    this.data(data);
    this.eventDataLoad(data, mime);
  }
  else
  {
    m.sys.DataSource().notify(this.url());
    this.eventDataSave(data);
  }
};

//------------------------------------------------------------------------------

Data.prototype.error = function(status, data, method, xhr)
{
  if(method === "GET")
  {
    this.eventDataErrorLoad(status, data, xhr);
  }
  else
  {
    this.eventDataErrorSave(status, data, xhr);
  }
};

//------------------------------------------------------------------------------

Data.prototype.eventDataChanged = function()
{
  this.get();
};

//------------------------------------------------------------------------------

Data.prototype.eventDataLoad = function(data, mime)
{
};

//------------------------------------------------------------------------------

Data.prototype.eventDataSave = function(data)
{
};

//------------------------------------------------------------------------------

Data.prototype.eventDataErrorLoad = function(status, data, xhr)
{
};

//------------------------------------------------------------------------------

Data.prototype.eventDataErrorSave = function(status, data, xhr)
{
};

//------------------------------------------------------------------------------
