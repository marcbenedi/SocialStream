import { Component, OnInit } from '@angular/core';

const updateBackgroundColor = (color: string) => document.body.style.backgroundColor = color;
export const getSearchText = () => document.getElementById('searchInput')?.getAttribute('value');
export const getResults = () => {
  const shows = document.getElementsByClassName('fallback-text')
  var result = []
  for(var i = 0; i <= shows.length; i += 1) {
    let text = shows.item(i)?.innerHTML
    result.push(text);
  }
  return result
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  color = '#ffffff';

  ngOnInit(): void {
    chrome.storage.sync.get('color', ({ color }) => {
      this.color = color;
    });
  }

  public updateColor(color: string) {
    chrome.storage.sync.set({ color });
  }

  public colorize() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: updateBackgroundColor,
        args: [this.color]
      });
    });
  }
}
