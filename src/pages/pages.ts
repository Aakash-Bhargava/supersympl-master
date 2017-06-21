import { TabsPage } from './tabs/tabs';
import { ListMasterPage } from './list-master/list-master';
import { ProfilePage } from './profile/profile';
import { SchedulePage } from '../pages/schedule/schedule';
import { MapPage } from '../pages/map/map';

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = ListMasterPage;
export const Tab2Root = MapPage;
export const Tab3Root = SchedulePage;
export const Tab4Root = ProfilePage;
