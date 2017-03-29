import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {firstName: string, lastName: string, email: string, password: string,
        major: string, phone: string, year: string} = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    major: "",
    phone: "",
    year: ""
  };


  //Create a new user
  createUserMutation = gql`
     mutation createUser($email: String!, $password: String!) {
       createUser(authProvider: { email: {email: $email, password: $password}}) {
         id
       }
     }
   `;


  // Our translated text strings
  private signupErrorString: string;

  signup: FormGroup;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public formBuilder: FormBuilder,
              private apollo: Angular2Apollo) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

    this.signup = formBuilder.group({
        firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        phone: ['',Validators.compose([Validators.maxLength(15), Validators.minLength(7), Validators.pattern('[0-9]*'), Validators.required])],
        year: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        major: ['', Validators.compose([Validators.required])]

    });
  }

  createUserMutation = gql`
    mutation createUser($email: String!, $password: String!,
      $firstName: String!, $lastName: String!,
      $major: String!, $phone: String, $year: String!) {
      createUser(authProvider: { email: {email: $email, password: $password}},
        firstName: $firstName, lastName: $lastName,
        major: $major, phone: $phone, year: $year) {
        id
      }
    }
  `;

  doSignup() {
    // Attempt to login in through our User service
    // this.user.signup(this.account).subscribe((resp) => {
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //
    //   this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint
    //
    //   // Unable to sign up
    //   let toast = this.toastCtrl.create({
    //     message: this.signupErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });


    this.apollo.mutate ({
        mutation: this.createUserMutation,
        variables: {
          email: this.account.email,
          password: this.account.password,
          firstName: this.account.firstName,
          lastName: this.account.lastName,
          major: this.account.major,
          phone: this.account.phone,
          year: this.account.year
        }
      });
      this.navCtrl.push(MainPage);

  }
}
