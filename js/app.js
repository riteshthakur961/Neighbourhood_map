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

var styles = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#FFBB00"
            },
            {
                "saturation": 43.400000000000006
            },
            {
                "lightness": 37.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "hue": "#FFC200"
            },
            {
                "saturation": -61.8
            },
            {
                "lightness": 45.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 51.19999999999999
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 52
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#0078FF"
            },
            {
                "saturation": -13.200000000000003
            },
            {
                "lightness": 2.4000000000000057
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "hue": "#00FF6A"
            },
            {
                "saturation": -1.0989010989011234
            },
            {
                "lightness": 11.200000000000017
            },
            {
                "gamma": 1
            }
        ]
    }
];


var map,
    infowindow,
    bounds;

var mapError = function() {
        alert('404 Error Not Found');
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.669815,
            lng: 77.228679
        },
        zoom: 11,
        styles: styles
    });

    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // This is to re-center the map upon resizing of the window
    window.onresize = function() {
        map.fitBounds(bounds);
    };

    // when clicked on elsewhere on the map, close the infowindow
    map.addListener("click", function() {
        infowindow.close(infowindow);
    });

    //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    function bounceMarker(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 3500);
        }
    }

    //create a locCreate object
    var locCreate = function(data, id) {
        this.title = ko.observable(data.title);
        this.location = data.location;
        this.markerId = id;
    };

    function viewModel() {
        var self = this;

        //create the list items
        self.locationList = ko.observableArray();
        locationData.forEach(function(loc) {
            self.locationList.push(new locCreate(loc));
        });

        //create a marker for every location
        this.locationList().forEach(function(loc) {
            var marker = new google.maps.Marker({
                map: map,
                position: loc.location,
                title: loc.title(),
                animation: google.maps.Animation.DROP
            });
            loc.marker = marker;
            //for each marker, extend the boundaries of the map
            bounds.extend(marker.position);
            //open an infowindow on click on the marker
            marker.addListener("click", function() {
                populateInfowindow(this, infowindow);
                bounceMarker(marker);
            });
        });

        self.clickList = function(loc) {
            var markerId = loc.markerId;

            //https://developers.google.com/maps/documentation/javascript/examples/event-simple
            //http://stackoverflow.com/questions/16985867/adding-an-onclick-event-to-google-map-marker
            google.maps.event.trigger(loc.marker, "click");
        };

        function populateInfowindow(marker, infowindow) {

            //check to make sure the infoWindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                infowindow.marker = marker;

                // load wikipedia data
                var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

                $.ajax({
                        url: wikiUrl,
                        dataType: "jsonp"
                    })
                    .done(function(response) {
                        var article = response[3][0];
                        infowindow.setContent('<div><h3>' + marker.title + '</h3><a href="' + article + '" target="blank" style="display: block;">Click here for more info</a><img src="images/mediawiki.png" alt="mediawiki image"></div>');
                        infowindow.open(map, marker);
                        //make sure the marker property is cleared if the infowindow is closed.
                        infowindow.addListener('closeclick', function() {
                            infowindow.marker = null;
                        });
                    })
                    .fail(function() {
                        alert("An Error Occured");
                    });
            }
        }

        //This is for filtering the list and the markers
        //http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
        //http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
        self.query = ko.observable(" ");

        this.filterLocations = ko.dependentObservable(function() {
            var queryVar = this.query().toLowerCase();
            if (!queryVar) {
                // This is to return the original locations i.e. self.locationList
                return ko.utils.arrayFilter(self.locationList(), function(markerVar) {
                    markerVar.marker.setVisible(true);
                    return true;
                });
            } else {
                return ko.utils.arrayFilter(this.locationList(), function(markerVar) {
                    if (markerVar.marker.title.toLowerCase().indexOf(queryVar) >= 0) {
                        markerVar.marker.setVisible(true);
                        return true;
                    } else {
                        markerVar.marker.setVisible(false);
                        return false;
                    }
                });
            }
        }, this);

    }

    // Activates knockout.js
    ko.applyBindings(new viewModel());
}