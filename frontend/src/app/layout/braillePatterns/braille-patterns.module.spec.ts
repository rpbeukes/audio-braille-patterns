import { BraillePatternsModule } from './braille-patterns.module';

describe('DashboardModule', () => {
    let dashboardModule: BraillePatternsModule;

    beforeEach(() => {
        dashboardModule = new BraillePatternsModule();
    });

    it('should create an instance', () => {
        expect(dashboardModule).toBeTruthy();
    });
});
