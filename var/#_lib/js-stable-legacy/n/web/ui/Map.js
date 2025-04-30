//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Map(properties)
{
  return Class(Map).construct(this, undefined, properties);
}

Class(Map)
.inherit(core.ElementControl)
//.implement(data.DataFilterTable)
.properties()
.property("servers")
.property("sources")
.property("sourcesOrder")
.property("view")
.property("bounds")
.property("layers")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Map.prototype.construct = function()
{
//  var obj = this;
//  window.addEventListener("resize", function(event)
//  {
////    obj.render();
//    obj.map.renderSync();
//  });
};

//------------------------------------------------------------------------------

Map.prototype.render = function()
{
//  console.log(this);
  
  this.html("");
  try
  {
  
//  this.mapID = "map_" + Date.now() + "_" + Math.random().toString().substring(2);
  this.mapID = "map_" + Math.random().toString().substring(2);
  this.mapDOM = new core.Element().id(this.mapID);
  this.mapDOM.parent(this);
//  this.mapDOM.parent(0);
//  this.mapDOM.parent(window.parent.parent.$("body")[0]);
  
  var map = new ol.Map(
  {
    target: this.mapDOM.node,
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    controls: ol.control.defaults(
    {
      zoom: false,
      attribution: false,
      rotate: false
    }),
    logo: false
  });
  
  if(typeof this.view().projection !== "string")
  {
    this.view().projection = new ol.proj.Projection(this.view().projection);
  }
  
  map.setView(new ol.View(this.view()));
  
  var sources = this.sources() || {};
  var order = this.sourcesOrder() || [];
  for(var i = 0; i < order.length; i++)
  {
    eval("var fl = " + sources[order[i]].classLayer + ";");
    eval("var fs = " + sources[order[i]].classSource + ";");
    var pl = sources[order[i]].propsLayer;
    var ps = sources[order[i]].propsSource;
    if(ps.url && this.servers() && this.servers()[ps.url])
    {
      ps.url = this.servers()[ps.url];
    }
    pl.source = new fs(ps);
    sources[order[i]].olLayer = new fl(pl);
    map.addLayer(sources[order[i]].olLayer);
  }
  
  if(typeof this.bounds() === "undefined")
  {
    if(map.getView().getProjection().getCode() === "EPSG:3857")
    {
      this.bounds(new ol.proj.transformExtent([12.234432329644731,41.68015413832895,12.807484967014998,42.099983420974276], "EPSG:4326", map.getView().getProjection().getCode()));
    }
    else
    {
      this.bounds([2285062.148,4607826.713,2353196.540,4675961.426]);
    }
  }
  
  if(isNaN(map.getSize()[0]) || isNaN(map.getSize()[1]))
  {
    map.setSize([1920, 1080]);
  }
  
  map.getView().fit(this.bounds(), map.getSize());
  
//  map.addControl(new ol.control.FullScreen(
//  {
////    target: this.mapDOM.node,
////    source: this.mapDOM.node,
////    label: new core.Element().html("FS").node,
////    labelActive: new core.Element().html("NS").node,
//    tipLabel: "Schermo intero"
//  }));
  
  map.addControl(new ol.control.MousePosition(
  {
//    target: this.mapDOM.node,
//    coordinateFormat: null,
//    projection: null,
    undefinedHTML: ""
  }));
  
  map.addControl(new ol.control.OverviewMap(
  {
//    target: this.mapDOM.node,
//    label: ">>",
//    collapseLabel: "<<",
    collapsed: false,
    collapsible: false
  }));
  
  map.addControl(new ol.control.Rotate(
  {
//    target: this.mapDOM.node,
    autoHide: true,
    duration: 500,
//    label: new core.Element().html("Rotate").node,
    tipLabel: "Resetta rotazione"
  }));
  
  map.addControl(new ol.control.ScaleLine(
  {
//    target: this.mapDOM.node,
    units: "metric",
    minWidth: 150
  }));
  
  map.addControl(new ol.control.Zoom(
  {
//    target: this.mapDOM.node,
//    zoomInLabel: new core.Element().html("+").node,
//    zoomOutLabel: new core.Element().html("-").node,
    zoomInTipLabel: "Aumenta zoom",
    zoomOutTipLabel: "Diminuisci zoom",
    duration: 1500,
    delta: 1
  }));
  
  map.addControl(new ol.control.ZoomSlider(
  {
//    duration: 2500
    minResolution: 0,
    maxResolution: 9000
  }));
  
  map.addControl(new ol.control.ZoomToExtent(
  {
//    target: this.mapDOM.node,
    extent: this.bounds(),
//    label: new core.Element().html("Ext").node,
    tipLabel: "Resetta zoom"
  }));
  
  var toolbarEdit = new core.Element().parent(this.mapDOM);
  toolbarEdit.classes.add("map-toolbar-edit");
  toolbarEdit.classes.add("ol-unselectable");
  toolbarEdit.classes.add("ol-control");
  toolbarEdit.html("Disegna: ");
  
  var drawInteraction;
  var drawSource = new ol.source.Vector({wrapX: false});
  var drawVector = new ol.layer.Vector(
  {
    source: drawSource,
    visible: true,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    style: new ol.style.Style(
    {
      fill: new ol.style.Fill(
      {
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke(
      {
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle(
      {
        radius: 7,
        fill: new ol.style.Fill(
        {
          color: '#ffcc33'
        })
      })
    })
  });
  map.addLayer(drawVector);
  
  var toolbarEditButtonMoveZoom = new core.Element().parent(this.mapDOM).html("Muovi / Zoom");
  toolbarEditButtonMoveZoom.classes.add("map-toolbar-edit-button");
  toolbarEditButtonMoveZoom.parent(toolbarEdit);
  toolbarEditButtonMoveZoom.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
  });
  
  var toolbarEditButtonPoint = new core.Element().parent(this.mapDOM).html("Punto");
  toolbarEditButtonPoint.classes.add("map-toolbar-edit-button");
  toolbarEditButtonPoint.parent(toolbarEdit);
  toolbarEditButtonPoint.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Draw(
    {
      source: drawSource,
      type: "Point"
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonLineString = new core.Element().parent(this.mapDOM).html("Linea");
  toolbarEditButtonLineString.classes.add("map-toolbar-edit-button");
  toolbarEditButtonLineString.parent(toolbarEdit);
  toolbarEditButtonLineString.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Draw(
    {
      source: drawSource,
      type: "LineString"
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonPolygon = new core.Element().parent(this.mapDOM).html("Poligono");
  toolbarEditButtonPolygon.classes.add("map-toolbar-edit-button");
  toolbarEditButtonPolygon.parent(toolbarEdit);
  toolbarEditButtonPolygon.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Draw(
    {
      source: drawSource,
      type: "Polygon"
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonCircle = new core.Element().parent(this.mapDOM).html("Cerchio");
  toolbarEditButtonCircle.classes.add("map-toolbar-edit-button");
  toolbarEditButtonCircle.parent(toolbarEdit);
  toolbarEditButtonCircle.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Draw(
    {
      source: drawSource,
      type: "Circle"
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonLineStringFH = new core.Element().parent(this.mapDOM).html("Linea a mano libera");
  toolbarEditButtonLineStringFH.classes.add("map-toolbar-edit-button");
  toolbarEditButtonLineStringFH.parent(toolbarEdit);
  toolbarEditButtonLineStringFH.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Draw(
    {
      source: drawSource,
      condition: ol.events.condition.singleClick,
      freehandCondition: ol.events.condition.noModifierKeys,
      type: "LineString"
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonPolygonFH = new core.Element().parent(this.mapDOM).html("Poligono a mano libera");
  toolbarEditButtonPolygonFH.classes.add("map-toolbar-edit-button");
  toolbarEditButtonPolygonFH.parent(toolbarEdit);
  toolbarEditButtonPolygonFH.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Draw(
    {
      source: drawSource,
      condition: ol.events.condition.singleClick,
      freehandCondition: ol.events.condition.noModifierKeys,
      type: "Polygon"
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonModify = new core.Element().parent(this.mapDOM).html("Modifica");
  toolbarEditButtonModify.classes.add("map-toolbar-edit-button");
  toolbarEditButtonModify.parent(toolbarEdit);
  toolbarEditButtonModify.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Modify(
    {
      features: new ol.Collection(drawSource.getFeatures())
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonSelect = new core.Element().parent(this.mapDOM).html("Seleziona");
  toolbarEditButtonSelect.classes.add("map-toolbar-edit-button");
  toolbarEditButtonSelect.parent(toolbarEdit);
  toolbarEditButtonSelect.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Select(
    {
      multi: false
    });
    map.addInteraction(drawInteraction);
  });
  
  var toolbarEditButtonSelectBox = new core.Element().parent(this.mapDOM).html("Seleziona riquadro");
  toolbarEditButtonSelectBox.classes.add("map-toolbar-edit-button");
  toolbarEditButtonSelectBox.parent(toolbarEdit);
  toolbarEditButtonSelectBox.node.addEventListener("click", function()
  {
    (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    this.className = "map-toolbar-edit-button map-toolbar-edit-button-selected";
    map.removeInteraction(drawInteraction);
    drawInteraction = new ol.interaction.Select(
    {
      condition: ol.events.condition.never,
      multi: false
    });
    var dragBoxInteraction = new ol.interaction.DragBox();
    dragBoxInteraction.on("boxstart", function(event)
    {
      var selectedFeatures = drawInteraction.getFeatures();
      selectedFeatures.clear();
    });
    dragBoxInteraction.on("boxend", function(event)
    {
      var selectedFeatures = drawInteraction.getFeatures();
      selectedFeatures.clear();
      var extent = dragBoxInteraction.getGeometry().getExtent();
      drawSource.forEachFeatureIntersectingExtent(extent, function(feature){selectedFeatures.push(feature);});
      map.removeInteraction(dragBoxInteraction);
      (toolbarEdit.node.getElementsByClassName("map-toolbar-edit-button-selected")[0] || {}).className = "map-toolbar-edit-button";
    });
    map.addInteraction(drawInteraction);
    map.addInteraction(dragBoxInteraction);
  });
  
//  var toolbarEditButtonRotate = new core.Element().parent(this.mapDOM).html("Ruota mappa");
//  toolbarEditButtonRotate.classes.add("map-toolbar-edit-button");
//  toolbarEditButtonRotate.parent(toolbarEdit);
//  toolbarEditButtonRotate.node.addEventListener("click", function()
//  {
//    map.removeInteraction(drawInteraction);
//    drawInteraction = new ol.interaction.DragRotate(
//    {
//      condition: ol.events.condition.noModifierKeys
//    });
//    map.addInteraction(drawInteraction);
//  });
  
  var toolbarEditControl = new ol.control.Control({element: toolbarEdit.node});
  map.addControl(toolbarEditControl);
  
  // build ui
  function toogleWMS(source, index)
  {
//    console.log(source, index);
//    console.log(source.olLayer.getSource().getParams());
    var params = source.olLayer.getSource().getParams();
    var layers = params.LAYERS;
    var layer = source.propsSourceValues["params.LAYERS"].values[index];
    var separator = source.propsSourceValues["params.LAYERS"].separator;
    var prefix = source.propsSourceValues["params.LAYERS"].prefix;
//    console.log(layer, separator, prefix);
    if(-1 < layers.indexOf(layer))
    {
      if(-1 < layers.indexOf(layer + separator))
      {
        layers = layers.replace(layer + separator, "");
      }
      else if(-1 < layers.indexOf(separator + layer))
      {
        layers = layers.replace(separator + layer, "");
      }
      else
      {
        layers = layers.replace(layer, "");
      }
    }
    else
    {
//      if(layers === prefix)
      if(layers === "")
      {
        layers = prefix + layer;
      }
      else
      {
        layers = layers + separator + layer;
      }
    }
    if(layers === prefix)
    {
      layers = "";
    }
    if(layers === "")
    {
      source.olLayer.setVisible(false);
    }
    else
    {
      source.olLayer.setVisible(true);
    }
    params.LAYERS = layers;
//    console.log(params);
    source.olLayer.getSource().updateParams(params);
    source.olLayer.changed();
  }
  
  function nodeCallback(parent, node, object)
  {
    if(typeof object === "undefined" || typeof object.layer === "undefined")
    {
      return;
    }
    
    var layer = object.layer;
    var source = sources[object.layer.source];
    var label = node.node;
    
    if(-1 < source.classSource.indexOf("WMS"))
    {
      // todo set click callback to de/activate wms layer
      label.addEventListener("click", function()
      {
        toogleWMS(source, layer.value);
      });
    }
    
//    console.log(layer, source);
  }
  var menu = new Tree().parent(this).label("group").children("children").callback(nodeCallback).set(this.layers()).get();
  menu.classes.add("menu");
  menu.classes.add("ol-unselectable");
  menu.classes.add("ol-control");
  var menuControl = new ol.control.Control({element: menu.node});
  map.addControl(menuControl);
  
  var mc = this.properties();
//  console.log(mc);
  //map = document.getElementsByTagName("iframe")[1].contentWindow.map
//  window.map = mc;
//  var lt = [];
//  var ltp = "";
////  var ltg = {};
//  function ta(i)
//  {
////    console.log(mc.layers[i].name);
//    map.olLayers[i].setVisible(!map.olLayers[i].getVisible());
//  }
//  for(var i = 0; i < mc.layers.length; i++)
//  {
//    if(mc.layers[i].group !== ltp)
//    {
//      ltp = mc.layers[i].group;
////      ltg = new ol.layer.Group();
//      lt.push(
//      {
//        title: mc.layers[i].group,
//        section: mc.layers[i].group,
//        action: null,
//        sectionSeparator: true
//      });
//    }
//    lt.push(
//    {
//      title: mc.layers[i].name,
//      section: mc.layers[i].group,
//      action: ta.bind(undefined, i)
//    });
//  }
//  
//  lt[0].object = map;
//  var layersMenu = new TabShared()
//  .id("layers")
//  .set(lt)
//  .vertical(true)
//  .get();
  
  this.map = map;
  this.mapDOM.parent(this);
//  console.log(map.getSize(), this.bounds());
  }
  catch(e)
  {
    console.log(e);
  }
};

//------------------------------------------------------------------------------

Map.prototype.changed = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------

Map.prototype.saved = function(data)
{
};

//------------------------------------------------------------------------------

Map.prototype.errorLoad = function(response)
{
};

//------------------------------------------------------------------------------

Map.prototype.errorSave = function(response)
{
};

//------------------------------------------------------------------------------
