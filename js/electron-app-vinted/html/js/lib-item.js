
//------------------------------------------------------------------------------

function ItemListBrowser(parent)
{
  if(!(this instanceof ItemListBrowser)) throw new ReferenceError();

  this.items = [];
  this.itemsPerPage = 200;
  this.currentPage = 0;

  this.selection = {};
  this.selectionOrder = [];

  this.main = buildDivElem(parent, null, "item-browser");
  this.main._this = this;

  var _this = this;

  this.editToolbar = this.buildEditToolbar(this.main);

  this.browser = buildDivElem(this.main, null, "paged-browser");
  this.toolbar = buildDivElem(this.browser, null, "toolbar");
  this.currPage = buildButton(this.toolbar, "current_page", "text-indicator", "0");
  this.prevPage = buildButton(this.toolbar, "prev_page", "button", "Prev Page", function()
  {
    _this.currentPage--;
    if(_this.currentPage < 0) _this.currentPage = 0;
    _this.currPage.value = "" + _this.currentPage;
    _this.setItems(_this.items);
  });
  this.nextPage = buildButton(this.toolbar, "next_page", "button", "Next Page", function()
  {
    _this.currentPage++;
    if(_this.items.length < _this.currentPage * _this.itemsPerPage) _this.currentPage--;
    _this.currPage.value = "" + _this.currentPage;
    _this.setItems(_this.items);
  });
  this.itemsPerPageInput = buildText(this.toolbar, "current_page", "text-indicator", "200", function()
  {
    _this.itemsPerPage = parseInt(this.value);
    _this.setItems(_this.items);
  });

  this.unselectAll = buildButton(this.toolbar, "unselect_all", "button", "Unselect All", function()
  {
    _this.selection = {};
    _this.selectionOrder = [];
    var items = _this.itemList.querySelectorAll("input[type='checkbox']");
    for(var i = 0; i < items.length; i++)
    {
      items[i].checked = false;
    }
  });

  this.orderTime = buildButton(this.toolbar, "order_time", "button", "Order by Time", function()
  {
    _this.setItems(orderItemsByTime(_this.items));
  });

  this.orderUser = buildButton(this.toolbar, "order_user", "button", "Order by User", function()
  {
    _this.setItems(orderItemsByUser(_this.items));
  });

  this.itemList = buildDivElem(this.browser, null, "item-list");
}

// todo: build group/tag browsing gui to control item list to show in itemListBrowser
// todo: orderby only for current page
ItemListBrowser.prototype.buildEditToolbar = function(parent)
{
  var toolbar = buildDivElem(parent, null, "toolbar");
  var testbutton = buildButton(toolbar, "testbutton", "text-testbutton", "testbutton");
  var testbutton = buildButton(toolbar, "testbutton", "text-testbutton", "testbutton");
  var testbutton = buildButton(toolbar, "testbutton", "text-testbutton", "testbutton");

  return toolbar;
}

ItemListBrowser.prototype.setItems = function(items)
{
  this.items = items;
  this.itemList.innerHTML = "";

  var startIndex = this.currentPage * this.itemsPerPage;
  var endIndex = startIndex + this.itemsPerPage;

  var itemsInPage = this.items.slice(startIndex, endIndex);
  for(var i = 0; i < itemsInPage.length; i++)
  {
    this.addItemToListElem(itemsInPage[i]);
  }
}

ItemListBrowser.prototype.addItemToListElem = function(item)
{
  var _this = this;
  var parent = this.itemList;

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
      // console.log(item.id, true);
      _this.selection[item.id] = true;
      _this.selectionOrder.push(item.id);
    }
    else
    {
      // console.log(item.id, false);
      delete _this.selection[item.id];
      _this.selectionOrder.splice(_this.selectionOrder.indexOf(item.id), 1);
    }
    console.log(_this.selection, _this.selectionOrder);
  });
  buildDivElem(desc_1, null, "user", item.user_login);
  buildDivElem(desc_1, null, "price", "" + parseInt(parseFloat(item.price_numeric) + 0.5) + " €");
  buildDivElem(desc_1, null, "price", "" + parseInt(parseFloat(item.total_item_price) + 0.5) + " €");
  if(itemIsSold(item))
  {
    buildDivElem(desc_1, null, "status", "SOLD");
  }

  var desc_2 = buildDivElem(itemElem, null, "description");
  buildDivElem(desc_2, null, null, item.title);

  var img = buildThumbnail(itemElem);
  img.onclick = function()
  {
    // window.open(item.url);
    shell.openExternal(item.url);
  };

  dloadItemThumbnail_p(item).then(function()
  {
    img.src = getItemThumbnailFilePath(item.id);
  });
}

//------------------------------------------------------------------------------
