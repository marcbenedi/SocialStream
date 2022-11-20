import { Component, NgZone, OnInit } from '@angular/core';
import { getResults, getSearchText } from '../app.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-find-item',
  templateUrl: './find-item.component.html',
  styleUrls: ['./find-item.component.scss']
})
export class FindItemComponent implements OnInit {

  isNetflixSearch: Boolean;
  isShowFound: Boolean;
  apiResult: Array<any>;

  constructor(private zone:NgZone, private http:HttpClient) {
    this.isNetflixSearch = false;
    this.isShowFound = false;
    this.apiResult = [];
  }

  ngOnInit(): void { 

    let searchText = ''

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      this.zone.run(() => {
        let url = tabs[0].url!;
        this.isNetflixSearch = url.includes('netflix.com/search')
      });

      console.log('tab info', tabs[0]);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: getSearchText,
        args: []
      },
      (result) => {
          searchText = result[0].result.toLowerCase();
          console.log('search value', searchText);
        });

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: getResults,
        args: []
      },
      (result) => {
          this.zone.run(() => {
            result[0].result.forEach((show_title: any) => {
              if (String(show_title).toLowerCase() == searchText) {
                this.isShowFound = true;
              }
            });
            console.log('is found', this.isShowFound);
            if (!this.isShowFound) {
              this.http.get('http://localhost:5000/find/' + encodeURIComponent(searchText)).toPromise()
                .then((i: any) => {
                  console.log('i', i)
                  this.apiResult = i
                })
                .catch((e) => {
                  console.log('e', e)
                })
                .finally(() => {
                  console.log('f')
                })
            }
          });
        });
    });
  }

}
