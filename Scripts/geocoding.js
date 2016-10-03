var map = null,
    marker = null,
    geocoder = null;

var zoneOnePolygon = null,
    zoneTwoPolygon = null,
    zoneThreePolygon = null,
    zoneFourPolygon = null,
    zoneFivePolygon = null,
    zoneSixPolygon = null;

var zoneOneCoords = [
    { lat: 41.904433, lng: -87.596183 }, // East end of Divison
    { lat: 41.902784, lng: -87.706797 }, // Divison and Kedzie
    { lat: 41.837226, lng: -87.704829 }, // Kedzie and 31st
    { lat: 41.838752, lng: -87.596183 }  // East end of 31st
];

// To make a hole in the center, switch first and fourth coords and third and second coords from previous zone
var zoneTwoCoords = [
    [
        { lat: 41.947960, lng: -87.596183 }, // East end of Addison
        { lat: 41.946122, lng: -87.747014 }, // Addison and Hwy50
        { lat: 41.800322, lng: -87.743047 }, // Hwy50 and 51st
        { lat: 41.802575, lng: -87.580000 }  // East end of 51st
    ], [
        { lat: 41.838752, lng: -87.596183 },
        { lat: 41.837226, lng: -87.704829 },
        { lat: 41.902784, lng: -87.706797 },
        { lat: 41.904433, lng: -87.596183 }
    ]
];

var zoneThreeCoords = [
    [
        { lat: 41.976790, lng: -87.596183 }, // East end of Foster
        { lat: 41.975483, lng: -87.807047 }, // Foster and Hwy43
        { lat: 41.757235, lng: -87.799989 }, // Hwy43/Harlem and W 74th
        { lat: 41.761025, lng: -87.550000 }  // East end of E 74th
    ], [
        { lat: 41.802575, lng: -87.580000 },
        { lat: 41.800322, lng: -87.743047 },
        { lat: 41.946122, lng: -87.747014 },
        { lat: 41.947960, lng: -87.596183 }
    ]
];

var zoneFourCoords = [
    [
        { lat: 42.028200, lng: -87.596183 }, // East end of Oakton
        { lat: 42.022898, lng: -87.920813 }, // Oakton and S Mt Prospect
        { lat: 41.702250, lng: -87.920773 }, // Near 107th and Hwy171
        { lat: 41.708660, lng: -87.510000 }  // East end of 103rd
    ], [
        { lat: 41.761025, lng: -87.550000 },
        { lat: 41.757235, lng: -87.799989 },
        { lat: 41.975483, lng: -87.807047 },
        { lat: 41.976790, lng: -87.596183 }
    ]
];

var zoneFiveCoords = [
    [
        { lat: 42.099200, lng: -87.510000 }, // East end of Willow
        { lat: 42.103061, lng: -88.024227 }, // Near Rohwing and Hwy14
        { lat: 41.641704, lng: -88.012902 }, // W 135th and Veterans Memorial Tollway
        { lat: 41.652000, lng: -87.420000 }  // East end of 135th
    ], [
        { lat: 41.708660, lng: -87.510000 },
        { lat: 41.702250, lng: -87.920773 },
        { lat: 42.022898, lng: -87.920813 },
        { lat: 42.028200, lng: -87.596183 }
    ]
];

var zoneSixCoords = [
    [
        { lat: 42.189025, lng: -87.509043 }, // East end of Willow
        { lat: 42.182032, lng: -88.135604 }, // Cuba and Barrington
        { lat: 41.566032, lng: -88.132706 }, // 2100 Caton Farm Road
        { lat: 41.583325, lng: -87.400000 }  // East end of 173rd
    ], [
        { lat: 41.652000, lng: -87.420000 },
        { lat: 41.641704, lng: -88.012902 },
        { lat: 42.103061, lng: -88.024227 },
        { lat: 42.099200, lng: -87.510000 }
    ]
];

var weekDayFees = {
    "monday": 0,
    "tuesday": 0,
    "wednesday": 0,
    "thursday": 0,
    "friday": 0,
    "saturday": 5,
    "sunday": 25
};

var zoneFee = {
    1: 25,
    2: 45,
    3: 55,
    4: 65,
    5: 85,
    6: 120
};

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: 41.886665, lng: -87.658788 }
    });

    marker = new google.maps.Marker();
    geocoder = new google.maps.Geocoder();

    /*
    var testMarker = new google.maps.Marker({
	    position: new google.maps.LatLng(41.886665, -87.658788),
	    url: 'http://www.google.com',
	    animation: google.maps.Animation.DROP
    });

    testMarker.setMap(map);
    google.maps.event.addListener(testMarker, 'click', function() {window.location.href = testMarker.url;});
    */

    zoneOnePolygon = createPolygon(zoneOneCoords, '#FFCC00', '#FFF0B2');
    zoneTwoPolygon = createPolygon(zoneTwoCoords, '#009933', '#99D6AD');
    zoneThreePolygon = createPolygon(zoneThreeCoords, '#FFFF00', '#FFFFB2');
    zoneFourPolygon = createPolygon(zoneFourCoords, '#CC0000', '#FF6666');
    zoneFivePolygon = createPolygon(zoneFiveCoords, '#663300', '#B29980');
    zoneSixPolygon = createPolygon(zoneSixCoords, '#993399', '#D6ADD6');

    applyZonesToMap(map);
}

function geocodeAddress() {

    var address = $('#address').val();
    var loc = [];

    geocoder.geocode({ 'address': address }, function (results, status) {

        if (status === google.maps.GeocoderStatus.OK) {

            loc[0] = results[0].geometry.location.lat(); // latitude stored in first index
            loc[1] = results[0].geometry.location.lng(); // longitude stored in second index

            var formattedAddress = results[0].formatted_address;

            var lookup = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(loc[0], loc[1]),
		        url: 'http://www.google.com',
                draggable: false
            });

            var base = retrieveBaseValue(lookup);
            var fees = retrieveFees();

            var totalFee = fees + base;
            $('#fees').text('Delivery fees: $' + totalFee);
            $('#format_addr').text('Delivery Address: ' + formattedAddress);

            map.setCenter(results[0].geometry.location);
            marker.setMap(map);
            marker.setPosition(results[0].geometry.location);

        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function applyZonesToMap(map) {

    // Set them to the map in reverse order so the color of the largest area does not encompass the entire zone
    zoneSixPolygon.setMap(map);
    zoneFivePolygon.setMap(map);
    zoneFourPolygon.setMap(map);
    zoneThreePolygon.setMap(map);
    zoneTwoPolygon.setMap(map);
    zoneOnePolygon.setMap(map);
}

function retrieveFees() {
    var timeFee = retrieveTimeFees();
    var dayFee = retrieveDayFees();

    return timeFee + dayFee;
}

function retrieveTimeFees() {
    var deliveryTime = $('#time').val();

    if (deliveryTime >= "07:00" && deliveryTime <= "16:00") {
        return 0;
    } 
    else if ((deliveryTime > "16:00" && deliveryTime <= "16:30") ||
             (deliveryTime >= "06:30" && deliveryTime < "07:00")) {
        return 5;
    } 
    else if ((deliveryTime > "16:30" && deliveryTime <= "17:00") ||
             (deliveryTime >= "06:00" && deliveryTime < "06:30")) {
        return 10;
    } 
    else if ((deliveryTime > "17:00" && deliveryTime <= "17:30") ||
             (deliveryTime >= "05:30" && deliveryTime < "06:00")) {
        return 15;
    } 
    else if ((deliveryTime > "17:30" && deliveryTime <= "18:00") ||
             (deliveryTime >= "05:00" && deliveryTime < "05:30")) {
        return 20;
    } 
    else if (deliveryTime > "18:00" && deliveryTime <= "18:30") {
        return 25;
    }
    else if (deliveryTime > "18:30" && deliveryTime <= "19:00") {
        return 30;
    }
    else {
        alert("Please consult with Luis and Edilberto about delivery fees for this time.");
        return 0;
    }
}

function retrieveDayFees() {
    var deliveryDay = $('#day').val();

    return weekDayFees[deliveryDay];
}

function retrieveBaseValue(lookup) {

    var polygonArray = [zoneOnePolygon, zoneTwoPolygon, zoneThreePolygon, zoneFourPolygon, zoneFivePolygon, zoneSixPolygon];

    for (var i = 1; i <= polygonArray.length; i++) {
        if (google.maps.geometry.poly.containsLocation(lookup.getPosition(), polygonArray[i - 1])) {
            return zoneFee[i];
        }
    }

    return 160;
}

function createPolygon(path, strokeColor, fillColor) {
    return new google.maps.Polygon({
        paths: path,
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.25
    });
}

function checkKeyPress(e) {
    if (e.keyCode == 13) {
        geocodeAddress();
    }
}

function setDefaultDate() {
    $('#time').val('07:00');
    $('#day').val('wednesday');
}

function attachEvents() {
    $('#address').keyup(checkKeyPress);
    $('#submit').click(geocodeAddress);
}

function onLoad() {
    attachEvents();
    setDefaultDate();
}

$(function() {
    onLoad();
});