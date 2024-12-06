
//------------------------------------------------------------------------------

function Queue()
{
  if(!(this instanceof Queue)) throw new ReferenceError();

  this.queue = [];
}

Queue.prototype.add = function(callbackReturningPromise, args)
{
  if(typeof callbackReturningPromise === "undefined" || callbackReturningPromise === null)
  {
    throw new ReferenceError();
  }

  if(typeof callbackReturningPromise !== "function")
  {
    throw new TypeError();
  }

  this.queue.push({callback: callbackReturningPromise, args: args});

  return this;
};

Queue.prototype.exec = function()
{
  var _this = this;

  return new Promise((resolve, reject) =>
  {
    var f = function()
    {
      if(_this.queue.length === 0)
      {
        resolve();
        return;
      }

      var obj = _this.queue.splice(0, 1)[0];
      try
      {
        obj.callback.apply(global, obj.args)
        .then(() => f())
        .catch(() => f());
      }
      catch(error)
      {
        console.error(error);
        f();
      }
    };
    f();
  });
};

//------------------------------------------------------------------------------
