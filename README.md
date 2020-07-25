# OpenAir

Real-time Air Quality Monitoring and Navigation System based on IoT

## Screenshots

<div>
  <img src="./.github/screenshots/dashboard-clients.png" alt="Dashboard Clients" />
  <div>_</div>
  <img src="./.github/screenshots/dashboard-client-activity.png" alt="Dashboard Client Activity" />
</div>

<div>
   <img width="250" src="./.github/screenshots/android-1.png" alt="Android Screen 1" />
  <div>_</div>
  <img width="250" src="./.github/screenshots/android-2.png" alt="Android Screen 2" />
  <div>_</div>
  <img width="250" src="./.github/screenshots/android-3.png" alt="Android Screen 3" />
</div>

<div>
  <img width="250" src="./.github/screenshots/android-4.png" alt="Android Screen 4" />
  <div>_</div>
  <img width="250" src="./.github/screenshots/android-5.png" alt="Android Screen 5" />
    <div>_</div>
  <img width="250" src="./.github/screenshots/android-6.png" alt="Android Screen 6" />
</div>

<hr />

## Uses

- MQTT
- Websockets
- HTTP

```
                        _______________________
                        |      dashboard      |
                        | (web-socket client) |
                        |_____________________|
                                  |
                                  | web-socket protocol
                        _______________________
                        |         |           |
                        |  web-socket(server) |
                        |_____________________|
 __________________     |         |           |      __________________      ______________      _______________
 | mqtt publisher | --> |     mqtt broker     | <--> | mqtt subscriber | --> | API server | <--> | Android App |
 |________________|     |_____________________|      |_________________|     |____________|      |_____________|
                   mqtt                         mqtt                    http                http
                 protocol                     protocol                protocol            protocol
```

## Licence

Code released under the [GPL V3 License](LICENSE).
