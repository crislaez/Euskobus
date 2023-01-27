import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapPage } from './containers/map.page';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:'',
        component: MapPage,
        data:{path:'geolocation'}
      },
      {
        path:'station/:stationId',
        component: MapPage,
        data:{path:'station'}
      },
      {
        path: '**',
        redirectTo: '/home',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapPageRoutingModule {}
