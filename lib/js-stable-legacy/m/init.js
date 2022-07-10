m.global = {};
m.g = m.global;

//global = m.g;
g = m.g;

var log = m.log.Log();
log.add(new m.log.LoggerConsoleSimple());
//log.add(new m.log.LoggerConsoleTrace());
//log.level(m.log.Log.level.ALL);
//log.level(m.log.Log.level.OFF);
log.level(m.env.log.level);
m.global.log = log;

var _queue = new mod.Queue();
m.global.queue = _queue;

var _conf = new conf.Configuration();
m.global.conf = _conf;

var _lang = new conf.Language();
m.global.lang = _lang;

//m.global.environment = m.util.environment();
//m.sys[m.global.environment].init();
