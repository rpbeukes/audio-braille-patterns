import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface BraillePatternLine {
    name: string;
    position?: number;
    pictureUrl?: string;
    audioUrl: string;
}

const DATA: BraillePatternLine[] = [
    { position: 1, name: 'Hydrogen', pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/uploaded-images/braille_tow_truck.png', audioUrl: 'https://www.youtube.com' },
    { position: 1, name: 'Helium', pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/uploaded-images/braille_tow_truck.png', audioUrl: 'https://www.youtube.com' },
    { position: 1, name: 'Lithium', audioUrl: 'https://www.youtube.com' },
    { position: 1, name: 'Beryllium' , pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/uploaded-images/braille_tow_truck.png', audioUrl: 'https://www.youtube.com' },
    { position: 1, name: 'Boron' , pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/uploaded-images/braille_tow_truck.png', audioUrl: 'https://www.youtube.com' },
    { position: 1, name: 'Carbon', pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/uploaded-images/braille_tow_truck.png', audioUrl: 'https://www.youtube.com' },
    { position: 1, name: 'Nitrogen' , audioUrl: 'https://www.youtube.com' },
];

@Component({
    selector: 'app-dashboard',
    templateUrl: './braille-patterns.component.html',
    styleUrls: ['./braille-patterns.component.scss']
})
export class BraillePatternsComponent implements OnInit {
    displayedColumns = ['position', 'name', 'pictureUrl', 'audioUrl'];
    dataSource = new MatTableDataSource(DATA);

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
