import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;
import 'package:google_maps_webservice/places.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_google_places/flutter_google_places.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';

import '../model/routes_api_response.dart';

class Map extends StatefulWidget {
  @override
  _MapState createState() => _MapState();
}

class _MapState extends State<Map> {
  static const GoogleApiKey = "API_KEY_HERE";
  // some native location
  static const LatLng _center = const LatLng(9.1530, 76.7356);

  PolylinePoints polylinePoints = new PolylinePoints();
  Completer<GoogleMapController> _controller = new Completer();
  GoogleMapsPlaces _places = new GoogleMapsPlaces(apiKey: GoogleApiKey);
  TextEditingController sourceController = new TextEditingController();
  TextEditingController destinationController = new TextEditingController();

  LatLng _lastMapPosition = _center;
  MapType _currentMapType = MapType.normal;
  Set<Polyline> _polylines = {};
  Set<Marker> _markers = {};

  _onMapCreated(GoogleMapController controller) {
    _controller.complete(controller);
  }

  _onCameraMove(CameraPosition position) {
    _lastMapPosition = position.target;
  }

  bool loading = false;

  void getRoutes(String value) async {
    var url = 'http://10.0.2.2:5001/api/v1/get_routes_data';
    var body = {
      "start_location": {"lat": 9.2267063, "lng": 76.8496779},
      "end_location": {"lat": 9.1323982, "lng": 76.718111}
    };

    // ToDo(fix): clear existing polylines and markers(if any)
    _markers.clear();
    _polylines.clear();

    setState(() {
      loading = true;
    });
    final response = await http.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(body));
    setState(() {
      loading = false;
    });

    if (response.statusCode == 200) {
      final _jsonResponse = json.decode(response.body);
      ApiResponse data = ApiResponse.fromJson(_jsonResponse);
      _handleRouteGeneration(data.data.data);
    } else {
      throw Exception('An error occurred while getting routes');
    }
  }

  BitmapDescriptor getColoredMarker(int aqi) {
    if (aqi <= 50) {
      // green
      return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen);
    } else if (aqi >= 51 && aqi <= 100) {
      // yellow
      return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueYellow);
    } else if (aqi >= 101 && aqi <= 150) {
      // orange
      return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);
    } else if (aqi >= 151 && aqi <= 200) {
      // red
      return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed);
    } else if (aqi >= 201 && aqi <= 300) {
      // purple(not available)
      return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueViolet);
    } else if (aqi >= 301 && aqi <= 500) {
      // maroon(not available)
      return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue);
    }

    return BitmapDescriptor.defaultMarkerWithHue(10);
  }

  String getHealthConcernLevel(int aqi) {
    if (aqi <= 50) {
      return 'Good';
    } else if (aqi >= 51 && aqi <= 100) {
      return 'Moderate';
    } else if (aqi >= 101 && aqi <= 150) {
      return 'Unhealthy for Sensitive groups';
    } else if (aqi >= 151 && aqi <= 200) {
      return 'Unhealthy';
    } else if (aqi >= 201 && aqi <= 300) {
      return 'Very Unhealthy';
    } else if (aqi >= 301 && aqi <= 500) {
      return 'Hazardous';
    }

    return 'You dare not stay here';
  }

  _handleRouteGeneration(ResponseData data) {
    List<Routes> routes = data.routes;

    routes.map((route) {
      final legs = route.legs;
      // generate polyline
      List<PointLatLng> coordinates =
          decodePolyline(route.overviewPolyline.points);

      if (coordinates.isNotEmpty) {
        List<LatLng> polylineCoordinates = [];
        PolylineId pId =
            PolylineId("polyline" + routes.indexOf(route).toString());

        coordinates.forEach((PointLatLng point) {
          polylineCoordinates.add(LatLng(point.latitude, point.longitude));
        });

        Polyline polyline = Polyline(
            polylineId: pId, color: Colors.blue, points: polylineCoordinates);
        // add to set
        _polylines.add(polyline);
      }

      // generate markers
      legs.map((leg) {
        final steps = leg.steps;

        steps.map((step) {
          final markerUniqueId = MarkerId('marker' +
              routes.indexOf(route).toString() +
              legs.indexOf(leg).toString() +
              steps.indexOf(step).toString());
          final windowString =
              '${step.aqi}: ${getHealthConcernLevel(step.aqi)}';

          // ToDo: source/destination might suffer duplication
          _markers.add(
            Marker(
                markerId: markerUniqueId,
                position: LatLng(step.location.lat, step.location.lng),
                infoWindow: InfoWindow(title: step.name, snippet: windowString),
                icon: getColoredMarker(step.aqi)),
          );
        }).toList();
      }).toList();
    }).toList();
  }

  List<PointLatLng> decodePolyline(String polyline) {
    return polylinePoints.decodePolyline(polyline);
  }

  void onError(PlacesAutocompleteResponse response) {
    print(response.errorMessage);
  }

  Future<Prediction> getPrediction() {
    // show input autocomplete with selected mode
    return PlacesAutocomplete.show(
        context: context,
        apiKey: GoogleApiKey,
        onError: onError,
        mode: Mode.overlay, // Mode.fullscreen
        language: "en",
        components: [new Component(Component.country, "in")]);
  }

  Future<Null> displayPrediction(Prediction p, TextEditingController t) async {
    // get detail (lat/lng)
    PlacesDetailsResponse detail = await _places.getDetailsByPlaceId(p.placeId);
    final lat = detail.result.geometry.location.lat;
    final lng = detail.result.geometry.location.lng;

    // ToDo: set lat/lng in state
    print("${p.description} - $lat/$lng");
    // update text input value
    t.text = p.description;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(children: <Widget>[
        GoogleMap(
          initialCameraPosition: CameraPosition(target: _center, zoom: 11.5),
          onMapCreated: _onMapCreated,
          onCameraMove: _onCameraMove,
          compassEnabled: true,
          mapType: _currentMapType,
          polylines: _polylines,
          markers: _markers,
        ),
        Positioned(
          top: 45,
          left: 15,
          right: 15,
          child: Container(
              height: 50,
              width: double.infinity,
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(3.0),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.grey,
                        offset: Offset(1.0, 5.0),
                        blurRadius: 10,
                        spreadRadius: 3)
                  ]),
              child: TextField(
                  onTap: () async {
                    Prediction p = await getPrediction();

                    if (p != null) {
                      displayPrediction(p, sourceController);
                    }
                  },
                  controller: sourceController,
                  cursorColor: Colors.blue.shade900,
                  decoration: InputDecoration(
                      icon: Container(
                        child: Icon(
                          Icons.location_on,
                          color: Colors.blue.shade900,
                        ),
                        margin: EdgeInsets.only(left: 20, top: 4, bottom: 16),
                        width: 10,
                        height: 10,
                      ),
                      border: InputBorder.none,
                      contentPadding:
                          EdgeInsets.only(left: 15, top: 16, bottom: 15),
                      hintText: 'Select your starting point'))),
        ),
        Positioned(
            top: 103,
            left: 15,
            right: 15,
            child: Container(
                height: 50,
                width: double.infinity,
                decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(3.0),
                    boxShadow: [
                      BoxShadow(
                          color: Colors.grey,
                          offset: Offset(1.0, 5.0),
                          blurRadius: 10,
                          spreadRadius: 3)
                    ]),
                child: TextField(
                    onTap: () async {
                      Prediction p = await getPrediction();

                      if (p != null) {
                        displayPrediction(p, destinationController);
                      }
                    },
                    controller: destinationController,
                    textInputAction: TextInputAction.go,
                    onSubmitted: getRoutes,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                        icon: Container(
                          child: Icon(
                            Icons.local_taxi,
                            color: Colors.blue.shade900,
                          ),
                          margin: EdgeInsets.only(left: 20, top: 4, bottom: 16),
                          width: 10,
                          height: 10,
                        ),
                        border: InputBorder.none,
                        contentPadding:
                            EdgeInsets.only(left: 15, top: 16, bottom: 15),
                        hintText: 'Select your destination point'))))
      ]),
    );
  }
}
