import 'package:flutter/material.dart';

import './screens/map.dart';

void main() {
  runApp(OpenAirApp());
}

class OpenAirApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Map(),
    );
  }
}
