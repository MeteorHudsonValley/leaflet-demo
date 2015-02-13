// 1. Add client initialization code here
//    including global collection subscriptions

// Intialize leaflet map
// Meteor.startup is similar to $( function(){} ) in jquery
// It is used to scope code that is run once on startup
Meteor.startup(function(){
	LUtil.initLeaflet();
});