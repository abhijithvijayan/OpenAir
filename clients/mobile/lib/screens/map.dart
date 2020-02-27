import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class Map extends StatefulWidget {
  @override
  _MapState createState() => _MapState();
}

class _MapState extends State<Map> {
  static final CameraPosition _collegeCameraPosition =
      CameraPosition(target: LatLng(9.1315825, 76.7183041), zoom: 90);

  @override
  Widget build(BuildContext context) {
    return Stack(children: <Widget>[
      GoogleMap(
        mapType: MapType.normal,
        initialCameraPosition: _collegeCameraPosition,
      )
    ]);
  }
}
