import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LotteryComponent} from './components/lottery/lottery.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [
    {path: '', redirectTo: './', pathMatch: 'full'},
    {path: './:address', component: DashboardComponent},
    {path: 'lottery/:address', component: LotteryComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
