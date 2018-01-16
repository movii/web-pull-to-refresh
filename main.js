require(['./dist/ptr'], (PTR) => {
  
  const $ = selector => document.querySelector(selector)

  const $trigger = $('.btn__refresh')

  const refresher = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('new refresher')
        resolve()
      }, 2000)
    })
  }

  const options = {
    pullDownText: 'Keep Dragging',
    releaseText: 'Now can release',
    refreshText: 'Updating',
    finishText: 'Done',
    distanceToRefresh: 60,
    refresher: refresher
  }

  const ptr = new PTR(options)

  $trigger.addEventListener('click',  e => {
    e.preventDefault()
    ptr.trigger().then(() => {
      alert('after manual trigger')
    })
  }, { capture: false })
})