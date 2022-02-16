var HEIGHT = window.innerHeight+'px';
var pos = [57.615398, 39.885228];
var scale = 13;
var locs = [[57.620188, 39.898177,1],
            [57.619867, 39.879848,2]];
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

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

setTimeout(()=>{
    permissions = cordova.plugins.permissions;
    var list = [
        //permissions.CAMERA,
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
    // setTimeout(()=>{
    //     navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // },1000);
},2000);

function get_location(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

document.getElementById("map").style.height = HEIGHT;

var map = L.map('map', {
    center: pos,
    zoom:scale,
    zoomControl: false,
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


function zoomin(){
    map.zoomIn(1);
}
function zoomout(){
    map.zoomOut(1);
}

redraw()

function redraw(){
    // console.log(map.getCenter());
    //console.log(map.getBounds());
    //navigator.geolocation.getCurrentPosition(onSuccess, onError);
    let pos_x = map.latLngToContainerPoint(L.latLng(pos[0],pos[1])).x;
    let pos_y = map.latLngToContainerPoint(L.latLng(pos[0],pos[1])).y;
    document.getElementById('icons-here').innerHTML = "" +
        "<div style=\"top: "+pos_y+"px;left: "+pos_x+"px\" class=\"my-position d-flex justify-content-center align-items-center\">\n" +
        "            <div class=\"orange-circle\"></div>\n" +
        "        </div>";
    locs.forEach((a)=>{
        console.log(map.latLngToContainerPoint(L.latLng(a[0],a[1])));
        let x = map.latLngToContainerPoint(L.latLng(a[0],a[1])).x;
        let y = map.latLngToContainerPoint(L.latLng(a[0],a[1])).y;
        if(0 <= x && x <= window.innerWidth && 0 <= y && y <= window.innerHeight){
            document.getElementById('icons-here').innerHTML +=
                "<div class=\"status-icon\" style=\"top:"+y+"px; left:"+x+"px\">\n" +
                "        <a href=\"#\" onclick=\"get_info()\">\n" +
                "            <div class=\"status-icon-inner status-icon-" + a[2] + " d-flex justify-content-center align-items-center\">\n" +
                "                <div>\n" +
                "                    <p class=\"status-icon-text\">" + a[2] + "</p>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </a>\n" +
                "    </div>"
        }
    });

}