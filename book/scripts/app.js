/*
Copyright (c) 2015 ubs121. All rights reserved.
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

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
  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  };

  // connect to database
  window.db = new DataService();
  window.db.connect().then(function() {
    console.log('Database Connected.');
    //app._loadData();
  });

  /*
  const BOOKS_PER_PAGE = 15;

  // TODO: load BOOKS_PER_PAGE * 3 books from indexeddb
  app.renderPages = function() {
    int n = 0;
    do {
      var section = new Element.section();

      BookListPage p = new Element.tag("book-pager");
      p.context = data.context;

      if ((n + 1) * BOOKS_PER_PAGE < rs.length) {
        p.rs = rs.sublist(n * BOOKS_PER_PAGE, (n + 1) * BOOKS_PER_PAGE);
      } else {
        p.rs = rs.sublist(n * BOOKS_PER_PAGE);
      }


      section.children.add(p);
      this.$.pagerEl.children.add(section);

      n = n + 1;
    } while (n * BOOKS_PER_PAGE < rs.length);

  };

  // товчлуулаар гүйлгэх
  app.arrowHandler = function(e) {
    if (e.detail['key']== 'right') {
      this.nextPage();
    } else if (e.detail['key'] == 'left') {
      this.prevPage();
    }
  };

  app.nextPage = function(e) {
    int n = pagerEl.children.length;

    if (currentPage < n - 1) {
      currentPage = currentPage + 1;
    } else {
      // өгөгдөл байгаа эсэх
      if (n * BOOKS_PER_PAGE < data.total) {
        loading = true;
        data.nextPage().then((_) {

          loadPages(data.rs);
          loading = false;

          currentPage = currentPage + 1;
        });
      }
    }

  };

  app.prevPage = function(e) {
    if (currentPage > 0) {
      currentPage = currentPage - 1;
    }
  };
  */


  app.importBook = function(e) {
        // TODO: Book import as *.zip format
  };

  app.exportBook = function(e) {
    // TODO: Markdown book export: pdf, html, ...
  }

})(document);


/*
eBook програм

@CustomTag("ebook-app")
class EBookApp extends NavPage {
  @observable
  RecordSet data;

  @observable
  bool menuOpen = false;

  @observable
  bool dlgOpen = false;

  @observable
  List categories = toObservable(['шинэ', 'түүх', 'уран зохиол', 'гарын авлага', 'эрүүл мэнд', 'спорт', 'хэл', 'мэдээллийн технологи', 'шинжлэх ухаан', 'бизнес', 'намтар', 'зөвлөмж', 'менежмент']);

  @observable
  Map newBook = toObservable({}); // шинэ ном

  @observable
  String currentFilter;

  EBookApp.created() : super.created() {
    context = $["ctx"];
    data = $["rsBook"];
    page = window.location.hash;
  }

  keypress(KeyboardEvent e, var detail, Element target) {
    if (e.keyCode == KeyCode.ENTER) {
      cancelEvent(e);

      find(e, detail, target);
    }


  }


  find(Event e, var detail, Node target) {
    cancelEvent(e);

    //page = '#/search';
    window.location.hash = page;

    data.page = 0;
    data.buildQuery(data.searchText);
    data.find().then((n) {
      if (n == 0) {
        $["statusMsg"].text = "'${data.searchText}' хайлтад тохирох ном олдсонгүй";
        $["statusMsg"].show();
      }
    });
  }

  add(Event e, var detail, Node target) {
    cancelEvent(e);

    // шинэ мөр нэмэх
    newBook.clear();
    dlgOpen = true;
  }

  cancelAdd(Event e, var detail, Node target) {
    newBook.clear();
    dlgOpen = false;
  }

  saveBook(Event e, Map book, Node target) {
    Map aBook = firstNonNull(book, newBook);

    context.send("db.save", ["Ном", aBook]).then((resp) {

        $["statusMsg"].text = "'${aBook['нэр']}' ном амжилттай бүртгэгдлээ.";
        $["statusMsg"].show();
        dlgOpen = false;

    }).catchError((e) {
      window.alert("Ном үүсгэхэд алдаа гарлаа ${e}");
    });

  }

  deleteBook(Event e,  Map book, Node target) {
     Map aBook = firstNonNull(book, newBook);

     context.send("db.remove", ["Ном", {
        "_id": aBook['_id']
      }]).then((resp) {

      $["statusMsg"].text = "'${aBook['нэр']}' ном бүртгэлээс хасагдлаа.";
      $["statusMsg"].show();

      dlgOpen = false;

    }).catchError((e) {
      window.alert("Ном бүртгэлээс хасахад алдаа гарлаа ${e}");
    });


  }

  toggleToolbar(Event e, var detail, Node target) {
    Element el = shadowRoot.querySelector("#main-toolbar");

    if (el.classes.contains("medium-tall")) {
      el.classes.remove("medium-tall");
      menuOpen = false;
    } else {
      el.classes.add("medium-tall");
      menuOpen = true;
    }
  }

  static final String lastWeek = new DateTime.now().subtract(new Duration(days: 7)).toString().substring(0, 7);

  filterByCategory(Event e, var detail, Element target) {
      String categ = target.attributes["data-categ"];
      if (categ == currentFilter) {
        currentFilter = "";
        data.xquery.clear();
        data.q.clear();
      } else {
          currentFilter = categ;

          if (categ == 'шинэ') {
            // сүүлийн 7 хоногийн номууд харуулах
            data.xquery["created"] = { r'$gt': lastWeek };
          } else {
            data.xquery["ангилал"] = currentFilter;
          }
      }

      data.page = 0;
      data.find();
  }

  filterByPin(Event e, var detail, PaperToggleButton target) {

    if (target.checked){
      data.xquery["_pin"] = {r"$in": [context.userId] };
    } else{
      data.xquery.remove("_pin");
    }
    data.find();
  }


}


*/
