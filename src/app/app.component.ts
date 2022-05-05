import { Component, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'client';
  message = '';
  messages: any[];

  ngOnInit(): void {
    this.messages = [];
  }

  ngOnDestroy(): void {
  }
}
