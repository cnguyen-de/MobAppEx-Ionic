import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';
var Tab1Page = /** @class */ (function () {
    function Tab1Page(apiService) {
        this.apiService = apiService;
        this.myDate = new Date();
    }
    Tab1Page.prototype.ngOnInit = function () {
    };
    Tab1Page.prototype.bookCapsule = function () {
        this.apiService.bookCapsule(1, 0, "2019-05-31T12:37:36.358Z", 0, 0, "string", 0, true, "string", 0, "2019-06-20T12:37:36.358Z")
            .subscribe(function (data) {
        });
    };
    Tab1Page.prototype.getBookings = function () {
        this.apiService.getBookings().subscribe(function (data) {
            console.log(data);
        });
    };
    Tab1Page = tslib_1.__decorate([
        Component({
            selector: 'app-tab1',
            templateUrl: 'tab1.page.html',
            styleUrls: ['tab1.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [ApiService])
    ], Tab1Page);
    return Tab1Page;
}());
export { Tab1Page };
//# sourceMappingURL=tab1.page.js.map