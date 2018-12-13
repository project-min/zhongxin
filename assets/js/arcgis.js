function initialMap() {
  require(["esri/map",
     "esri/toolbars/draw",
     "esri/toolbars/edit",
     "esri/graphic",
     "esri/geometry/Polygon",
     "esri/layers/ArcGISTiledMapServiceLayer",
     "esri/geometry/Extent",
     "esri/geometry/Point",
     "esri/SpatialReference",
     "esri/symbols/SimpleFillSymbol",
     "esri/symbols/SimpleLineSymbol",
     "esri/Color",
     "esri/tasks/GeometryService",
     "esri/tasks/ProjectParameters",
     "dijit/registry",
     "dijit/Menu",
     "dijit/MenuItem",
     "dijit/MenuSeparator",
     "dijit/form/Button",
     "dojo/parser",
     "dojo/on",
     "dojo/dom",
     "dojo/domReady!"],
    function(
      Map,
      Draw,
      Edit,
      Graphic,
      Polygon,
      ArcGISTiledMapServiceLayer,
      Extent,
      Point,
      SpatialReference,
      SimpleFillSymbol,
      SimpleLineSymbol,
      Color,
      GeometryService,
      ProjectParameters,
      registry,                 
      Menu,
      MenuItem,
      MenuSeparator,
      Button,
      parser,
      on,
      dom) {

      parser.parse();

      arcgisSpatialReference = new SpatialReference(4326);
      var ext = {"xmin":117.67255102256046,
                 "ymin":39.06648939147723,
                 "xmax":117.91507758557971,
                 "ymax":39.2233553582866};

      arcgisGeometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

      arcgisMap = new Map("map", {
        logo:false,//右下的esri logo
        showAttribution:false,//右下的gisNeu (logo左侧)
        autoResize: true,
        extent: new Extent({xmin:ext.xmin,
                            ymin:ext.ymin,
                            xmax:ext.xmax,
                            ymax:ext.ymax})
      });

      var tiledLayer = new ArcGISTiledMapServiceLayer(
        "https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer", 
        { spatialReference: sr }
      );

      map.addLayer(tiledLayer);

      map.on("load", function() {
        createToolbarAndContextMenu();
      });          

      on(dom.byId("map-confirm"), "click", function(evt){
        transferPolygon();
      });
}
require(
        ["esri/map",
         "esri/toolbars/draw",
         "esri/toolbars/edit",
         "esri/graphic",
         "esri/geometry/Polygon",
         "esri/layers/ArcGISTiledMapServiceLayer",
         "esri/geometry/Extent",
         "esri/geometry/Point",
         "esri/SpatialReference",
         "esri/symbols/SimpleFillSymbol",
         "esri/symbols/SimpleLineSymbol",
         "esri/Color",
         "esri/tasks/GeometryService",
         "esri/tasks/ProjectParameters",
         "dijit/registry",
         "dijit/Menu",
         "dijit/MenuItem",
         "dijit/MenuSeparator",
         "dijit/form/Button",
         "dojo/parser",
         "dojo/on",
         "dojo/dom",
         "dojo/domReady!"],
        function(
          Map,
          Draw,
          Edit,
          Graphic,
          Polygon,
          ArcGISTiledMapServiceLayer,
          Extent,
          Point,
          SpatialReference,
          SimpleFillSymbol,
          SimpleLineSymbol,
          Color,
          GeometryService,
          ProjectParameters,
          registry,                 
          Menu,
          MenuItem,
          MenuSeparator,
          Button,
          parser,
          on,
          dom) {
            
          parser.parse();
            
          var sr = new SpatialReference(4326);
          var ext = {"xmin":117.67255102256046,
                     "ymin":39.06648939147723,
                     "xmax":117.91507758557971,
                     "ymax":39.2233553582866};
        
          var geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

          var map = new Map("map", {
		    logo:false,//右下的esri logo
		    showAttribution:false,//右下的gisNeu (logo左侧)
            autoResize: true,
            extent: new Extent({xmin:ext.xmin,
                                ymin:ext.ymin,
                                xmax:ext.xmax,
                                ymax:ext.ymax})
          });

          var tiledLayer = new ArcGISTiledMapServiceLayer(
            "https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer", 
            { spatialReference: sr }
          );
        
          map.addLayer(tiledLayer);

          map.on("load", function() {
            createToolbarAndContextMenu();
          });          

          on(dom.byId("map-confirm"), "click", function(evt){
            transferPolygon();
          });
        
          function transferPolygon() {
            var convertPolygons = [];
            polygons = [];
            
            var length = map.graphics.graphics.length;

            for (var i = 0; i < length; i++) {
              var py = new Polygon(new SpatialReference(map.graphics.graphics[i].geometry.spatialReference.wkid));
              py.rings = map.graphics.graphics[i].geometry.rings;
              py.type = map.graphics.graphics[i].geometry.type;
              if (py.type.toLowerCase() == "polygon") {
                convertPolygons.push(py);
              }
            }
            if (convertPolygons.length > 0) {
              var project = geometryService.project(convertPolygons, sr, function(result) {
                for(var i = 0; i < result.length; i++) {
                  var points = []
                  for (var j = 0; j < result[i].rings[0].length; j++) {
                    var pt = new Object;
                    
                    pt.lng = result[i].rings[0][j][0];
                    pt.lat = result[i].rings[0][j][1];
                    points.push(pt);
                  }
                  var pg = new Object;
                  pg.polygon = points;
                  polygons.push(pg);
                }
                //console.log(polygons);
                alert("选择区域已确认");
              });
            }
            else {
              alert("选择区域为空");
            }
            //console.log(polygons);
          }

          function addToMap(evt) {
            var symbol;
            toolbar.deactivate();
            map.showZoomSlider();
            //symbol = new SimpleFillSymbol();
            symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, 
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([98,194,204]), 2), new Color([98,194,204,0.5])
            );
            var graphic = new Graphic(evt.geometry, symbol);

            map.graphics.add(graphic);
          }
        
          function createToolbarAndContextMenu() {
            toolbar = new Draw(map);
            toolbar.on("draw-end", addToMap);
            
            // Create and setup editing tools
            editToolbar = new Edit(map);

            map.on("click", function(evt) {
              editToolbar.deactivate();
            });

            createMapMenu();
            createGraphicsMenu();
          }

          function createMapMenu() {
            // Creates right-click context menu for map
            var ctxMenuForMap = new Menu({
              onOpen: function(box) {
                // Lets calculate the map coordinates where user right clicked.
                // We'll use this to create the graphic when the user clicks
                // on the menu item to "Add Point"
                currentLocation = getMapPointFromMenuPosition(box);          
                editToolbar.deactivate();
              }
            });

            ctxMenuForMap.addChild(new MenuItem({ 
              label: "新区域",
              onClick: function() {
                toolbar.activate(Draw["POLYGON"]);
                map.hideZoomSlider();
              }
            }));

            ctxMenuForMap.startup();
            ctxMenuForMap.bindDomNode(map.container);
          }

          function createGraphicsMenu() {
            // Creates right-click context menu for GRAPHICS
            var ctxMenuForGraphics = new Menu({});
            ctxMenuForGraphics.addChild(new MenuItem({ 
              label: "编辑",
              onClick: function() {
                if ( selected.geometry.type !== "point" ) {
                  editToolbar.activate(Edit.EDIT_VERTICES, selected);
                } else {
                  alert("Not implemented");
                }
              } 
            }));

            ctxMenuForGraphics.addChild(new MenuItem({ 
              label: "移动",
              onClick: function() {
                editToolbar.activate(Edit.MOVE, selected);
              } 
            }));
          
            ctxMenuForGraphics.addChild(new MenuSeparator());
            ctxMenuForGraphics.addChild(new MenuItem({ 
              label: "删除",
              onClick: function() {
                map.graphics.remove(selected);
              }
            }));

            ctxMenuForGraphics.startup();

            map.graphics.on("mouse-over", function(evt) {
              // We'll use this "selected" graphic to enable editing tools
              // on this graphic when the user click on one of the tools
              // listed in the menu.
              selected = evt.graphic;

              // Let's bind to the graphic underneath the mouse cursor           
              ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
            });

            map.graphics.on("mouse-out", function(evt) {
              ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
            });
          }

          function getMapPointFromMenuPosition(box) {
            var x = box.x, y = box.y;
            switch( box.corner ) {
              case "TR":
                x += box.w;
                break;
              case "BL":
                y += box.h;
                break;
              case "BR":
                x += box.w;
                y += box.h;
                break;
            }

            var screenPoint = new Point(x - map.position.x, y - map.position.y);
            return map.toMap(screenPoint);
          }
        }
      );