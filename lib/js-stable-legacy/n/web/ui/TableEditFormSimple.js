//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TableEditFormSimple()
{
  return Class(TableEditFormSimple).construct(this, arguments);
}

Class(TableEditFormSimple)
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

TableEditFormSimple.prototype.render = function()
{
  if(this.dom && this.dom.form && this.dom.form.visible())
  {
    return;
  }
  
  this.html("");
  
  this.dom = {};
  
  var langdata = {};
  if(this.lang() && this.lang().data)
  {
    langdata = this.lang().data[this.url()] || {};
  }
  
  if(typeof this.data() === "undefined" || this.data() === null)
  {
    return this;
  }
  
  var type = this.data().type;
  var meta = this.data().meta;
  var data = this.data().data;
  
  var title = this.title() || langdata.name;
  var fields = [];
  var ldf = langdata.fields || {};
  for(var i = 0; i < meta.fields.length; i++)
  {
    fields.push(ldf[meta.fields[i]] || meta.fields[i]);
  }
  
  // TODO decode data with lang
  
  this.dom.header = new TableBase().header(this.header()).footer(false).parent(this);
  this.dom.header.title(title).fields(fields).data(data);
  this.dom.header.classes.add("header");
  this.dom.header.parent(0);
  var headerHeight = this.dom.header.node.firstChild.children[0].offsetHeight + this.dom.header.node.firstChild.children[1].offsetHeight;
  this.dom.header.parent(this);
  this.dom.header.style.height = headerHeight + "px";
  
  this.dom.body = new TableBase().header(this.header()).footer(this.footer()).parent(this);
  this.dom.body.title(title).fields(fields).data(data);
  this.dom.body.classes.add("body");
  
//  this.dom.resize = new ResizeListener().parent(this.dom.body);
//  this.dom.resize.eventResizeListenerResize = function()
//  {
//    console.log("resize_event", arguments, this);
//    console.log(_this.dom.body.node.scrollWidth, _this.dom.body.node.clientWidth, _this.dom.body.node.offsetWidth, _this.dom.body);
//    _this.dom.header.style.right = (_this.dom.body.node.offsetWidth - _this.dom.body.node.clientWidth) + "px";
//    _this.dom.footer.style.right = (_this.dom.body.node.offsetWidth - _this.dom.body.node.clientWidth) + "px";
//  };
  
  this.dom.resize = new ResizeListener().parent(this.dom.body).register("eventResizeListenerResize", function()
  {
//    console.log("resize_event", arguments, this);
//    console.log(_this.dom.body.node.scrollWidth, _this.dom.body.node.clientWidth, _this.dom.body.node.offsetWidth, _this.dom.body);
    _this.dom.header.style.right = (_this.dom.body.node.offsetWidth - _this.dom.body.node.clientWidth) + "px";
    _this.dom.footer.style.right = (_this.dom.body.node.offsetWidth - _this.dom.body.node.clientWidth) + "px";
    
    var scrollbarsWidth = 50;
    if(_this.dom.body.node.offsetWidth < _this.dom.body.node.scrollWidth)
    {
      _this.dom.header.style.width = _this.dom.body.node.scrollWidth + scrollbarsWidth + "px";
      _this.dom.footer.style.width = _this.dom.body.node.scrollWidth + scrollbarsWidth + "px";
      _this.dom.body.style.width = _this.dom.body.node.scrollWidth + scrollbarsWidth + "px";
    }
  });
  
  this.dom.footer = new TableBase().header(false).footer(this.footer()).parent(this);
  this.dom.footer.fields(fields).data(data);
  this.dom.footer.classes.add("footer");
  this.dom.footer.parent(0);
  var footerHeight = this.dom.footer.node.firstChild.children[2].offsetHeight;
  this.dom.footer.parent(this);
  this.dom.footer.style.height = footerHeight + "px";
  
  // sort
  if(this.sortable())
  {
    var _this = this;
    
    function sortCallback()
    {
      var index = this.getAttribute("data-index");

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
    
    var headers = this.dom.header.select("th");
    for(var i = 0; i < headers.length; i++)
    {
      headers[i].addEventListener("click", sortCallback);
    }
    
    headers = this.dom.footer.select("th");
    for(var i = 0; i < headers.length; i++)
    {
      headers[i].addEventListener("click", sortCallback);
    }
  }
  
  // edit
  if(this.editable())
  {
    var _this = this;
    
    this.dom.form = new Form().url(this.url()).parent(this);
    this.dom.form.visible(false);
    
//    this.dom.insert = new core.Element().parent(this.dom.table).html("<input type='button' class='button insert' value='Inserisci'>");
    this.dom.insert = new core.Element().html("<input type='button' class='button insert' value='Inserisci'>");
    this.dom.insert.classes.add("table_button_insert");
    this.node.insertBefore(this.dom.insert.node, this.dom.header.node);
    
    this.dom.insert.select("input")[0].addEventListener("click", function()
    {
      var index = this.getAttribute("data-index");

      var d = {};
      d.type = type;
      d.meta = meta;
      d.data = [];

      _this.dom.insert.visible(false);
      _this.dom.header.visible(false);
      _this.dom.body.visible(false);
      _this.dom.footer.visible(false);
      _this.dom.form.visible(true, false);
      _this.dom.form.data(d);
//      _this.dom.form.render();
    });
    
    var rows = this.dom.body.select("tr");
    for(var i = 0; i < rows.length; i++)
    {
      rows[i].addEventListener("click", function()
      {
        var index = this.getAttribute("data-index");
        
        var d = {};
        d.type = type;
        d.meta = meta;
        d.data = data[index];

        _this.dom.insert.visible(false);
        _this.dom.header.visible(false);
        _this.dom.body.visible(false);
        _this.dom.footer.visible(false);
        _this.dom.form.data(d).visible(true);
      });
    }
  }
  
  // fixed header/footer
//  this.dom.header.style.display = "block";
//  this.dom.footer.style.display = "block";
//  this.dom.tbody.style.display = "block";
//  this.dom.tbody.style.overflowY = "auto";
//  var othersHeights = this.dom.caption.node.offsetHeight + this.dom.header.node.offsetHeight + this.dom.footer.node.offsetHeight;
////  this.dom.tbody.style.height = "calc(100% - " + othersHeights + "px)";
//  this.dom.footer.parent(this.dom.table);
//  
//  // get first row columns sizes
//  this.dom.columnWidths = [];
//  var domcolumns = this.dom.tbody.node.firstChild.Element.select("td");
//  for(var i = 0; i < domcolumns.length; i++)
//  {
//    this.dom.columnWidths.push(domcolumns[i].clientWidth);
//  }
//  console.log(this.dom.columnWidths, domcolumns, domcolumns[0].clientWidth, domcolumns[0].scrollWidth, domcolumns[0].offsetWidth);
//  
//  // set header column sizes
//  var domcolumns = this.dom.header.select("th");
//  for(var i = 0; i < domcolumns.length; i++)
//  {
////    domcolumns[i].style.width = this.dom.columnWidths[i];
//    domcolumns[i].width = this.dom.columnWidths[i];
//  }
//  
//  // set footer column sizes
//  var domcolumns = this.dom.footer.select("th");
//  for(var i = 0; i < domcolumns.length; i++)
//  {
////    domcolumns[i].style.width = this.dom.columnWidths[i];
//    domcolumns[i].width = this.dom.columnWidths[i];
//  }
  
  return this;
};

//------------------------------------------------------------------------------
