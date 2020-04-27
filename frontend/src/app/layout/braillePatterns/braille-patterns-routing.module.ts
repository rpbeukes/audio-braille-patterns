import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BraillePatternsComponent } from './braille-patterns.component';

const routes: Routes = [
    {
        path: '',
        component: BraillePatternsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BraillePatternsRoutingModule {}
