Polymer({
  is: "x-ratings",

  properties: {
    stars: { type: Array, notify: true, value: function() { return []; }},
    label: { type: String, value: ''},
    count: { type: Number, value: 5, observer: '_countChanged'},
    value: { type: Number, value: 0, observer: '_valueChanged'},
    editing: { type: Boolean, value: false}
  },

  created: function() {

  },

  ready: function() {
    this._countChanged();
  },

  _countChanged: function(oldValue, newValue) {
    this.stars = [];
    for (var i = 0; i < this.count; i++) {
      this.push('stars', {'index': i, 'class': ''});
    }

    this._valueChanged();
  },

  _valueChanged: function(oldValue, newValue) {
    for (var i = 0; i < this.count; i++) {
      this.set('stars.'+i+'.class', (i < this.value ? 'full' : ''));
    }
  },

  updateValue: function(e,  detail) {
    var i = parseInt(e.target.attributes['index'].value);
    this.value = i + (this.stars[i].class != 'full' ? 1 : 0);
  }
});
