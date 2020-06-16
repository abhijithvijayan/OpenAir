// https://javiercbk.github.io/json_to_dart/
class ApiResponse {
  ApiResponseData data;
  ResponseStatus response;

  ApiResponse({this.data, this.response});

  ApiResponse.fromJson(Map<String, dynamic> json) {
    data = json['data'] != null
        ? new ApiResponseData.fromJson(json['data'])
        : null;
    response = json['response'] != null
        ? new ResponseStatus.fromJson(json['response'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.data != null) {
      data['data'] = this.data.toJson();
    }
    if (this.response != null) {
      data['response'] = this.response.toJson();
    }
    return data;
  }
}

class ApiResponseData {
  ResponseData data;
  bool status;

  ApiResponseData({this.data, this.status});

  ApiResponseData.fromJson(Map<String, dynamic> json) {
    data =
        json['data'] != null ? new ResponseData.fromJson(json['data']) : null;
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.data != null) {
      data['data'] = this.data.toJson();
    }
    data['status'] = this.status;
    return data;
  }
}

class ResponseData {
  List<Routes> routes;

  ResponseData({this.routes});

  ResponseData.fromJson(Map<String, dynamic> json) {
    if (json['routes'] != null) {
      routes = new List<Routes>();
      json['routes'].forEach((v) {
        routes.add(new Routes.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.routes != null) {
      data['routes'] = this.routes.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Routes {
  List<Legs> legs;
  OverviewPolyline overviewPolyline;
  String summary;

  Routes({this.legs, this.overviewPolyline, this.summary});

  Routes.fromJson(Map<String, dynamic> json) {
    if (json['legs'] != null) {
      legs = new List<Legs>();
      json['legs'].forEach((v) {
        legs.add(new Legs.fromJson(v));
      });
    }
    overviewPolyline = json['overview_polyline'] != null
        ? new OverviewPolyline.fromJson(json['overview_polyline'])
        : null;
    summary = json['summary'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.legs != null) {
      data['legs'] = this.legs.map((v) => v.toJson()).toList();
    }
    if (this.overviewPolyline != null) {
      data['overview_polyline'] = this.overviewPolyline.toJson();
    }
    data['summary'] = this.summary;
    return data;
  }
}

class Legs {
  List<Steps> steps;

  Legs({this.steps});

  Legs.fromJson(Map<String, dynamic> json) {
    if (json['steps'] != null) {
      steps = new List<Steps>();
      json['steps'].forEach((v) {
        steps.add(new Steps.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.steps != null) {
      data['steps'] = this.steps.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Steps {
  int aqi;
  Distance distance;
  Location location;
  String updatedAt;

  Steps({this.aqi, this.distance, this.location, this.updatedAt});

  Steps.fromJson(Map<String, dynamic> json) {
    aqi = json['aqi'];
    distance = json['distance'] != null
        ? new Distance.fromJson(json['distance'])
        : null;
    location = json['location'] != null
        ? new Location.fromJson(json['location'])
        : null;
    updatedAt = json['updated_at'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['aqi'] = this.aqi;
    if (this.distance != null) {
      data['distance'] = this.distance.toJson();
    }
    if (this.location != null) {
      data['location'] = this.location.toJson();
    }
    data['updated_at'] = this.updatedAt;
    return data;
  }
}

class Distance {
  int value;
  String text;

  Distance({this.value, this.text});

  Distance.fromJson(Map<String, dynamic> json) {
    value = json['value'];
    text = json['text'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['value'] = this.value;
    data['text'] = this.text;
    return data;
  }
}

class Location {
  double lat;
  double lng;

  Location({this.lat, this.lng});

  Location.fromJson(Map<String, dynamic> json) {
    lat = json['lat'];
    lng = json['lng'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['lat'] = this.lat;
    data['lng'] = this.lng;
    return data;
  }
}

class OverviewPolyline {
  String points;

  OverviewPolyline({this.points});

  OverviewPolyline.fromJson(Map<String, dynamic> json) {
    points = json['points'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['points'] = this.points;
    return data;
  }
}

class ResponseStatus {
  int statusCode;
  String statusText;

  ResponseStatus({this.statusCode, this.statusText});

  ResponseStatus.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    statusText = json['statusText'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['statusCode'] = this.statusCode;
    data['statusText'] = this.statusText;
    return data;
  }
}
