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
    this.createAndSignIn().then(({data}) => {
      if (data){
        this.userInfo.data = data
        console.log(this.userInfo.data.signinUser.token);
        window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
      }
    });
    this.navCtrl.push(MainPage)
  }

  //returns a promise that both creates the user and returns the user's auth token
  createAndSignIn(){
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
        signinUser(email: {email: $email, password: $password}){
          token
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

  dismiss(){
    console.log("dismiss");
    this.viewCtrl.dismiss();
  }
}
