
//------------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const https = require("https");
const {shell} = require("electron");

//------------------------------------------------------------------------------
// MAIN GUI
//------------------------------------------------------------------------------

function buildSectionGUIupdate(parent)
{
  var toolbar = buildDivElem(parent, null, "toolbar");

  var currPage = buildButton(toolbar, "current_page", "text-indicator", "0");
  var prevPage = buildButton(toolbar, "prev_page", "button", "Prev Page", function()
  {
    listElem.currentPage--;
    if(listElem.currentPage < 0) listElem.currentPage = 0;
    // currPage.innerText = "" + listElem.currentPage;
    currPage.value = "" + listElem.currentPage;
    refreshListElem(parent.listElem);
  });
  var nextPage = buildButton(toolbar, "next_page", "button", "Next Page", function()
  {
    listElem.currentPage++;
    if(listElem.items.length < listElem.currentPage * listElem.itemsPerPage) listElem.currentPage--;
    // currPage.innerText = "" + listElem.currentPage;
    currPage.value = "" + listElem.currentPage;
    refreshListElem(parent.listElem);
  });

  var unselectAll = buildButton(toolbar, "unselect_all", "button", "Unselect All", function(){clearSelection(parent.listElem);});

  var orderTime = buildButton(toolbar, "order_time", "button", "Order by Time", function()
  {
    listElem.items = orderListByTime(listElem.items);
    refreshListElem(parent.listElem);
  });

  var orderUser = buildButton(toolbar, "order_user", "button", "Order by User", function()
  {
    listElem.items = orderListByUser(listElem.items);
    refreshListElem(parent.listElem);
  });

  // var tagbar = buildDivElem(parent, null, "tagbar");

  var tags = getTags();
  addTagsToGUI(toolbar, tags);

  var listElem = buildDivElem(parent, "update_list", "item-list");
  parent.listElem = listElem;
  listElem.selection = {};
  listElem.selectionOrder = [];
  listElem.items = [];
  listElem.itemsPerPage = 200;
  listElem.currentPage = 0;
}

//------------------------------------------------------------------------------

function buildSectionGUIorganize(parent)
{
  // window.open("https://www.vinted.it/member/signup/select_type");
}

//------------------------------------------------------------------------------

function buildSectionGUIsearch(parent)
{
}

//------------------------------------------------------------------------------

function main()
{
  console.log("main");

  buildSection("update", buildSectionGUIupdate);
  buildSection("organize", buildSectionGUIorganize);
  buildSection("search", buildSectionGUIsearch);
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
