import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isSubmitted = false;

  name = new FormControl('')
  loginForm = this.formBuilder.group({
  })

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    chrome.storage.sync.get('users', (users) => {
      this.name.setValue(users['users'])
    });
    // chrome.storage.sync.clear()

  }

  onSubmit(): void {
    this.loginForm.reset();
    this.isSubmitted = true;

    this.http.post(
      'http://localhost:5000/user/' + encodeURIComponent(this.name.value!), {})
        .toPromise()
        .then((i: any) => {
          console.log('i', i)
          chrome.storage.sync.set({'users': this.name.value}) 
        })
        .catch((e) => {
          console.log('e', e)
        })
        .finally(() => {
          console.log('f')
        })

  }

}
