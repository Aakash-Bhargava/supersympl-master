import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleOptionsPage } from './schedule-options';

@NgModule({
  declarations: [
    ScheduleOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleOptionsPage),
  ],
  exports: [
    ScheduleOptionsPage
  ]
})
export class ScheduleOptionsPageModule {}
