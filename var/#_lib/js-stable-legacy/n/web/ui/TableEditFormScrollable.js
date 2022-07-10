//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TableEditFormScrollable()
{
  return Class(TableEditFormScrollable).construct(this, arguments);
}

Class(TableEditFormScrollable)
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

TableEditFormScrollable.prototype.render = function()
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
  
  this.dom.table = new dom.TableScrollable().caption(title).header(this.header() ? fields : false).footer(this.footer() ? fields : false).body(data).parent(this);
  
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
    
    var headers = this.dom.table.select("th");
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
    this.node.insertBefore(this.dom.insert.node, this.dom.table.node);
    
    this.dom.insert.select("input")[0].addEventListener("click", function()
    {
      var index = this.getAttribute("data-index");

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
    
    var rows = this.dom.table.select("tbody>tr");
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
        _this.dom.table.visible(false);
        _this.dom.form.data(d).visible(true);
      });
    }
  }
  
  this.dom.table.eventResizeListenerTargetResize();
  
  return this;
};

//------------------------------------------------------------------------------
