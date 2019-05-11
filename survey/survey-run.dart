import 'dart:html';
import 'dart:async';
import 'package:polymer/polymer.dart';
import 'package:quiver/core.dart';
import 'package:erpc/x-form.dart';
import 'package:paper_elements/paper_dialog.dart';
import 'package:paper_elements/paper_toast.dart';

/**
 * Санал асуулгын форм
 *
 * TODO: Асуултын эрэмбэ өөрчлөх, шууд тоог нь засаж болно
 */
@CustomTag("survey-form")
class SurveyForm extends XForm {
  @published bool real = false;
  @published bool running = false;
  @published bool showName = true;
  @published String name;
  @published List questions = toObservable([]);

  @observable int questionLimit = 0;
  @observable bool canAdd = true;

  Map questionCols = toObservable({
    "эрэмбэ": 1,
    "төрөл": ["m2o","m2m","fill","rating"],
    "асуулт": "",
    "хариулт": "",
    "хамаарал":""
  });

  Element backDrop = new Element.html("<div class='modal-backdrop fade in'></div>");

  SurveyForm.created() : super.created() {

  }

  @ComputedProperty('data.current["_id"]')
  String get surveyId => readValue(#surveyId);
  surveyIdChanged(){
    setTarget();
    questions = toObservable([]);
    if(data.current['асуулт'] != null){
      data.current['асуулт'].sort((x,y) => x['эрэмбэ'].compareTo(y['эрэмбэ']));
      questions.addAll(data.current['асуулт']);
    }
    name = data.current['нэр'];
  }

  attached() {
    super.attached();

    setTarget();
  }

  @ComputedProperty('data.current["байрлал"]')
  String get position => readValue(#position);
  positionChanged() {
    if(position == 'нүүр'){
      data.current['үр_дүн'] = 'хаалттай';
      questionLimit = 0;
      canAdd = true;
    } else if(position == 'баннер' || position == 'pop-up'){
      questionLimit = 1;
    }
  }

  @ComputedProperty('data.current["асуулт"]')
  List get questionList => readValue(#questionList);
  questionListChanged() {
    if(questionList.length == 1 && (data.current["байрлал"] == 'баннер' || data.current["байрлал"] == 'pop-up')){
      canAdd = false;
    } else {
      canAdd = true;
    }
  }

  questionLimitChanged(){
    data.current['асуулт'] = firstNonNull(toObservable(data.current['асуулт']),toObservable([]));
    if(questionLimit == 1){
      if(data.current['асуулт'].length >= 1){
        data.current['асуулт'] = toObservable([data.current['асуулт'][0]]);
        canAdd = false;
      }
    }
  }

  setTarget(){
    if(data != null){
      if(data.context.roles.contains('survey.selflab')){
        data.current['target'] = "SelfLab";
      }
    }
  }

  run(Event e, var detail, Node target) {
    e.preventDefault();
    e.stopPropagation();
    questions = toObservable([]);
    if(data.current['асуулт'] != null){
      data.current['асуулт'].sort((x,y) => x['эрэмбэ'].compareTo(y['эрэмбэ']));
      questions.addAll(data.current['асуулт']);
    }
    running = true;
//    document.body.classes.add("modal-open");
//    document.body.children.add(backDrop);
  }


  /// Асуулгыг дуусгах, үр дүнг хадгалах
  finish(Event e, var detail, Node target) {
    e.preventDefault();
    e.stopPropagation();

    // жинхэнэ асуулга бол үр дүнг хадгалах хэрэгтэй
    // Формоос хариултыг ялгаж авах
    List<Map> answers = [];
    if (real) {
      Map fb = {};
//      fb['Survey'] = data.current['_id'];
//      fb['User'] = data.context.userId;
//      fb['Date'] = new DateTime.now().toString().substring(0, 19);


      Element formFb = shadowRoot.querySelector("#feedbackForm");

      // m2o, m2m төрлийн асуултууд
      List inps = formFb.querySelectorAll("input");
      for (InputElement inp in inps) {
        if (inp.checked) {
          answers.add({
            'асуулт': inp.attributes['name'],
            'хариулт': inp.attributes['data-msg']
          });
        }
      }

      // ratings төрлийн асуултууд
      List rts = formFb.querySelectorAll("x-ratings");
      for (XRatings rt in rts) {
        answers.add({
          'асуулт': rt.attributes['name'],
          'хариулт': rt.value
        });
      }

      // fill төрлийн асуултууд
      List tas = formFb.querySelectorAll("textarea");
      for (TextAreaElement ta in tas) {
        answers.add({
          'асуулт': ta.attributes['name'],
          'хариулт': ta.value
        });
      }

      fb['Answers'] = answers;


//      data.context.send("plus/survey/feedback/${data.current['_id']}", [fb]).then((resp) {
//        window.alert("Танд баярлалаа");
//      }).catchError( (e) {
//        window.alert("Таны хариултыг хадгалж чадсангүй ${e}");
//      });

    }
    if(answers.length != questions.length){
      window.alert("Бүх талбарыг бөглөнө үү.");
    } else {
      fire('finish', detail:answers);
      close(e, detail, target);
    }
  }

  close(Event e, var detail, Node target) {
    e.preventDefault();
    e.stopPropagation();
//    running = false;
//    document.body.classes.remove("modal-open");
//    backDrop.remove();
  }
  calc(answers){
    return answers.split(',');
  }
}