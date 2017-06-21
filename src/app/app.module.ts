import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';

import { MyApp } from './app.component';

import { ContentPage } from '../pages/content/content';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { ListMasterPage } from '../pages/list-master/list-master';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { MenuPage } from '../pages/menu/menu';
import { SettingsPage } from '../pages/settings/settings';
import { SearchPage } from '../pages/search/search';
import { SchedulePage } from '../pages/schedule/schedule';
import { ProfilePage } from '../pages/profile/profile';
import { PasswordPage } from '../pages/password/password';
import { SetLocationPage } from '../pages/set-location/set-location';
import { addEventModal } from '../pages/addEventModal/addEventModal';
import { CalendarModule } from "ion2-calendar";
import { SelectedDay } from '../pages/selectedDay/selectedDay';

import { Camera } from '@ionic-native/camera';



import { provideClient } from './client';
import { ApolloModule } from 'angular2-apollo';

import { ION_CALENDAR_DIRECTIVES, IonCalendar } from '@ionic2-extra/calendar';


let pages = [
  MyApp,
  ContentPage,
  LoginPage,
  MapPage,
  SignupPage,
  TabsPage,
  WelcomePage,
  ListMasterPage,
  ItemDetailPage,
  MenuPage,
  SettingsPage,
  SearchPage,
  SchedulePage,
  ProfilePage,
  PasswordPage,
  addEventModal,
  SetLocationPage,
  SelectedDay
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

@NgModule({
  declarations: [declarations(), IonCalendar],
  imports: [
    ApolloModule.withClient(provideClient),
    CalendarModule,
    IonicModule.forRoot(MyApp),
    BrowserModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: [Camera,IonCalendar, { provide: ErrorHandler, useClass: IonicErrorHandler }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
