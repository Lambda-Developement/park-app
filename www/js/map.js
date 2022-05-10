var HEIGHT = window.innerHeight + 'px';
var pos = [57.625398, 39.885228];
var scale = 13;
var locs = [];

var permissions;


// Получение информации о парковках
document.addEventListener('deviceready', () => {
    cordovaHTTP.post("https://park.backend.xredday.ru/",
        {
            'request':
            {
                "action": "getdata",
            }
        },
        {},
        function (response) {
            console.log(response.status);
            try {
                locs = JSON.parse(response.data);
                locs.forEach((el, t) => {
                    index.addDoc({
                        'body': el[3],
                        'latitude': el[0],
                        'longitude': el[1],
                        'id': t
                    })
                })
                if (localStorage != undefined) {
                    if (localStorage.getItem('prev_place') != null && localStorage.getItem('prev_place') !='undefined') {
                        idx = localStorage.getItem('prev_place');
                        map.flyTo([locs[idx][0], locs[idx][1]], 18);
                        get_info(parseInt(idx));
                    }
                    if(localStorage.getItem('d_lat') != null){
                        lat = localStorage.getItem('d_lat');
                        lon = localStorage.getItem('d_lon');
                        localStorage.removeItem('d_lat');
                        localStorage.removeItem('d_lon');
                        // map.flyTo([lat, lon], 18);
                        make_route(pos,[lat,lon]);
                    }
                    if(localStorage.getItem('make_route') != null){
                        p_id = localStorage.getItem('make_route');
                        make_route(pos,[locs[p_id][0],locs[p_id][1]]);
                        localStorage.removeItem('make_route');
                    }
                }
                update_markers();
            } catch (e) {
                console.error("JSON parsing error");
            }
        },
        function (response) {
            console.log(response.status);
            console.log(response.data);
        }
    );
});

var onSuccess = function (position) {
    pos = [position.coords.latitude, position.coords.longitude];
    console.log('Latitude: ' + position.coords.latitude + '\n' +
        'Longitude: ' + position.coords.longitude + '\n' +
        'Altitude: ' + position.coords.altitude + '\n' +
        'Accuracy: ' + position.coords.accuracy + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
        'Heading: ' + position.coords.heading + '\n' +
        'Speed: ' + position.coords.speed + '\n' +
        'Timestamp: ' + position.timestamp + '\n');
};

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Запрос разрешений
setTimeout(() => {
    permissions = cordova.plugins.permissions;
    var list = [
        permissions.ACCESS_FINE_LOCATION
    ];

    permissions.checkPermission(list, success, null);

    function error() {
        console.warn('Camera or Accounts permission is not turned on');
        document.location.href = "../../screens/AccessError/accessError.html";
    }

    function success(status) {
        if (!status.hasPermission) {

            permissions.requestPermissions(
                list,
                function (status) {
                    if (!status.hasPermission) error();
                },
                error);
        }
    }
}, 2000);

// Получение текущего местоположения
function get_location() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    map.flyTo(pos, 18);
    update_markers();
}

document.getElementById("map").style.height = HEIGHT;

// Настройка карты
var map = L.map('map', {
    center: pos,
    zoom: scale,
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
map.on('move', redraw);
map.on('scale', redraw);
var markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 80
});
var pos_marker = L.marker(new L.LatLng(pos[0], pos[1]),);
var routing_control = L.Routing.control({
    waypoints: [
        null
    ],
    createMarker: function () { return null; },
    show: false,
    showAlternatives: false,
    addWaypoints: false,
    draggableWaypoints: false,
    lineOptions: {
        addWaypoints: false,
        draggableWaypoints: false,
    },
    router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
});
routing_control.addTo(map);

// Обновление маркеров
function update_markers() {
    map.removeLayer(markers);
    markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 80
    });
    let idx = 0;
    locs.forEach((el) => {
        icon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div class=\"status-icon\">\n" +
                "        <a href=\"#\" onclick=\"get_info(" + idx + ")\">\n" +
                "            <div class=\"status-icon-inner status-icon-" + el[2] + " d-flex justify-content-center align-items-center "+(localStorage.getItem('park_choose')==idx ?'glow':'')+"\">\n" +
                "                <div>\n" +
                "                    <p class=\"status-icon-text\">" + el[2] + "</p>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </a>\n" +
                "    </div>",
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        let marker = L.marker(new L.LatLng(el[0], el[1]), { icon: icon });
        // marker.bindPopup(title);
        markers.addLayer(marker);
        idx++;
    });
    icon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class=\"my-position d-flex justify-content-center align-items-center\">\n" +
            "            <div class=\"orange-circle\"></div>\n" +
            "        </div>",
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });
    if (map.hasLayer(pos_marker)) {
        map.removeLayer(pos_marker);
    }
    pos_marker = L.marker(new L.LatLng(pos[0], pos[1]), { icon: icon });
    map.addLayer(markers);
    map.addLayer(pos_marker);
}

update_markers();

// Построение маршрута
function make_route(start, end) {
    map.removeControl(routing_control);
    routing_control = L.Routing.control({
        waypoints: [
            start,
            end
        ],
        createMarker: function () { return null; },
        show: false,
        showAlternatives: false,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: {
            addWaypoints: false,
            draggableWaypoints: false,
        },
        router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
    });
    routing_control.addTo(map);
}

// Приближение карты
function zoomin() {
    map.zoomIn(1);
}

// Отдаление карты
function zoomout() {
    map.zoomOut(1);
}

redraw()

function redraw() {



}
var index = elasticlunr(function () {
    this.use(elasticlunr.ru);
    this.addField('latitude');
    this.addField('longitude');
    this.addField('body');
    this.setRef('id');
});

// Поиск парковок
function search(input_str) {
    results = index.search(input_str);
    document.getElementById("search-results1").innerHTML = "";
    if (results.length == 0){
        let hs = localStorage.getItem('history');
        if (hs != null && hs != 'undefined'){
            try {
                hs = JSON.parse(hs);
                hs = hs.reverse();
                hs.forEach( idx => {
                    document.getElementById('search-results1').innerHTML += "" +
                        "<div><a onclick='search_clicked([" + locs[idx][0] + "," + locs[idx][1] + "]," + idx +")'>\n" +
                        "                    <div class=\"bg-white w-100 d-inline-flex p-2\">\n" +
                        "                        <div class=\"time-icon me-3\"></div>\n" +
                        "                        <div><h3 class=\"text-common\">" + locs[idx][3] + "</h3></div>\n" +
                        "                    </div>\n" +
                        "                </a></div>";
                })
            }catch (e){
                console.log(e);
            }
        }
    }
    results.forEach((el) => {
        document.getElementById('search-results1').innerHTML += "" +
            "<div><a onclick='search_clicked([" + el.doc.latitude + "," + el.doc.longitude +"],"+el.doc.id+")'>\n" +
            "                    <div class=\"bg-white w-100 d-inline-flex p-2\">\n" +
            "                        <div class=\"time-icon-empty me-3\"></div>\n" +
            "                        <div><h3 class=\"text-common\">" + el.doc.body + "</h3></div>\n" +
            "                    </div>\n" +
            "                </a></div>";
    });
}

// Обработчик нажатия на строчку поиска
function search_clicked(coords,id) {
    map.flyTo(coords, 16);
    let hs = localStorage.getItem('history');
    if (hs != null && hs != 'undefined'){
        try {
            hs = JSON.parse(hs);
            hs.push(id);
            hs = JSON.stringify(hs);
            localStorage.setItem('history',hs);
        }catch(e){
            console.log(e);
        }
    }
    if(hs == null){
        localStorage.setItem('history',`[${id}]`);
    }
    search_history_close();
}
setInterval(() => {
    search(document.getElementById('line-edit').value);
}, 1000);

// Получение расстояни от текущего местоположения до парковки
function calc_distance_to_geopoint(g_id){
    let meters = map.distance(L.latLng(pos[0],pos[1]),L.latLng(locs[g_id][0],locs[g_id][1]));
    return parseFloat(meters/1000.0).toFixed(1);
}