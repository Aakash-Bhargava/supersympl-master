import { Component } from '@angular/core';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';



@Component({
  selector: 'addEventModal',
  templateUrl: 'addEventModal.html'
})
export class addEventModal {

  sections = <any>[];
  section: any;
  teaching = <any>[];
  data: any;

  today = new Date();
  form: FormGroup;
  isReadyToSave: boolean;

  dueDate: any;
  dueTime: any;
  // now: any = new Date();
  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  now = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);
  startTime: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);
  endTime: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private apollo: Angular2Apollo,
    public formBuilder: FormBuilder,
    public toast: ToastController) {

      this.form = formBuilder.group({
       title: ['', Validators.required],
       section: ['', Validators.required],
       dueDate: [this.startTime, Validators.required],
       dueTime: [this.endTime, Validators.required],
       url: [''],
       description: ['']
      });

      this.form.valueChanges.subscribe((v) => {
        this.isReadyToSave = this.form.valid;
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 add(){
   console.log(this.form.value.dueTime);
  //  this.form.value.dueTime.setHours((this.form.value.dueTime.getHours()+4));
   if (this.isReadyToSave) {
     this.createEvent().then(({data}) => {
       let toast = this.toast.create({
         message: 'Event created!',
         position: 'top',
         duration: 3000
       });
       toast.present();
       this.dismiss();
     });
   } else {
     let toast = this.toast.create({
       message: 'Some information missing. Try again!',
       position: 'top',
       duration: 3000
     });
     toast.present();
   }
 }

 ionViewDidEnter() {
   this.today.setHours(this.today.getHours() - 4);
   this.querySections().then(({data}) => {
     if (data){
       this.data = data;
       this.sections = this.data.user.sections;
       this.teaching = this.data.user.teaching;
       console.log(this.teaching);
     }
   })
 }

querySections(){
  return this.apollo.query({
    query: gql`
      query{
        user{
          teaching{
            id
            sectionNumber
            courseName
            type
            icon
            users {
              firstName
              lastName
              major
              profilePic
            }
            professor{
              name
              email
            }
          }
          sections{
            id
            sectionNumber
            courseName
            type
            icon
            users {
              firstName
              lastName
              major
              profilePic
            }
            professor{
              name
              email
            }
          }
        }
      }
    `
  }).toPromise();
}

  createEvent(){

  //Get dueDate Date object and set time to midnight for dataBase filters
  var tempDueDate = new Date(this.form.value.dueDate);
  tempDueDate.setHours(0,0,0,0);
  console.log(tempDueDate);

  return this.apollo.mutate({
    mutation: gql`
    mutation createEvent($title: String,
                        $sectionId: ID,
                        $dueDate: DateTime,
                        $dueTime: DateTime,
                        $url: String,
                        $description: String){

      createEvent(title: $title,
                  sectionId: $sectionId,
                  dueDate: $dueDate,
                  dueTime: $dueTime,
                  url: $url,
                  description: $description){
                    id
                  }
                }
    `,
    variables: {
      title: this.form.value.title,
      sectionId: this.form.value.section,
      dueDate: tempDueDate,
      dueTime: this.form.value.dueTime,
      url: this.form.value.url,
      description: this.form.value.description
    }
  }).toPromise();
}

}
