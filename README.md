# web-pull-to-refresh

- [QRCode](https://github.com/movii/web-pull-to-refresh#qrcode)
- [Preview](https://github.com/movii/web-pull-to-refresh#preview)
- [Usage](https://github.com/movii/web-pull-to-refresh#usage)
  - [HTML and CSS](https://github.com/movii/web-pull-to-refresh#html-and-css)
  - [Using `window`](https://github.com/movii/web-pull-to-refresh#use-window)
  - [Using AMD with require.js](https://github.com/movii/web-pull-to-refresh#amd-with-requirejs)
  - [Change `statusText` within `refresher` function](https://github.com/movii/web-pull-to-refresh#change-statustext-within-refresher-function)
  - [Manually trigger with `.trigger()`](https://github.com/movii/web-pull-to-refresh#manually-trigger-with-trigger)
- [Options](https://github.com/movii/web-pull-to-refresh#options)
- [License](https://github.com/movii/web-pull-to-refresh#license)

## QRCode
Scan the QRCode below to preview the example *(which source code is provided in `gh-pages` branch)*.
<div align="center">
  <img src="/media/web_pull_to_refresh_qrcod.png"/>
</div> 

1. Pull down then let go to see basic pull-to-refresh effect;
2. Tap the button in bottom right corner to manually trigger a pull-down action;
3. After manually trigger, there is `Promise` returned so you can make use of it by simply chain a `.then()`.
4. No third-party library required.
5. Build with Webpack@3.
6. Support preventing mobile Chrome's default pull to refresh features *(reference [doc](https://docs.google.com/document/d/12Ay4s3NWake8Qd6xQeGiYimGJ_gCe0UMDZKwP9Ni4m8/edit), [emample](http://output.jsbin.com/qofuwa/2/quiet), and related [StackOverflow question](https://stackoverflow.com/questions/29008194/disabling-androids-chrome-pull-down-to-refresh-feature))*.

## Preview
GIF recorded on my Mac.
<div align="center">
  <img src="/media/web_pull_to_refresh_preview.gif" width="70%" />
</div> 

## Usage
Supprt both `window` and AMD (with require.js), but firstly there is certain HTML structure and CSS needed.

### HTML and CSS
```index.html
<!-- css -->
<link rel="stylesheet" href="dist/ptr.css">

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

### Use `Window`
```index.html
<srcipt src="/path/to/ptr.js"></script>
<script>
  const refresher = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('new refresher')
        resolve()
      }, 2000)
    })
  }

  const options = {
    refresher: refresher
  }

  const ptr = new PTR(options)
</script>
```

### AMD with require.js

Example in `gh-pages` branch using this way.

```html
<script data-main="main" src="lib/require.js"></script>
```
```main.js
require(['./dist/ptr'], (PTR) => {
  const refresher = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('new refresher')
        resolve()
      }, 2000)
    })
  }

  const options = {
    refresher: refresher
  }

  const ptr = new PTR(options)
}
```

### Change `statusText` within `refresher` function
The `refresher()` function passed in options gain the access to `statusText`, with it you can easily change `statusText` shown depends on certain conditions, for example making an AJAX call could be result in 'update successfully', 'error loading, try again later', or 'this is all latest news' possibilities.
❗️**Using `statusText` will overwrite the option `finishText` passed in.**

```javascript
const refresher = (statuText) => {
  return new Promise((resolve) => {
    if (condition) {
      statuText = 'success'
    }
    else {
      statuText = 'error'
    }
  })
}
```

### Manually trigger with `.trigger()`
1. `new PTR(options)` will return an object with a method called `trigger()`, you can use it manually trigger a pull down action, which will also fire the `refresher()` function you passed in options;
2. `.trigger()` itself returns a `Promise`, you can chain a `.then()` directly with it to fire certain action immediately after action take place.

```main.javascript.patch
require(['./dist/ptr'], (PTR) => {
  // ...

  const ptr = PTR(options)
  
+  setTimeout(() => {
+    ptr.trigger().then(() = {
+     alert('fire after trigger()')
+    })
+  }, 1000)
}
```

## Options

| params              | type     | default                 | comment                                                                                                                                                                                                                                                                                                                    |
|---------------------|----------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `contain`           | DOM node | `.ptr-wrapper`          | The warpper for all.                                                                                                                                                                                                                                                                                                        |
| `header`            | DOM node | `.ptr-wrapper .ptr`     | The wrapper for the status text, spinner.                                                                                                                                                                                                                                                                                |
| `content`           | DOM node | `.ptr-wrapper .content` | In most cases, this the wrapper for a `<ul>`.                                                                                                                                                                                                                                                                              |
| `distanceToRefresh` | Number   | 60                      |  Threshold value, control how long the distance finger can pull down to trigger release-to-refresh. **recommend 50 ~ 90, and a number provided bigger than 120, it willl stay at 120.**                                                                                                                                    |
| `pullDownText`      | String   | `'Pull down'`           | The text show in pull-down state, in the example it refers to 'Keep Dragging'.                                                                                                                                                                                                                                            |
| `releaseText`       | String   | `'Release to refresh'`  | The text show in release-to-update state. In the example it refers to 'Now can release'.                                                                                                                                                                                                                                          |
| `refreshText`       | String   | `'Updating'`            | The text show in the refresh action takes place. In the example it refers to 'Updating'.                                                                                                                                                                                                                         |
| `finishText`        | String   | `'Done Refresh'`        | The text show in the refresh action is done. In the example it refers to 'Done'.<br><br> There is a `trigger()` you can use to manually trigger a pull-down-refresh, and the trigger function actually have a paramter call `statusText`, for detail see the Usage part below. basically it let you change the text shown. |
| `refresher`         |          |                         | The function will be fired. **Promise Excepted**.                                                                                                                                                                                                                                                       |

## License
MIT License Copyright (c) 2018 Lien
