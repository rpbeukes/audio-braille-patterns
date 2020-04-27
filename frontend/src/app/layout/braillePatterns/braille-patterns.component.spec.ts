import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BraillePatternsComponent } from './braille-patterns.component';

describe('BraillePatternsComponent', () => {
    let component: BraillePatternsComponent;
    let fixture: ComponentFixture<BraillePatternsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BraillePatternsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BraillePatternsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
