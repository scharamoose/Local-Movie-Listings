  // Note: This example requires that you consent to location sharing when
  // prompted by your browser. If you see the error "The Geolocation service
  // failed.", it means you probably did not give permission for the browser to
  // locate you.
  let map, infoWindow;
  let styles = {
    default: null,
    silver: [
      {
        elementType: 'geometry',
        stylers: [{color: '#f5f5f5'}]
      },
      {
        elementType: 'labels.icon',
        stylers: [{visibility: 'off'}]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{color: '#616161'}]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{color: '#f5f5f5'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#bdbdbd'}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#eeeeee'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#757575'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#e5e5e5'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9e9e9e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#ffffff'}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [{color: '#757575'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#dadada'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#616161'}]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9e9e9e'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#e5e5e5'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#eeeeee'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#97c8eb'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#abd3ef'}]
      }
    ]
  };

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      // Default to Dublin
      center: {lat: 53.350140, lng: -6.266155}, 
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    });

    map.setOptions({styles: styles['silver']});

    // Attempt HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude
        };

        let icon = {
            url: "http://maps.google.com/mapfiles/kml/paddle/red-circle.png",
            scaledSize: new google.maps.Size(42, 42),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        };        

        let marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: icon
            });          

        marker.setMap(map);

        plotNearestCinema(map, pos);

        $(".nav-item a[href='#directions-panel']").removeClass('disabled');

        getCinemaDetails(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function calculateAndDisplayRoute(directionsService, directionsDisplay, you, destination) {
    let selectedMode = "DRIVING";
    directionsService.route({
      origin: {lat: you.lat, lng: you.lng},  // You
      destination: {lat: destination.lat, lng: destination.lng},  // Nearest Cinema          
      travelMode: google.maps.TravelMode[selectedMode] // Transport Default: Driving
    }, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  function plotNearestCinema(map, pos){
      let destination = null, request = {
        location: pos,
        radius: '5000',
        types: ['movie_theater']
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            destination = {
              lat: results[i].geometry.viewport.f.f,
              lng: results[i].geometry.viewport.b.b
            };

            let directionsService = new google.maps.DirectionsService();
            let directionsDisplay = new google.maps.DirectionsRenderer();

            directionsDisplay.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsDisplay, pos, destination);
            directionsDisplay.setPanel(document.getElementById('direction-details'));

            createMarker(results[i]);
          }
        }
      });
      
      $("#listings").removeAttr('hidden');
  }

  function createMarker(place) {
    let image = 'http://maps.google.com/mapfiles/kml/pal2/icon22.png';
    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: image,
      zIndex:120
    });

    // marker.metadata = {IstTheaterId: 52870};

    $("#cinema").text(place.name);
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    let placeholder = browserHasGeolocation ?
      'If you wish to retrieve local cinema times, try allowing next time. </p><p class="text-danger"> You may need to reset your browser\'s location setting' :
      'Error: Your browser doesn\'t support geolocation.';

    let error = '<ul>\
                  <div class="media mb-3">\
                    <a class="media-left waves-light mr-4">\
                      <i class="fa fa-location-arrow fa-3x text-danger" aria-hidden="true"></i>\
                    </a>\
                    <div class="media-body">\
                      <h5 class="media-heading text-danger">This widget relies on geolocation</h5>\
                      <p class="text-danger">'+ placeholder +'</p>\
                      <button type="button" class="btn btn-primary btn-lg" onClick="top.location.reload(true)"><i class="fa fa-repeat fa-lg" aria-hidden="true">&nbsp;</i>Try Again</button>\
                    </div>\
                  </div>\
                </ul>';

    $('div#current-listings-panel.tab-pane').html(error);

    $("#listings").removeAttr('hidden');
  }
  