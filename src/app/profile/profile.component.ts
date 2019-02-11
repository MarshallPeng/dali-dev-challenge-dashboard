import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '@app/service/members.service';
import { Member } from '@app/model/member';
import { environment } from '@env/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
/**
 * Component that handles display of user profiles.
 */
export class ProfileComponent implements OnInit {
  private routeName: string;
  private members: Member[];
  private currMember: Member;
  private profilePicture: any;
  private isImageLoading: boolean;
  private projects: string[];
  private terms: string[];

  constructor(private route: ActivatedRoute, private membersService: MembersService) {
    this.route.params.subscribe(params => (this.routeName = params['name']));
  }

  ngOnInit() {
    this.loadMemberData();
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
        this.currMember.url = this.reformatMemberURL(this.currMember.url);
        this.projects = this.currMember.project;
        this.terms = this.currMember.terms_on;
        this.getImageFromService();
      },
      err => {
        console.log(err);
      }
    );
  }

  createImageFromBlob(image: Blob) {
    console.log('creating image from Blob');
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.profilePicture = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService() {
    this.isImageLoading = true;
    this.membersService.getImage(environment.apiUrl + this.currMember.iconUrl).subscribe(
      data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      },
      error => {
        this.isImageLoading = false;
        console.log(error);
      }
    );
  }

  /**
   * Remove leading double slashes for member personal websites
   * @param url
   */
  private reformatMemberURL(url: string) {
    if (url.startsWith('//')) {
      return url.substring(2);
    }
    return url;
  }
}
