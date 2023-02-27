import {Component} from '@angular/core';
import {RefresherCustomEvent} from '@ionic/angular';

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

  constructor(private fb: FormBuilder, private todoService: TodoService) {
  }

  submitForm(value: { title: string, completed: false }): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty('key')) {
        this.validateForm.controls[key].markAsDirty()
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    value.completed = false;
    this.todoService.create(value).then(() => {
      this.todoService.findAll().then((res) => {
        this.todos$ = res.data;
      });
    })

    this.validateForm.reset();
  }

  ngOnInit(): void {
    this.todoService.findAll().then((res) => {
      this.todos$ = res.data;
    })
    this.validateForm = this.fb.group({
      title: [null, Validators.required]
    })
  }

  update = (todo: Todo) => {
    const updateTodo = Object.assign({}, todo);
    updateTodo.completed = !updateTodo.completed
    this.todoService.update(updateTodo).then(() => {
      this.todoService.findAll().then((res) => {
        this.todos$ = res.data;
      });
    });
  }

  delete = (todo: Todo) => {
    if (todo.id != null) {
      this.todoService.delete(todo.id).then(() => {
        this.todoService.findAll().then(res => {
          this.todos$ = res.data
        })
      })
    }
  }

  refresh(ev: any) {
    this.todoService.findAll().then(res => {
      this.todos$ = res.data;
      ev.detail.complete();
    })
  }

}
