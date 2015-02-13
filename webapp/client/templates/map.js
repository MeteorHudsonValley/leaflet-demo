
// ========================================================
// A convenience class to capture helpers that can be used
// (and invoked globally) to handle leaflet interactions
// It encloses the one (singleton) map instance 
LUtil = {

  // reference to the single 'map' object to control
  map: null,

  // location of marker images
  imagePath : 'packages/mrt_leaflet-0.6.4/images',

  // init function to be called ONCE on startup
  initLeaflet: function(){
    $(window).resize(function() {
      $('#map').css('height', window.innerHeight - 82 - 45);
    });
    $(window).resize(); // trigger resize event
    console.log("[c/t/map.js] Initializing leaflet config");
  },

  // populates and inits map view in page
  // (element=div to populate, view=latlong for center)
  initMap: function(element, view){
    L.Icon.Default.imagePath = this.imagePath;

    // sensible defaults if nothing specified
    element = element || 'map';
    view = view || {};
    view.zoom = view.zoom || 12;
    view.latlong = view.latlong || [ 40.752998, -73.977056];

    this.map = L.map(element, { 
        scrollWheelZoom : false,
        doubleClickZoom : false,
        boxZoom         : false,
        touchZoom       : false
      })
      .setView(
        view.latlong , 
        view.zoom
      );
  },

  // register event handlers
  handleEvent: function(event, callback){
    if (!event || !callback) 
      return;
    // TODO: validate event and callback
    this.map.on(event, callback);
  },

  // add marker to specified point (uses default marker image)
  addMarker: function(latlng){
    return L.marker(latlng).addTo(this.map);
  },

  // remove marker from map
  removeMarker: function(marker){
    this.map.removeLayer(marker);
  },

  // remove layer
  removeLayer: function(layer){
    this.map.removeLayer(layer);
  }
  
};


// change tile layer
LUtil.addTileLayer = function(_layer, _attribution){
  _attribution = _attribution || "";
  L.tileLayer( _layer,{ attribution: _attribution })
    .addTo(this.map);
}
// ========================================================


// 3. Template event handling can be done here
//  Meteor can capture most DOM events -- these include
//    click, dblclick, focus, blur, change
//    mousedown, mouseup, mouseenter, mouseleave, mouseout
//    keydown, keyup, keypress
//    submit, reset
//  (DOM events: http://en.wikipedia.org/wiki/DOM_events)
//
// However, the leaflet library can extract context at the 
//   click locations and surface them in its own events
//   see: http://leafletjs.com/reference.html#events
//
// To get access to those objects, we need to register handlers
// to the leaflet library's event handling framework. Do this 
// by registering functions against 
//   map.on('click', function(e){  -- e = leaflet event obj -- })
//
Template.map.events({
  'dblclick' : function(event, template){
    console.log("[c/t/map.js] Map was double-clicked", event);
  }
});

// 3. Template created function is called when template object is created
Template.map.created = function(){
  console.log("[c/t/map.js] Map template created");
};

// 3. Template rendering function is called each time template is rendered
//    to the screen as a view
Template.map.rendered = function() {
  console.log("[c/t/map.js] Map template rendered");

  // Initialize the map view
  LUtil.initMap();

  // Set preferred tile layer
  //    http://leaflet-extras.github.io/leaflet-providers/preview/
  LUtil.addTileLayer(
    'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
    '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  );
  /*
  var Stamen_Watercolor = L.tileLayer(
    'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
    //attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16
  });
  Stamen_Watercolor.addTo(map);
  */

  // Register handler functions for various events..
  LUtil.handleEvent('dblclick', function(event){
    Markers.insert({latlng: event.latlng});
  });

  // Add explicit observers to receive collection change 
  // notifications and manually update map
  Markers
    .find()
    .observe({

      added: function(document) {
        var marker = LUtil.addMarker(document.latlng);
        marker.on('click', function(event) {
            LUtil.removeMarker(marker);
            Markers.remove({_id: document._id});
          });
      },

      removed: function(oldDocument) {
        layers = LUtil.map._layers;

        var key, val;
        for (key in layers) {
          val = layers[key];
          if (val._latlng && val._latlng.lat)

          if (val._latlng) {
            if (val._latlng.lat === oldDocument.latlng.lat && 
              val._latlng.lng === oldDocument.latlng.lng) {
              LUtil.removeLayer(val);
            }
          }
        }
    }
  });
};