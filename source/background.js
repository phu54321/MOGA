import tldList from './tldList'

const maybeNonTLDQuery = /^https?:\/\/([^/]+)\/$/
browser.webNavigation.onBeforeNavigate.addListener((evt) => {
  // Ignore non-top-level navigation. e.g) iframe
  if (evt.frameId !== 0) return

  const tabId = evt.tabId

  // Non-standard tld test
  if (maybeNonTLDQuery.test(evt.url)) {
    const url = evt.url.match(maybeNonTLDQuery)[1]
    const segments = url.split('.')
    const tld = segments[segments.length - 1].toUpperCase()

    if (tldList.indexOf(tld) === -1) {
      if (url.startsWith('www.')) return searchWith(url.substr(4), tabId)
      else return searchWith(url, tabId)
    }
  }
})

function searchWith (query, tabId) {
  browser.search.search({ query, tabId })
}
