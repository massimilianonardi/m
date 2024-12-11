
//------------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const https = require("https");
const {shell} = require("electron");

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

function PromisesQueue()
{
  if(!(this instanceof PromisesQueue)) throw new ReferenceError();

  this.queue = [];
}

PromisesQueue.prototype.add = function(callbackReturningPromise, args, callbackThen, callbackCatch)
{
  if(typeof callbackReturningPromise === "undefined" || callbackReturningPromise === null)
  {
    throw new ReferenceError();
  }

  if(typeof callbackReturningPromise !== "function")
  {
    throw new TypeError();
  }

  if(typeof callbackThen !== "undefined" && callbackThen !== null && typeof callbackThen !== "function")
  {
    throw new TypeError();
  }

  if(typeof callbackCatch !== "undefined" && callbackCatch !== null && typeof callbackCatch !== "function")
  {
    throw new TypeError();
  }

  this.queue.push({callback: callbackReturningPromise, args: args, callbackThen: callbackThen, callbackCatch: callbackCatch});

  return this;
};

PromisesQueue.prototype.exec = function()
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
        .then((...args) => {obj.callbackThen.apply(global, ...args); f();})
        .catch((...args) => {obj.callbackCatch.apply(global, ...args); f();});
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
