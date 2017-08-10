import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
// import { Items } from '../../providers/providers';
// import { Item } from '../../models/item';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import { PincodeController } from  'ionic2-pincode-input/dist/pincode'


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  allSections = <any>[];
  queryList = <any>[];
  userId: any;
  code:string;
  accessCode: any;
  masterCode: any;
  // section: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              // public items: Items
              public pincodeCtrl: PincodeController,
              public alertCtrl: AlertController,
              private apollo: Angular2Apollo,
              public viewCtrl: ViewController,
              public toast: ToastController) {}


  ngOnInit() {
    this.currentUserInfo().then(({data}) => {
      this.allSections = data;
      this.userId = this.allSections.user.id;
      this.allSections = this.allSections.allSections;
      // this.allSections.sort(this.compare);
    });
  }

  //Gets user info using graphcool token for authentication
  currentUserInfo(){
      return this.apollo.query({
        query: gql`
        query{
          user{
            id
          }
          allSections(orderBy: courseName_ASC){
            id
            courseName
            sectionNumber
            type
            professor {
              name
            }
            users{
              id
            }
          }
        }
        `
      }).toPromise();
    }


  initializeItems(): void {
    this.queryList = this.allSections;
    console.log(this.queryList);
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      this.queryList = [];
      return;
    }

    this.queryList = this.queryList.filter((v) => {
      if(v.courseName && q) {
        if (v.courseName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          for (let user of v.users) {
            if (user.id == this.userId) {
              return false;
            }
          }
          return true;
        }
        return false;
      }
    });

    console.log(q, this.queryList.length);
  }

  listSections(course) {
    // this.sectionList = course.sections;

    console.log(course.sections);
  }

  addToUser(course) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you are on this class?',
      message: 'You can always undo it later.',
      buttons: [
        {
          text: 'Nope',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yeah!',
          handler: () => {
            this.apollo.mutate({
              mutation: gql`
              mutation addToUserOnSection($usersUserId: ID!, $sectionsSectionId: ID!){
                addToUserOnSection(usersUserId:$usersUserId,sectionsSectionId:$sectionsSectionId){
                  sectionsSection {
                    id
                  }
                }
              }
              `,variables:{
                usersUserId: this.userId,
                sectionsSectionId: course.id
              }
            }).toPromise();
            let toast = this.toast.create({
              message: 'Class Added!',
              position: 'top',
              duration: 3000
            });
            toast.present();
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    confirm.present();

  }

  compare(a,b) {
    if (a.courseName < b.courseName)
      return -1;
    if (a.courseName > b.courseName)
      return 1;
    return 0;
  }




  openPinCode(course):any{
    console.log(course);
    this.apollo.query({
      query: gql`
      query allSections($courseId: ID!){
        allSections( filter: {id: $courseId})
        {
          id
          courseName
          accessCode
          masterAccessCode
        }
      }
      `,variables:{
        courseId: course.id
      }
    }).toPromise().then(({data}) => {
      if (data){
        this.accessCode = data;
        this.masterCode = this.accessCode.allSections[0].masterAccessCode;
        this.accessCode = this.accessCode.allSections[0].accessCode;
      }
    })

    let pinCode =  this.pincodeCtrl.create({
      title:'Pincode',
      hideForgotPassword: true,
    });

    pinCode.present();

    pinCode.onDidDismiss( (code,status) => {
      console.log(code);
      console.log(this.accessCode);

      if(status === 'done'){
        //If student code
        if(code == this.accessCode){
          this.apollo.mutate({
            mutation: gql`
            mutation addToUserOnSection($usersUserId: ID!, $sectionsSectionId: ID!){
              addToUserOnSection(usersUserId:$usersUserId,sectionsSectionId:$sectionsSectionId){
                sectionsSection {
                  id
                }
              }
            }
            `,variables:{
              usersUserId: this.userId,
              sectionsSectionId: course.id
            }
          }).toPromise().then(({data})=> {
            let toast = this.toast.create({
              message: 'Class Added!',
              position: 'top',
              duration: 3000
            });
            toast.present();
            this.viewCtrl.dismiss();
          });


        // If professors code
        } else if (code == this.masterCode ) {
          this.apollo.mutate({
            mutation: gql`
            mutation addToSectionOnMaster($teachingSectionId: ID!, $masterUserId: ID!){
              addToSectionOnMaster(teachingSectionId:$teachingSectionId,masterUserId:$masterUserId){
                teachingSection {
                  id
                }
              }
            }
            `,variables:{
              teachingSectionId: course.id,
              masterUserId: this.userId
            }
          }).toPromise();
          this.apollo.mutate({
            mutation: gql`
            mutation addToUserOnSection($usersUserId: ID!, $sectionsSectionId: ID!){
              addToUserOnSection(usersUserId:$usersUserId,sectionsSectionId:$sectionsSectionId){
                sectionsSection {
                  id
                }
              }
            }
            `,variables:{
              usersUserId: this.userId,
              sectionsSectionId: course.id
            }
          }).toPromise().then(({data})=> {
            let toast = this.toast.create({
              message: 'Greetings Professor/TA!',
              position: 'top',
              duration: 3000
            });
            toast.present();
            this.viewCtrl.dismiss();
          });;
        }
      }
    })

  }


}
