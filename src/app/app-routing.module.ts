import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FindItemComponent } from './find-item/find-item.component';
import { MoodComponent } from './mood/mood.component';
import { SocialComponent } from './social/social.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'find-item', component: FindItemComponent },
  { path: 'mood', component: MoodComponent },
  { path: 'social', component: SocialComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
