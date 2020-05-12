import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BraillePatternLines, BraillePatternLine } from './braillePattterns';

type BraillePatternColumnNames = keyof BraillePatternLine;

@Component({
    selector: 'app-dashboard',
    templateUrl: './braille-patterns.component.html',
    styleUrls: ['./braille-patterns.component.scss']
})
export class BraillePatternsComponent implements OnInit {

    displayedColumns: BraillePatternColumnNames[] =  ['position', 'name', 'audioUrl', 'pictureUrl'];
    dataSource = new MatTableDataSource(BraillePatternLines);

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    constructor() {
    }

    ngOnInit() {
        // sort alphabetical
        this.dataSource.data = this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));

        this.dataSource.data = this.dataSource.data.map((x, index) => {
            x.position = index + 1;
            return x;
        });
    }
}
