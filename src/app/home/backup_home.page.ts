import {Component} from '@angular/core';
import {RefresherCustomEvent} from '@ionic/angular';

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

  constructor(private fb: FormBuilder, private todoService: TodoService, private data: DataService) {
  }

  submitForm(value: { title: string, completed: false }): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty('key')) {
        this.validateForm.controls[key].markAsDirty()
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    value.completed = false;
    console.log('Submitted', value);
    this.todoService.create(value).then(() => {
      this.todoService.findAll().then((res) => {
        this.todos$ = res.data;
      });
    })

    this.validateForm.reset();
  }

  ngOnInit(): void {
    this.todoService.findAll().then((res) => {
      console.log(res.data)
      this.todos$ = res.data;
    })
    this.validateForm = this.fb.group({
      title: [null, Validators.required]
    })
  }

  update = (todo: Todo) => {
    const updateTodo = Object.assign({}, todo);
    updateTodo.completed = !updateTodo.completed
    console.log('Todo updated', updateTodo)
    this.todoService.update(updateTodo).then(() => {
      this.todoService.findAll().then((res) => {
        this.todos$ = res.data;
      });
    });
  }

  delete = (todo: Todo) => {
    console.log('Delete', todo);
    if (todo.id != null) {
      this.todoService.delete(todo.id).then(() => {
        this.todoService.findAll().then(res => {
          this.todos$ = res.data
        })
      })
    }
    console.log('Delete', todo);
  }

  refresh(ev: any) {
    this.todoService.findAll().then(res => {
      this.todos$ = res.data;
      ev.detail.complete();
    })
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

}
