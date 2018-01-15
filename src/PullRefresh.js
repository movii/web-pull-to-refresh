import SCSS from './PullRefresh.scss'
import {
  $,
  style,
  addEvent,
  removeEvent,
  preventMobileChromeDefaultPullRefresh,
  delay
} from './utils'

class PTR {
  constructor(options) {
    this.options = Object.assign({}, PTR.defaults, options)
    this.state = PTR.states
    this.distanceToRefresh = this.options.distanceToRefresh
    this.init()
  }

  // refs of
  getElement() {
    this.$contain = this.options.contain
    this.$header = this.options.header
    this.$content = this.options.content
    
    // status text: eg 正在刷新，
    this.$statusText = $('.status-text', this.$header)
    this.$statusArrow = $('.status-arrow', this.$header)
    this.$statusLoader = $('.status-loader', this.$header)
    this.$loadingContain = $('.loading', this.$header)

    return this
  }

  // refs of container's classlist
  getClass() {
    this.$containClass = this.$contain.classList
    return this
  }

  // refs of header.style and content.style
  getStyleObj() {
    this.$headerStyles = this.$header.style
    this.$contentStyles = this.$content.style
    return this
  }

  init() {
    this
      .getElement()
      .getClass()
      .getStyleObj()
      .addEvt()

    preventMobileChromeDefaultPullRefresh()
  }

  addEvt() {
    addEvent(this.$contain, 'touchstart', this._touchstart.bind(this))
    addEvent(this.$contain, 'touchmove', this._touchmove.bind(this))
    addEvent(this.$contain, 'touchend', this._touchend.bind(this))
  }

  removeEvt() {
    removeEvent(this.$contain, 'touchstart', this._touchstart.bind(this))
    removeEvent(this.$contain, 'touchmove', this._touchmove.bind(this))
    removeEvent(this.$contain, 'touchend', this._touchend.bind(this))
  }

  // handle 'touchstart' evt
  _touchstart(e) {
    if (this.state.loading) return
    this.state.enable = this.$contain.scrollTop === 0 ? true : false
    this.state.startPos = e.touches[0].pageY
  }

  // handle 'touchmove' evt
  _touchmove(e) {
    if (!this.state.enable || this.state.loading) return

    let distance = e.changedTouches[0].pageY - this.state.startPos
    distance = this.state.distance = distance > 120 ? 120 : distance

    if (distance <= 20) return

    if (window.scrollY <= 0) {
      if (distance - window.scrollY <= this.distanceToRefresh) {
        this.setStatusReady()
      } else {
        this.setStatusPullDown()
      }
      this.handleTouchMove()
    }
  }

  // handle 'touchend' evt
  _touchend() {
    if (!this.state.enable || this.state.loading) return

    if (this.$containClass.contains('should-refresh') && window.scrollY <= 0) {
      this.state.loading = true
      this.setStatusLoad()

      if (
        this.options 
        && this.options.refresher 
        && typeof this.options.refresher === 'function'
      ) {
        this.takeAction()
      }
    } else if (window.scrollY <= 0) {
      this.handleTouchEnd()
      this.reset()
    } else {
      this.reset()
    }
  }

  takeAction () {
    return Promise
      .resolve(this.options.refresher(this.$statusText))
      .then(() => {
        return this.setStatusFinish().then(() => delay(850).then(() => {
          this.reset()
          this.options.loading = false
        }))
      })
  }

  trigger () {
    if (this.options.loading) return
    this.options.loading = true 
    this.setStatusLoad()
    return this.takeAction().then(() => delay(50))
  }

  // the status of init status, also the pull down distance less than the distanceToRefresh
  setStatusReady() {
    this.hideLoader()
    this.rotateArrow(135)
    style(this.$header).set('transition', '')
    this.$containClass.remove('should-refresh')
    this.$statusText.innerHTML = this.options.pullDownText
  }

  // the status of pull down distance great than distanceToRefresh
  setStatusPullDown() {
    this.rotateArrow(315)
    this.$containClass.add('should-refresh')
    style(this.$header).set('transition', '')
    this.$statusText.innerHTML = this.options.releaseText
  }

  // the status of pull down distance great than distanceToRefresh and release finger
  setStatusLoad() {
    this.showLoader()
    this.$statusText.innerHTML = this.options.refreshText
    style(this.$content).set('transition', '300ms')
    style(this.$content).set('transform', `translate3d(0, ${this.distanceToRefresh}px, 0 )`)
    style(this.$header).set('transition', '300ms')
    style(this.$header).set('height', `${this.distanceToRefresh}px`)
    style(this.$loadingContain).set('transition', '300ms')
    style(this.$loadingContain).set('height', `${this.distanceToRefresh}px`)
  }

  setStatusFinish () {
    return new Promise(resolve => {
      style(this.$statusLoader).set('display', 'none')
      style(this.$statusArrow).set('display', 'none')
      let statusText = $('.status-text', this.$header).innerHTML

      if (statusText !== this.options.finishText && statusText !== this.options.refreshText) {
        this.$statusText.innerHTML = statusText
      }
      else {
        this.$statusText.innerHTML = this.options.finishText
      }
      resolve()
    })
  }

  // toggle UI arrow and loading animation
  showLoader() {
    style(this.$statusLoader).set('display', 'block')
    style(this.$statusArrow).set('display', 'none')
  }

  hideLoader() {
    style(this.$statusLoader).set('display', 'none')
    style(this.$statusArrow).set('display', 'block')
  }

  // animate UI arrow
  rotateArrow(deg) {
    style(this.$statusArrow).set('transform', `rotate(${deg}deg)`)
  }

  // reset all transfrom and states to init value
  reset() {
    this.hideLoader()
    style(this.$header).set('transition', '130ms')
    style(this.$content).set('transition', '130ms')
    style(this.$statusArrow).set('transform', '')

    style(this.$header).set('height', '')
    style(this.$header).set('transition', '')

    style(this.$loadingContain).set('height', '')
    style(this.$loadingContain).set('transition', '')

    style(this.$content).set('transform', `translate3d(0, 0, 0 )`)
    style(this.$content).set('transform', ``)
    style(this.$content).set('transition', '')

    this.state = Object.assign({}, PTR.states)
    this.state.loading = false
  }

  // handle $header & $content transform anaimtion while touchmove
  handleTouchEnd() {
    style(this.$header).set('transition', '330ms')
    style(this.$content).set('transition', '330ms')
    style(this.$header).set('height', `${(this.distanceToRefresh - this.$header.offsetHeight)}px`)
    style(this.$content).set('transform', ``)
    style(this.$loadingContain).set('height', `${(this.distanceToRefresh - this.$header.offsetHeight)}px`)
  }

  // handle $header & $content transform anaimtion while touchend
  handleTouchMove() {
    style(this.$header).set('transition', '')
    style(this.$header).set('height', `${this.state.distance * 0.7}px`)

    style(this.$content).set('transition', '')
    style(this.$content).set('transform', `translate3d(0, ${this.state.distance * 0.7}px, 0 )`)

    style(this.$loadingContain).set('transition', '')
    style(this.$loadingContain).set('height', `${this.state.distance * 0.7}px`)
  }
}

function refresher() {
  alert('refresh handler fires')
}

// pull to refresh default options
PTR.defaults = {
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

// pull to refresh state
PTR.states = {
  enable: false,
  startPos: 0,
  distance: 0,
  loading: false
}

export default PTR
