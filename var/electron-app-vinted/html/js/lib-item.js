
function addThumbnailToItemElem(parent, itemID, url, clickCallback)
{
  var itemFullPath = path.join(itemIndexPath, itemID);
  var thPath = path.join(itemFullPath, "thumbnail.jpg");

  var img = buildThumbnail(parent);
  img.onclick = clickCallback;

  if(!fs.existsSync(thPath) || fs.statSync(thPath).size === 0)
  {
    var fstream = fs.createWriteStream(thPath);
    var req = https.get(url, (res) =>
    {
      res.pipe(fstream);
      res.on("end", () =>
      {
        img.src = thPath;
      });
    })
    .on("error", (error) => {console.error(error.message);});
  }
  else
  {
    img.src = thPath;
  }
}

//------------------------------------------------------------------------------

function addItemToListElem(parent, itemID)
{
  var itemFullPath = path.join(itemIndexPath, itemID);
  var item = JSON.parse(fs.readFileSync(path.join(itemFullPath, "item.json")));

  var itemElem = buildDivElem(parent, item.id, "item");
  itemElem.vintedItem = item;

  // brand city country created_at label title description id path photos price_numeric service_fee total_item_price status url user_login
  // instant_buy is_closed is_for_sell is_hidden is_reserved is_visible
  // buildImage(itemElem, item.photos[0].full_size_url);
  // buildImage(itemElem, item.photos[0].thumbnails[0].url);
  // venduto: "item_closing_action": "sold" + "can_be_sold": false + "instant_buy": false + "can_buy": false + "accepted_pay_in_methods": []

  var desc_1 = buildDivElem(itemElem, null, "description");
  buildCheckbox(desc_1, null, "selector", false, function(event)
  {
    // console.log(event);
    if(event.srcElement.checked)
    {
      // console.log(itemID, true);
      parent.selection[itemID] = true;
      parent.selectionOrder.push(itemID);
    }
    else
    {
      // console.log(itemID, false);
      delete parent.selection[itemID];
      parent.selectionOrder.splice(parent.selectionOrder.indexOf(itemID), 1);
    }
    console.log(parent.selection, parent.selectionOrder);
  });
  buildDivElem(desc_1, null, "user", item.user_login);
  buildDivElem(desc_1, null, "price", "" + parseInt(parseFloat(item.price_numeric) + 0.5) + " €");
  buildDivElem(desc_1, null, "price", "" + parseInt(parseFloat(item.total_item_price) + 0.5) + " €");
  if(item.item_closing_action === "sold" || item.can_be_sold === false || item.instant_buy === false || item.can_buy === false)
  {
    console.log("SOLD", item.id, "item_closing_action", item.item_closing_action, "can_be_sold", item.can_be_sold, "instant_buy", item.instant_buy, "can_buy", item.can_buy);
    buildDivElem(desc_1, null, "status", "SOLD");
  }

  var desc_2 = buildDivElem(itemElem, null, "description");
  buildDivElem(desc_2, null, null, item.title);

  addThumbnailToItemElem(itemElem, itemID, item.photos[0].thumbnails[2].url, function()
  {
    // window.open(item.url);
    shell.openExternal(item.url);
  });
}

//------------------------------------------------------------------------------

function refreshListElem(listElem)
{
  listElem.innerHTML = "";
  var startIndex = listElem.currentPage * listElem.itemsPerPage;
  var endIndex = startIndex + listElem.itemsPerPage;
  var items = listElem.items.slice(startIndex, endIndex);
  for(var i = 0; i < items.length; i++)
  {
    addItemToListElem(listElem, items[i]);
  }
}

//------------------------------------------------------------------------------

function clearSelection(listElem)
{
  listElem.selection = {};
  listElem.selectionOrder = [];
  // var items = listElem.getElementsByTagName("input");
  var items = listElem.querySelectorAll("input[type='checkbox']");
  for(var i = 0; i < items.length; i++)
  {
    // if(items[i].type === "checkbox") items[i].checked = false;
    items[i].checked = false;
  }
}

//------------------------------------------------------------------------------

function buildItemList(parent)
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

  var listElem = buildDivElem(parent, "update_list", "item-list");
  parent.listElem = listElem;
  listElem.selection = {};
  listElem.selectionOrder = [];
  listElem.items = [];
  listElem.itemsPerPage = 200;
  listElem.currentPage = 0;
}

//------------------------------------------------------------------------------
