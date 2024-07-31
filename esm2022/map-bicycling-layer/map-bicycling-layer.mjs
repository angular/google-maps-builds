/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" preserve="true" />
import { Directive, EventEmitter, NgZone, Output, inject } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
import * as i0 from "@angular/core";
/**
 * Angular component that renders a Google Maps Bicycling Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
 */
export class MapBicyclingLayer {
    constructor() {
        this._map = inject(GoogleMap);
        this._zone = inject(NgZone);
        /** Event emitted when the bicycling layer is initialized. */
        this.bicyclingLayerInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            if (google.maps.BicyclingLayer && this._map.googleMap) {
                this._initialize(this._map.googleMap, google.maps.BicyclingLayer);
            }
            else {
                this._zone.runOutsideAngular(() => {
                    Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
                        this._initialize(map, lib.BicyclingLayer);
                    });
                });
            }
        }
    }
    _initialize(map, layerConstructor) {
        this._zone.runOutsideAngular(() => {
            this.bicyclingLayer = new layerConstructor();
            this.bicyclingLayerInitialized.emit(this.bicyclingLayer);
            this._assertLayerInitialized();
            this.bicyclingLayer.setMap(map);
        });
    }
    ngOnDestroy() {
        this.bicyclingLayer?.setMap(null);
    }
    _assertLayerInitialized() {
        if (!this.bicyclingLayer) {
            throw Error('Cannot interact with a Google Map Bicycling Layer before it has been initialized. ' +
                'Please wait for the Transit Layer to load before trying to interact with it.');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapBicyclingLayer, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapBicyclingLayer, isStandalone: true, selector: "map-bicycling-layer", outputs: { bicyclingLayerInitialized: "bicyclingLayerInitialized" }, exportAs: ["mapBicyclingLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapBicyclingLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-bicycling-layer',
                    exportAs: 'mapBicyclingLayer',
                    standalone: true,
                }]
        }], propDecorators: { bicyclingLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWJpY3ljbGluZy1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYmljeWNsaW5nLWxheWVyL21hcC1iaWN5Y2xpbmctbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQXFCLE1BQU0sRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFakcsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOztBQUVuRDs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGlCQUFpQjtJQUw5QjtRQU1VLFNBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsVUFBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQVMvQiw2REFBNkQ7UUFDMUMsOEJBQXlCLEdBQzFDLElBQUksWUFBWSxFQUE4QixDQUFDO0tBdUNsRDtJQXJDQyxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3BFLENBQUM7aUJBQU0sQ0FBQztnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtvQkFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDNUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFO3dCQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFHLEdBQStCLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3pFLENBQUMsQ0FDRixDQUFDO2dCQUNKLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUFDLEdBQW9CLEVBQUUsZ0JBQW1EO1FBQzNGLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzdDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekIsTUFBTSxLQUFLLENBQ1Qsb0ZBQW9GO2dCQUNsRiw4RUFBOEUsQ0FDakYsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO3FIQW5EVSxpQkFBaUI7eUdBQWpCLGlCQUFpQjs7a0dBQWpCLGlCQUFpQjtrQkFMN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixVQUFVLEVBQUUsSUFBSTtpQkFDakI7OEJBYW9CLHlCQUF5QjtzQkFBM0MsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgcHJlc2VydmU9XCJ0cnVlXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBpbmplY3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBCaWN5Y2xpbmcgTGF5ZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjQmljeWNsaW5nTGF5ZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWJpY3ljbGluZy1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwQmljeWNsaW5nTGF5ZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBCaWN5Y2xpbmdMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfbWFwID0gaW5qZWN0KEdvb2dsZU1hcCk7XG4gIHByaXZhdGUgX3pvbmUgPSBpbmplY3QoTmdab25lKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjQmljeWNsaW5nTGF5ZXJcbiAgICovXG4gIGJpY3ljbGluZ0xheWVyPzogZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXI7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYmljeWNsaW5nIGxheWVyIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYmljeWNsaW5nTGF5ZXJJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllcj4oKTtcblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGlmIChnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllciAmJiB0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUodGhpcy5fbWFwLmdvb2dsZU1hcCwgZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgUHJvbWlzZS5hbGwoW3RoaXMuX21hcC5fcmVzb2x2ZU1hcCgpLCBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdtYXBzJyldKS50aGVuKFxuICAgICAgICAgICAgKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuTWFwc0xpYnJhcnkpLkJpY3ljbGluZ0xheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShtYXA6IGdvb2dsZS5tYXBzLk1hcCwgbGF5ZXJDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyKSB7XG4gICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmJpY3ljbGluZ0xheWVyID0gbmV3IGxheWVyQ29uc3RydWN0b3IoKTtcbiAgICAgIHRoaXMuYmljeWNsaW5nTGF5ZXJJbml0aWFsaXplZC5lbWl0KHRoaXMuYmljeWNsaW5nTGF5ZXIpO1xuICAgICAgdGhpcy5fYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5iaWN5Y2xpbmdMYXllci5zZXRNYXAobWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuYmljeWNsaW5nTGF5ZXI/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtiaWN5Y2xpbmdMYXllcjogZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXJ9IHtcbiAgICBpZiAoIXRoaXMuYmljeWNsaW5nTGF5ZXIpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEJpY3ljbGluZyBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIFRyYW5zaXQgTGF5ZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=