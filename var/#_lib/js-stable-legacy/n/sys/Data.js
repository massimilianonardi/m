////------------------------------------------------------------------------------
//// Class -----------------------------------------------------------------------
////------------------------------------------------------------------------------

function Data()
{
  return Class(Data).construct(this, arguments);
}

//Class(Data)
//.properties()
//.property("source")
//.property("data")
////.property("policyReload")
////.compose("event", event.EventHandler)
//;
//
//// events: load, save, change, error.load, error.save
//
////------------------------------------------------------------------------------
//// Methods ---------------------------------------------------------------------
////------------------------------------------------------------------------------
//
//Data.prototype.construct = function()
//{
//  var _this = this;
//  this.dataSourceCallback = function(){_this.eventChange.apply(_this, arguments);};
////  this.dataSourceCallback = function(){_this.event.notify.call(_this, "change", arguments);};
//};
//
////------------------------------------------------------------------------------
//
//Data.prototype.source = function(source)
//{
//  if(typeof source === "undefined")
//  {
//    return this._classinstance._properties.source;
//  }
//  else
//  {
//    DataSource().unregister(this._classinstance._properties.source, this.dataSourceCallback);
//    this._classinstance._properties.source = source;
//    DataSource().register(this._classinstance._properties.source, this.dataSourceCallback);
//
//    return this;
//  }
//};
//
////------------------------------------------------------------------------------
//
//Data.prototype.get = function()
//{
////  if(typeof this.props.url !== "undefined" && this.props.url !== null)
////  {
////    var self = this;
////    this.load(self.props.url, self.props.params, function(data){self.data.call(self, data);self.dataChanged.call(self, data);}, self.dataErrorLoad);
////  }
////  else
////  {
////    this.dataChanged(this.data());
////  }
////  
////  return this;
//};
//
////------------------------------------------------------------------------------
//
//Data.prototype.set = function(data)
//{
////  if(typeof this.props.url !== "undefined" && this.props.url !== null)
////  {
////    this.props.params = this.props.params || {};
////    this.props.params.data = JSON.stringify(data);
////    var self = this;
//////    this.save(self.props.url, self.props.params, function(res){self.dataSaved(res); self.get();}, self.dataErrorSave);
////    this.save(self.props.url, self.props.params, function(res){self.dataSaved(res); DataSource().notify(self.props.url);}, self.dataErrorSave);
////    delete this.props.params.data;
////  }
////  else
////  {
////    this.data(data);
////  }
////  
////  return this;
//};
//
////------------------------------------------------------------------------------
//
////Data.prototype.load = function(url, params, success, error)
////{
////////  $.ajax(
//////  sys.ajax(
//////  {
//////    type: 'GET',
//////    url: url,
//////    data: params,
//////    processData: true,
//////    success: success,
//////    error: error,
//////    contentType: 'application/x-www-form-urlencoded',
//////    dataType: 'json'
//////  });
////};
//
////------------------------------------------------------------------------------
//
////Data.prototype.save = function(url, params, success, error)
////{
////////  $.ajax(
//////  sys.ajax(
//////  {
//////    type: 'POST',
//////    url: url,
//////    data: params,
//////    processData: true,
//////    success: success,
//////    error: error,
//////    contentType: 'application/x-www-form-urlencoded',
//////    dataType: 'json'
//////  });
////};
//
////------------------------------------------------------------------------------
//
//Data.prototype.eventChange = function()
//{
//  // todo reload policies
//  this.get();
//};
//
////------------------------------------------------------------------------------
//
//Data.prototype.eventLoad = function(data, mime)
//{
//  // usually overridden to get new data when available
//};
//
////------------------------------------------------------------------------------
//
//Data.prototype.eventSave = function(data)
//{
//  // usually overridden to notify user
//};
//
////------------------------------------------------------------------------------
//
//Data.prototype.eventErrorLoad = function(status, data, xhr)
//{
//  // usually overridden to notify user
//};
//
////------------------------------------------------------------------------------
//
//Data.prototype.eventErrorSave = function(status, data, xhr)
//{
//  // usually overridden to notify user
//};
//
////------------------------------------------------------------------------------
