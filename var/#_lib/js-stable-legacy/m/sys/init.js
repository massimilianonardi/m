m.env = m.env || {};
m.env.engine = m.util.environment();

//var sys = m.sys[m.env.engine];
var sys = this[m.env.engine];
sys.init();

//m.service = {};
//m.service.Service = sys.service.Service;
//m.service.Authentication = sys.service.Authentication;
//m.service.Data = sys.service.Data;
this.default = this[m.env.engine];
//m.service = this[m.env.engine].service;
//m.sys.default = m.sys[m.env.engine];

//m.mod.ModuleFunction = m.mod.Module;
//m.mod.Module = sys.mod.Module;

m.ui = sys.ui;
