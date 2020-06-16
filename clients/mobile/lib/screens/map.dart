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
  Completer<GoogleMapController> _controller = Completer();
  MapType _currentMapType = MapType.normal;
  PolylinePoints polylinePoints = PolylinePoints();
  TextEditingController sourceController = new TextEditingController();
  TextEditingController destinationController = new TextEditingController();
  // some native location
  static const LatLng _center = const LatLng(9.1530, 76.7356);
  LatLng _lastMapPosition = _center;
  Set<Polyline> _polylines = {};
  Set<Marker> _markers = {};
  List<LatLng> polylineCoordinates = [];
  static const GoogleApiKey = "API_KEY_HERE";
  GoogleMapsPlaces _places = GoogleMapsPlaces(apiKey: GoogleApiKey);

  _onMapCreated(GoogleMapController controller) {
    _controller.complete(controller);
  }

  _onCameraMove(CameraPosition position) {
    _lastMapPosition = position.target;
  }

  bool loading = false;

  void getRoutes(String value) async {
    print('submitted $value');
    var url = 'http://10.0.2.2:5001/api/v1/get_routes_data';
    var body = {
      "start_location": {"lat": 9.2267063, "lng": 76.8496779},
      "end_location": {"lat": 9.1323982, "lng": 76.718111}
    };

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

  _handleRouteGeneration(ResponseData data) {
    List<dynamic> routes = data.routes;
    print(routes);
  }

  _getMarkers() {
    final List<LatLng> _markerLocations = [
      LatLng(9.2267362, 76.8497095),
      LatLng(9.2290586, 76.781823),
      LatLng(9.2108601, 76.76513940000001),
      LatLng(9.1527763, 76.7362141),
      LatLng(9.1326702, 76.7181268),
    ];

    for (LatLng markerLocation in _markerLocations) {
      _markers.add(
        Marker(
            markerId:
                MarkerId(_markerLocations.indexOf(markerLocation).toString()),
            position: markerLocation,
            infoWindow: InfoWindow(title: 'AQI', snippet: '80'),
            icon: BitmapDescriptor.defaultMarkerWithHue(90)),
      );
    }
  }

  _addPolyLine() {
    PolylineId id = PolylineId("poly");
    Polyline polyline = Polyline(
        polylineId: id, color: Colors.blue, points: polylineCoordinates);
    _polylines.add(polyline);
    setState(() {});
  }

  _getPolyline() async {
    List<PointLatLng> result = polylinePoints.decodePolyline(
        "cbiw@uu`tMIH\\h@P\\AVKNoAj@qAz@}EpCcDvBsBzAo@x@}ArC_BzG_BhBoBxAsANg@FUPcAbDoApDuAvBcCfDo@fB[fDHnBQzAm@xCw@tB_BzD]p@gAdAeBFg@LeAv@m@f@KdBKfEJpA`@pFA`A]\\gFhAMR?XLh@PvABz@Zj@|A`C|ClFn@vB@~@a@fDs@dCgA~BiClDk@p@uAhCuAhCiAbB{ArCOXL^z@nA`@tBC\\g@fAwBbHiAjI{BfF}@nFElb@CpAY|AUlA@j@TrB|@tD`BdCn@xB\\Xt@NnC`A^T`BhB~@tAXv@b@xFF`A`@R`KzB~D~AjGtBpAz@~BdA\\j@N~@@lEWzAa@fAcAdAe@r@QlA_@nEMpAe@rAoAtCEd@Nz@l@~@X\\Nz@DfAx@zIPn@VVpAZP`@NfBLpA^TxDCzBWdBHRQl@pANl@b@f@v@Vj@XnClCVR@t@PtCb@dDAfBHPXZh@JjFTrCFlEDxEMxA?~BTdHz@vBr@rAdAbAd@x@j@hE`D|CpBd@r@LdAXnDZpCV~AtAnDh@`Br@rDr@xGlECvDtCb@l@dAlC|ArEtC`DXn@p@dAhBv@rBv@zDd@f@LHn@i@|Bm@bBKdALpAmDjBeAjFgAvEQbABhB`@jBR|@N`B_@|D_CjFSvASVsA`@G|@i@j@QtAJbCh@dDLxF@fBCt@TtAb@pBb@nEAfA]bBy@hCOz@Fp@El@e@fDRtBDzApHX|AJz@MrBIpGbA^DnAQdFaBbDa@dH`@tFdBhA`AVl@d@`A~Av@|C\\|Cd@pCDfETbBEpFs@rEUhDZrDHtCi@`Ae@z@}@n@Wp@ArCZbBLjEOpAFnFxAbDn@lBNdGOtP|@vDJbDlAtCdAnD|AlJ`DxJtBv@Pl@?n@IlAi@f@UbAOT?GvBBfAx@YxAa@vBYnEJvAc@pBA|CC|A@rAJtBZ~Cj@jEFfCDjBKrA]p@y@FiBLiAVUbEY`Ac@x@_@fA}@xAeAhBo@|@KtANj@JbAj@d@Vl@NtAHlDbAdCdAjB\\rCNr@VrAhCL`AZVtAb@dAnAR`@Aj@KfCNrBh@~@`@ZzDx@xA^`@p@j@x@bBx@zBx@a@bAYlAh@tAl@`AzAl@hDzAvAxAdAzAh@ZtC~@jCt@fAl@hFzBdBt@nACBCH?D?~@OpDsAZKdCxBVPjA\\hBd@lC@hAK~@H`BVrA^z@f@~A~AbA~AxAbAbBr@`ItCfCfAx@rAhA|FT~Cj@dCL|BBvBfAdMh@vBtDxIlBhDr@jAb@E`@D?h@");

    if (result.isNotEmpty) {
      result.forEach((PointLatLng point) {
        polylineCoordinates.add(LatLng(point.latitude, point.longitude));
      });
    }

    _addPolyLine();
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
  void initState() {
    super.initState();

    _getPolyline();
    _getMarkers();
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
