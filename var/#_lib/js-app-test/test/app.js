
console.log("test", this);

// globals ---------------------------------------------------------------------

var root = this.root || "";

var app = new m.App();
app
.init(main)
;

// main ------------------------------------------------------------------------

function main()
{
  console.log("init-main");
  console.log("init-main", app.conf.data());
  
  
  document.body.style.overflow = "auto";
  
//  test_01();
//  test_02();
//  test_03();
//  test_04();
//  test_05();
//  test_lib_dynamic_load();
//  test_traverse();
//  test_resolve();
//  test_map();
  test_authz_man();
}

// functions -------------------------------------------------------------------

function test_00()
{
  var e = new m.ui.Element().id("").parent(0);
}

//------------------------------------------------------------------------------

function test_01()
{
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
//  var sel = new m.ui.Select().parent(0);
//  sel.conf(
//  {
//    locale: "it",
////    deselect: true,
//    placeholder: "..."
//  });
//  sel.map({key1: "value 10",         // Just a Key -> innerText Pair
//        key2: {                 // Complete Option Structure
//            value: "value 20",
//            group: "#",         // The optgroup, the default is "#"
//            selected: false,    // Pre-Select Item
//            disabled: false,    // Pre-Disable Item
//            description: "v20 description"     // Custom Option Description
//        }});
//  
//console.log("class inherit", "Select", m.ui.Select.prototype, m.ui.Select.prototype, sel);
//  var self = function(){console.log("self", this, arguments);};
////  sel.eventConfChangedRegister(self, true);
//  sel.eventRegister("ConfChanged", self, true);
//  sel.conf({test: "testval"});
////  sel.eventConfChangedUnregister(self);
//  sel.eventUnregister("ConfChanged", self);
//  sel.conf({test_after: "testval_after"});
//  sel.eventNotify("ConfChanged", [{notifiedkey: "notified value"}]);
//  
//  sel.first({zVeryFirstKey: "---initial---"});
//  sel.last({zVeryLastKey: "---final---"});
//  sel.map({key1: "value 10",         // Just a Key -> innerText Pair
//        key2: {                 // Complete Option Structure
//            value: "value 20",
//            group: "#",         // The optgroup, the default is "#"
//            selected: false,    // Pre-Select Item
//            disabled: false,    // Pre-Disable Item
//            description: "v20 description"     // Custom Option Description
//        }});
  
////  var s = new m.ui.ElementStoreSelect().configure(
//  var s = new m.ui.ElementStoreSelect().conf(
//  {
//    locale: "it"
//  }).parent(0);
//  s.data({key1: "value1",         // Just a Key -> innerText Pair
//        key2: {                 // Complete Option Structure
//            value: "value2",
//            group: "#",         // The optgroup, the default is "#"
//            selected: false,    // Pre-Select Item
//            disabled: false,    // Pre-Disable Item
//            description: "v2 description"     // Custom Option Description
//        }});
  
//  document.body.innerHTML += "<input type='text' id='datetime' />";
//  
//  var dt = new tail.DateTime("#datetime");
//  console.log(dt);
//  window.sel = sel;
  
//  var dt2 = new m.ui.DateSelect().parent(0);
////  dt2.conf({
////      /* No Custom Settings Defined */
////
////      // Demonstration Values
//////      position: "bottom",    // Appends the Calendar to this Container
//////      startOpen: true,                   // Directly opens the Calendar Popup
//////      stayOpen: true                     // Keeps the Calendar Popup Open
////      startOpen: false,                   // Directly opens the Calendar Popup
////      stayOpen: false,                     // Keeps the Calendar Popup Open
////      locale: "it",
////      dateFormat: "YYYY-mm-dd",
////      timeFormat: false,
////      closeButton: false
////  });
//  console.log(dt2);
////  dt2.value("200a-01-01");
//  dt2.conf({locale: "it"});
//  window.dt = dt2;

//  var tt = new m.ui.Time().parent(0);
//  window.tt = tt;

//  var dr = new m.ui.DateRange().parent(0);
//  window.dr = dr;

//  var ss = new m.ui.SpreadSheet().parent(0);
//  ss.conf({
//    data:[
//    ['US', 'Wholemeal', 'Yes', '2019-02-12'],
//    ['CA;US;UK', 'Breakfast Cereals', 'Yes', '2019-03-01'],
//    ['CA;BR', 'Grains', 'No', '2018-11-10'],
//    ['BR', 'Pasta', 'Yes', '2019-01-12']
//],
//    columns: [
//        { type:'dropdown', width:'300', title:'Product Origin', url:'/jexcel/countries', autocomplete:true, multiple:true },
//        { type:'text', width:'200', title:'Description' },
//        { type:'dropdown', width:'100', title:'Stock', source:['No','Yes'] },
//        { type:'calendar', width:'100', title:'Best before' },
//    ]
//});
//  window.ss = ss;
  
//  new m.ui.ElementStoreTable().parent(0);
//  
//  new m.ui.ElementStoreTable().conf({
//    columns: ['Name', 'Position', 'Salary'],
//    data: [
//      ['Faris', 'Software Developer', '$1200'],
//      ['Manas', 'Software Engineer', '$1400']
//    ]
//  }).parent(0);
  
//  var fl1 = new m.ui.File().parent(0);

//  var fi = new m.ui.File().parent(0);
//  fi.conf(
//  {
//    allowMultiple: true
//  });
//  window.fi = fi;
  
//  var fi = new m.ui.FileAdvanced().parent(0);
//  fi.conf(
//  {
//    allowMultiple: true
//  });
//  window.fi = fi;
  
  var form_ = 
  [
//    {_class: "DateSelect", label: "label_to_translate", id: "date"},
//    // for easy sub-form configuration
//    [
//      {_class: "Input", label: "simple_input_label_to_translate", id: "simple"},
//      {_class: "Input"}
//    ],
    {
      // for deep sub-form configuration
      id: "sub-form-1",
      _class: "Form",
      conf:
      [
        {_class: "Input", label: "simple_input_21", id: "simple_21"},
//        {_class: "DateRange", label: "advanced_input_2_1", id: "advanced_2_1"},
//        {_class: "DateSelect", label: "advanced_input_2_2", id: "advanced_2_2"},
        {_class: "File", label: "advanced_input_2_3", id: "advanced_2_3"},
//        {_class: "Select", label: "advanced_input_2_4", id: "advanced_2_4"},
//        {_class: "SpreadSheet", label: "advanced_input_2_5", id: "advanced_2_5"},
//        {_class: "Table", label: "advanced_input_2_6", id: "advanced_2_6"},
//        {_class: "Time", label: "advanced_input_2_7", id: "advanced_2_7"},
//        {_class: "Input", label: "advanced_input_2_8", id: "advanced_2_8"},
//        {_class: "Input", label: "advanced_input_2_9", id: "advanced_2_9"},
//        {_class: "Input", label: "advanced_input_2_10", id: "advanced_2_10"},
//        {_class: "Input", label: "advanced_input_2_11", id: "advanced_2_11"},
//        {_class: "Input", label: "advanced_input_2_12", id: "advanced_2_12"},
//        {_class: "Input", label: "advanced_input_2_", id: "advanced_2_"},
//        {_class: "Input", label: "advanced_input_2_", id: "advanced_2_"},
        {_class: "Input", label: "simple_input_22", id: "simple_22"}
      ]
    }
  ];
  
  var form = 
  [
    {_class: "Input", label: "simple_input_21", id: "simple_21", placeholder: "hint text"},
//    {_class: "DateRange", label: "advanced_input_2_1", id: "advanced_2_1"},
    {_class: "DateSelect", label: "advanced_input_2_2", id: "advanced_2_2", value: ""},
//    {_class: "File", label: "advanced_input_2_3", id: "advanced_2_3", path: "/m/data.read/web.app.file/_test_upload", multiple: true},
    {_class: "File", label: "advanced_input_2_3", id: "advanced_2_3", path: "_test_upload", multiple: true},
    {_class: "Select", label: "advanced_input_2_4", id: "advanced_2_4", conf: {items: {key1: "val1", key2: "val2"}}},
//    {_class: "SpreadSheet", label: "advanced_input_2_5", id: "advanced_2_5"},
//    {_class: "Table", label: "advanced_input_2_6", id: "advanced_2_6"},
//    {_class: "Time", label: "advanced_input_2_7", id: "advanced_2_7"},
    {_class: "Text", label: "advanced_input_2_8", id: "advanced_2_8"},
    {_class: "Button", label: "advanced_input_2_9", id: "advanced_2_9", callback: function(){console.log("button callback click");}},
    {_class: "ProgressBar", label: "advanced_input_2_10", id: "advanced_2_10", value: 0.5},
//    {_class: "Input", label: "advanced_input_2_11", id: "advanced_2_11"},
//    {_class: "Input", label: "advanced_input_2_12", id: "advanced_2_12"},
//    {_class: "Input", label: "advanced_input_2_", id: "advanced_2_"},
//    {_class: "Input", label: "advanced_input_2_", id: "advanced_2_"},
    {_class: "Input", label: "simple_input_22", id: "simple_22"}
  ];
  
  var fo = new m.ui.Form().parent(0);
  fo.conf(form);
  window.fo = fo;

}

//------------------------------------------------------------------------------

function test_02()
{
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
  var form = 
  [
    {_class: "Input", label: "simple_input_21", id: "simple_21", placeholder: "hint text"},
    {_class: "DateSelect", label: "advanced_input_2_2", id: "advanced_2_2", value: ""},
//    {_class: "File", label: "advanced_input_2_3", id: "advanced_2_3", path: "/m/data.read/web.app.file/_test_upload", multiple: true},
    {_class: "File", label: "advanced_input_2_3", id: "advanced_2_3", path: "_test_upload", multiple: true},
    {_class: "Select", label: "advanced_input_2_4", id: "advanced_2_4", conf: {items: {key1: "val1", key2: "val2", key3: {value: "val3", _selected: true}}}},
    {_class: "Text", label: "advanced_input_2_8", id: "advanced_2_8"},
    {_class: "Button", label: "advanced_input_2_9", id: "advanced_2_9", callback: function(){console.log("button callback click");}},
    {_class: "ProgressBar", label: "advanced_input_2_10", id: "advanced_2_10", value: 0.5},
    {_class: "ProgressBar", label: "no_id", value: 0.5},
//    {_class: "Input", label: "advanced_input_2_11", id: "advanced_2_11"},
//    {_class: "Input", label: "advanced_input_2_12", id: "advanced_2_12"},
//    {_class: "Input", label: "advanced_input_2_", id: "advanced_2_"},
//    {_class: "Input", label: "advanced_input_2_", id: "advanced_2_"},
    {_class: "Input", label: "simple_input_22", id: "simple_22"}
  ];
  
  var form2 = 
  [
    {_class: "Input", label: "simple_input_31", id: "simple_31", placeholder: "added form conf"},
    {_class: "DateSelect", label: "advanced_input_3_2", id: "advanced_3_2", value: ""},
    {_class: "Input", label: "no_id"},
    {_class: "Input", label: "no_id"},
    {_class: "Input", label: "simple_input_32", id: "simple_32"}
  ];
  
  var form2 = 
  [
    {_class: "FormDynamic", label: "complex_form_3", id: "cmplx_form_3", conf: form2}
  ];
  
//  var fo = new m.ui.Form().parent(0);
  var fo = new m.ui.FormDynamic().parent(0);
  fo.conf(form);
  fo.conf(form2);
  window.fo = fo;

}

//------------------------------------------------------------------------------

function test_03()
{
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
  var e = new m.ui.Element().id("editor_holder").parent(0);
  var s = new m.ui.Element("button").id("submit").text("Submit").parent(0);
  
  var c = {
        schema: {
          type: "object",
          title: "Car",
          properties: {
            make: {
              type: "string",
              enum: [
                "Toyota",
                "BMW",
                "Honda",
                "Ford",
                "Chevy",
                "VW"
              ]
            },
            model: {
              type: "string"
            },
            year: {
              type: "integer",
              enum: [
                1995,1996,1997,1998,1999,
                2000,2001,2002,2003,2004,
                2005,2006,2007,2008,2009,
                2010,2011,2012,2013,2014
              ],
              default: 2008
            },
            safety: {
              type: "integer",
              format: "rating",
              maximum: "5",
              exclusiveMaximum: false,
              readonly: false
            }
          }
        }
      };
  
//  var editor = new JSONEditor(document.getElementById('editor_holder'),c);
  var editor = new m.ui.JSONFormEditor().merge(false).conf(c).parent(0);
//  var editor = new m.ui.JSONFormEditor();
//  editor.conf(c);
window.e = editor;
      // Hook up the submit button to log to the console
      document.getElementById('submit').addEventListener('click',function() {
        // Get the value from the editor
        console.log(editor.getValue());
      });
}

//------------------------------------------------------------------------------

function test_04()
{
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
  var form = 
  [
    {_class: "Input", label: "simple_input_21", id: "simple_21", placeholder: "hint text"},
    {_class: "DateSelect", label: "advanced_input_2_2", id: "advanced_2_2", value: ""},
    {_class: "Select", label: "advanced_input_2_4", id: "advanced_2_4", conf: {items: {key1: "val1", key2: "val2", key3: {value: "val3", _selected: true}}}},
    {_class: "Text", label: "advanced_input_2_8", id: "advanced_2_8"},
    {_class: "ProgressBar", label: "advanced_input_2_10", id: "advanced_2_10", value: 0.69},
    {_class: "Button", label: "MyButton", id: "button_2_9", icon: "icon-ok", callback: function(){console.log("button callback click");}},
    {_class: "File", label: "file_00", id: "advanced_2_3", path: "_test_upload", multiple: true},
    {_class: "Input", label: "simple_input_22", id: "simple_22"}
  ];
  
  var form2 = 
  [
    {_class: "File", label: "file_dy", id: "file_dy_id", path: "_test_upload_dynamic", multiple: true},
    {_class: "Input", label: "dyfo_simple_input", id: "dyfo_simple"}
  ];
  
  var form2 = 
  [
    {_class: "FormDynamic", label: "complex_form_3", sublabel: "complex_form_3_sublabel", id: "cmplx_form_3", conf: form2}
  ];
  
  var fo = new m.ui.Form().parent(0);
//  var fo = new m.ui.FormBuilder().parent(0);
//  var fo = new m.ui.FormDynamic().parent(0);
  fo.conf(form);
  fo.conf(form2);
  window.fo = fo;
}

//------------------------------------------------------------------------------

function test_05()
{
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
  var conf = 
  [
    {_class: "Input", label: "simple_input_21", id: "simple_21", placeholder: "hint text"},
    {_class: "DateSelect", label: "advanced_input_2_2", id: "advanced_2_2", value: ""},
    {_class: "Select", label: "advanced_input_2_4", id: "advanced_2_4", conf: {items: {key1: "val1", key2: "val2", key3: {value: "val3", _selected: true}}}},
    {_class: "Text", label: "advanced_input_2_8", id: "advanced_2_8"},
    {_class: "ProgressBar", label: "advanced_input_2_10", id: "advanced_2_10", value: 0.69},
    {_class: "Button", label: "MyButton", id: "button_2_9", icon: "icon-ok", callback: function(){console.log("button callback click");}},
    {_class: "File", label: "file_00", id: "advanced_2_3", path: "_test_upload", multiple: true},
    {_class: "Input", label: "simple_input_22", id: "simple_22"}
  ];
  
  var tr = new m.ui.Tree().parent(0);
  tr.conf(conf);
  window.tr = tr;
}

//------------------------------------------------------------------------------

function test_lib_dynamic_load(path, file)
{
  var source_dir = m.root;
  if(typeof path === "string")
  {
    source_dir = path;
  }
  source_dir += "/";
  
  var modulesFile = "modules_js.json";
  if(typeof file === "string")
  {
    modulesFile = file;
  }
  
  var queue = new m.mod.Queue();
  var data = new m.srv.Data();
  
  var error = function()
  {
    console.error("ERROR");
  //  m.global.log.fatal("Errore iniziale!");
  }
  
  var modules;
  data.parse("json").url(source_dir + modulesFile).success(queue.add(function(data){modules = data;})).error(error).read();
  
  data.parse("");
  
  var code = "";
  var getModulesCode = function(modules)
  {
    if(modules.modules)
    {
      if(modules.name && typeof modules.name === "string" && modules.name !== "")
      {
        queue.add(function()
        {
          var code_ns_start = "";
          code_ns_start += "\nvar " + modules.name + " = " + modules.name + "  || {};\n";
          code_ns_start += "\nthis." + modules.name + " = " + modules.name + ";\n";
          code_ns_start += "\n" + modules.name + " = (function ()\n{\n";
          code_ns_start += "\nfor(var $_sub_module_iterator in " + modules.name + "){eval(\"var \" + $_sub_module_iterator + \" = " + modules.name + "[$_sub_module_iterator];\");}\n";
          code += code_ns_start;
        })();
      }
      
      var ma = modules.modules;
      for(var i = 0; i < ma.length; i++)
      {
        getModulesCode(ma[i]);
      }
      
      if(modules.name && typeof modules.name === "string" && modules.name !== "")
      {
        queue.add(function()
        {
          var code_ns_end = "";
          code_ns_end += "\nreturn this;\n";
          code_ns_end += "\n}.call(" + modules.name + "));\n";
          code += code_ns_end;
        })();
      }
      
      if(!modules.name)
      {
        queue.add(function()
        {
          eval(code);
        })();
      }
    }
    else if(modules.file)
    {
      data.url(source_dir + modules.file).success(queue.add(function(data)
      {
        code += data;
        if(modules.symbols && typeof modules.symbols === "string" && modules.symbols !== "")
        {
          var symbolsArray = modules.symbols.split(",");
          for(var i = 0; i < symbolsArray.length; i++)
          {
            code += "this." + symbolsArray[i] + " = " + symbolsArray[i] + ";\n";
          }
        }
      })).error(error).read();
    }
  };
  
  queue.add(function(){getModulesCode(modules);})();
//  queue.add(function(){console.log(code);})();
//  queue.add(function(){eval(code);})();
}

//------------------------------------------------------------------------------

function test_traverse()
{
  console.log("test_traverse - init");
  
  var json = 
  {
    one: "@ref:test",
    two: "@ref:test2",
    "z1§§§___": "@ref:.three",
    "@call:JSON.parse:p": ["\"test_json_string\""],
    "@new:Date:date1": ["2000-01-01"],
    three: 
    {
      one1: "@ref:.one", one2: "@ref:[0].one", d1: "@ref:.date1", d2: "@ref:.date2", 
      o: {one3: "@ref:[0].one", one4: "@ref:[1].one1", one5: "@ref:[0].one4", t3: "@ref:.three.o.one4"}
    },
    z2: "@ref:.three",
    "@new:Date:date2": [],
    "@new:Date:date3": null
  };
  
  var t = m.json.traverse(json, function(o, path, pathArray, parents)
  {
    console.log(o, path, pathArray, parents);
//    console.log(path, pathArray);
    return "calculated: " + path;
  });
  
  console.log("test_traverse - result", t);
}

//------------------------------------------------------------------------------

function test_resolve()
{
  console.log("test_resolve - init");
  
//  console.log("canonicalize", canonicalize(".asd[0].qwe.zxc[1][\"test\"].q[\"---\\\"]---\\\\\"]___\"][\"end\"]")); return;
  
  var refs = {};
  
  // json is string
//  var json = null;
//  var json = true;
//  var json = new Date();
//  var json = "test";
//  window.test = "test_reference_ok_global"; var test = "test_reference_ok_local"; var json = "@ref:test";
//  window.test = "test_reference_ok_global"; var refs = {test: "test_reference_ok_refs"}; var json = "@ref:test";
//  window.test = "test_reference_ok_global"; var refs = ["first", "test_reference_ok_refs"]; var json = "@ref:1"; // refs can't be array
  
//  var refs = 
//  {
//    
//  };
  
//  var refs = 
//  [
//    
//  ];
  
  // json is object
//  var refs = {test: "test_reference_ok_refs"};
//  var json = 
//  {
//    one: "@ref:test",
//    two: "@ref:test2",
//    "@call:JSON.parse:p": ["\"test_json_string\""],
//    "@new:Date:date1": ["2000-01-01"],
//    "@new:Date:date2": [],
//    "@new:Date:date3": null
//  };
  
  window.test = "test_reference_ok_global";
  window.c3_value = "c3_value_global";
  var refs = {test: "test_reference_ok_refs"};
//  var json = 
//  {
//    one: "@ref:test",
//    two: "@ref:test2",
//    c0: "@ref:^.c1",
//    c1: "@ref:$[\"c2\"]",
//    c2: "@ref:$.c3",
//    c3: "c3_value",
////    cr0: "@ref:$.cr1",
////    cr1: "@ref:$.cr0",
////    cr2: "@ref:$.cr2",
//    z1: "@ref:$.three",
//    "@call:JSON.parse:p": ["{\"test\": \"test_json_string\"}"],
//    "@call:String.prototype.concat:concat": ["aaa", "@ref:$.one", "@ref:$.three.o.t3"],
//    "@new:Date:date1": ["2000-01-01", {}],
//    "@eval:date_evaluated": "new Date(\"2000-01-01\")",
//    "@eval:evaluated": "test + \"_evaluated\"",
////    "@eval:evaluated2": "test2 + \"_evaluated\"",
//    "@eval:evaluated_depend": "@ref:$.c1",
//    three: 
//    {
//      "@eval:inner_evaluated_depend": "@ref:$.c1",
//      one1: "@ref:$.z3", one2: "@ref:^.one", d1: "@ref:$.date1", d2: "@ref:$.date2", 
//      o: {one3: "@ref:^.one", one4: "@ref:^^.one1", one5: "@ref:^.one4", t3: "@ref:$.concat2", t4: "@ref:$.three.o.one4"}
//    },
//    z2: "@ref:$.three",
//    z3: "@ref:$.one",
//    "@call:String.prototype.concat:concat2": ["aaa", "@ref:$.one", "bbb"],
//    "@new:Date:date2": [],
//    "@new:Date:date3": null
//  };
  
//  var json = 
//  {
//    one: "@ref:test",
//    two: "@ref:test2",
//    c0: "@ref:^.c1",
//    c1: "@ref:$[\"c2\"]",
//    c2: "@ref:$.c3",
//    c3: "c3_value",
////    cr0: "@ref:$.cr1",
////    cr1: "@ref:$.cr0",
////    cr2: "@ref:$.cr2",
//    z1: "@ref:$.three",
//    "p": ["@call", "JSON.parse", "{\"test\": \"test_json_string\"}"],
////    "concat": ["@call", "String.prototype.concat", "aaa", "@ref:$.one", "@ref:$.three.o.t3"],
//    "concat": ["@call", "String.prototype.concat", ["aaa", "@ref:$.one", "@ref:$.three.o.t3"]],
//    "date1": ["@new", "Date", "2000-01-01", {}],
//    "date_evaluated": "@eval:new Date(\"2000-01-01\")",
//    "evaluated": "@eval:test + \"_evaluated\"",
////    "evaluated2": "@eval:test2 + \"_evaluated\"",
//    "evaluated_depend": "@eval:$.c1",
//    three: 
//    {
//      "inner_evaluated_depend": "@eval:$.c1",
//      one1: "@ref:$.z3", one2: "@ref:^.one", d1: "@ref:$.date1", d2: "@ref:$.date2", 
//      o: {one3: "@ref:^.one", one4: "@ref:^^.one1", one5: "@ref:^.one4", t3: "@ref:$.concat2", t4: "@ref:$.three.o.one4"}
//    },
//    four: ["@call", "String.prototype.concat", "-1-", "-2-", "-3-"],
//    five: ["@new", "Array", "-1-", "-2-", "-3-"],
////    six: ["@new", "Array", "-1-", "@eval:5 + 7", "-3-"],
//    six: ["@new", "Array", ["-1-", "@eval:5 + 7", "-3-"]],
//    z2: "@ref:$.three",
//    z3: "@ref:$.one",
//    "concat2": ["@call", "String.prototype.concat", "aaa", "@ref:$.one", "bbb"],
//    "date2": ["@new", "Date"],
//    "date3": ["@new", "Date", null]
//  };
  
  var json = 
  {
    one: "@ref:test",
    two: "@ref:test2",
    c0: "@ref:^.c1",
    c1: "@ref:$[\"c2\"]",
    c2: "@ref:$.c3",
    c3: "c3_value",
//    cr0: "@ref:$.cr1",
//    cr1: "@ref:$.cr0",
//    cr2: "@ref:$.cr2",
    z1: "@ref:$.three",
    "p": ["@call", "JSON.parse", ["{\"test\": \"test_json_string\"}"]],
    "concat": ["@call", "String.prototype.concat", ["aaa", "@ref:$.one", "@ref:$.three.o.t3"]],
    "date1": ["@new", "Date", ["2000-01-01", {}]],
    "date_evaluated": "@eval:new Date(\"2000-01-01\")",
    "evaluated": "@eval:test + \"_evaluated\"",
//    "evaluated2": "@eval:test2 + \"_evaluated\"",
    "evaluated_depend": "@eval:$.c1",
    three: 
    {
      "inner_evaluated_depend": "@eval:$.c1",
      one1: "@ref:$.z3", one2: "@ref:^.one", d1: "@ref:$.date1", d2: "@ref:$.date2", 
      o: {one3: "@ref:^.one", one4: "@ref:^^.one1", one5: "@ref:^.one4", t3: "@ref:$.concat2", t4: "@ref:$.three.o.one4"}
    },
    four: ["@call", "String.prototype.concat", ["-1-", "-2-", "-3-"]],
    five: ["@new", "Array", ["-1-", "-2-", "-3-"]],
    six: ["@new", "Array", ["-1-", "@eval:5 + 7", "-3-"]],
    z2: "@ref:$.three",
    z3: "@ref:$.one",
    "concat2": ["@call", "String.prototype.concat", ["aaa", "@ref:$.one", "bbb"]],
    "date2": ["@new", "Date", []],
//    "date3": ["@new", "Date", null]
    "date3": ["@new", "Date", []]
  };
  
  // json is array
//  var json = 
//  [
//    
//  ];
  
  var r = m.json.resolve(json, refs);
  
  console.log("test_resolve - json", json);
  console.log("test_resolve - result", r);
}

//------------------------------------------------------------------------------

function test_map()
{
//  m.mod.loadLibraryDynamically(m.root, "modules_js_ui.json");
////  m.mod.loadLibraryDynamically.call(window, null, "modules_js_ui.json");
//  m.mod.loadCSSDynamically(m.root, "modules_css.json");
  console.log("m.root", m.root, document.readyState, app.conf.data());
//  m.mod.loadLibraryDynamically(m.root, "modules_js_ui.json", "modules_css.json", null, "/m/app/pub/lib/m/js.css");
//  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, "/m/app/pub/lib/m/js.css");
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
  var labels = {};
  
  labels.filters_catalog = "Catalogo";
  labels.filters_visible = "Visibili";
  labels.filters_query = "Interrogati";
  labels.filters_zindex = "Ordine";
  labels.reset = "Reset";
  
  labels.controls_query = "Interroga";
  labels.controls_zindex = "Ordine";
  labels.controls_visibility = "Opacità";
  
  labels.info_search = "Cerca";
  labels.info_result = "Risultati";
  labels.info_info = "Dettagli";
  
  labels.result_zoom = "Zoom";
  labels.result_closeup = "Ravvicinato";
  labels.result_deselect = "Deseleziona";
  
  app.ui.map = new m.ui.Map(labels).id("map_module").parent(0);
  
//  app.ui.map.rebuild();
  
  // if not conf.map from specific profile-conf, then load map/default.json as map-conf
  // map-conf has openlayers conf as map, view, bounds, etc. + Map specific conf as layer-catalog and specific ui conf
  // layers/sources are loaded as find based on profile authz
  // available layers are matched against layer-catalog wich is thus pruned against profile authz
  // app/profile-conf with map-conf inside, default map-conf if not profile dependent, layers-confs
  
  var mapConf = app.conf.get("map");
  console.log("app.root", app.root, "app.context", app.context, "mapConf", mapConf);
  if(mapConf)
  {
console.log("master conf-map", mapConf);
    init_map(mapConf);
  }
  else
  {
    app.conf
    .path(app.context + "/conf/map/default.json")
    .success(init_map)
    .error(error)
    .read()
    ;
  }
}

function init_map(map)
{
  console.log("init-main-map", this, map);
  
  if(map) app.ui.map.references(map.references);
  app.ui.map.conf(map);
  
  app.layerPath = app.context + "/conf/map/layers";
  
  app
  .success(init_layers)
  .error(error)
  .params({regex: ".*.json"})
  .info(app.layerPath)
  ;
}

function init_layers(layers)
{
  console.log("init-main-map-layers", this, layers);
  
  var groupConfName = "/_group";
  var i1 = app.layerPath.length;
  var i2 = ".json".length;
  var catalog = {};
  for(var k in layers)
  {
    var key = k.substring(i1, k.length - i2);
    if(key.endsWith(groupConfName)) catalog[key.substring(0, key.length - groupConfName.length)] = layers[k];
    else catalog[key] = layers[k];
  }
  console.log("init-main-map-layers - catalog", layers, catalog);
  
  var references = app.ui.map.references() || {};
  references.layers = catalog;
  app.ui.map.references(references);
  console.log("init-main-map-layers", app.ui.map.references());
  
  // layers from info are references, catalog is tree of layer-groups that hold layers from references
  // one layer can be referenced multiple times (decide if use a group container to handle independent visibility/opacity)
  // catalog tree is independent from layer folder structure
  // menu can have filter buttons to switch from all catalog, only visible and only queried (of course they are different guis filter is fiction)
  // how to handle z-index? defaults can create a z-index structure completely different from catalog structure...
  // maybe a z-index filter where layers are outside groups and de/increment are handled cleverly (not very easy but maybe the only solution)
  
  app.ui.map.conf({catalog: catalog});
}

//------------------------------------------------------------------------------

function test_authz_man()
{
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
//  var form = 
//  [
//    {_class: "Select", label: "Utenti", id: "users", conf: {items: {key1: "val1", key2: "val2", key3: {value: "val3", _selected: true}}}}
//  ];
//  
//  var fo = new m.ui.Form().parent(0);
//  
//  fo.conf(form);
//  
////  fo.elems.users.conf({items: {key1: "val1", key4: "val4"}});
//  fo.elems.users.map({key1: "val1", key2: "val2"});
//  m.Class.listener(fo.elems.users, "value", function(value, prev)
//  {
//    console.log(value, prev, this);
//  });
//  
//  window.fo = fo;
  
  var authz = new m.srv.Authorization();
  
  var usersSelect = new m.ui.Select().label("Utenti").id("users").parent(0);
  
  m.Class.listener(usersSelect, "value", function(value, prev)
  {
    authz
    .success(function(data)
    {
      console.log(data);
      rolesSelect.value(data);
    })
    .error(error)
    .getIDRoles(value);
  });
  
  authz
  .success(function(data)
  {
    console.log(data);
    var map = {};
    for(var i = 0; i < data.length; i++)
    {
      map[data[i]] = data[i];
    }
    console.log(map);
    usersSelect.map(map);
  })
  .error(error)
  .ids();
  
  var rolesSelect = new m.ui.Select().label("Ruoli").id("roles").conf({multiple: true, startOpen: true, stayOpen: true}).parent(0);
  
  m.Class.listener(rolesSelect, "value", function(value, prev)
  {
    console.log(value, prev, this);
  });
  
  authz
  .success(function(data)
  {
    console.log(data);
    var map = {};
    for(var i = 0; i < data.length; i++)
    {
      map[data[i]] = data[i];
    }
    console.log(map);
    rolesSelect.map(map);
  })
  .error(error)
  .roles();
  
  var saveButton = new m.ui.Button().label("Salva").id("save").parent(0);
  saveButton.callback(function()
  {
    console.log("click save");
//    authz
    new m.srv.Authorization()
    .success(function(data)
    {
      console.log(data);
    })
    .error(error)
    .setIDRoles(usersSelect.value(), rolesSelect.value());
  });
  
  window.s = rolesSelect;
}

//------------------------------------------------------------------------------

function error()
{
  console.error("test - error", this, arguments);
}

//------------------------------------------------------------------------------
