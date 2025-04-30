//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function HandsOnDataTable()
{
  return Class(HandsOnDataTable).construct(this, arguments);
}

Class(HandsOnDataTable)
.inherit(core.ElementControl)
.implement(web.data.DataFilterTable)
.properties()
.property("title")
.property("header", true)
.property("footer", false)
.property("sortable", true)
.property("editable", true)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

HandsOnDataTable.prototype.construct = function()
{
  this.dom = {};
  this.dom.table = new core.Element().parent(this.node);
  
  if(this.editable())
  {
    this.dom.form = new Form().parent(this);
    this.dom.form.visible(false);
    
    this.dom.insert = new core.Element().html("<input type='button' class='button insert' value='Inserisci'>");
    this.dom.insert.classes.add("table_button_insert");
    this.node.insertBefore(this.dom.insert.node, this.dom.table.node);
  }
  
  this.table = new Handsontable(this.dom.table.node, 
  {
//    className: "",
    rowHeaders: false,
    colHeaders: true,
    autoRowSize: true,
    autoColumnSize: true,
//    columnSorting: true,
//    columnSorting: {column: 0, sortOrder: true},
    manualColumnFreeze: true,
    manualRowMove: true,
    manualRowResize: true,
    manualColumnMove: true,
    manualColumnResize: true,
    autoWrapRow: false,
    autoWrapCol: false,
    allowInsertRow: true,
    allowInsertColumn: false,
    allowRemoveRow: true,
    allowRemoveColumn: false,
    allowInvalid: true,
    disableVisualSelection: false,
    enterBeginsEditing: true,
    fillHandle: true,
    filter: true,
    filteringCaseSensitive: false,
    fragmentSelection: false,
    mergeCells: false,
    multiSelect: true,
    observeDOMVisibility: true,
    outsideClickDeselects: true,
//    pasteMode: "overwrite",
//    pasteMode: "shift_right",
    pasteMode: "shift_down",
    preventOverflow: false,
    readOnly: true,
    search: true,
    sortByRelevance: true,
    sortIndicator: true,
    stretchH: "none",
    trimWhitespace: false,
    undo: true,
    wordWrap: true,
    language: "it",
//    contextMenu: ["row_above", "row_below", "col_left", "col_right", "remove_row", "remove_col", "---------", "undo", "redo"],
    contextMenu: false,
//    contextMenuCopyPaste: {swfPath: ''},
    copyPaste: true,
    copyable: true
  });
  
//  var _this = this;
//  this.node.firstChild.addEventListener("change", function(event){_this.eventInputChange(this.value);});
};

//------------------------------------------------------------------------------

HandsOnDataTable.prototype.render = function()
{
  if(typeof this.dom === "undefined")
  {
    return this;
  }
  
  this.dom.insert.visible(true);
  this.dom.table.visible(true);
  
  if(typeof this.data() === "undefined" || this.data() === null)
  {
    return this;
  }
  
  var type = this.data().type;
  var meta = this.data().meta;
  var data = this.data().data;
  
  var settings = {};
  
  if(this.header())
  {
    settings.colHeaders = meta.fields;
  }
  else
  {
    settings.colHeaders = false;
  }
  
  if(this.sortable())
  {
//    settings.afterOnCellMouseDown = function(event, coords, element)
//    {
//      console.log(arguments);
//    };
    var _this = this;
    
    function sortCallback(index, event)
    {
      console.log(index, this, event);
//      event.stopPropagation();
//      event.preventDefault();
      var params = _this.params() || {};
      if(params.order === meta.fields[index])
      {
        if(params.versus === "asc")
        {
          _this.sort().sort(meta.fields[index], false);
        }
        else
        {
          _this.sort().sort(meta.fields[index], true);
        }
      }
      else
      {
        _this.sort().sort(meta.fields[index], true);
      }
      _this.get();
    }
    
    var headers = this.select(".ht_clone_top th");
    for(var i = 0; i < headers.length; i++)
    {
//      headers[i].addEventListener("click", sortCallback.bind(undefined, i));
      headers[i].onclick = sortCallback.bind(headers[i], i);
    }
  }
  
  if(this.editable())
  {
    var _this = this;
    
    this.dom.form.url(this.url());
    
    this.dom.insert.select("input")[0].addEventListener("click", function()
    {
      var d = {};
      d.type = type;
      d.meta = meta;
      d.data = [];

      _this.dom.insert.visible(false);
      _this.dom.table.visible(false);
      _this.dom.form.visible(true, false);
      _this.dom.form.data(d);
//      _this.dom.form.render();
    });
    
    var rows_hot = this.select("tr");
    var rows = [];
    for(var i = 1; i < rows_hot.length - 2; i++)
    {
      rows.push(rows_hot[i]);
    }
    
//    console.log(rows);
    for(var i = 0; i < rows.length; i++)
    {
      rows[i].onclick = function(index)
      {
        var d = {};
        d.type = type;
        d.meta = meta;
        d.data = data[index];

        _this.dom.insert.visible(false);
        _this.dom.table.visible(false);
        _this.dom.form.data(d).visible(true);
      }.bind(undefined, i);
    }
  }
  
  var columnsSettings = [];
  settings.columns = columnsSettings;
  
  try
  {
    this.table.updateSettings(settings);
    this.table.loadData(data);
  }
  catch(e)
  {
    console.log(e);
  }
  
  return this;
};

//------------------------------------------------------------------------------
