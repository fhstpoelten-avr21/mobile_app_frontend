import {Component, Input, OnInit} from "@angular/core";
import {Todo} from "../services/todo.service";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  @Input() todo: Todo | undefined;
  // @ts-ignore
  @Input() update!: (todo) => void;
  // @ts-ignore
  @Input() delete!: (todo) => void;

  ngOnInit(): void {

  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
