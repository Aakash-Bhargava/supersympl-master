import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudygroupPage } from './studygroup';

@NgModule({
  declarations: [
    StudygroupPage,
  ],
  imports: [
    IonicPageModule.forChild(StudygroupPage),
  ],
  exports: [
    StudygroupPage
  ]
})
export class StudygroupPageModule {}
