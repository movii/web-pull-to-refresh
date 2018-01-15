// utils
// select element
export function $(selector, elem) {
  return !elem ? document.querySelector(selector) : elem.querySelector(selector)
}

// set element style
// in my case:
//  1. display: none/block
//  2. trnasform element
export function style(element) {
  if (!element) return
  return {
    set: (name, val) => {
      if (name === 'transform') {
        element.style['WebkitTransform'] = val
      }
      element.style[name] = val
    }
  }
}

// addEventListener
export function addEvent(n, e, c) {
  n.addEventListener(e, c, { capture: false, passive: false })
}

// removeEventListener
export function removeEvent(n, e, c) {
  n.removeEventListener(e, c)
}

export function preventMobileChromeDefaultPullRefresh() {
  let startY = 0

  addEvent(document, 'touchstart', (e) => {
    startY = e.touches[0].clientY
  })

  addEvent(document, 'touchmove', (e) => {
    if (window.pageYOffset <= 0 && e.touches[0].clientY - startY > 0) {
      e.preventDefault()
    }
  })
}

export function delay (t) {
  return new Promise(resolve => setTimeout(() => {
    resolve()
  }, t))
}