import tldList from './tldList'

const maybeNonTLDQuery = /^http:\/\/([^/]+)\/$/
const rSubredditQuery = /^http:\/\/www.r.com\/([^/]+)$/

browser.webNavigation.onBeforeNavigate.addListener((evt) => {
  // Ignore non-top-level navigation. e.g) iframe
  if (evt.frameId !== 0) return

  const tabId = evt.tabId
  const navUrl = evt.url

  if (maybeNonTLDQuery.test(navUrl)) { // Not-so-common tld (ex: node.js)
    const url = navUrl.match(maybeNonTLDQuery)[1]
    const segments = url.split('.')
    const tld = segments[segments.length - 1].toUpperCase()

    if (tldList.indexOf(tld) === -1) {
      if (url.startsWith('www.')) return searchWith(url.substr(4), tabId)
      else return searchWith(url, tabId)
    }
  } else if (rSubredditQuery.test(navUrl)) { // Subreddit
    const subreddit = navUrl.match(rSubredditQuery)[1]
    searchWith(`r/${subreddit}`, tabId)
  }
})

function searchWith (query, tabId) {
  browser.search.search({ query, tabId })
}
