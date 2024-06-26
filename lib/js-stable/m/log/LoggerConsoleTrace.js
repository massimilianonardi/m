//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function LoggerConsoleTrace()
{
}

Class(LoggerConsoleTrace)
.inherit(Logger)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

LoggerConsoleTrace.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
{
  console.trace(timestamp, date, time, level, levelString, caller, data);
};

//------------------------------------------------------------------------------
