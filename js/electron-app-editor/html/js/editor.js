
var regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
var regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

var testString = "foo 𝌆 bar mañana mañana";
var reverse = function(string)
{
  // Step 1: deal with combining marks and astral symbols (surrogate pairs)
  string = string
    // Swap symbols with their combining marks so the combining marks go first
    .replace(regexSymbolWithCombiningMarks, function($0, $1, $2)
    {
      // Reverse the combining marks so they will end up in the same order
      // later on (after another round of reversing)
      return reverse($2) + $1;
    })
    // Swap high and low surrogates so the low surrogates go first
    .replace(regexSurrogatePair, '$2$1');
  // Step 2: reverse the code units in the string
  var result = [];
  var index = string.length;
  while (index--)
  {
    result.push(string.charAt(index));
  }
  return result.join('');
};

function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function sleep(millis)
// {
//     var date = new Date();
//     var curDate = null;
//     do{curDate = new Date();}
//     while(curDate-date < millis);
// }

async function testEditor()
{
  var initText = "";
  initText += "012345678\n";
  initText += "012345678\n";
  initText += "012345678\n";
  initText += "012345678\n";
  initText += "012345678\n";
  initText += "0123456789\n";
  initText += "0123456789\n";
  initText += "0123456789\n";
  initText += "0123456789\n";
  initText += "0123456789\n";
  initText += "ABCDEFGHIJ\n";
  initText += "KLMNOPQRST\n";
  initText += "UVWXYZ+-/*\n";
  initText += "\n";
  initText += "asd\tqwe\tzxc\n";
  initText += "\n";
  initText += "\n";
  initText += "___foo 𝌆 bar mañana mañana___\n";
  initText += "\n";

  var textToInsert = "";
  // textToInsert = "abc";
  // textToInsert = "ab\ncd";
  // textToInsert = "ab\ncdef\tgh\n";
  textToInsert = "ab\ncdef\tgh\nijk\nlmn\nopq";

  textEditor.text = initText;
  m_edit_text.value = textEditor.text;

  // textEditor.addSelectionRange(12, 13, true);
  // textEditor.addSelectionRange(22, 23, true);
  // textEditor.addSelectionRange(32, 33, true);
  textEditor.addSelectionRange(12, 13, true);
  textEditor.addSelectionRange(22, 23, false);
  textEditor.addSelectionRange(32, 33, true);
  // textEditor.addSelectionRange(12, 15, true);
  // textEditor.addSelectionRange(22, 25, true);
  // textEditor.addSelectionRange(32, 35, true);

  // textEditor.insertText(textToInsert);
  // await sleep(2000);
  // m_edit_text.value = textEditor.text;

  // for(var i = 0; i < textToInsert.length; i++)
  // {
  //   textEditor.insertText(textToInsert[i]);
  //   await sleep(1000);
  //   m_edit_text.value = textEditor.text;
  // }

  textEditor.modListeners.push(function(indexFrom, indexTo, removedText, text)
  {
    console.log("UNDO - reconstructed text", textEditor.text.slice(0, indexFrom) + removedText + textEditor.text.slice(indexFrom + (text || "").length));
  });

  // await sleep(3000);
  textEditor.text = initText;
  m_edit_text.value = textEditor.text;
  // textEditor.insertText(textToInsert);
  // textEditor.insertText(textToInsert, false);
  // textEditor.removeText(12);
  // textEditor.removeText(11);
  // textEditor.removeText(10);
  // textEditor.removeText(9);
  // textEditor.removeText(8);
  // textEditor.removeText(7);
  // textEditor.removeText(6);
  // textEditor.removeText(5);
  // textEditor.removeText(4);
  // textEditor.removeText(3);
  // textEditor.removeText(2);
  textEditor.removeText(1);
  // textEditor.removeText(0);
  await sleep(1000);
  m_edit_text.value = textEditor.text;
}

//------------------------------------------------------------------------------
// GLOBAL
//------------------------------------------------------------------------------

var m_edit = null;
var m_edit_text = null;
var textEditor = null;

//------------------------------------------------------------------------------

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
    textEditor.insertText(TextEdit.LineSeparator);
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
  textEditor = new m.text.TextEdit();

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

  m_edit_text.style.width = "99%";
  m_edit_text.style.height = "500px";
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
