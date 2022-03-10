var HEIGHT = window.innerHeight+'px';
var pos = [57.625398, 39.885228];
var scale = 13;
var locs = [
    [57.622236, 39.884839,2,"Большая Октябрьская ул., 31"],
    [57.624188, 39.8822077,4,"Собинова ул., 39"],
    [57.627292, 39.858420,7,"Толбухина ул., 40"],
    [57.639515, 39.862256,4,"Загородный сад ул., 11"],
    [57.639034, 39.821984,5,"Добрынина ул., 12А"],
    [57.649298, 39.860342,6,"Октября пр-кт, 78Б"],
    [57.645455, 39.877078,9,"улица Полушкина Роща, 1А"],
    [57.645099, 39.908914,1,"Урочская улица, 42А"],
    [57.649693, 39.944541,3,"улица Ляпидевского, 22"],
    [57.620188, 39.898177,4,"Хуторская улица, 6"],
    [57.605647, 39.862247,2,"улица Посохова, 24"],
    [57.606838, 39.835261,6,"Овинная улица, 30"],
    [57.605392, 39.821499,4,"улица 8 Марта, 15"],
    [57.600434, 39.822155,7,"улица Маланова, 29к2"],
    [57.584222, 39.838684,9,"улица Гагарина, 28"],
    [57.576776, 39.843122,4,"Московский проспект, 108"],
    [57.571376, 39.842645,6,"Дорожная улица, 6А"],
    [57.573007, 39.869146,7,"улица Доронина, 6к2"],
    [57.576274, 39.867646,8,"улица Расковой, 7"],
    [57.589138, 39.878839,3,"Суздальское шоссе, 39"],
    [57.592553, 39.885935,2,"улица Гоголя, 27"],
    [57.590112, 39.894649,1,"проспект Фрунзе, 30"],
    [57.587035, 39.906111,6,"проспект Фрунзе, 29"],
    [57.581520, 39.916649,2,"улица Лескова, 21"],
    [57.575536, 39.912939,7,"проспект Фрунзе, 56Д"],
    [57.571607, 39.931740,5,"Корабельная улица, 28А"],
    [57.562224, 39.921041,4,"Ярославская улица, 142А"],
    [57.555821, 39.937534,3,"1-я Тормозная улица, 42"],
    [57.629841, 39.939223,7,"улица Маяковского, 61"],
    [57.641939, 39.948377,8,"улица Папанина, 4"],
    [57.645132, 39.960549,9,"улица Энергетиков, 2"],
    [57.659440, 39.952563,6,"проспект Авиаторов, 159"]
];
var permissions;

var onSuccess = function(position) {
    pos = [position.coords.latitude,position.coords.longitude];
    console.log('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

setTimeout(()=>{
    permissions = cordova.plugins.permissions;
    var list = [
        permissions.ACCESS_FINE_LOCATION
    ];

    permissions.checkPermission(list, success, null);

    function error() {
        console.warn('Camera or Accounts permission is not turned on');
    }

    function success( status ) {
        if( !status.hasPermission ) {

            permissions.requestPermissions(
                list,
                function(status) {
                    if( !status.hasPermission ) error();
                },
                error);
        }
    }
},2000);

function get_location(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    map.flyTo(pos,18);
    update_markers();
}

document.getElementById("map").style.height = HEIGHT;

var map = L.map('map', {
    center: pos,
    zoom:scale,
    zoomControl: false,
    maxZoom: 18
})

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ'
}).addTo(map);
map.on('move',redraw);
map.on('scale',redraw);
var markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 80
});
update_markers();
var routing_control = L.Routing.control({
    waypoints: [
        null
    ],
    createMarker: function() { return null; },
    show: false,
    showAlternatives: false,
    addWaypoints:false,
    draggableWaypoints: false,
    lineOptions : {
        addWaypoints:false,
        draggableWaypoints: false,
    },
    router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
});
routing_control.addTo(map);

if(localStorage != undefined){
    if(localStorage.getItem('d_lat') != null){
        make_route(pos,L.latLng(localStorage.getItem('d_lat'),localStorage.getItem('d_lon')));
        localStorage.removeItem('d_lat');
        localStorage.removeItem('d_lon');
    }
}
function update_markers(){
    map.removeLayer(markers);
    markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 80
    });
    locs.forEach((el)=>{
        icon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div class=\"status-icon\">\n" +
                "        <a href=\"#\" onclick=\"get_info(["+el[0]+","+el[1]+"])\">\n" +
                "            <div class=\"status-icon-inner status-icon-" + el[2] + " d-flex justify-content-center align-items-center\">\n" +
                "                <div>\n" +
                "                    <p class=\"status-icon-text\">" + el[2] + "</p>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </a>\n" +
                "    </div>",
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        let marker = L.marker(new L.LatLng(el[0], el[1]), { icon: icon});
        // marker.bindPopup(title);
        markers.addLayer(marker);
    });
    icon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class=\"my-position d-flex justify-content-center align-items-center\">\n" +
            "            <div class=\"orange-circle\"></div>\n" +
            "        </div>",
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });

    let marker = L.marker(new L.LatLng(pos[0], pos[1]), { icon: icon});
    map.addLayer(markers);
    map.addLayer(marker);
}

update_markers();
function make_route(start, end){
    map.removeControl(routing_control);
    routing_control = L.Routing.control({
        waypoints: [
            start,
            end
        ],
        createMarker: function() { return null; },
        show: false,
        showAlternatives: false,
        addWaypoints:false,
        draggableWaypoints: false,
        lineOptions : {
            addWaypoints:false,
            draggableWaypoints: false,
        },
        router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
    });
    routing_control.addTo(map);
}
function zoomin(){
    map.zoomIn(1);
}
function zoomout(){
    map.zoomOut(1);
}

redraw()

function redraw(){



}
var index = elasticlunr(function () {
    this.use(elasticlunr.ru);
    this.addField('latitude');
    this.addField('longitude');
    this.addField('body');
    this.setRef('id');
});
locs.forEach((el,t)=>{
    index.addDoc({
        'body':el[3],
        'latitude':el[0],
        'longitude':el[1],
        'id':t
    })
})
function search(input_str){
    results = index.search(input_str);
    document.getElementById("search-results1").innerHTML = "";
    results.forEach((el)=>{
        document.getElementById('search-results1').innerHTML += "" +
            "<div><a onclick='search_clicked(["+el.doc.latitude+","+el.doc.longitude+"])'>\n" +
            "                    <div class=\"bg-white w-100 d-inline-flex p-2\">\n" +
            "                        <div class=\"time-icon me-3\"></div>\n" +
            "                        <div><h3 class=\"text-common\">"+el.doc.body+"</h3></div>\n" +
            "                    </div>\n" +
            "                </a></div>";
    });
}
function search_clicked(coords){
    map.flyTo(coords,16);
    search_history_close();
}
setInterval(()=>{
    search(document.getElementById('line-edit').value);
},1000);