function Configuration(application)
{
  var config = {};
  
  function init(roleConfig, userConfig)
  {
    roleConfig = roleConfig || {};
    userConfig = userConfig || {};
    
    config.role = roleConfig;
    config.user = userConfig;
    
    console.log(config);
  }
  
  var appFilter = 
  [
    "=",
    "key",
    application
  ];
  var appConfig = new m.web.data.DataTable().async(false).filter(appFilter);
  appConfig.eventDataLoad = function(data)
  {
    console.log(data);
    var roleConfig = {};
    if(data.data && data.data[0] && data.data[0][2])
    {
      roleConfig = JSON.parse(data.data[0][2]);
    }
    var profileConfig = new m.web.data.DataTable().async(false).filter(appFilter);
    profileConfig.eventDataLoad = function(data)
    {
      var userConfig = {};
      if(data.data && data.data[0] && data.data[0][2])
      {
        userConfig = JSON.parse(data.data[0][2]);
      }
      init(roleConfig, userConfig);
    };
    profileConfig.url("data/system/config/profiles");
  };
  appConfig.url("data/system/config/apps");
  
  return config;
}
