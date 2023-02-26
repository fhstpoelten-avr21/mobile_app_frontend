import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {TodoComponent} from "./todo.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [TodoComponent],
  exports: [TodoComponent]
})
export class TodoComponentModule {
}
