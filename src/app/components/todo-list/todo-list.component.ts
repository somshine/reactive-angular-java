import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Todo } from 'src/app/model/todo';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getTodoListing();
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
    title = title.trim();
    if (!title) { return; }
    let date = new Date().toDateString();
    let description = title;
    this.todoService.addTodo({ title, description, date, isCompleted } as Todo)
      .subscribe(hero => {
        this.todos.push(hero);
      });
  }

  delete(hero: Todo): void {
    this.todos = this.todos.filter(h => h !== hero);
    this.todoService.deleteTodo(hero.id).subscribe();
  }
}
