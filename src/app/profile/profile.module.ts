import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileRoutingModule } from '@app/profile/profile-routing.module';

@NgModule({
  imports: [CommonModule, TranslateModule, ProfileRoutingModule],
  declarations: [ProfileComponent]
})
export class ProfileModule {}
