import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '@app/service/members.service';
import { Member } from '@app/model/member';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private routeName: string;
  private memberName: string;
  private members: Member[];
  private currMember: Member;

  constructor(private route: ActivatedRoute, private membersService: MembersService) {
    this.route.params.subscribe(params => (this.routeName = params['name']));
  }

  /**
   * pulls member data from api and sets current member according to route name
   */
  loadMemberData() {
    this.membersService.getMembers().subscribe(
      members => {
        this.members = members;
        this.currMember = this.members.find(
          member => member.name.toLowerCase() === this.routeName.toLowerCase().replace('_', ' ')
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit() {
    this.loadMemberData();
  }
}
