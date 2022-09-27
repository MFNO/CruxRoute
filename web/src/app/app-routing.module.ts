import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarMonthViewComponent } from './calendar-month-view/calendar-month-view.component';

import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { AuthGuard } from './guards/index';
import { AtheleteOverviewComponent } from './athelete-overview/athelete-overview.component';
import { CoachOverviewComponent } from './coach-overview/coach-overview.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarMonthViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'coach',
    component: CoachOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ATHLETE',
    },
  },
  {
    path: 'athletes',
    component: AtheleteOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'COACH',
    },
  },
  {
    path: 'calendar',
    component: CalendarMonthViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signIn',
    component: SignInComponent,
  },
  {
    path: 'signUp',
    component: SignUpComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
