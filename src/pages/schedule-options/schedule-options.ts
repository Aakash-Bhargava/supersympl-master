import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';


@IonicPage()
@Component({
  selector: 'page-schedule-options',
  templateUrl: 'schedule-options.html',
})
export class ScheduleOptionsPage {

  event = <any>{};

  today = new Date();
  form: FormGroup;
  isReadyToSave: boolean;

  constructor(public navCtrl: NavController,private apollo: Angular2Apollo, public toast: ToastController, public viewCtrl: ViewController, public navParams: NavParams, public formBuilder: FormBuilder,) {

    this.event = this.navParams.get('event');
    console.log(this.event);

    this.form = formBuilder.group({
     title: [this.event.title, Validators.required],
     section: [this.event.section.courseName, Validators.required],
     dueDate: [this.event.dueDate, Validators.required],
     dueTime: [this.event.dueTime, Validators.required],
     url: [this.event.url],
     description: [this.event.description]
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  save() {
    var tempDueDate = new Date(this.form.value.dueDate);
    tempDueDate.setHours(0,0,0,0);
    this.apollo.mutate({
      mutation: gql`
      mutation updateEvent($id: ID!,
                          $title: String,
                          $dueDate: DateTime,
                          $dueTime: DateTime,
                          $url: String,
                          $description: String){

        updateEvent(id: $id,
                    title: $title,
                    dueDate: $dueDate,
                    dueTime: $dueTime,
                    url: $url,
                    description: $description) {
                      title
                    }
                  }
      `,
      variables: {
        id: this.event.id,
        title: this.form.value.title,
        dueDate: tempDueDate,
        dueTime: this.form.value.dueTime,
        url: this.form.value.url,
        description: this.form.value.description
      }
    }).toPromise().then(({data}) => {
      let toast = this.toast.create({
        message: 'Event edited!',
        position: 'top',
        duration: 3000
      });
      toast.present();
      this.viewCtrl.dismiss();
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }


}
