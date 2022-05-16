import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from '../model/todo';
@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const Todoes = [
      { id: 1, title: 'Sprint Planning', description: 'Sprint Planning', date: "19-03-2022", isCompleted: true},
      { id: 2, title: 'Analysis', description: 'Analysis', date: "19-03-2022", isCompleted: true},
      { id: 3, title: 'Estimation', description: 'Estimation', date: "19-03-2022", isCompleted: true},
      { id: 4, title: 'POC', description: 'POC', date: "19-03-2022", isCompleted: false},
      { id: 5, title: 'Approval', description: 'Approval', date: "19-03-2022", isCompleted: false}
    ];
    return {Todoes};
  }

  // Overrides the genId method to ensure that a Todo always has an id.
  // If the Todoes array is empty,
  // the method below returns the initial number (11).
  // if the Todoes array is not empty, the method below returns the highest
  // Todo id + 1.
  genId(Todoes: Todo[]): number {
    return Todoes.length > 0 ? Math.max(...Todoes.map(Todo => Todo.id)) + 1 : 11;
  }
}
