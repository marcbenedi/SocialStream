import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FindItemComponent } from './find-item/find-item.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MoodComponent } from './mood/mood.component';
import { SocialComponent } from './social/social.component';

@NgModule({
  declarations: [
    AppComponent,
    FindItemComponent,
    HomeComponent,
    MoodComponent,
    SocialComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
