import {Injectable} from "@angular/core";
import {Http, HttpResponse} from "@capacitor-community/http";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
//import {HttpResponse} from "@angular/common/http";

export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  userId?: string
}

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private resourceUrl = "http://localhost:3000/todos";
  private userId = null

  constructor(private authService: AuthService) {}

  create(todo: Todo): Promise<HttpResponse> {
    //TODO add user ID
    const options = {
      url: `${this.resourceUrl}`,
      data: todo,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    };

    return Http.post(options);
  }

  update(todo: Todo): Promise<HttpResponse> {
    const options = {
      url: `${this.resourceUrl}/${todo.id}`,
      data: todo,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    };

    return Http.put(options);
  }

  findAll(): Promise<HttpResponse> {
    const options = {
      url: `${this.resourceUrl}?user=${this.userId}`,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    };

    return Http.get(options);
  }

  find(id: number): Promise<HttpResponse> {
    const options = {
      url: `${this.resourceUrl}/${id}`,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    };

    return Http.get(options);
  }

  delete(id: number): Promise<HttpResponse> {
    const options = {
      url: `${this.resourceUrl}/${id}`,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    };

    return Http.del(options);
  }
}
