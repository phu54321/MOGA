import tldList from './tldList'

const maybeNonTLDQuery = /^https?:\/\/([^/]+)\/$/
browser.webNavigation.onCommitted.addListener((evt) => {
  if (evt.frameId !== 0) {
    return
  }

  // Ignore non-omnibox-typed events
  if (evt.transitionType !== 'typed') return

  console.log('onCommitted', evt)

  // Non-standard tld
  if (maybeNonTLDQuery.test(evt.url)) {
    const url = evt.url.match(maybeNonTLDQuery)[1]
    const segments = url.split('.')
    const tld = segments[segments.length - 1].toUpperCase()

    if (tldList.indexOf(tld) === -1) {
      if (url.startsWith('www.')) return searchWith(url.substr(4))
      else return searchWith(url)
    }
  }
})

async function searchWith (query) {
  const currentTabs = await browser.tabs.query({ active: true, currentWindow: true })
  if (currentTabs.length !== 1) {
    throw new Error('Invalid currentTabs: ' + currentTabs)
  }
  const currentTab = currentTabs[0]
  browser.search.search({ query, tabId: currentTab.id })
}
