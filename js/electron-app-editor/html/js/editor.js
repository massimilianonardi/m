
//------------------------------------------------------------------------------
// GLOBAL
//------------------------------------------------------------------------------

var m_edit = null;
var m_edit_text = null;

//------------------------------------------------------------------------------
// FUNCTION
//------------------------------------------------------------------------------

  function m_edit_click(event)
  {
    m_edit_text.focus();
  }

//------------------------------------------------------------------------------

  function m_edit_focus(event)
  {
    var selection = document.getSelection();
    console.log(selection);
    console.log("selection.type", selection.type);
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
    console.log(focusNode, focusNode.parentNode.dataset);
  }

//------------------------------------------------------------------------------

  function m_edit_keyDown(event)
  {
    console.log("m_edit_keyDown", event);
    // if(event.keyCode == 13 && event.shiftKey == false)
    if(event.key === "Enter")
    {
      event.preventDefault();
      // document.execCommand("insertLineBreak");
      var selection = document.getSelection();
      if(selection.type === "Caret")
      {
      }
      else
      {
        console.log("error! Not a selection caret!", selection.type);
      }

      var lineElem = document.createElement("code");
      selection.focusNode.parentNode.after(lineElem);
      lineElem.focus();

      // selection.focusNode.parentNode.after(document.createElement("code"));

      // var focusNode = selection.focusNode.parentNode;
      // console.log(focusNode.dataset);
      // var row = focusNode.dataset.rowNumber || 1;
      // var col = focusNode.dataset.colNumber || 1;
      // console.log(row, col);
      // addCodeLineAfterNode(focusNode);
    }
  }

//------------------------------------------------------------------------------

  function m_edit_text_keyDown(event)
  {
    console.log(event);
    var keyEvent = new KeyboardEvent("keydown",
    {
      key: event.key,
      code: event.code,
      location: event.location,
      repeat: event.repeat,
      isComposing: event.isComposing,
      charCode: event.charCode,
      keyCode: event.keyCode,
      which: event.which,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey
    });
    m_edit.focus();
    m_edit.dispatchEvent(keyEvent);
    m_edit_text.focus();
  }

//------------------------------------------------------------------------------

  function addCodeLineAfterNode(node)
  {
    console.log("addCodeLineAfterNode", node);

    var row = "" + (parseInt(node.dataset.rowNumber || "1") + 1);
    console.log("addCodeLineAfterNode - row", row);

    var lineElem = document.createElement("code");
    lineElem.setAttribute("data-row-number", "" + row);
    node.after(lineElem);

    return lineElem;
  }

//------------------------------------------------------------------------------
// MAIN
//------------------------------------------------------------------------------

function main()
{
  console.log("main");

  m_edit = document.getElementById("m-edit");
  m_edit_text = document.getElementById("m-edit-text");

  m_edit.innerHTML="";
  var initialElem = document.createElement("code");
  initialElem.setAttribute("data-row-number", "1");
  initialElem.setAttribute("data-col-number", "1");
  m_edit.appendChild(initialElem);

  // m_edit.addEventListener("click", m_edit_click);
  m_edit.addEventListener("focus", m_edit_focus);
  m_edit.addEventListener("keydown", m_edit_keyDown);
  m_edit_text.addEventListener("keydown", m_edit_text_keyDown);

  // m_edit.focus();
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
