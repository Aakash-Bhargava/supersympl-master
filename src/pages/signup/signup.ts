import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ToastController, ViewController } from 'ionic-angular';
import { MainPage } from '../../pages/pages';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  firstName: "";
  lastName: "";
  email: "";
  password: "";
  major: "";
  phone: "";
  year: "";

  userInfo = <any>{};

  private signupErrorString: string;
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public toastCtrl: ToastController,
              // public formBuilder: FormBuilder,
              private apollo: Angular2Apollo) {
  }

  //calls the createAndSignIn function
  //sets the auth token
  //pushes the Tabs Page
  loginEvent(event) {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.major || !this.phone || !this.year) {
      let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      console.log("ha");
    } else {
      this.createUser().then(({data}) => {
        if (data){
          this.SignIn().then(({data}) => {
            this.userInfo.data = data
            console.log(this.userInfo.data.signinUser.token);
            window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
            this.navCtrl.setRoot(MainPage);
          }, (errors) => {
              console.log(errors);
              if (errors == "GraphQL error: No user found with that information") {
                let toast = this.toastCtrl.create({
                  message: 'User already exists with that information. Try again.1',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }
            });

        }
      }, (errors) => {
          console.log(errors);
          if (errors == "Error: GraphQL error: User already exists with that information") {
            let toast = this.toastCtrl.create({
              message: 'User already exists with that information. Try again.',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });
    }

  }

  //returns a promise that both creates the user and returns the user's auth token
  createUser(){
      return this.apollo.mutate({
        mutation: gql`
        mutation createUser($email: String!,
                            $password: String!,
                            $firstName: String!,
                            $lastName: String!,
                            $major: String!,
                            $phone: String,
                            $year: String!){

          createUser(authProvider: { email: {email: $email, password: $password}},
                     firstName: $firstName,
                     lastName: $lastName,
                     major: $major,
                     phone: $phone,
                     year: $year){
            id
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          major: this.major,
          phone: this.phone,
          year: this.year,

        }
      }).toPromise();
  }
  SignIn(){
      return this.apollo.mutate({
        mutation: gql`
        mutation signinUser($email: String!,
                            $password: String!){

          signinUser(email: {email: $email, password: $password}){
            token
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
        }
      }).toPromise();
  }

  dismiss(){
    console.log("dismiss");
    this.viewCtrl.dismiss();
  }
}
