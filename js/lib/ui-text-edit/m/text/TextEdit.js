//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TextEdit()
{
  return TextEdit.Class.construct(this, arguments);
}

Class(TextEdit)
.compose("text", [])
.compose("selectionRanges", [])
.compose("modListeners", [])
.property("text___")
.properties()
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

TextEdit.prototype.addSelectionRange = function(start, end, forward)
{
  if(start > end || start > this.text.length || end > this.text.length) throw new ReferenceError();

  var rangeToInsert =
  {
    start: start,
    end: end,
    forward: forward
  };

  if(this.selectionRanges.length === 0)
  {
    this.selectionRanges.push(rangeToInsert);
  }
  else
  {
    var inserted = false;

    for(var i = 0; i < this.selectionRanges.length; i++)
    {
      var range = this.selectionRanges[i];

      if(range.start < rangeToInsert.start) continue;

      if(range.start < rangeToInsert.end) throw new ReferenceError();

      if(i > 0)
      {
        range = this.selectionRanges[i - 1];
        if(range.end > rangeToInsert.start) throw new ReferenceError();
      }

      this.selectionRanges.splice(i, 0, rangeToInsert);
      inserted = true;
      break;
    }

    if(!inserted) this.selectionRanges.push(rangeToInsert);
  }

  return this;
};

//------------------------------------------------------------------------------

TextEdit.prototype.remSelectionRange = function(index)
{
  this.selectionRanges.splice(index, 1);

  return this;
};

//------------------------------------------------------------------------------

TextEdit.prototype.remAllSelectionRanges = function()
{
  this.selectionRanges = [];
  // this.addSelectionRange(0, 0);

  return this;
};

//------------------------------------------------------------------------------

TextEdit.prototype.getSelectionRangesCopy = function()
{
  selectionRangesCopy = [];

  for(var i = 0; i < this.selectionRanges.length; i++)
  {
    var rangeCopy = Object.assign({}, this.selectionRanges[i]);
    selectionRangesCopy.push(rangeCopy);
  }

  return selectionRangesCopy;
};

//------------------------------------------------------------------------------

TextEdit.prototype.collapseSelectionRange = function(index)
{
  var range = this.selectionRanges[index];

  if(range.start > range.end) throw new ReferenceError();

  this.text = this.text.slice(0, range.start) + this.text.slice(range.end);

  range.end = range.start;
};

//------------------------------------------------------------------------------

TextEdit.prototype.collapseSelectionRanges = function(indexFrom, indexTo)
{
  var _indexFrom = indexFrom || 0;
  var _indexTo = indexTo || this.selectionRanges.length;

  if(_indexFrom < 0 || _indexTo < 0 || this.selectionRanges.length < _indexFrom || this.selectionRanges.length < _indexTo || _indexTo < _indexFrom) throw new ReferenceError();

  if(_indexFrom === _indexTo) return;

  for(var i = _indexTo - 1; i >= _indexFrom; i--)
  {
    this.collapseSelectionRange(i);
  }

  return this;
};

//------------------------------------------------------------------------------

TextEdit.prototype.modifyText = function(indexFrom, indexTo, text)
{
  var removedText = this.text.slice(indexFrom, indexTo);
  console.log("TextEdit.prototype.modifyText", indexFrom, indexTo, "removed", removedText, "inserted", text);
  this.text = this.text.slice(0, indexFrom) + (text || "") + this.text.slice(indexTo);
  for(var i = 0; i < this.modListeners.length; i++)
  {
    var f = this.modListeners[i];
    if(typeof f === "function") f(indexFrom, indexTo, removedText, text);
  }

  return this;
};

//------------------------------------------------------------------------------

TextEdit.prototype.insertText = function(text, columnMode)
{
  var _columnMode = columnMode;
  var _text = text;
  var lines = null;

  if(_columnMode !== false)
  {
    lines = text.split(TextEdit.LineSeparator);

    // console.log("TextEdit.prototype.insertText", "_columnMode !== false", "lines.length", lines.length, lines);

    if(lines.length === 1) _columnMode = false;
    else if(lines.length === this.selectionRanges.length)
    {
    }
    else if(this.selectionRanges.length < lines.length)
    {
      // console.log("TextEdit.prototype.insertText", "_columnMode !== false", "this.selectionRanges.length < lines.length");
      lines[this.selectionRanges.length - 1] = lines.slice(this.selectionRanges.length - 1).join(TextEdit.LineSeparator);
      // console.log("TextEdit.prototype.insertText", "_columnMode !== false", "this.selectionRanges.length < lines.length", "joined exceeding lines", lines);
    }
    else
    {
      // console.log("TextEdit.prototype.insertText", "_columnMode !== false", "this.selectionRanges.length < lines.length -> else (lines is smaller)");
      for(var i = lines.length; i < this.selectionRanges.length; i++)
      {
        lines[i] = "";
      }
      // console.log("TextEdit.prototype.insertText", "_columnMode !== false", "this.selectionRanges.length < lines.length -> else (lines is smaller)", "filled missing lines", lines);
    }
  }

  var delta = 0;
  for(var i = 0; i < this.selectionRanges.length; i++)
  {
    if(_columnMode !== false) _text = lines[i];
    else _text = text;

    var range = this.selectionRanges[i];

    if(range.start > range.end) throw new ReferenceError();

    if(range.forward === false)
    {
      _text = reverse(_text);
    }

    // console.log("delta - before", delta, range.start, range.end);
    range.start = range.start + delta;
    range.end = range.end + delta;
    // console.log("delta - after", delta, range.start, range.end);
    // console.log("_text", _text.length, _text);

    // this.text = this.text.slice(0, range.start) + _text + this.text.slice(range.end);
    this.modifyText(range.start, range.end, _text);

    delta = delta - (range.end - range.start) + _text.length;
    // console.log("delta - new", delta);

    range.start = range.start + _text.length;
    range.end = range.start;
  }

  return this;
};

//------------------------------------------------------------------------------

TextEdit.prototype.removeText = function(nchars)
{
  if(typeof nchars !== "number") throw new ReferenceError();

  var delta = 0;
  var rangesToRemoveLater = [];
  for(var i = 0; i < this.selectionRanges.length; i++)
  {
    var range = this.selectionRanges[i];

    if(range.start > range.end) throw new ReferenceError();

    var _nchars = nchars;
    if(range.forward === false) _nchars = -nchars;

    console.log("delta - before", delta, range.start, range.end, range.forward, "_nchars", _nchars);
    range.start = range.start + delta;
    range.end = range.end + delta;
    // console.log("delta - after", delta, range.start, range.end);
    // console.log("nchars", nchars);

    console.log("nchars", nchars, "_nchars", _nchars, Math.abs(_nchars));
    console.log("delta", delta, range.end, range.start, - Math.abs(_nchars));
    delta = delta - (range.end - range.start) - Math.abs(_nchars);
    console.log("delta - new", delta, _nchars, Math.abs(_nchars));

// range.end++;
    if(0 === _nchars)
    {
      // this.text = this.text.slice(0, range.start) + this.text.slice(range.end);
      this.modifyText(range.start, range.end);
      range.end = range.start;
    }
    else if(0 < _nchars)
    {
      for(var j = this.selectionRanges.length - 1; i < j; j--)
      {
        if(this.selectionRanges[j].start < range.end)
        {
          if(this.selectionRanges[j].end < range.end)
          {
            console.log("removing selection range", j, this.selectionRanges[j].start, this.selectionRanges[j].end, this.selectionRanges[j].forward);
            this.remSelectionRange(j);
          }
          else
          {
            this.selectionRanges[j].start = range.end;
          }
        }
      }
      // this.text = this.text.slice(0, range.start) + this.text.slice(range.end + _nchars);
      this.modifyText(range.start, range.end + _nchars);
      range.end = range.start;
    }
    else
    {
      for(var j = i - 1; 0 <= j; j--)
      {
        console.log("reverse check for overlaps", i, j, this.selectionRanges[j]);
        if(range.start < this.selectionRanges[j].end)
        {
          if(range.start < this.selectionRanges[j].start)
          {
            console.log("marking for removing selection range", j, this.selectionRanges[j].start, this.selectionRanges[j].end, this.selectionRanges[j].forward);
            rangesToRemoveLater.push(j);
          }
          else
          {
            this.selectionRanges[j].end = range.start;
          }
        }
      }
      // this.text = this.text.slice(0, range.start + _nchars) + this.text.slice(range.end);
      this.modifyText(range.start + _nchars, range.end);
      range.start = range.start + _nchars;
      range.end = range.start;
    }

    console.log(this.text);
  }

  for(var i = 0; i < rangesToRemoveLater.length; i++)
  {
    console.log("removing 'marked for later' selection range", i, this.selectionRanges[rangesToRemoveLater[i]].start, this.selectionRanges[rangesToRemoveLater[i]].end, this.selectionRanges[rangesToRemoveLater[i]].forward);
    this.remSelectionRange(rangesToRemoveLater[i]);
  }

  return this;
};

//------------------------------------------------------------------------------
