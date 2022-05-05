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
        url: 'ws://localhost:8080/rsocket'
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
      li.innerText = payload.data;
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
          metadata: String.fromCharCode('my-channel'.length) + 'my-channel'
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
      // numberRequester(sock, 10);
      channelRequest(sock, this.processor);
      this.processor.onNext(10);

      channelRequestNotification(sock, this.processor);
    }, errorHandler);

    this.client.connect().then(sock => {
      channelRequestNotification(sock, this.processor);
      this.processor.onNext({
        "source": "Angular JS",
        "destination": "Spring boot reactive Java",
        "text": "This is the best example of reactive programing with :: " + this.message
      });
    }, errorHandler);
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    if (searchValue.length > 0) {
      this.processor.onNext(parseInt(searchValue));
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.client) {
      this.client.close();
    }
  }
}
