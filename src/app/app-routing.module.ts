import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LotteryComponent} from './components/lottery/lottery.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'lottery/:address', component: LotteryComponent},
    {path: '**', component: DashboardComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
