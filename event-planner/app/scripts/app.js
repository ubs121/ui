/*
 Copyright (c) 2015 ubs121. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  if (localStorage.account && localStorage.data) {
    app.data = JSON.parse(localStorage.data);
  } else {
    // sample data
    app.data = {};
    app.data['event1'] = {
      'name': 'Ub\'s birthday',
      'type': 'birthday',
      'startDate': '2016-01-12',
      'endDate': '2016-01-12',
      'addr': 'Ulaanbaatar'
    };
    app.data['event2'] = {
      'name': 'eShop project meeting',
      'type': 'conference talk',
      'startDate': '2015-12-28',
      'endDate': ''
    };
    app.data['event3'] = {
      'name': 'Basketball in gym',
      'type': 'game',
      'startDate': '2015-12-20',
      'endDate': ''
    };
  }

  // set current element
  app.current = app.data['event1'];

  // refresh data
  app.refreshData = function() {
    app.eventList = [];

    for (var k in app.data) {
      var item = app.data[k];
      item.id = k;

      app.eventList.push(item);
    }
  };

  app.refreshData();


  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') { // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {

    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };



  app.genID = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };

  app.createItem = function(e) {
    e.preventDefault();

    var newEvt = {};
    newEvt.ID = this.genID();

    var evtForm = Polymer.dom(document).querySelector('event-form');
    evtForm.data = newEvt;

    app.route = "event-form";
    app.current = newEvt;
    app.scrollPageToTop();
  };

  app.selectItem = function(id) {
    if (app.data) {
      app.current = app.data[id];
      return;
    }

    console.log("Not found! " + id);
  };


  // save current item
  app.save = function(e) {
    console.log('on-save ' + app.current.name);

    if (!app.data) {
      app.data = {};
    }

    app.data[app.current.id] = app.current;

    if (localStorage.account) {
      // persist data to localStorage   
      localStorage.setItem("data", JSON.stringify(app.data));

      app.$.toast.text = "Successfully saved!";
      app.$.toast.show();
    } else {
      app.$.toast.text = "In-memory save! Please create an account";
      app.$.toast.show();
    }

    app.refreshData();

  };

  app.delete = function(e) {
    delete app.data[app.current.id];
    app.refreshData();
  };


  app.hasAccount = function() {
    if (localStorage.account) {
      return true;
    }
    return false;
  };

  app.createAccount = function(e) {
    var accForm = Polymer.dom(document).querySelector('account-form');
    accForm.editing = true;

    app.route = "account"
    app.scrollToTop();
  };

})(document);
