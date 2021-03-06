import { Component, OnDestroy, OnInit } from '@angular/core';
import { IdentitySerializer, JsonSerializer, RSocketClient } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { Subject } from 'rxjs';
const { Single, FlowableProcessor } = require('rsocket-flowable');

// https://www.vinsguru.com/rsocket-websocket-spring-boot/

@Component({
  selector: 'app-request-channel',
  templateUrl: './request-channel.component.html',
  styleUrls: ['./request-channel.component.css']
})
export class RequestChannelComponent implements OnInit, OnDestroy {

  title = 'client';
  message = '';
  messages: any[];
  client: RSocketClient;
  sub = new Subject();
  processor = new FlowableProcessor(sub => { });
  processorNotification = new FlowableProcessor(sub => { });
  inputValue: string;

  constructor() { }

  ngOnInit(): void {
    console.log("Loading the channel");
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
      li.innerText = payload.data;
      li.classList.add('list-group-item', 'small')
      document.getElementById('result').appendChild(li);
    }

    const handleNotificationResponse = (payload) => {
      const li = document.createElement('li');
      li.innerText = payload.data.title;
      li.classList.add('list-group-item', 'small')
      document.getElementById('result').appendChild(li);
    }

    const numberRequester = (socket, value) => {
      socket.requestStream({
        data: value,
        metadata: String.fromCharCode('number.stream'.length) + 'number.stream'
      }).subscribe({
        onError: errorHandler,
        onNext: responseHandler,
        onSubscribe: subscription => {
          subscription.request(100); // set it to some max value
        }
      })
    }

    // reactive stream processor
    this.processor = new FlowableProcessor(sub => { });

    const channelRequest = (socket, processor) => {
      socket.requestChannel(processor.map(i => {
        return {
          data: i,
          metadata: String.fromCharCode('number.channel'.length) + 'number.channel'
        }
      })).subscribe({
        onError: errorHandler,
        onNext: responseHandler,
        onSubscribe: subscription => {
          subscription.request(100); // set it to some max value
        }
      })
    }

    const channelRequestNotification = (socket, processor) => {
      socket.requestChannel(processor.map(i => {
        return {
          data: i,
          metadata: String.fromCharCode('test-channel'.length) + 'test-channel'
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
    // my-channel

    this.client.connect().then(sock => {
      channelRequest(sock, this.processor);
      this.processor.onNext(10);

      channelRequestNotification(sock, this.processorNotification);

      //Notification Object
      // this.processorNotification.onNext({
      //   "source": "Angular JS",
      //   "destination": "Spring boot reactive Java",
      //   "text": "This is the best example of reactive programing with :: " + this.message
      // });

      this.processorNotification.onNext({
        "title": "Test 8",
        "destination": "This is the best example of reactive programing with :: " + this.message,
        "dueDate": "2022-05-15",
        "isCompleted": true
      });

    }, errorHandler);
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    if (searchValue.length > 0) {
      this.processor.onNext(parseInt(searchValue));

      this.processorNotification.onNext({
        "source": "Angular JS",
        "destination": "Spring boot reactive Java",
        "text": "This is the best example of reactive programing with :: " + this.message
      });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.client) {
      this.client.close();
    }
  }
}
