import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { Member } from '@app/model/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private MEMBERS_URL = 'members.json';
  private data: any;
  private observable: Observable<Member[]>;

  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.data) {
      return of(this.data);
    } else if (this.observable) {
      return this.observable;
    } else {
      this.observable = this.http
        .get(environment.apiUrl + this.MEMBERS_URL, {
          observe: 'response'
        })
        .pipe(
          map(response => {
            this.observable = null;
            if (response.status === 400) {
              return 'Request failed.';
            } else if (response.status === 200) {
              this.data = response.body;
              return this.data;
            }
          })
        )
        .pipe(share());
      return this.observable;
    }
  }
}
