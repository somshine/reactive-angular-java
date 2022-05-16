import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoadTodoListComponent } from './components/auto-load-todo-list/auto-load-todo-list.component';
import { RequestChannelComponent } from './components/request-channel/request-channel.component';
import { TodoAddComponent } from './components/todo-add/todo-add.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoViewComponent } from './components/todo-view/todo-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/request-channel', pathMatch: 'full' },
  { path: 'request-channel', component: RequestChannelComponent },
  { path: 'todo/listing', component: TodoListComponent },
  { path: 'todo/view/:id', component: TodoViewComponent },
  { path: 'todo/add', component: TodoAddComponent },
  { path: 'todo/auto', component: AutoLoadTodoListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
