import {Injectable} from "@angular/core";
import {Http, HttpResponse} from "@capacitor-community/http";
//import {HttpResponse} from "@angular/common/http";

export interface User {
  id?: number;
  email: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private resourceUrl = "http://localhost:3000/user";

  constructor() {}

  create(user: User): Promise<HttpResponse> {
    const options = {
      url: `${this.resourceUrl}/register`,
      data: user,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    };

    return Http.post(options);
  }

  update(user: User): Promise<HttpResponse> {
    const options = {
      url: `${this.resourceUrl}/${user.id}`,
      data: user,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    };

    return Http.put(options);
  }

  findAll(): Promise<HttpResponse> {
    const options = {
      url: `${this.resourceUrl}`,
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
}
