mapboxgl.accessToken = 'pk.eyJ1IjoibGNzdGhtcyIsImEiOiJjbGI0NmQ5MTgwaXkxM3dvdXh4bXh3YjZ3In0.J1PmCUuyOPQm6LW_R9HINA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lcsthms/clb58dnoa001514pkvntrjcly',
    projection: 'mercator',
    zoom: 1.5,
    center: [0, 30]
    });
 
const aircrashes = 'https://raw.githubusercontent.com/lucasthms/aircrashes-dataset/main/data2.geojson'

    map.on('load', () => {
        map.addSource('aircrashes', {
            type: 'geojson',
            data: aircrashes
        });
 
        map.addLayer({
            'id': 'point',
            'type': 'circle',
            'source': 'aircrashes',
            'paint': {
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-color': '#C29432',
                'circle-stroke-color': 'white'
            }
        });

        map.addLayer({
            'id': 'point-hover',
            'type': 'circle',
            'source': 'aircrashes',
            'paint': {
                'circle-radius': 6,
                'circle-stroke-width': 1,
                'circle-color': '#C25746',
                'circle-stroke-color': 'white'
            },
            "filter": ["==", "id", ""]
        });
    });
    
    map.on('mouseenter', 'point', (e) => {
        map.getCanvas().style.cursor = 'pointer';
    })

    map.on('mouseleave', 'point', (e) => {
        map.getCanvas().style.cursor = '';
        });

    map.on('click', 'point', (e) => {
            map.flyTo({
            center: e.features[0].geometry.coordinates
            });
            });

    map.on('click', 'point', (e) => {
        const layers = map.getStyle().layers;
	    const last = layers[layers.length - 1];
        if (last.id == "route") {
            map.removeLayer("route");
            map.removeSource("route");
        }

        document.getElementById('infos').style.display='block'
        
        map.flyTo({
            center: e.features[0].geometry.coordinates, zoom:4
            });
        var city = e.features[0].properties.city;
        var country = e.features[0].properties.country
        document.getElementById('lieu').innerHTML ="<h2>Lieu du crash : </h2>" + city + ', ' + country
        var année = e.features[0].properties.annee.slice(6)
        document.getElementById('année').innerHTML ="<h2> Année : </h2> " + année
        var heure = e.features[0].properties.hour;
        document.getElementById('heure').innerHTML ="<h2>Heure : </h2>" + heure+"h"
        var compagnie = e.features[0].properties.compagnie;
        document.getElementById('compagnie').innerHTML ="<h2> Compagnie Aérienne : </h2>" + compagnie
        var victimes = e.features[0].properties.dead;
        document.getElementById('victimes').innerHTML ="<h2> Nombre de victimes : </h2>" + victimes
        var story = e.features[0].properties.story;
        document.getElementById('histoire').innerHTML ="<h2> Histoire du crash : </h2>" + story

        var lat_d =e.features[0].properties.lat_depart
        var lon_d=e.features[0].properties.lon_depart
        var lat_a=e.features[0].properties.lat_arrivee
        var lon_a=e.features[0].properties.lon_arrivee

        console.log(lat_a,lat_d,lon_a,lon_d)



        map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [[lon_d,lat_d], [lon_a,lat_a]]
                }
            }
        });
        
        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'lightsteelblue',
                'line-width': 2
            }
            });
    })


function changeM() {
   map.setProjection('mercator')
   map.setZoom('1.5')
   map.setCenter('[0, 30]')
}

function changeG() {
    map.setProjection('globe')
    map.setZoom('1.5')
    map.setCenter('[0, 30]')
 }


map.on('click','point', function(e){
    var id = e.features[0].properties.id
    console.log(id)
    map.setFilter("point-hover", ["==", "id", id])
})