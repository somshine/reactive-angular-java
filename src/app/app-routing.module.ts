import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestChannelComponent } from './components/request-channel/request-channel.component';

const routes: Routes = [
  { path: '', redirectTo: '/request-channel', pathMatch: 'full' },
  { path: 'request-channel', component: RequestChannelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
