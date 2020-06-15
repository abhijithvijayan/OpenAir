import 'dart:async';
import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;
import 'package:google_maps_webservice/places.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_google_places/flutter_google_places.dart';

class Map extends StatefulWidget {
  @override
  _MapState createState() => _MapState();
}

class _MapState extends State<Map> {
  Completer<GoogleMapController> _controller = Completer();

  MapType _currentMapType = MapType.normal;
  // some native location
  static const LatLng _center = const LatLng(9.1530, 76.7356);
  LatLng _lastMapPosition = _center;

  _onMapCreated(GoogleMapController controller) {
    _controller.complete(controller);
  }

  _onCameraMove(CameraPosition position) {
    _lastMapPosition = position.target;
  }

  bool loading = false;

  void getRoutes() async {
    try {
      var url = 'http://localhost:5001/api/v1/get_routes_data';
      setState(() {
        loading = true;
      });
      final response = await http.post(url, body: {
        'start_location': {'lat': 9.2267063, 'lng': 76.8496779},
        'end_location': {'lat': 9.1323982, 'lng': 76.718111}
      });
    } catch (err) {
      //
      print(err);
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(children: <Widget>[
        GoogleMap(
          initialCameraPosition: CameraPosition(target: _center, zoom: 10.0),
          onMapCreated: _onMapCreated,
          onCameraMove: _onCameraMove,
          mapType: _currentMapType,
        ),
        Positioned(
          top: 50,
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
                    const GoogleApiKey = "API_KEY_HERE";

                    Prediction p = await PlacesAutocomplete.show(
                        context: context,
                        apiKey: GoogleApiKey,
                        mode: Mode.overlay, // Mode.fullscreen
                        language: "en",
                        components: [new Component(Component.country, "in")]);

                    if (p != null) {}
                  },
                  controller: null,
                  cursorColor: Colors.blue.shade900,
                  decoration: InputDecoration(
                      icon: Container(
                        child: Icon(
                          Icons.location_on,
                          color: Colors.blue.shade900,
                        ),
                        margin: EdgeInsets.only(left: 20, top: 5),
                        width: 10,
                        height: 10,
                      ),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(left: 15, top: 16),
                      hintText: 'Select your starting point'))),
        ),
        Positioned(
            top: 105,
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
                    controller: null,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                        icon: Container(
                          child: Icon(
                            Icons.local_taxi,
                            color: Colors.blue.shade900,
                          ),
                          margin: EdgeInsets.only(left: 20, top: 5),
                          width: 10,
                          height: 10,
                        ),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.only(left: 15, top: 16),
                        hintText: 'Select your destination point'))))
      ]),
    );
  }
}
