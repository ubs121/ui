# Flip animation

Polymer flip animation.


Sample code:


```html
<!-- card flip -->
<neon-animated-pages id="pages" on-tap="_flip" selected="0" entry-animation="flip-in-animation" exit-animation="flip-out-animation">
	<neon-animatable><p>Front</p></neon-animatable>
	<neon-animatable><p>Back</p></neon-animatable>
</neon-animated-pages>
```


```javascript

// ... other code


_flip: function() {
  if (this.$.pages.selected == 0) {
    this.$.pages.selected = 1;
  } else {
    this.$.pages.selected = 0;

  }
}
```