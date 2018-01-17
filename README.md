# web-pull-to-refresh
[![NPM](https://nodei.co/npm/web-pull-to-refresh.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/web-pull-to-refresh/)

- [Intro](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#intro)
  - [Scan the QRCode to preview](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#scan-the-qrcode-to-preview)
  - [Screenshots](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#screenshots)
- [Download](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#downloads)
  - [Via Github](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#via-github)
  - [Via NPM](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#via-npm)
- [Installation](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#installation)
  - [Using window](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#using-window)
  - [Using AMD with require.js](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#using-amd-with-requirejs)
  - [Import with Webpack](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#import-with-webpack)
- [Usage](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#usage)
  - [Basic Usage](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#basic-usage)
  - [Change statusText within refresher callback](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#change-statustext-within-refresher-callback)
  - [Manually trigger with .trigger()](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#manually-trigger-with-trigger)
- [Options](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#options)
  - [Options' default value](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#options-default-value)
- [Develop](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#develop)
- [License](https://github.com/movii/web-pull-to-refresh/blob/master/README.md#license)

## Intro
### Scan the QRCode to preview
Scan the QRCode below to preview the example (which source code is provided in gh-pages branch).

<div align="center">
  <img src="/media/web_pull_to_refresh_qrcod.png"/>
</div> 

1. Pull down then let go to see pull-to-refresh effect;
2. Tap the button in bottom right corner to manually trigger a pull-to action;
3. After manually trigger, there is Promise returned so you can make use of it by simply chain a .then().
4. No third-party library required.
5. Build with Webpack@3.
6. Support preventing mobile Chrome's default pull to refresh features *(reference [doc](https://docs.google.com/document/d/12Ay4s3NWake8Qd6xQeGiYimGJ_gCe0UMDZKwP9Ni4m8/edit), [emample](http://output.jsbin.com/qofuwa/2/quiet), and related [StackOverflow question](https://stackoverflow.com/questions/29008194/disabling-androids-chrome-pull-down-to-refresh-feature))*.

### Screenshots
Gif recorded on my Mac
<div align="center">
  <img src="/media/web_pull_to_refresh_preview.gif" width="70%" />
</div> 

## Download
### Via Github
Clone or open the [`./dist`](https://github.com/movii/web-pull-to-refresh/tree/master/dist), grab `ptr.js` and `ptr.css`, place them wherever you want.

```html
<link rel="stylesheet" href="path/to/ptr.css">
<script src="/path/to/ptr.js"></script>
```

### Via NPM

```shell
npm install web-pull-to-refresh --save
```

## Installation 
CSS file should always be required

```html
<link rel="stylesheet" href="dist/ptr.css">
```

#### Using `window` 

```html
<srcipt src="/path/to/ptr.js"></script>
<script>
  const options = {/*...*/}
  new PTR(options)
</script>
```

#### Using AMD with require.js

For example the entry you set is `main.js`, in the html file should be like this:

```html
<script data-main="main" src="lib/require.js"></script>
```

then in the `main.js`, require the `ptr`:

```javascript
define(['./dist/ptr'], (PTR) => {
  const options = {/*...*/}
  new PTR(options)
}
// or
define(require => {
  const PTR = require('./dist/ptr')
  const options = {/*...*/}
  new PTR(options)
})
```

#### Import with Webpack

```javascript
import PTR from 'web-pull-to-refresh'

const options = {/*...*/}
new PTR(options)
```

When use Webpack it could be serval different way to import CSS depends on different situation:
1. Import the file in an entry CSS file,
2. Load CSS directly in html using `<link>` tag,
3. Or import CSS in JavaScript file then let Webpack take care of the rest. 

But the path will stay the same: `./node_modules/web-pull-to-refresh/dist/ptr.css`.

## Usage
### Basic Usage

Firstly there is certain HTML structure and CSS needed.

```html
<!-- html -->
<div class="ptr-wrapper">
  <div class="ptr">
    <span class="status-arrow"></span>
    <span class="status-loader"></span>
    <span class="status-text">pull more</span>
  </div>
  <div class="content">
    <ul></ul>
  </div>
</div>
```

❗️Note the **`refresher` callback passed in require a Promise returned**.

```javascript

const refresher = (statusText) => {
  return new Promise((resolve) => {
     setTimeout(() => {
       alert('new refresher')
       resolve()
     }, 2000)
  })
}

const options = {
  contain: $('.ptr-wrapper'),
  header: $('.ptr-wrapper .ptr'),
  content: $('.ptr-wrapper .content'),
  distanceToRefresh: 50,
  pullDownText: 'Pull down',
  releaseText: 'Release to refresh',
  refreshText: 'Updating',
  finishText: 'Done Refresh',
  refresher: refresher
}

const ptr = new PTR(options)
```


### Change `statusText` within `refresher` callback
`statusText` refers to the top-bar shown when pull-to action take place. 

See the `options` passed in the `PTR` constructor, there are four different String value for four different status. The final one `finishText` will show when entire pull-to-refresh action finish. 

But in real world, most situation here is make an AJAX call to load some more data, and then the text could result in 'Update successfully', 'Error loading, try again later', or 'Nothing new'.

So the `refresher` callback take a `statusText` parameter in, with which you can easily change statusText shown depends on certain conditions.

❗️Note using `statusText` will overwrite the option's `finishText`.

```javascript
const refresher = (statuText) => {
  if (condition) {
    statuText = 'success'
  }
  else {
    statuText = 'error'
  }
}
```


### Manually trigger with `.trigger()`

`new PTR(options)` will return an object with a method called `.trigger()`, you can use it to manually trigger a pull-to-refresh action, which will also fire the `refresher()` callback

Then, `.trigger()` itself returns a Promise, you can chain a `.then()` directly to fire certain action immediately after action take place. 

For example there is a button in html with a class `.button-to-trigger`, the code would be: 

```javascript
const ptr = PTR(options)

$('.button-to-trigger').on('click'. () => {
  ptr.trigger().then(() => {
    alert('fire after trigger()')
  }) 
})
```

*There's a full `trigger()` example in `gh-pages` branch.*


## Options

| params 	| type 	| comment 	|
|---------------------	|------------	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `contain` 	| `DOM` 	| The warpper. 	|
| `header` 	| `DOM` 	| The wrapper for the status text, spinner 	|
| `content` 	| `DOM` 	| In most cases, this the wrapper for a `<ul>`. 	|
| `distanceToRefresh` 	| `Number` 	|  Threshold value. <br>Control how long the distance finger can pull down to trigger release-to-refresh. <br><br> **recommend 50 ~ 90, and a number provided bigger than 120, it willl stay at 120.** 	|
| `pullDownText` 	| `String` 	| The text show in pull-down state.<br>In the example it refers to 'Keep Dragging' 	|
| `releaseText` 	| `String` 	| The text show in release-to-update state.<br> In the example it refers to 'Now can release' 	|
| `refreshText` 	| `String` 	| The text show in the refresh action is actually taking place.<br>In the example it refers to 'Updating' 	|
| `finishText` 	| `String` 	| The text show in the refresh action is done.<br> In the example it refers to 'Done'.<br><br> There is a `trigger()` you can use to manually trigger a pull-down-refresh, and the trigger function actually have a paramter call `statusText`, for detail see the Usage part below. basically it let you change the text shown. 	|
| `refresher` 	| `function` 	| The function will be fired. **Promise Excepted**, see example blow. 	|

### Options' default value
```javascript
const options = {
  contain: $('.ptr-wrapper'),
  header: $('.ptr-wrapper .ptr'),
  content: $('.ptr-wrapper .content'),
  distanceToRefresh: 50,
  pullDownText: 'Pull down',
  releaseText: 'Release to refresh',
  refreshText: 'Updating',
  finishText: 'Done Refresh',
  refresher: refresher
}
```

## Develop 
Pull request welcome

#### Download and run at localhost

```shell
npm run serve
```

#### Build development
```shell
npm run build:dev
```

#### Build production
```shell
npm run build:prod
```

## License
MIT License Copyright (c) 2018 Lien
