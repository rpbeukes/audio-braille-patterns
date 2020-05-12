import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'braille-patterns'
            },
            {
                path: 'braille-patterns',
                loadChildren: () => import('./braillePatterns/braille-patterns.module').then(m => m.BraillePatternsModule)
            },
            {
                path: 'about',
                component: AboutComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
