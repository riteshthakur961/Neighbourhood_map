var locationData = [ // It has the name of the Famous locations of Delhi along with their latitudes and longitudes
    {
        title: 'Parliament of India',
        location: {
            lat: 28.617214,
            lng: 77.208127
        }
    },
    {
        title: 'Rashtrapati Bhavan',
        location: {
            lat: 28.61436,
            lng: 77.199621
        }
    },
    {
        title: 'Connaught Place',
        location: {
            lat: 28.631451,
            lng: 77.216667
        }
    },
    {
        title: 'Lodhi Gardens',
        location: {
            lat: 28.593681,
            lng: 77.221834
        }
    },
    {
        title: 'National Museum',
        location: {
            lat: 28.611799,
            lng: 77.219493
        }
    },
    {
        title: 'Lotus Temple',
        location: {
            lat: 28.553492,
            lng: 77.258826
        }
    },
    {
        title: 'Purana Quila',
        location: {
            lat: 28.609574,
            lng: 77.243737
        }
    },
    {
        title: 'Laxminarayan Temple',
        location: {
            lat: 28.632667,
            lng: 77.198996
        }
    },
    {
        title: 'Chandni Chowk',
        location: {
            lat: 28.650594,
            lng: 77.230328
        }
    },
    {
        title: 'Qutub Minar',
        location: {
            lat: 28.526583,
            lng: 77.185893
        }
    },
    {
        title: 'Akshardham Temple',
        location: {
            lat: 28.612674,
            lng: 77.277262
        }
    },
    {
        title: 'Gurudwara Bangla Sahib',
        location: {
            lat: 28.626373,
            lng: 77.209076
        }
    },
    {
        title: 'ISKCON Temple',
        location: {
            lat: 28.5559,
            lng: 77.253851
        }
    },
    {
        title: 'Jama Masjid',
        location: {
            lat: 28.650679,
            lng: 77.233442
        }
    },
    {
        title: 'Jantar Mantar',
        location: {
            lat: 28.627055,
            lng: 77.216627
        }
    },
    {
        title: 'Raj Ghat',
        location: {
            lat: 28.640621,
            lng: 77.2495
        }
    },

];

var styles = [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#08304b"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
                "color": "#0c4152"
            },
            {
                "lightness": 5
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#0b434f"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#0b3d51"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "color": "#146474"
        }]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#021019"
        }]
    }
];


var map,
    infowindow,
    bounds;

function initMap() {
    // TODO: use a constructor to create a new map JS object. You can use the coordinates
    // we used, 40.7413549, -73.99802439999996 or your own!
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.661898,
            lng: 77.227396
        },
        zoom: 11,
        styles: styles
    });

    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    //create a locCreate object
    var locCreate = function(data) {
        this.title = ko.observable(data.title);
        this.location = data.location;
    };

    function viewModel() {
        var self = this;
        //create the list items
        this.locationList = ko.observableArray();
        locationData.forEach(function(loc) {
            self.locationList.push(new locCreate(loc));
        });

    //create a marker for every location
    this.locationList().forEach(function(loc) {
        var marker = new google.maps.Marker({
            map: map,
            position: loc.location,
            animation: google.maps.Animation.DROP
        });
        loc.marker = marker;
        //for each marker, extend the boundaries of the map
        bounds.extend(marker.position);
        //open an infowindow on click on the marker
        marker.addListener("click", function() {
            populateInfowindow(this, infowindow);
        });
    });

    function populateInfowindow(marker, infowindow) {
        //check to make sure the infoWindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          //make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function(){
              infowindow.setMarker(null);
          });
        }
      }
    }

    // Activates knockout.js
    ko.applyBindings(new viewModel());
}