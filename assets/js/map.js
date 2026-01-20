var map = L.map("map");

L.MakiMarkers.accessToken = 'pk.eyJ1Ijoib3BpZXRlcnMiLCJhIjoiY2lxOXAxazFjMDA1bmkzbnNkOXE4MTNoeSJ9.pGr88-Eqx9TOU89v5s7maw';

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}{r}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'opieters.0j6gge8o',
    accessToken: 'pk.eyJ1Ijoib3BpZXRlcnMiLCJhIjoiY2lxOXAxazFjMDA1bmkzbnNkOXE4MTNoeSJ9.pGr88-Eqx9TOU89v5s7maw'
}).addTo(map);

map_data = JSON.parse(map_data);

var marker_list = []
var marker, pop_content;
for(i=0; i<map_data.length; i++){
  if(map_data[i].hasOwnProperty("icon")){
    var icon = L.MakiMarkers.icon({icon: map_data[i].icon, color: map_data[i].colour, size: "m"});
    marker = L.marker([map_data[i].lat, map_data[i].long], {icon: icon}).addTo(map);
  } else {
    marker = L.marker([map_data[i].lat, map_data[i].long]).addTo(map);
  }
  if(map_data[i].hasOwnProperty("thumbnail")){
    pop_content = "<a href=\"#" + map_data[i].count + "\"><img src=\"https://images.olivierpieters./public/" + picture_path + "/" + map_data[i].thumbnail + "\" alt=\""+ map_data[i].filename +"\"/></a>"
  }
  else if (map_data[i].hasOwnProperty("description") && map_data[i].hasOwnProperty("title")) {
    pop_content = "<h1>" + map_data[i].title + "</h1><p>" + map_data[i].description + "<a href='#" + map_data[i].id + "'>More</a></p>";
  } else {
    pop_content = "";
  }
  marker.bindPopup(pop_content);
  marker_list.push(marker);
}

var group = new L.featureGroup(marker_list);
map.fitBounds(group.getBounds());
