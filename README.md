# Auto Scroller v.1.0.0
#### Simple non jquery auto scroller


## Installation
#### Step 1 : Download file and link required files
First, you need to download autoScroller.js file from this repo.
Next, link javascript file.
```HTML
<script src="common/js/autoScroller.js" /></script>
```
#### Step2 : Create HTML Markup
Create a `DOM Element` with class
```HTML
<div class="anchor">
    <img src="common/images/image1.jpg">
</div>
<div class="anchor">
    <img src="common/images/image2.jpg">
</div>
<div class="anchor">
    <img src="common/images/image3.jpg">
</div>
```
#### Step3 : Create AutoScroller instance
Create a instance of AutoScroller to initialize and make it work.
```js
var scroller = new AutoScroller('.anchor');
```
Also you can customize it by setting option values
```js
var scroller = new AutoScroller({
    selector     : '.anchor',
    scrollDistance: 15,
    disableDuration: 300,
    func: 'bounce'
});
```

## Configuration options
**Selector**  Class to select image slide wrapper
```js
selector: '.class'
```

**Func** The name of effect function
```js
func: 'autoScroll'
func:'bounce'
```

**scrollDistance** Number scroll distance per frame
```js
scrollDistance: 15
scrollDistance: 30
```

**disableDuration** Duration after scroll event to enable auto-scroll
```js
disableDuration: 300
disableDuration: 450
```

## License
MIT
