import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';



@Component({
  selector: 'addEventModal',
  templateUrl: 'addEventModal.html'
})
export class addEventModal {

  sections = <any>[];
  section: any;
  data: any;





  public event = {
    title: '',
    class: '',
    dueDate: new Date().toISOString(),
    alert: '',
    url: '',
    description: ''
  };

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private apollo: Angular2Apollo,
    private formBuilder: FormBuilder ) {
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 add(){
   console.log("add clicked");
   console.log(this.event.title);
   console.log(this.event.class);
   console.log(this.event.dueDate);
   console.log(this.event.alert);
   console.log(this.event.url);
   console.log(this.event.description);
   this.createEvent();
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
                        $dueDuate: DateTime,
                        $alert: String,
                        $url: String,
                        $description: String){

      createEvent(title: $title,
                  class: $class,
                  dueDate: $dueDuate,
                  alert: $alert,
                  url: $url,
                  description: $description){
                    id
                  }
                }
    `,
    variables: {
      title: this.event.title,
      class: this.event.class,
      dueDate: this.event.dueDate,
      alert: this.event.alert,
      url: this.event.url,
      description: this.event.description

    }
  }).toPromise();
}

}
