//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Logger()
{
  return Logger.Class.construct(this, arguments);
}

Class(Logger)
.inherit(log.Logger)
;

//------------------------------------------------------------------------------
// Enums -----------------------------------------------------------------------
//------------------------------------------------------------------------------

Logger.level = Object.freeze(
{
  OFF: "",
  FATAL: "error",
  ERROR: "error",
  WARN: "warning",
  INFO: "information",
  DEBUG: "information",
  TRACE: "information",
  ALL: "information"
});

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Logger.prototype.construct = function(module)
{
  Noty.overrideDefaults(
  {
    layout: 'bottomRight', // 'top', 'topLeft', 'topCenter', 'topRight', 'centerLeft', 'center', 'centerRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'bottom'
    theme: 'relax', // 'defaultTheme', 'bootstrapTheme', 'relax'
    type: 'alert', // 'alert', 'success', 'error', 'warning', 'information', 'confirm'
    text: '', // can be html or string
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: 
    {
      open: 'animated bounceInRight', // or Animate.css class names like: 'animated bounceInLeft'
      close: 'animated bounceOutRight', // or Animate.css class names like: 'animated bounceOutLeft'
      easing: 'swing', // not used with Animate.css
      speed: 500 // opening & closing animation speed. Not used with Animate.css
    },
    timeout: 5000, // false, milliseconds -> delay for closing event. Set false for sticky notifications
    progressBar: true, 
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 8, // you can set max visible notification for dismissQueue true option,
    killer: false, // for close all notifications before show
    closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
    callbacks: 
    {
      onShow: function() {},
      afterShow: function() {},
      onClose: function() {},
      afterClose: function() {},
      onCloseClick: function() {}
    },
    buttons: false // an array of buttons
  });
};

//------------------------------------------------------------------------------

Logger.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
{
  new Noty({type: Logger.level[levelString], text: data[0].toString()}).show();
};

//------------------------------------------------------------------------------
