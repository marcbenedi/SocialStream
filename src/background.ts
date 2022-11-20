chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#3aa757' });
  chrome.webNavigation.onCompleted.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
      if (id) {
        chrome.action.disable(id);
      }
    });
  }, { url: [{ hostContains: 'google.com' }] });
});


chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (activeInfo.tabId === tabId && changeInfo.url) {
       console.log(`URL has changed to ${changeInfo.url}`)
       if (changeInfo.url.includes('netflix.com')) {
         chrome.action.setBadgeText({text:'👀'});
         chrome.action.setBadgeBackgroundColor({color: '#F50000'})
       } else {
        chrome.action.setBadgeText({text:''})
         chrome.action.setBadgeBackgroundColor({color: ''})
      }

       if (changeInfo.url.includes('netflix.com/watch')) {
        console.log('yeah you are watching netflix!')

        // let name = ''
        // chrome.storage.sync.get('users', (users) => {
        //   name = users['users']
        // });

        // let request = new XMLHttpRequest();
        // request.open("PUT", "http://localhost:5000/user/" + encodeURIComponent(name));
        // request.setRequestHeader("Content-Type", "application/json")
        // request.send(JSON.stringify({ name: name, url: changeInfo.url, time: 0, isPlaying: true }));
        // request.onload = () => {
        //   console.log(request);
        // }
      }
    }
  })
})
