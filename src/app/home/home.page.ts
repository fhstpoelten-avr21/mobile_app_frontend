import {Component} from '@angular/core';
import {RefresherCustomEvent} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {DataService, Message} from '../services/data.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Todo, TodoService} from "../services/todo.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todos$: Todo[] = [];
  validateForm!: FormGroup;

  public createName: string;
  public createEmail: string;
  public createPassword: string;
  public createConfirmPassword: string;
  public signInEmail: string;
  public signInPassword: string;
  public jwt?: null|string;


  constructor(private http: HttpClient, private fb: FormBuilder, private todoService: TodoService, private data: DataService) {
  }

  createAccount(){
    let credentials = {
      name: this.createName,
      email: this.createEmail,
      password: this.createPassword,
      confirm: this.createConfirmPassword
    }
    this.http.post('http://localhost:3000/user/register', credentials).subscribe((res) => {
      console.log(res);
    });
  }
  signIn(){
    let credentials = {
      username: this.signInEmail,
      password: this.signInPassword
    }

    console.log('login', credentials)
    this.http.post('http://localhost:3000/auth/login', credentials).subscribe((res: any) => {
      console.log(res);
      // NOTE: This is just for testing, typically you would store the JWT in local storage and retrieve from there
      this.jwt = res.token;
    });
  }
  testRoute(){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.jwt)
    this.http.get('http://localhost:3000/user', {headers: headers}).subscribe((res) => {
      console.log(res);
    });
  }
  logout(){
    this.jwt = null;
  }

  // submitForm(value: { title: string, completed: false }): void {
  //   console.log(this.createEmail)
  //   for (const key in this.validateForm.controls) {
  //     if (this.validateForm.controls.hasOwnProperty('key')) {
  //       this.validateForm.controls[key].markAsDirty()
  //       this.validateForm.controls[key].updateValueAndValidity();
  //     }
  //   }
  //   value.completed = false;
  //   console.log('Submitted', value);
  //   this.todoService.create(value).then(() => {
  //     this.todoService.findAll().then((res) => {
  //       this.todos$ = res.data;
  //     });
  //   })
  //
  //   this.validateForm.reset();
  // }
  //
  // ngOnInit(): void {
  //   this.todoService.findAll().then((res) => {
  //     console.log(res.data)
  //     this.todos$ = res.data;
  //   })
  //   this.validateForm = this.fb.group({
  //     title: [null, Validators.required]
  //   })
  // }
  //
  // update = (todo: Todo) => {
  //   const updateTodo = Object.assign({}, todo);
  //   updateTodo.completed = !updateTodo.completed
  //   console.log('Todo updated', updateTodo)
  //   this.todoService.update(updateTodo).then(() => {
  //     this.todoService.findAll().then((res) => {
  //       this.todos$ = res.data;
  //     });
  //   });
  // }
  //
  // delete = (todo: Todo) => {
  //   console.log('Delete', todo);
  //   if (todo.id != null) {
  //     this.todoService.delete(todo.id).then(() => {
  //       this.todoService.findAll().then(res => {
  //         this.todos$ = res.data
  //       })
  //     })
  //   }
  //   console.log('Delete', todo);
  // }
  //
  // refresh(ev: any) {
  //   this.todoService.findAll().then(res => {
  //     this.todos$ = res.data;
  //     ev.detail.complete();
  //   })
  // }
  //
  // getMessages(): Message[] {
  //   return this.data.getMessages();
  // }

}
