//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function DataTable()
{
  return Class(DataTable).construct(this, arguments);
}

Class(DataTable).inherit(Data).implement(DataFilterTable);
