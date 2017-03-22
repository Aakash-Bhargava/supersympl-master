import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

import { ListMasterPage } from '../list-master/list-master';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {email: string, password: string} = {
    email: 'MartyFly@msu.edu',
    password: 'test'
  };


  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public apollo : Angular2Apollo) {

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

    doLogin(event) {
      let userInfo = <any>{};
      this.signIn().then(({data}) =>{
        if (data) {
          userInfo.data = data
          console.log(userInfo.data.signinUser.token);
          window.localStorage.setItem('graphcoolToken', userInfo.data.signinUser.token);
        }
        // this.apollo.watchQuery({
        // query: this.CurrentUserForProfile
        // }).subscribe(({data}) => {
        //     console.log(data);
        // });

      }).then(() => {
        this.navCtrl.push(ListMasterPage)
      }) ;

        // console.log(data.token);
        // console.log(data.signinUser);
        // window.localStorage.setItem('graphcoolToken', data.signinUser.token);
      // })

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


  // // Attempt to login in through our User service
  // doLogin() {
  //   this.user.login(this.account).subscribe((resp) => {
  //     this.navCtrl.push(MainPage);
  //   }, (err) => {
  //     this.navCtrl.push(MainPage);
  //     // Unable to log in
  //     let toast = this.toastCtrl.create({
  //       message: this.loginErrorString,
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     toast.present();
  //   });
  // }
}
