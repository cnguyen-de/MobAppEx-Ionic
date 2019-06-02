import * as tslib_1 from "tslib";
import { Component, ViewChild } from "@angular/core";
import { IonSlides } from "@ionic/angular";
import { LocationService } from '../../_services/location.service';
var Tab2Page = /** @class */ (function () {
    function Tab2Page(locationService) {
        this.locationService = locationService;
        // set to false to use GPS location!
        this.fixedLocation = true;
        this.mapZoomLevel = 17;
        this.latMapCenter = 50.1303316;
        this.lngMapCenter = 8.69238764;
        this.personIcon = '../../../assets/images/icons/LocationPerson.svg';
        this.capsuleIcon = '../../../assets/images/icons/SnoozeMarker.svg';
        this.capsules = [];
        this.slidesConfig = {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: 1.5
        };
    }
    Tab2Page.prototype.ngOnInit = function () {
        var _this = this;
        // Demo Data
        this.capsules = [
            {
                lat: 50.13017685,
                lng: 8.69303674,
                isOpen: true,
                name: "Gebäude 1"
            },
            {
                lat: 50.13122569,
                lng: 8.69226426,
                isOpen: false,
                name: "Bibliothek"
            },
            {
                lat: 50.12887008,
                lng: 8.69176537,
                isOpen: false,
                name: "BCN"
            }
        ];
        /**
         * Retrieve Current Position
         */
        if (!this.fixedLocation) {
            this.locationService.getCurrentPosition().then(function (data) {
                console.log('Result getting location in Component', data);
                _this.latMapCenter = data.coords.latitude;
                _this.lngMapCenter = data.coords.longitude;
            });
        }
    };
    Tab2Page.prototype.clickedMarker = function (label, index) {
        console.log("clicked the marker: " + (label || index));
        this.hideAll();
        this.slider.slideTo(index);
    };
    Tab2Page.prototype.onBoundsChanged = function (event) {
        console.log(event);
    };
    Tab2Page.prototype.cardClicked = function (i) {
        this.hideAll();
        this.slider.slideTo(i);
        this.capsules[i].isOpen = true;
    };
    Tab2Page.prototype.hideAll = function () {
        for (var _i = 0, _a = this.capsules; _i < _a.length; _i++) {
            var item = _a[_i];
            item.isOpen = false;
        }
    };
    Tab2Page.prototype.onSlideChanged = function () {
        var _this = this;
        this.hideAll();
        this.slider.getActiveIndex().then(function (data) {
            _this.capsules[data].isOpen = true;
        });
    };
    Tab2Page.prototype.getDistance = function (lat1, lng1, lat2, lng2) {
        return this.locationService.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
    };
    tslib_1.__decorate([
        ViewChild("slider"),
        tslib_1.__metadata("design:type", IonSlides)
    ], Tab2Page.prototype, "slider", void 0);
    Tab2Page = tslib_1.__decorate([
        Component({
            selector: "app-tab2",
            templateUrl: "tab2.page.html",
            styleUrls: ["tab2.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [LocationService])
    ], Tab2Page);
    return Tab2Page;
}());
export { Tab2Page };
//# sourceMappingURL=tab2.page.js.map