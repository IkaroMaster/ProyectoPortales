 var map = null;
 var mapCoordsHonduras = {lat:14.641775, lng:-86.2470938};

 var direccion = null;
 var yo = null;
 var geocoder = null;
 var infowindow = null;


 var autocomplete = null;




function init (){

	if (navigator.geolocation){
		 alert('geolocation OK');

		// cuando una funcion como success o error se pasa como no se le ponen parentesis
		navigator.geolocation.getCurrentPosition(success,error);

	}else{
		alert('actualiza tu navegador');
	}

	// lat y lng son variable de google



          



}



function createMap(_lat,_lon)
{
	var mapCoords = {lat: _lat,lng: _lon};
	
	var mapSettings ={
		center: mapCoordsHonduras,
		mapTypeId:'roadmap', //roadmap,satellite, hybrid, terrain
		zoom: 8.03
	};
	map = new google.maps.Map(document.getElementById('mapa'),mapSettings);


	//------------------creando marcadores

	var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

	var markerSettings = {
		map: map,
		position: mapCoords,
		title: 'Usted esta aqui',
		
		animation: google.maps.Animation.DROP,
		icon: image

	};

	 marker = new google.maps.Marker(markerSettings);


	 marker.addListener('dblclick', function() {
   		 map.setZoom(14);
    	map.setCenter(marker.getPosition());
  	});





	 //--------------------ubicaciones---------------

	 //----Copan Ruinas

	 var markerCopanRuinas = new google.maps.Marker({
		map: map,
		position: {lat: 14.837396, lng: -89.141511 },
		title: 'Las Ruinas de Copan'
		
	});


	 acercar(markerCopanRuinas);


	 //--Parque la tigra
	 var markerTigra = new google.maps.Marker({
		map: map,
		position: {lat: 14.238738, lng: -87.105231 },
		title: 'Parque la tigra'
		
	});

	acercar(markerTigra);

	 //--Celaque
	 var markerCelaque = new google.maps.Marker({
		map: map,
		position: {lat: 14.494261, lng: -87.105231 },
		title: 'Celaque'
		
	});

	 

	 acercar(markerCelaque);



	 //convertir las variables de rutas en objetos


	 var objConfigDR = {
	 	map: map,
	 	suppressMarkers: true
	 }

	dirService = new google.maps.DirectionsService();
	dirDisplay = new google.maps.DirectionsRenderer(objConfigDR);

	// dirDisplay.setMap(map);


	//disparar el geocoder cuando la api de google se inicie con init y lo convierte un objeto
	//geocoder = new google.maps.Geocoder();




	geocoder = new google.maps.Geocoder;
    infowindow = new google.maps.InfoWindow;



        
          //geocodeLatLng(geocoder, mapa, infowindow,marker);
          // geocodeLatLng1(geocoder, mapa, infowindow,marker);
          clicke(geocoder, map, infowindow,markerTigra);
          clicke(geocoder, map, infowindow,markerCelaque);
          clicke(geocoder, map, infowindow,markerCopanRuinas);



////////////////////////////////////////////////////codigo de barra de busquedas con autocompletacion//////////////
	
	// Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');


        var searchBox = new google.maps.places.SearchBox(input);
        var options = {
		  types: ['(cities)'],	
		  componentRestrictions: {country: 'hn'}
		};

        autocomplete = new google.maps.places.Autocomplete(input, options);
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markersBusqueda = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markersBusqueda.forEach(function(marker) {
            marker.setMap(null);
          });
          markersBusqueda = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markersBusqueda.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });



/////////////////////////////////CODIGO DE MARKERS CON INFORMACION BRINDAD POR GOOGLE/////////////////////
	// Search for Google's office in Australia.
	  var request = {
	    location: map.getCenter(),
	    radius: '500',
	    query: 'Google Sydney'
	  };

	  var service = new google.maps.places.PlacesService(map);
	  service.textSearch(request, callback);
	

}


// using the place ID and location from the PlacesService.
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var marker = new google.maps.Marker({
      map: map,
      place: {
        placeId: results[0].place_id,
        location: results[0].geometry.location
      }
    });
  }
}








// function geolocate() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var geolocation = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };
//       var circle = new google.maps.Circle({
//         center: geolocation,
//         radius: position.coords.accuracy
//       });
//       autocomplete.setBounds(circle.getBounds());
//     });
//   }
// }






function clicke(geocoder,mapa,infowindow,ma){
	ma.addListener('click', function(){
		geocodeLatLng(geocoder, map, infowindow,ma);

		var desde = marker.getPosition();
		var hasta = ma.getPosition();

		console.log(desde);
		console.log(hasta);
		//var travel = document.getElementById('travelMode');

		if(desde =='' || hasta =='')
		if (travel =='')
			return;


		// alert(travel)
		// return false;



		var request = {
			origin: desde,
			destination: hasta,
			travelMode: 'DRIVING' ,// WALKING, BICYCLING
			provideRouteAlternatives:true

		};


		//primero recibe la informacion de la peticion que esta en request y lo segundo una funcion anonima
		dirService.route(request, function(result,status){

			if (status == 'OK')
			{

				dirDisplay.setPanel(document.getElementById('directions'));
				dirDisplay.setDirections(result);

				alert('ok');
			}else if (status == 'NOT_FOUND'){
				alert('error');
			}
		});


	})



}


$(function(){


	$('#btnBuscar').on('click',function (){
		map.setCenter( {lat:13.3167,lng:-87.2167});
		map.setZoom(10);

	});

});




function acercar(punto){

	punto.addListener('dblclick', function() {

	 	if(map.getZoom() >= 14){
	 		map.setZoom(8);
	 		map.setCenter(mapCoordsHonduras);
	 	}else{
   		 map.setZoom(14);
    	map.setCenter(punto.getPosition());
    	}

  	});

}


function success(pos){

	createMap(pos.coords.latitude,pos.coords.longitude);

}


function error(e){

	createMap(pos.coords.latitude,pos.coords.longitude);	
}


function geocodeLatLng(geocoder, map, infowindow,markers) {


        
        var latlng = markers.getPosition();
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              
              infowindow.setContent(results[1].formatted_address);

              direccion = markers.getPosition(); 
              //direccion = results[1].formatted_address;

              //markers.addListener('click',function(){
				infowindow.open(map, markers);
              //});
              
              

              console.log(direccion);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
}


// function geocodeLatLng1(geocoder, map, infowindow,markers) {


        
//         var latlng = markers.getPosition();
//         geocoder.geocode({'location': latlng}, function(results, status) {
//           if (status === 'OK') {
//             if (results[1]) {
              
//               infowindow.setContent(results[1].formatted_address);

//               yo = latlng;
//               //yo = results[1].formatted_address;

//               markers.addListener('click',function(){
// 				infowindow.open(mapa, markers);
//               });
              
              

//               console.log(yo);
//             } else {
//               window.alert('No results found');
//             }
//           } else {
//             window.alert('Geocoder failed due to: ' + status);
//           }
//         });
// }




