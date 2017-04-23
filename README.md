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
    <div class="text">
        Polaroid pinterest flannel, godard wolf gochujang gluten-free 
        live-edge literally air plant YOLO aesthetic ramps. Quinoa ugh 
        disrupt normcore trust fund hella. Vice green juice DIY bespoke.
    </div>
</div>
<div class="anchor">
    <div class="text">
        Polaroid pinterest flannel, godard wolf gochujang gluten-free 
        live-edge literally air plant YOLO aesthetic ramps. Quinoa ugh 
        disrupt normcore trust fund hella. Vice green juice DIY bespoke.
    </div>
</div>
<div class="anchor">
    <div class="text">
        Polaroid pinterest flannel, godard wolf gochujang gluten-free 
        live-edge literally air plant YOLO aesthetic ramps. Quinoa ugh 
        disrupt normcore trust fund hella. Vice green juice DIY bespoke.
    </div>
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
    selector: ".anchor",
    scrollDistance: 4,
    disableDuration: 200,
    func: 'bounce',
    callback: {
        object: callbackObject,
        callTogether: false,
        noticeEnd: true,
    },
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

#### **Callback** callback object and property to interact with AutoScroller
**object** Instance of object that interacts with AutoScrollerr

**callTogether** Set true if you want to interact when scrolling

**noticeEnd** Set true if you want to disable scrolling while other object interacting and notify end of interaction via callback
```js
callback: {
    object: callbackObject,
    callTogether: false,
    noticeEnd: true
}
```

## License
MIT
