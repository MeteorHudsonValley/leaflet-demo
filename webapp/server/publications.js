// 2. Server side publications
//
Meteor.publish("markers", function(){
	return Markers.find();
})