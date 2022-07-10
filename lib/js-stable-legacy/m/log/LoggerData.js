//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function LoggerData()
{
  return LoggerData.Class.construct(this, arguments);
}

Class(LoggerData)
.inherit(log.Logger)
.inherit(m.service.Data)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

LoggerData.prototype.construct = function()
{
  // todo save log to generic data storage, implement save policies eg. each n log object, at time interval, at generic event, after receiving an error log event, etc.
};

//------------------------------------------------------------------------------

LoggerData.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
{
  console.log(timestamp, date, time, level, levelString, caller, JSON.stringify(data));
};

//------------------------------------------------------------------------------
