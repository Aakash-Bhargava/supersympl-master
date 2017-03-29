import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {email: string, password: string} = {
    email: "",
    password: ""
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              private apollo: Angular2Apollo) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }


  loginUserMutation = gql`
      mutation signinUser($email: String!, $password: String!) {
        signinUser( email: {email: $email, password: $password }) {
          token
        }
      }
  `;
  CurrentUserForProfile = gql`
    query {
      user {
        id
      }
    }
  `;

  signInEvent(event) {
    let userInfo = <any>{};
    this.signIn().then(({data}) =>{
      if (data) {
        userInfo.data = data
        window.localStorage.setItem('graphcoolToken', userInfo.data.signinUser.token);
      }

    }).then(() => {
      this.navCtrl.push(MainPage)
    }) ;
  }

  signIn(){
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
        email: this.account.email,
        password: this.account.password
      }
    }).toPromise();
  }
}
