
//------------------------------------------------------------------------------
// GLOBAL
//------------------------------------------------------------------------------

var m_edit = null;
var m_edit_text = null;

//------------------------------------------------------------------------------
// FUNCTION
//------------------------------------------------------------------------------

  // function m_edit_click(event)
  // {
  //   m_edit_text.focus();
  // }

//------------------------------------------------------------------------------

  function m_edit_focus(event)
  {
    var selection = document.getSelection();
    console.log("m_edit_focus", selection);
    console.log("m_edit_focus", "selection.type", selection.type);
    if(selection.type === "None")
    {
      event.target.focus();
      return;
    }
    else
    {
      // console.log("selection type is not none");
    }

    var focusNode = selection.focusNode;
    console.log(focusNode);
    // console.log(focusNode, focusNode.parentNode.dataset);
    if(focusNode.tagName.toLowerCase() !== "code")
    {
      // todo get previous caret position
      // temp fix: get first code tag
      // m_edit.focus();
      var range = document.createRange();
      range.setStart(m_edit.firstElementChild, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      console.log("new selected node", document.getSelection().focusNode);
    }
  }

//------------------------------------------------------------------------------

  function m_edit_blur(event)
  {
    var selection = document.getSelection();
    console.log("m_edit_blur", selection);
    console.log("m_edit_blur", selection.type, selection.focusNode);
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

  // function m_edit_text_keyDown(event)
  // {
  //   console.log(event);
  //   var keyEvent = new KeyboardEvent("keydown",
  //   {
  //     key: event.key,
  //     code: event.code,
  //     location: event.location,
  //     repeat: event.repeat,
  //     isComposing: event.isComposing,
  //     charCode: event.charCode,
  //     keyCode: event.keyCode,
  //     which: event.which,
  //     ctrlKey: event.ctrlKey,
  //     shiftKey: event.shiftKey,
  //     altKey: event.altKey,
  //     metaKey: event.metaKey
  //   });
  //   m_edit.focus();
  //   m_edit.dispatchEvent(keyEvent);
  //   m_edit_text.focus();
  // }

//------------------------------------------------------------------------------

  // function addCodeLineAfterNode(node)
  // {
  //   console.log("addCodeLineAfterNode", node);
  //
  //   var row = "" + (parseInt(node.dataset.rowNumber || "1") + 1);
  //   console.log("addCodeLineAfterNode - row", row);
  //
  //   var lineElem = document.createElement("code");
  //   lineElem.setAttribute("data-row-number", "" + row);
  //   node.after(lineElem);
  //
  //   return lineElem;
  // }

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
  // m_edit_text.addEventListener("keydown", m_edit_text_keyDown);

  // m_edit.focus();
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
