import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BraillePatternLines, BraillePatternLine } from './braillePattterns';

//type BraillePatternColumnNames = Pick<BraillePatternLine, 'position' | 'name' | 'pictureUrl' | 'audioUrl';

@Component({
    selector: 'app-dashboard',
    templateUrl: './braille-patterns.component.html',
    styleUrls: ['./braille-patterns.component.scss']
})
export class BraillePatternsComponent implements OnInit {
    // private fff: keyof BraillePatternLine = 'p1osition';
    // columnNames = fff
    displayedColumns =  ['position', 'name', 'pictureUrl', 'audioUrl'];

    dataSource = new MatTableDataSource(BraillePatternLines);

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    constructor() {
    }

    ngOnInit() {
        this.dataSource.data = this.dataSource.data.map((x, index) => {
            x.position = index + 1;
            return x;
        });
        console.log(this.dataSource.data);
    }
}
