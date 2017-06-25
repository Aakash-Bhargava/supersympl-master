import { Component } from '@angular/core';
import { NavController, NavParams, Platform} from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

import { Camera, CameraOptions } from '@ionic-native/camera';

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  userInfo = <any>{};
  sections: any[];
  imageUri: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apollo: Angular2Apollo,
              private Camera: Camera,
              private platform: Platform) {

              }


  ionViewDidLoad() {
    this.setUser();
  }

  goToSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

  setUser(){
    if (this.navParams.get("user")) {
      console.log(this.navParams.get("user"));
      this.userInfo = this.navParams.get("user");
      if (!this.userInfo.profilePic) {
        this.imageUri = "https://msudenver.edu/media/sampleassets/profile-placeholder.png";
      } else {
        this.imageUri = this.userInfo.profilePic;
      }
      this.sections = this.userInfo.sections;
    } else {
      this.checkUserInfo().then(({data}) => {
        if (data){
          this.userInfo = data;
          this.userInfo = this.userInfo.user;
          if (!this.userInfo.profilePic) {
            this.imageUri = "https://msudenver.edu/media/sampleassets/profile-placeholder.png";
          } else {
            this.imageUri = this.userInfo.profilePic;
          }
          this.sections = this.userInfo.sections;
        }
      })

    }
 }

 //returns a promise containing the user's info
 checkUserInfo(){
   return this.apollo.query({
     query: gql`
       query{
         user{
           id
           email
           firstName
           lastName
           phone
           email
           major
           year
           profilePic
           sections {
             courseName
           }
          }
         }
     `
   }).toPromise();
 }

 changePic() {
   let options: CameraOptions = {
     quality: 50,
     destinationType: 0,
     targetWidth: 500,
     targetHeight: 500,
     encodingType: 0,
     sourceType: 0,
     correctOrientation: true,
     allowEdit: true

   };
   if (this.platform.is('android')) {
     this.Camera.getPicture(options).then((ImageData) => {
       let base64Image = "data:image/jpeg;base64," + ImageData;
       this.imageUri = base64Image;
     });
   } else if (this.platform.is('ios')) {
     this.Camera.getPicture(options).then((ImageData) => {
       let base64Image = "data:image/jpeg;base64," + ImageData;
       this.imageUri = base64Image;
     })
   }

   this.apollo.mutate({
     mutation: gql`
      mutation updateUser($id: ID!, $profilePic: String) {
        updateUser(id: $id, profilePic: $profilePic) {
          id
        }
      }
     `, variables: {
       id: this.userInfo.id,
       profilePic: this.imageUri
     }
   });
 }
}
