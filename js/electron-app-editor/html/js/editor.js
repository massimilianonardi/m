
//------------------------------------------------------------------------------
// GLOBAL
//------------------------------------------------------------------------------

var m_edit = null;
var m_edit_text = null;

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

  focusNode.innerHTML = "AAAAAAAAAAAAA<code>BBBBB</code>" + pastedText;
  // // selection.getRangeAt(0).insertNode(document.createTextNode("AAAAAAAAAAAAA<code>BBBBB</code>" + pastedText));
  // var elem = document.createElement("code");
  // elem.innerText = "AAAAAAAAAAAAA<code>BBBBB</code>" + pastedText;
  // selection.getRangeAt(0).insertNode(elem);
  selection.collapseToEnd();

  event.preventDefault();
  return false;
}

//------------------------------------------------------------------------------

function m_edit_keyDown(event)
{
  // console.log("m_edit_keyDown", event);
  if(event.key === "Enter")
  {
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
  else
  {
    // process typing for syntax highlight, hints and code completion, bracket matching, folding blocks detection, linting (error/warning detection), smart indent
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
