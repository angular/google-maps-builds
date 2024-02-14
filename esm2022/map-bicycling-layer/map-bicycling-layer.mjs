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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapBicyclingLayer, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapBicyclingLayer, isStandalone: true, selector: "map-bicycling-layer", outputs: { bicyclingLayerInitialized: "bicyclingLayerInitialized" }, exportAs: ["mapBicyclingLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapBicyclingLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-bicycling-layer',
                    exportAs: 'mapBicyclingLayer',
                    standalone: true,
                }]
        }], propDecorators: { bicyclingLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWJpY3ljbGluZy1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYmljeWNsaW5nLWxheWVyL21hcC1iaWN5Y2xpbmctbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpHLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7QUFFbkQ7Ozs7R0FJRztBQU1ILE1BQU0sT0FBTyxpQkFBaUI7SUFMOUI7UUFNVSxTQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLFVBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFTL0IsNkRBQTZEO1FBQzFDLDhCQUF5QixHQUMxQyxJQUFJLFlBQVksRUFBOEIsQ0FBQztLQXVDbEQ7SUFyQ0MsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN6QixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNwRSxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTt3QkFDYixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRyxHQUErQixDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUN6RSxDQUFDLENBQ0YsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLFdBQVcsQ0FBQyxHQUFvQixFQUFFLGdCQUFtRDtRQUMzRixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVPLHVCQUF1QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sS0FBSyxDQUNULG9GQUFvRjtnQkFDbEYsOEVBQThFLENBQ2pGLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQzs4R0FuRFUsaUJBQWlCO2tHQUFqQixpQkFBaUI7OzJGQUFqQixpQkFBaUI7a0JBTDdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsVUFBVSxFQUFFLElBQUk7aUJBQ2pCOzhCQWFvQix5QkFBeUI7c0JBQTNDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgaW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgQmljeWNsaW5nIExheWVyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI0JpY3ljbGluZ0xheWVyXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1iaWN5Y2xpbmctbGF5ZXInLFxuICBleHBvcnRBczogJ21hcEJpY3ljbGluZ0xheWVyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwQmljeWNsaW5nTGF5ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX21hcCA9IGluamVjdChHb29nbGVNYXApO1xuICBwcml2YXRlIF96b25lID0gaW5qZWN0KE5nWm9uZSk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI0JpY3ljbGluZ0xheWVyXG4gICAqL1xuICBiaWN5Y2xpbmdMYXllcj86IGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGJpY3ljbGluZyBsYXllciBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGJpY3ljbGluZ0xheWVySW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllcj4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXI+KCk7XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXIgJiYgdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX21hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIFByb21pc2UuYWxsKFt0aGlzLl9tYXAuX3Jlc29sdmVNYXAoKSwgZ29vZ2xlLm1hcHMuaW1wb3J0TGlicmFyeSgnbWFwcycpXSkudGhlbihcbiAgICAgICAgICAgIChbbWFwLCBsaWJdKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLk1hcHNMaWJyYXJ5KS5CaWN5Y2xpbmdMYXllcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUobWFwOiBnb29nbGUubWFwcy5NYXAsIGxheWVyQ29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllcikge1xuICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5iaWN5Y2xpbmdMYXllciA9IG5ldyBsYXllckNvbnN0cnVjdG9yKCk7XG4gICAgICB0aGlzLmJpY3ljbGluZ0xheWVySW5pdGlhbGl6ZWQuZW1pdCh0aGlzLmJpY3ljbGluZ0xheWVyKTtcbiAgICAgIHRoaXMuX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuYmljeWNsaW5nTGF5ZXIuc2V0TWFwKG1hcCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmJpY3ljbGluZ0xheWVyPy5zZXRNYXAobnVsbCk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRMYXllckluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7YmljeWNsaW5nTGF5ZXI6IGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyfSB7XG4gICAgaWYgKCF0aGlzLmJpY3ljbGluZ0xheWVyKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBCaWN5Y2xpbmcgTGF5ZXIgYmVmb3JlIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBUcmFuc2l0IExheWVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19