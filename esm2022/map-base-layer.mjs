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
import { Directive, NgZone } from '@angular/core';
import { GoogleMap } from './google-map/google-map';
import * as i0 from "@angular/core";
import * as i1 from "./google-map/google-map";
export class MapBaseLayer {
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            this._ngZone.runOutsideAngular(() => {
                this._initializeObject();
            });
            this._assertInitialized();
            this._setMap();
        }
    }
    ngOnDestroy() {
        this._unsetMap();
    }
    _assertInitialized() {
        if (!this._map.googleMap) {
            throw Error('Cannot access Google Map information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.');
        }
    }
    _initializeObject() { }
    _setMap() { }
    _unsetMap() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapBaseLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapBaseLayer, isStandalone: true, selector: "map-base-layer", exportAs: ["mapBaseLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapBaseLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-base-layer',
                    exportAs: 'mapBaseLayer',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWJhc2UtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWJhc2UtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRW5FLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQzs7O0FBT2xELE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQ3FCLElBQWUsRUFDZixPQUFlO1FBRGYsU0FBSSxHQUFKLElBQUksQ0FBVztRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFDakMsQ0FBQztJQUVKLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRU8sa0JBQWtCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sS0FBSyxDQUNULDRFQUE0RTtnQkFDMUUsb0VBQW9FLENBQ3ZFLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUVTLGlCQUFpQixLQUFJLENBQUM7SUFDdEIsT0FBTyxLQUFJLENBQUM7SUFDWixTQUFTLEtBQUksQ0FBQzs4R0EvQmIsWUFBWTtrR0FBWixZQUFZOzsyRkFBWixZQUFZO2tCQUx4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlLCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWJhc2UtbGF5ZXInLFxuICBleHBvcnRBczogJ21hcEJhc2VMYXllcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEJhc2VMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplT2JqZWN0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLl9zZXRNYXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl91bnNldE1hcCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKSB7XG4gICAgaWYgKCF0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfaW5pdGlhbGl6ZU9iamVjdCgpIHt9XG4gIHByb3RlY3RlZCBfc2V0TWFwKCkge31cbiAgcHJvdGVjdGVkIF91bnNldE1hcCgpIHt9XG59XG4iXX0=