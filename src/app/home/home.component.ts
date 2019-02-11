import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { MembersService } from '@app/service/members.service';
import { Member } from '@app/model/member';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  members: Member[];

  constructor(private quoteService: QuoteService, private membersService: MembersService) {}

  /**
   * Download members and generate quote
   */
  ngOnInit() {
    this.membersService.getMembers().subscribe(members => {
      this.members = members;
    });

    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }

  /**
   * Create url to link to individual profiles
   * @param name
   */
  createProfileURL(name: string): string {
    const normalized_name = name.toLowerCase().replace(' ', '_');
    const url = '/profile/' + normalized_name;
    return url;
  }
}
