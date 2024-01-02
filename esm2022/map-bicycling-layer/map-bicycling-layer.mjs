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
import { importLibrary } from '../import-library';
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
                    Promise.all([
                        this._map._resolveMap(),
                        importLibrary('maps', 'BicyclingLayer'),
                    ]).then(([map, layerConstructor]) => {
                        this._initialize(map, layerConstructor);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapBicyclingLayer, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MapBicyclingLayer, isStandalone: true, selector: "map-bicycling-layer", outputs: { bicyclingLayerInitialized: "bicyclingLayerInitialized" }, exportAs: ["mapBicyclingLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapBicyclingLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-bicycling-layer',
                    exportAs: 'mapBicyclingLayer',
                    standalone: true,
                }]
        }], propDecorators: { bicyclingLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWJpY3ljbGluZy1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYmljeWNsaW5nLWxheWVyL21hcC1iaWN5Y2xpbmctbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpHLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7O0FBRW5EOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8saUJBQWlCO0lBTDlCO1FBTVUsU0FBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixVQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBUy9CLDZEQUE2RDtRQUMxQyw4QkFBeUIsR0FDMUMsSUFBSSxZQUFZLEVBQThCLENBQUM7S0F3Q2xEO0lBdENDLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDekIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUN0RCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDcEUsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO29CQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDO3dCQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUN2QixhQUFhLENBQW9DLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQztxQkFDM0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLEVBQUUsRUFBRTt3QkFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFDMUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTyxXQUFXLENBQUMsR0FBb0IsRUFBRSxnQkFBbUQ7UUFDM0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN6QixNQUFNLEtBQUssQ0FDVCxvRkFBb0Y7Z0JBQ2xGLDhFQUE4RSxDQUNqRixDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7cUhBcERVLGlCQUFpQjt5R0FBakIsaUJBQWlCOztrR0FBakIsaUJBQWlCO2tCQUw3QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs4QkFhb0IseUJBQXlCO3NCQUEzQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIGluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7aW1wb3J0TGlicmFyeX0gZnJvbSAnLi4vaW1wb3J0LWxpYnJhcnknO1xuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgQmljeWNsaW5nIExheWVyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI0JpY3ljbGluZ0xheWVyXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1iaWN5Y2xpbmctbGF5ZXInLFxuICBleHBvcnRBczogJ21hcEJpY3ljbGluZ0xheWVyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwQmljeWNsaW5nTGF5ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX21hcCA9IGluamVjdChHb29nbGVNYXApO1xuICBwcml2YXRlIF96b25lID0gaW5qZWN0KE5nWm9uZSk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI0JpY3ljbGluZ0xheWVyXG4gICAqL1xuICBiaWN5Y2xpbmdMYXllcj86IGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGJpY3ljbGluZyBsYXllciBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGJpY3ljbGluZ0xheWVySW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllcj4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXI+KCk7XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXIgJiYgdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX21hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuX21hcC5fcmVzb2x2ZU1hcCgpLFxuICAgICAgICAgICAgaW1wb3J0TGlicmFyeTx0eXBlb2YgZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXI+KCdtYXBzJywgJ0JpY3ljbGluZ0xheWVyJyksXG4gICAgICAgICAgXSkudGhlbigoW21hcCwgbGF5ZXJDb25zdHJ1Y3Rvcl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCBsYXllckNvbnN0cnVjdG9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShtYXA6IGdvb2dsZS5tYXBzLk1hcCwgbGF5ZXJDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyKSB7XG4gICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmJpY3ljbGluZ0xheWVyID0gbmV3IGxheWVyQ29uc3RydWN0b3IoKTtcbiAgICAgIHRoaXMuYmljeWNsaW5nTGF5ZXJJbml0aWFsaXplZC5lbWl0KHRoaXMuYmljeWNsaW5nTGF5ZXIpO1xuICAgICAgdGhpcy5fYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5iaWN5Y2xpbmdMYXllci5zZXRNYXAobWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuYmljeWNsaW5nTGF5ZXI/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtiaWN5Y2xpbmdMYXllcjogZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXJ9IHtcbiAgICBpZiAoIXRoaXMuYmljeWNsaW5nTGF5ZXIpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEJpY3ljbGluZyBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIFRyYW5zaXQgTGF5ZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=