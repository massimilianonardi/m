//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TextEdit()
{
  return TextEdit.Class.construct(this, arguments);
}

Class(TextEdit)
// .compose("text", [])
// .compose("selectionRanges", [])
// .compose("modListeners", [])
// .property("text___")
// .properties()
;

var reverse = m.text.reverse;
TextEdit.LineSeparator = "\n";

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

// TextEdit.prototype.construct = function(service)
// {
//   if(typeof service === "string")
//   {
//     this.service(service);
//   }
// };

//------------------------------------------------------------------------------
