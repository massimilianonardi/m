//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function DataFilterTable()
{
  return Class(DataFilterTable).construct(this, arguments);
}

//Classes(DataFilterTable).inherit(Data);

//------------------------------------------------------------------------------
// Enums -----------------------------------------------------------------------
//------------------------------------------------------------------------------

DataFilterTable.format = Object.freeze(
{
  TABLE: 0,
  ROW_MAP: 1,
  COLUMN_ARRAY: 2
});

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

// /data/
// datasource_name/
// schema/
// table/
// parameters:
// comma_separated_columns_or_*/
// order_by_clause/
// where_clause/
// page,page_size/
// data_format
//Data.prototype.select = function(columns)
DataFilterTable.prototype.column = function(column)
{
  if(typeof column === "undefined" || column === null || column === "")
  {
    delete this._classinstance._properties.params.columns;
  }
  else
  {
    this._classinstance._properties.params = this._classinstance._properties.params || {};
    this._classinstance._properties.params.columns = this._classinstance._properties.params.columns || "";
    if(this._classinstance._properties.params.columns !== "")
    {
      this._classinstance._properties.params.columns += ",";
    }
    this._classinstance._properties.params.columns += column;
  }
  
  return this;
};

//------------------------------------------------------------------------------

DataFilterTable.prototype.page = function(page)
{
  if(typeof page === "undefined" || page === null || page === "")
  {
    delete this._classinstance._properties.params.page;
  }
  else
  {
    // correctness of page and page size, must be checked by server in any case
    this._classinstance._properties.params = this._classinstance._properties.params || {};
    this._classinstance._properties.params.page = page;
  }
  
  return this;
};

//------------------------------------------------------------------------------

DataFilterTable.prototype.paging = function(size)
{
  if(typeof size === "undefined" || size === null || size === "")
  {
    delete this._classinstance._properties.params.paging;
  }
  else
  {
    // correctness of page and page size, must be checked by server in any case
    this._classinstance._properties.params = this._classinstance._properties.params || {};
    this._classinstance._properties.params.paging = size;
  }
  
  return this;
};

//------------------------------------------------------------------------------

//DataTable.prototype.sort = function(column, versus, index)
DataFilterTable.prototype.sort = function(column, versus)
{
  // todo support for toggle at any point of the list (versus must be numeric in this case 1,0,-1)
  // todo support removing column in the middle
  if(typeof column === "undefined" || column === null || column === "")
  {
    this._classinstance._properties.params = this._classinstance._properties.params || {};
    delete this._classinstance._properties.params.order;
    delete this._classinstance._properties.params.versus;
  }
  else
  {
    this._classinstance._properties.params = this._classinstance._properties.params || {};
    this._classinstance._properties.params.order = this._classinstance._properties.params.order || "";
    this._classinstance._properties.params.versus = this._classinstance._properties.params.versus || "";
    if(this._classinstance._properties.params.order !== "")
    {
      this._classinstance._properties.params.order += ",";
    }
    if(this._classinstance._properties.params.versus !== "")
    {
      this._classinstance._properties.params.versus += ",";
    }
    
    this._classinstance._properties.params.order += column;
    if(versus === false)
    {
      this._classinstance._properties.params.versus += "desc";
    }
    else
    {
      this._classinstance._properties.params.versus += "asc";
    }
  }
  
  return this;
};

//------------------------------------------------------------------------------

DataFilterTable.prototype.decode = function(value, url)
{
  if(!value) return;
  if(!url) return;
  
  this._classinstance._properties.decode = this._classinstance._properties.decode || {};
  this._classinstance._properties.decode[value] = url ;
  
  return this;
};

//------------------------------------------------------------------------------

DataFilterTable.prototype.filter = function(criteria)
{
  if(typeof criteria === "undefined" || criteria === null)
//  if(typeof criteria === "undefined" || criteria === null || criteria === {})
  {
//    this._classinstance._properties.params = this._classinstance._properties.params || {};
//    delete this._classinstance._properties.params.where;
    if(this._classinstance._properties && this._classinstance._properties.params && this._classinstance._properties.params.where)
    {
      delete this._classinstance._properties.params.where;
    }
  }
  else
  {
    this._classinstance._properties.params = this._classinstance._properties.params || {};
    this._classinstance._properties.params.where = JSON.stringify(criteria);
  }
  
  return this;
};

//------------------------------------------------------------------------------
