import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./views/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'stations',
    loadChildren: () => import('./views/station/station.module').then( m => m.StationPageModule)
  },
  {
    path: 'schedules',
    loadChildren: () => import('./views/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./views/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch:'full'
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
