import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

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
  data: any;

  today = new Date();
  form: FormGroup;
  isReadyToSave: boolean;

  dueDate: any;
  dueTime: any;
  now: any = new Date();

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private apollo: Angular2Apollo,
    public formBuilder: FormBuilder ) {

      this.form = formBuilder.group({
       title: ['', Validators.required],
       section: ['', Validators.required],
       dueDate: [this.today.toISOString(), Validators.required],
       dueTime: [this.today.toISOString(), Validators.required],
       url: ['', Validators.required],
       description: ['', Validators.required]
      });

      this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
      this.now = this.now.toISOString();
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 add(){
   console.log("add clicked");
   this.createEvent();
   this.dismiss();
 }

 ionViewDidEnter() {
   this.today.setHours(this.today.getHours() - 4);
   this.getUserSections();
 }

 getUserSections() {
   this.querySections().then(({data}) => {
     if (data){
       this.data = data;
       this.sections = this.data.user.sections;
       console.log(this.sections);
     }
   })
 }

querySections(){
  return this.apollo.query({
    query: gql`
      query{
        user{
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
