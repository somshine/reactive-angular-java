import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IdentitySerializer, JsonSerializer, RSocketClient } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { fromEvent, Subject } from 'rxjs';
import { Todo } from 'src/app/model/todo';
import { TodoService } from 'src/app/services/todo.service';
const { Single, FlowableProcessor } = require('rsocket-flowable');

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.scss']
})
export class TodoAddComponent implements OnInit {
  title = 'client';
  message = '';
  messages: any[];
  client: RSocketClient;
  sub = new Subject();
  processor = new FlowableProcessor(sub => { });
  processorNotification = new FlowableProcessor(sub => { });
  inputValue: string;

  todos: Todo[] = [];

  constructor(private todoService: TodoService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getTodoListing();
    // Create an instance of a client

    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer
      },
      setup: {
        // ms btw sending keepalive to server
        keepAlive: 60000,
        // ms timeout if no keepalive response
        lifetime: 180000,
        // format of `data`
        dataMimeType: 'application/json',
        // format of `metadata`
        metadataMimeType: 'message/x.rsocket.routing.v0',
      },
      transport: new RSocketWebSocketClient({
        url: 'ws://localhost:7000/rsocket'
      }),
    });

    // error handler
    const errorHandler = (e) => console.log(e);
    // response handler
    const responseHandler = (payload) => {
      const li = document.createElement('li');
      this.todos.push(payload.data);
      li.innerText = payload.data;
      li.classList.add('list-group-item', 'small')
      document.getElementById('result').appendChild(li);
    }

    const handleNotificationResponse = (payload) => {
      const li = document.createElement('li');
      li.innerText = payload.data;
      li.classList.add('list-group-item', 'small')
      document.getElementById('result').appendChild(li);
    }

    // reactive stream processor
    this.processor = new FlowableProcessor(sub => { });

    const channelRequestNotification = (socket, processor) => {
      socket.requestChannel(processor.map(i => {
        return {
          data: i,
          metadata: String.fromCharCode('my-channel'.length) + 'my-channel'
          // metadata: String.fromCharCode('saveTodo'.length) + 'saveTodo'
        }
      })).subscribe({
        onError: errorHandler,
        onNext: handleNotificationResponse,
        onSubscribe: subscription => {
          subscription.request(100); // set it to some max value
        }
      })
    }

    this.client.connect().then(sock => {
      //FOr notification refer the request-channel
      channelRequestNotification(sock, this.processorNotification);
      this.processorNotification.onNext({
        "title": "Test 8",
        "destination": "This is the best example of reactive programing with :: " + this.message,
        "dueDate": "12/05/2022",
        "isCompleted": true
      });

    }, errorHandler);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.client) {
      this.client.close();
    }
  }

  ngAfterViewInit(): void {
    //Event observable
    fromEvent(document.getElementById("addNew")!, 'click').subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error),
      complete: () => console.log("Done with event based")
    });
  }

  getTodoListing(): void {
    // this.todoService.getTodoes().subscribe(todos => this.todos = todos);
    this.todoService.getTodoes().subscribe({
      next: (todos) => this.todos = todos,
      error: (error) => console.log(error),
      complete: () => console.log("Done with listing the todo items"),
    });
    // let todoListObservable$ = from(this.todos);
  }

  add(title: string, isCompleted: boolean): void {
    // title = title.trim();
    // if (!title) { return; }
    // let date = new Date().toDateString();
    // let description = title;
    // this.todoService.addTodo({ title, description, date, isCompleted } as Todo)
    //   .subscribe(hero => {
    //     this.todos.push(hero);
    //   });
    this.processorNotification.onNext({
      "title": "Test 8",
      "destination": "This is the best example of reactive programing with :: " + this.message,
      "dueDate": "12/05/2022",
      "isCompleted": true
    });
  }

  delete(hero: Todo): void {
    this.todos = this.todos.filter(h => h !== hero);
    this.todoService.deleteTodo(hero.id).subscribe();
  }

}
