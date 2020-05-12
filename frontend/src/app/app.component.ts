import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

declare let gtag: Function;

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    constructor(public router: Router) {}

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                gtag("config", "UA-123740081-4", {
                    page_path: event.urlAfterRedirects,
                });
            }
        });
    }
}
