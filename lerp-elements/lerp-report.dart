// Copyright (c) 2014, ubs121
library erpc.xreport;

import 'dart:html';
import 'package:polymer/polymer.dart';
import 'package:quiver/core.dart';
import 'core.dart';

/**
 * Сервер талд ажилладаг mongo javascript обектыг төлөөлнө
 */
@CustomTag("mongo-js")
class MongoJs extends PolymerElement {
  @published
  String functionName; // function name

  @published
  String code; // source code

  @published
  String src; // external source code

  MongoJs.created() : super.created();

  fileResponse(Event e, var detail, Node target) {

    this.code = detail["response"];
    this.functionName = extractScriptId(this.code);

    print("Script loaded ${this.functionName}");
  }

  fileError(Event e, var detail, Node target) {
  }

  // функцийн нэрийг ялгаж авах
  String extractScriptId(String src) {
    int start = src.indexOf("function");
    int i = start + "function".length;
    while (i < src.length && src[i] == ' ') {
      i++;
    }

    StringBuffer sb = new StringBuffer();
    while (i < src.length && src[i] != ' ' && src[i] != '(') {
      sb.write(src[i]);
      i++;
    }

    return sb.toString();
  }
}

/**
 * Тайлангийн суурь компонент
 */
@CustomTag("x-report")
class XReport extends PolymerElement {
  @published
  UserContext context; // context object, token, user etc.

  @published
  Map params;

  @published
  Map sorts;

  @published
  List<Map> rs;

  @observable
  bool running = false; // тайлан ажиллаж байгаа эсэх

  @observable
  bool auto = false;

  @observable
  bool printing = false;

  String scriptId;
  String scriptSrc;

  MongoJs mongoScript;

  XReport.created() : super.created() {
    params = toObservable({});
    sorts = toObservable({});
  }

  ready(){
    mongoScript = shadowRoot.querySelector("mongo-js");
  }
  
  autoLoad() {
    if (auto) {
      run();
    }
  }

  // тайланг ажиллуулах
  run() {

    if (mongoScript != null && context == null || running) {
      return;
    }

    scriptSrc = mongoScript.code;
    scriptId = mongoScript.functionName;

    Map sendParams = firstNonNull(params, {});
    Map sendSorts = firstNonNull(sorts, {});
    running = true;

    print("Report running ${scriptId}: ${sendParams}");

    context.send("db.runJs", [scriptId, scriptSrc, sendParams, sendSorts]).then((resp) {
      rs = toObservable(firstNonNull(resp, []));
      running = false;
      runFinished();
    }).catchError((e) {
      running = false;
      window.alert("${this.id} тайлан алдаатай! ${e}\n${scriptSrc}");
    });

    /*
     ExcelButton xlsBtn = shadowRoot.querySelector("excel-button");
     if (rs != null && rs.length > 0) {
       print("table=${rpt.table}");
       xlsBtn.table = rpt.table;
       xlsBtn.enabled = true;
       printBtn.attributes.remove("disabled");
     } else {
       xlsBtn.enabled = false;
       printBtn.attributes["disabled"] = "disabled";
     }*/

  }
  
  // тайлангийн өгөгдөл татагдаж дуусах үед
  runFinished() {}

  printPreview() {
    printing = true;
  }
  
  printReport(Event e, var detail, Node target) {
      window.print();
  }
}






/**
 * Олон тайлангаас сонгож ажиллуулах компонент
 */
@CustomTag("report-viewer")
class ReportViewer extends PolymerElement {
  @published
  UserContext context; // context object, token, user etc.

  @published
  List reports; // тайлангийн жагсаалт

  @observable
  String current = ''; // сонгогдсон тайлангийн ID

  XReport rpt;

  ReportViewer.created() : super.created() {
    reports = firstNonNull(reports, []);
  }

  currentChanged() {
    if (current != "") {
      $['output'].children.clear();
      rpt = new Element.tag(current);
      rpt.context = context;
      $['output'].children.add(rpt);
    }
  }
  
  String optId(o) {
      if (o is Map) {
       return o.keys.first;
      }
      return o;
  }
  

  String optValue(o) {
    if (o is Map) {
     return o.values.first; 
    }
    return o;
  }
}
