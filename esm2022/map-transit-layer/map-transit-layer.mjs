/// <reference types="google.maps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" />
import { Directive, EventEmitter, NgZone, Output, inject } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
import * as i0 from "@angular/core";
/**
 * Angular component that renders a Google Maps Transit Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
 */
export class MapTransitLayer {
    constructor() {
        this._map = inject(GoogleMap);
        this._zone = inject(NgZone);
        /** Event emitted when the transit layer is initialized. */
        this.transitLayerInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            if (google.maps.TransitLayer && this._map.googleMap) {
                this._initialize(this._map.googleMap, google.maps.TransitLayer);
            }
            else {
                this._zone.runOutsideAngular(() => {
                    Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
                        this._initialize(map, lib.TransitLayer);
                    });
                });
            }
        }
    }
    _initialize(map, layerConstructor) {
        this._zone.runOutsideAngular(() => {
            this.transitLayer = new layerConstructor();
            this.transitLayerInitialized.emit(this.transitLayer);
            this._assertLayerInitialized();
            this.transitLayer.setMap(map);
        });
    }
    ngOnDestroy() {
        this.transitLayer?.setMap(null);
    }
    _assertLayerInitialized() {
        if (!this.transitLayer) {
            throw Error('Cannot interact with a Google Map Transit Layer before it has been initialized. ' +
                'Please wait for the Transit Layer to load before trying to interact with it.');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapTransitLayer, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapTransitLayer, isStandalone: true, selector: "map-transit-layer", outputs: { transitLayerInitialized: "transitLayerInitialized" }, exportAs: ["mapTransitLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapTransitLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-transit-layer',
                    exportAs: 'mapTransitLayer',
                    standalone: true,
                }]
        }], propDecorators: { transitLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYW5zaXQtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYW5zaXQtbGF5ZXIvbWFwLXRyYW5zaXQtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpHLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7QUFFbkQ7Ozs7R0FJRztBQU1ILE1BQU0sT0FBTyxlQUFlO0lBTDVCO1FBTVUsU0FBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixVQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBUy9CLDJEQUEyRDtRQUN4Qyw0QkFBdUIsR0FDeEMsSUFBSSxZQUFZLEVBQTRCLENBQUM7S0F1Q2hEO0lBckNDLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDekIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEUsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO29CQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM1RSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7d0JBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUcsR0FBK0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDdkUsQ0FBQyxDQUNGLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTyxXQUFXLENBQUMsR0FBb0IsRUFBRSxnQkFBaUQ7UUFDekYsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN2QixNQUFNLEtBQUssQ0FDVCxrRkFBa0Y7Z0JBQ2hGLDhFQUE4RSxDQUNqRixDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7OEdBbkRVLGVBQWU7a0dBQWYsZUFBZTs7MkZBQWYsZUFBZTtrQkFMM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixVQUFVLEVBQUUsSUFBSTtpQkFDakI7OEJBYW9CLHVCQUF1QjtzQkFBekMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBpbmplY3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBUcmFuc2l0IExheWVyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI1RyYW5zaXRMYXllclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtdHJhbnNpdC1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwVHJhbnNpdExheWVyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwVHJhbnNpdExheWVyIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9tYXAgPSBpbmplY3QoR29vZ2xlTWFwKTtcbiAgcHJpdmF0ZSBfem9uZSA9IGluamVjdChOZ1pvbmUpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjVHJhbnNpdExheWVyXG4gICAqL1xuICB0cmFuc2l0TGF5ZXI/OiBnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXI7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdHJhbnNpdCBsYXllciBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHRyYW5zaXRMYXllckluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuVHJhbnNpdExheWVyPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXI+KCk7XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyICYmIHRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9tYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgUHJvbWlzZS5hbGwoW3RoaXMuX21hcC5fcmVzb2x2ZU1hcCgpLCBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdtYXBzJyldKS50aGVuKFxuICAgICAgICAgICAgKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuTWFwc0xpYnJhcnkpLlRyYW5zaXRMYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUobWFwOiBnb29nbGUubWFwcy5NYXAsIGxheWVyQ29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXIpIHtcbiAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNpdExheWVyID0gbmV3IGxheWVyQ29uc3RydWN0b3IoKTtcbiAgICAgIHRoaXMudHJhbnNpdExheWVySW5pdGlhbGl6ZWQuZW1pdCh0aGlzLnRyYW5zaXRMYXllcik7XG4gICAgICB0aGlzLl9hc3NlcnRMYXllckluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLnRyYW5zaXRMYXllci5zZXRNYXAobWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMudHJhbnNpdExheWVyPy5zZXRNYXAobnVsbCk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRMYXllckluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7dHJhbnNpdExheWVyOiBnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXJ9IHtcbiAgICBpZiAoIXRoaXMudHJhbnNpdExheWVyKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBUcmFuc2l0IExheWVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgVHJhbnNpdCBMYXllciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==