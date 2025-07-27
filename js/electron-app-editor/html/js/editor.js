
//------------------------------------------------------------------------------
// GLOBAL
//------------------------------------------------------------------------------

var m_edit = null;
var m_edit_text = null;
var textEditor = null;

//------------------------------------------------------------------------------
// CLASS
//------------------------------------------------------------------------------

function TextEditor()
{
  if(!(this instanceof TextEditor))
  {
    throw new ReferenceError();
  }

  this.text = "";
  this.selectionRanges = [];
  this.addSelectionRange(0, 0);
}

TextEditor.LineSeparator = "\n";

//------------------------------------------------------------------------------

// TextEditor.prototype.addSelectionRange = function(start, end, reverse)
// {
//   // todo notify selectionHistoryHandler that current selection is about to be modified (added range)
//
//   if(start > this.text.length || end > this.text.length) throw new ReferenceError();
//
//   var rangeToInsert = {};
//
//   if(reverse === true)
//   {
//     if(start > end)
//     {
//       rangeToInsert.start = end;
//       rangeToInsert.end = start;
//       rangeToInsert.forward = true;
//     }
//     else
//     {
//       rangeToInsert.start = start;
//       rangeToInsert.end = end;
//       rangeToInsert.forward = false;
//     }
//   }
//   else
//   {
//     if(start > end)
//     {
//       rangeToInsert.start = end;
//       rangeToInsert.end = start;
//       rangeToInsert.forward = false;
//     }
//     else
//     {
//       rangeToInsert.start = start;
//       rangeToInsert.end = end;
//       rangeToInsert.forward = true;
//     }
//   }
//
//   var inserted = false;
//   if(this.selectionRanges.length === 0) this.selectionRanges.push(rangeToInsert);
//   else for(var i = 0; i < this.selectionRanges.length; i++)
//   {
//     var range = this.selectionRanges[i];
//     console.log(i, rangeToInsert, range);
//     if(range.start < rangeToInsert.start) continue;
//     if(range.start < rangeToInsert.end) throw new ReferenceError();
//     if(i > 0)
//     {
//       range = this.selectionRanges[i - 1];
//       if(range.end > rangeToInsert.start) throw new ReferenceError();
//     }
//     this.selectionRanges.splice(i, 0, rangeToInsert);
//     console.log(i, rangeToInsert, range, "splice + break");
//     break;
//   }
//
//   if(!inserted) this.selectionRanges.push(rangeToInsert);
//
//   return this;
// };


TextEditor.prototype.addSelectionRange = function(start, end, forward)
{
  // todo notify selectionHistoryHandler that current selection is about to be modified (added range)

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

TextEditor.prototype.remSelectionRange = function(index)
{
  // todo notify selectionHistoryHandler that current selection is about to be modified (remove range)

  this.selectionRanges.splice(index, 1);

  return this;
};

//------------------------------------------------------------------------------

TextEditor.prototype.remAllSelectionRanges = function()
{
  // todo notify selectionHistoryHandler that current selection is about to be modified (rem all ranges)

  this.selectionRanges = [];
  this.addSelectionRange(0, 0);

  return this;
};

//------------------------------------------------------------------------------

TextEditor.prototype.getSelectionRangesCopy = function()
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

TextEditor.prototype.insertTextAtRange = function(text, range)
{
  if(range.start > range.end) throw new ReferenceError();

  this.text = this.text.slice(0, range.start) + (text || "") + this.text.slice(range.end);

  range.start = range.start + text.length;
  range.end = range.start;
};

//------------------------------------------------------------------------------

TextEditor.prototype.insertText = function(text, columnMode)
{
  // todo shift ranges below current being modified
  // todo notify selectionHistoryHandler that current selection is about to be collapsed
  // todo handle text smart history (fine grained for recent, word/block for older)
  // todo handle deletions: del/canc keys or redefine actions via selection+insertText???

  if(this.selectionRanges.length === 0) this.addSelectionRange(0, 0);

  var lines = text.split(TextEditor.LineSeparator);

  if(lines.length === 1 || columnMode === false)
  {
    for(var i = this.selectionRanges.length - 1; i >= 0; i--)
    {
      this.insertTextAtRange(text, this.selectionRanges[i]);
    }
  }
  else
  {
    var lastIndex = Math.min(this.selectionRanges.length, lines.length) - 1;

    this.insertTextAtRange(lines.slice(lastIndex).join(TextEditor.LineSeparator), this.selectionRanges[lastIndex]);

    for(var i = lastIndex - 1; i >= 0; i--)
    {
      this.insertTextAtRange(lines[i], this.selectionRanges[i]);
    }
  }

  // todo notify selectionHistoryHandler that current selection is now collapsed

  return this;
};

//------------------------------------------------------------------------------

TextEditor.prototype.removeTextAtRange = function(nchars, range, index)
{
  // differently from insertText, remove can make ranges overlap -> check against this situation!!!

  if(range.start > range.end) throw new ReferenceError();

  if(0 <= nchars)
  {
    this.text = this.text.slice(0, range.start) + this.text.slice(range.end + nchars);

    range.end = range.start;
  }
  else if(nchars < 0)
  {
    this.text = this.text.slice(0, range.start + nchars) + this.text.slice(range.end);

    range.start = range.start + nchars;
    range.end = range.start;
  }
  else throw new ReferenceError();
};

//------------------------------------------------------------------------------

TextEditor.prototype.removeText = function(nchars)
{
  // differently from insertText, remove can make ranges overlap -> check against this situation!!!

  // nchars positive remove left (del), nchars negative remove right (canc)
  // todo notify selectionHistoryHandler that current selection is about to be collapsed
  // todo handle text smart history (fine grained for recent, word/block for older)
  // todo handle deletions: del/canc keys or redefine actions via selection+insertText???

  if(this.selectionRanges.length === 0) this.addSelectionRange(0, 0);

  if(nchars === 0) return;

  for(var i = this.selectionRanges.length - 1; i >= 0; i--)
  {
    this.removeTextAtRange(nchars, this.selectionRanges[i], i);
  }

  // todo notify selectionHistoryHandler that current selection is now collapsed

  return this;
};

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// FUNCTION
//------------------------------------------------------------------------------

// function m_edit_focus(event)
// {
//   var selection = document.getSelection();
//   console.log("m_edit_focus", selection);
//   console.log("m_edit_focus", "selection.type", selection.type);
//   if(selection.type === "None")
//   {
//     event.target.focus();
//     return;
//   }
//   else
//   {
//     // console.log("selection type is not none");
//   }
//
//   var focusNode = selection.focusNode;
//   console.log(focusNode);
//   // console.log(focusNode, focusNode.parentNode.dataset);
//   if(focusNode.tagName.toLowerCase() !== "code")
//   {
//     // todo get previous caret position
//     // temp fix: get first code tag
//     // m_edit.focus();
//     var range = document.createRange();
//     range.setStart(m_edit.firstElementChild, 0);
//     range.collapse(true);
//     selection.removeAllRanges();
//     selection.addRange(range);
//     console.log("new selected node", document.getSelection().focusNode);
//   }
// }

//------------------------------------------------------------------------------

// function m_edit_blur(event)
// {
//   var selection = document.getSelection();
//   console.log("m_edit_blur", selection);
//   console.log("m_edit_blur", selection.type, selection.focusNode);
// }

//------------------------------------------------------------------------------

function ___m_edit_paste(event)
{
  console.log("m_edit_paste", event);

  var pastedText = (event.clipboardData || window.clipboardData).getData("text");
  document.execCommand("insertText", false, pastedText);
  // document.execCommand("insertHTML", false, pastedText);

  event.preventDefault();
  return false;
}

function m_edit_paste(event)
{
  console.log("m_edit_paste", event);

  var pastedText = (event.clipboardData || window.clipboardData).getData("text");

  var selection = document.getSelection();
  selection.deleteFromDocument();

  var focusNode = selection.focusNode;
  console.log("m_edit_keyDown", "focusNode", [focusNode], focusNode);
  if(focusNode.nodeType !== Node.ELEMENT_NODE)
  {
    focusNode = selection.focusNode.parentNode;
    console.log("m_edit_keyDown", "focusNode.parentNode", [focusNode], focusNode);
  }

  if(focusNode.tagName.toLowerCase() !== "code")
  {
    focusNode = m_edit.firstElementChild;
    console.log("m_edit_keyDown", "focusNode -> m_edit.firstElementChild", [focusNode], focusNode);
  }

  var pastedArray = pastedText.split("\n");
  console.log(pastedArray);
  // todo: keep track of undo/redo cache
  // todo: split focusNode before/after current selection (already deleted) and do proper edit on first/last node
  for(var i = 0; i < pastedArray.length; i++)
  {
    var lineElem = document.createElement("code");
    lineElem.innerHTML = pastedArray[i];
    focusNode.after(lineElem);
    focusNode = lineElem;
  }
  // focusNode.innerHTML = "AAAAAAAAAAAAA</code><code>BBBBB" + pastedText;
  // // selection.getRangeAt(0).insertNode(document.createTextNode("AAAAAAAAAAAAA<code>BBBBB</code>" + pastedText));
  // var elem = document.createElement("code");
  // elem.innerText = "AAAAAAAAAAAAA<code>BBBBB</code>" + pastedText;
  // selection.getRangeAt(0).insertNode(elem);
  // selection.collapseToEnd();
  // https://medium.com/@python-javascript-php-html-css/how-to-update-content-in-a-contenteditable-element-while-maintaining-the-undo-stack-e17c48e36466
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver


  event.preventDefault();
  return false;
}

//------------------------------------------------------------------------------

function m_edit_keyDown(event)
{
  // todo: keep track of undo/redo cache

  // console.log("m_edit_keyDown", event);
  if(event.key === "Enter")
  {
    textEditor.insertText(TextEditor.LineSeparator);
    m_edit_text.value = textEditor.text;

    // override default contenteditable behaviour

    event.preventDefault();

    var selection = document.getSelection();

    if(selection.type !== "Caret")
    {
      console.log("WARNING! Not a selection caret!", selection.type);
      // return;
    }

    // var focusNode = selection.focusNode.parentNode;
    var focusNode = selection.focusNode;
    console.log("m_edit_keyDown", "focusNode", [focusNode], focusNode);
    if(focusNode.nodeType !== Node.ELEMENT_NODE)
    {
      focusNode = selection.focusNode.parentNode;
      console.log("m_edit_keyDown", "focusNode.parentNode", [focusNode], focusNode);
    }

    if(focusNode.tagName.toLowerCase() !== "code")
    {
      focusNode = m_edit.firstElementChild;
      console.log("m_edit_keyDown", "focusNode -> m_edit.firstElementChild", [focusNode], focusNode);
    }

    var lineElem = document.createElement("code");
    focusNode.after(lineElem);

    var range = document.createRange();
    range.setStart(lineElem, 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  else if(event.key === "Backspace")
  {
    textEditor.removeText(-1);
    m_edit_text.value = textEditor.text;
  }
  else if(event.key === "Delete")
  {
    textEditor.removeText(1);
    m_edit_text.value = textEditor.text;
  }
  else if(event.key === "Shift")
  {
  }
  else if(event.key === "Control")
  {
  }
  else if(event.key === "Alt")
  {
  }
  else if(event.key === "CapsLock")
  {
  }
  else if(event.key === "ArrowUp")
  {
  }
  else if(event.key === "ArrowDown")
  {
  }
  else if(event.key === "ArrowLeft")
  {
  }
  else if(event.key === "ArrowRight")
  {
  }
  else
  {
    // process typing for syntax highlight, hints and code completion, bracket matching, folding blocks detection, linting (error/warning detection), smart indent
    textEditor.insertText(event.key);
    m_edit_text.value = textEditor.text;
  }
}

//------------------------------------------------------------------------------
// MAIN
//------------------------------------------------------------------------------

function main()
{
  console.log("main");

  m_edit = document.getElementById("m-edit");
  m_edit_text = document.getElementById("m-edit-text");
  textEditor = new TextEditor();

  m_edit.innerHTML = "";
  var initialElem = document.createElement("code");
  m_edit.appendChild(initialElem);

  // m_edit.addEventListener("click", m_edit_click);
  // m_edit.addEventListener("focus", m_edit_focus);
  // m_edit.addEventListener("blur", m_edit_blur);
  m_edit.addEventListener("keydown", m_edit_keyDown);
  m_edit.addEventListener("paste", m_edit_paste);
  // m_edit_text.addEventListener("keydown", m_edit_text_keyDown);

  // m_edit.focus();
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
