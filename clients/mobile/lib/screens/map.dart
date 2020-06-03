import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class Map extends StatefulWidget {
  @override
  _MapState createState() => _MapState();
}

class _MapState extends State<Map> {
  Completer<GoogleMapController> _controller = Completer();

  static final CameraPosition _adoorCameraPosition =
      CameraPosition(target: LatLng(9.1530, 76.7356), zoom: 10);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(children: <Widget>[
        GoogleMap(
          mapType: MapType.normal,
          initialCameraPosition: _adoorCameraPosition,
          onMapCreated: (GoogleMapController controller) {
            _controller.complete(controller);
          },
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