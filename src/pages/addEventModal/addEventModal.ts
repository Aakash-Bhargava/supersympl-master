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

  form: FormGroup;
  isReadyToSave: boolean;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private apollo: Angular2Apollo,
    public formBuilder: FormBuilder ) {

      this.form = formBuilder.group({
       title: ['', Validators.required],
       class: ['', Validators.required],
       dueDate: ['', Validators.required],
       alert: ['', Validators.required],
       url: ['', Validators.required],
       description: ['', Validators.required]
      });

      this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 add(){
   console.log("add clicked");

   this.createEvent();
   console.log(this.form.value.title);
   console.log(this.form.value.class);
   console.log(this.form.value.dueDate);
   console.log(this.form.value.alert);
   console.log(this.form.value.url);
   console.log(this.form.value.description);
   this.dismiss();
 }

 ionViewDidEnter() {
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
  return this.apollo.mutate({
    mutation: gql`
    mutation createEvent($title: String,
                        $class: String,
                        $dueDate: DateTime,
                        $alert: String,
                        $url: String,
                        $description: String){

      createEvent(title: $title,
                  class: $class,
                  dueDate: $dueDate,
                  alert: $alert,
                  url: $url,
                  description: $description){
                    id
                  }
                }
    `,
    variables: {
      title: this.form.value.title,
      class: this.form.value.class,
      dueDate: this.form.value.dueDate,
      alert: this.form.value.alert,
      url: this.form.value.url,
      description: this.form.value.description
    }
  }).toPromise();
}

}
