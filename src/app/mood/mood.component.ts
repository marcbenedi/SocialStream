import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-mood',
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.scss']
})
export class MoodComponent implements OnInit {

  constructor(
    private zone: NgZone,
    private http: HttpClient
  ) { 
    this.apiResult = []
  }

  apiResult: Array<any>;

  ngOnInit(): void {

    let username = ''
    chrome.storage.sync.get('users', (users) => {
      username = users['users']
    });

    let streamName = ''
    this.http.get('http://localhost:5000/users')
      .toPromise()
      .then((result: any) => {
        for (var i = 0; i < result.length; i += 1) {
          if (result[i].name == username) {
            streamName = result[i].stream.name
          }
        }
        this.http.get('http://localhost:5000/related/'+encodeURIComponent(streamName))
          .toPromise()
          .then((ee:any) => {
            this.zone.run(() => {
              this.apiResult = ee
            })
          })
      })
      .catch((e) => {
        console.log('e', e)
      })
      .finally(() => {
        console.log('f')
      })


  }

}
