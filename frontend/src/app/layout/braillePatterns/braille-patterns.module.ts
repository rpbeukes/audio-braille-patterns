import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { BraillePatternsRoutingModule } from './braille-patterns-routing.module';
import { BraillePatternsComponent } from './braille-patterns.component';

@NgModule({
    imports: [
        CommonModule,
        BraillePatternsRoutingModule,
        MatGridListModule,
        MatCardModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    declarations: [BraillePatternsComponent]
})
export class BraillePatternsModule {}
