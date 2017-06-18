import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserConnectedComponent} from './components/user-connected/user-connected.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'user', component: UserConnectedComponent},
    {path: '**', component: DashboardComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
