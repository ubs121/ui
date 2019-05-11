# Corporate Dashboard

Dashboard is a collection of widgets (web components) and they are configured in the file 'data/dashboard.json'.

Here are some pre-defined dashboards:

* A Dashboard "Branches" shows branch information (name, employee count, location, opening hours) on the map

* "Keymetrics" demonstrates a chart with realtime update from the server (using long polling technique)

* "All issues" shows list of issues as a data grid which supports filtering, sorting, selecting.


## How to run

Start a server app. You need Go SDK (https://golang.org/doc/install).

```
$ go run cmd/*.go
```

Server starts on a port 8080.

Install node.js, gulp and bower.

```
$ npm install
$ bower install
$ npm install -g gulp
```

Serve up with gulp:

```
$ gulp serve
```

## TODO

* Widget drag drop in a dashboard
* Add widget
* Remove widget
