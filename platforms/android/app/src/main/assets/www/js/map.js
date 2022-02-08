var HEIGHT = window.innerHeight+'px';
var pos = [57.615398, 39.885228];
var scale = 13;
var locs = [[57.620188, 39.898177,1],
            [57.619867, 39.879848,2]];

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
function redraw(){
    // console.log(map.getCenter());
    //console.log(map.getBounds());
    pos = [map.getCenter().lat,map.getCenter().lng];
    document.getElementById('icons-here').innerHTML = "";
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
    })
}