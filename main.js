require(['./dist/ptr'], (PTR) => {
  
  const $ = selector => document.querySelector(selector)

  let $content = $('.content ul')
  let $trigger = $('.btn__refresh')

  let $html = [...Array(55)].map((_, i) => {
    return `<li class="list">list: {{i}}</li>`.replace(/{{i}}/, ++i)
  }).join('')

  $content.innerHTML =$html

  const refresher = (statusText) => {
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