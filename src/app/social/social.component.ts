import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  friends: Array<any>


  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) { 
    this.friends = []
  }

  ngOnInit(): void {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      var activeTab = tabs[0];
      if (activeTab.url?.includes('watch')) {
        this.shareYours()
      }
    });

    this.getFriends();
  }

  getFriends(): void {
    this.http.get('http://localhost:5000/users')
      .toPromise()
      .then((i: any) => {
        this.zone.run(() => {
          this.friends = i
        });
        console.log('i', i)
      })
      .catch((e) => {
        console.log('e', e)
      })
      .finally(() => {
        console.log('f')
      })

  }

  shareYours(): void {
    console.log('clicked')

    chrome.storage.sync.get('users', (users) => {
      let name = users['users']

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        var activeTab = tabs[0];
        console.log(activeTab.url)

        this.http.put(
          'http://localhost:5000/user/' + encodeURIComponent(name!), {
            name: '', url: activeTab.url, time: 0, isPlaying: false
          })
          .toPromise()
          .then((i: any) => {
            console.log('i', i)
          })
          .catch((e) => {
            console.log('e', e)
          })
          .finally(() => {
            console.log('f')
          })

      });

    });

  }
}
