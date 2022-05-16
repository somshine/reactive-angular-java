import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Todo } from '../model/todo';
import { Utils } from '../utils/Utils';



@Injectable({ providedIn: 'root' })
export class TodoService {

  private TodoesUrl = 'todoList';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,) { }

  /** GET Todoes from the server */
  getTodoes(): Observable<Todo[]> {
    let url = Utils.apiBaseUrl + "todo";
    console.log("Final URL" + url);
    return this.http.get<Todo[]>(url)
      .pipe(
        tap(_ => this.log('fetched Todos')),
        catchError(this.handleError<Todo[]>('getTodoes', []))
      );
  }

  /** GET Todo by id. Return `undefined` when id not found */
  getTodoNo404<Data>(id: number): Observable<Todo> {
    const url = `${this.TodoesUrl}/?id=${id}`;
    return this.http.get<Todo[]>(url)
      .pipe(
        map(Todoes => Todoes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} Todo id=${id}`);
        }),
        catchError(this.handleError<Todo>(`getTodo id=${id}`))
      );
  }

  /** GET Todo by id. Will 404 if id not found */
  getTodo(id: number): Observable<Todo> {
    const url = `${this.TodoesUrl}/${id}`;
    return this.http.get<Todo>(url).pipe(
      tap(_ => this.log(`fetched Todo id=${id}`)),
      catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  /* GET Todoes whose name contains search term */
  searchTodoes(term: string): Observable<Todo[]> {
    if (!term.trim()) {
      // if not search term, return empty Todo array.
      return of([]);
    }
    return this.http.get<Todo[]>(`${this.TodoesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found Todoes matching "${term}"`) :
        this.log(`no Todoes matching "${term}"`)),
      catchError(this.handleError<Todo[]>('searchTodoes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Todo to the server */
  addTodo(Todo: Todo): Observable<Todo> {
    let url = Utils.apiBaseUrl + "todo";
    return this.http.post<Todo>(url, Todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => this.log(`added Todo w/ id=${newTodo.id}`)),
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  /** DELETE: delete the Todo from the server */
  deleteTodo(id: number): Observable<Todo> {
    const url = `${this.TodoesUrl}/${id}`;

    return this.http.delete<Todo>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Todo id=${id}`)),
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }

  /** PUT: update the Todo on the server */
  updateTodo(Todo: Todo): Observable<any> {
    return this.http.put(this.TodoesUrl, Todo, this.httpOptions).pipe(
      tap(_ => this.log(`updated Todo id=${Todo.id}`)),
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TodoService message with the MessageService */
  private log(message: string) {
    // this.messageService.add(`TodoService: ${message}`);
  }
}
