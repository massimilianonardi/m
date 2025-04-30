//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function LangListener()
{
  return Class(LangListener).construct(this, arguments);
}

Class(LangListener)
//.property("lang")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

LangListener.prototype.lang = function(lang)
{
//  if(typeof lang === "undefined")
  if(arguments.length === 0)
  {
    return this._classinstance._properties.lang;
  }
  else
  {
    this._classinstance._properties.lang = this._classinstance._properties.lang || {};
    $.extend(true, this._classinstance._properties.lang, lang);

    return this;
  }
};

//------------------------------------------------------------------------------

LangListener.prototype.langRegister = function(path)
{
  Lang().register(this, path);
  
  return this;
};

//------------------------------------------------------------------------------

LangListener.prototype.langUnregister = function(path)
{
  Lang().unregister(this, path);
  
  return this;
};

//------------------------------------------------------------------------------

LangListener.prototype.langChanged = function(lang)
{
};

//------------------------------------------------------------------------------
