import 'package:flutter/material.dart';

void main() {
  runApp(OpenAirApp());
}

class OpenAirApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('OpenAir'),
        ),
        body: Column(
          children: [
            Text('Hello World!'),
            RaisedButton(
                child: Text('Search'), onPressed: () => print('hello flutter'))
          ],
        ),
      ),
    );
  }
}
