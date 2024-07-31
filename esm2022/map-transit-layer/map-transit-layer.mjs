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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapTransitLayer, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapTransitLayer, isStandalone: true, selector: "map-transit-layer", outputs: { transitLayerInitialized: "transitLayerInitialized" }, exportAs: ["mapTransitLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapTransitLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-transit-layer',
                    exportAs: 'mapTransitLayer',
                    standalone: true,
                }]
        }], propDecorators: { transitLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYW5zaXQtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYW5zaXQtbGF5ZXIvbWFwLXRyYW5zaXQtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQXFCLE1BQU0sRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFakcsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOztBQUVuRDs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGVBQWU7SUFMNUI7UUFNVSxTQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLFVBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFTL0IsMkRBQTJEO1FBQ3hDLDRCQUF1QixHQUN4QyxJQUFJLFlBQVksRUFBNEIsQ0FBQztLQXVDaEQ7SUFyQ0MsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN6QixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNsRSxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTt3QkFDYixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRyxHQUErQixDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN2RSxDQUFDLENBQ0YsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLFdBQVcsQ0FBQyxHQUFvQixFQUFFLGdCQUFpRDtRQUN6RixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUMzQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLHVCQUF1QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sS0FBSyxDQUNULGtGQUFrRjtnQkFDaEYsOEVBQThFLENBQ2pGLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztxSEFuRFUsZUFBZTt5R0FBZixlQUFlOztrR0FBZixlQUFlO2tCQUwzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs4QkFhb0IsdUJBQXVCO3NCQUF6QyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiBwcmVzZXJ2ZT1cInRydWVcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIGluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIFRyYW5zaXQgTGF5ZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjVHJhbnNpdExheWVyXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC10cmFuc2l0LWxheWVyJyxcbiAgZXhwb3J0QXM6ICdtYXBUcmFuc2l0TGF5ZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBUcmFuc2l0TGF5ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX21hcCA9IGluamVjdChHb29nbGVNYXApO1xuICBwcml2YXRlIF96b25lID0gaW5qZWN0KE5nWm9uZSk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNUcmFuc2l0TGF5ZXJcbiAgICovXG4gIHRyYW5zaXRMYXllcj86IGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0cmFuc2l0IGxheWVyIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdHJhbnNpdExheWVySW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXI+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcj4oKTtcblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGlmIChnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXIgJiYgdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX21hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5fbWFwLl9yZXNvbHZlTWFwKCksIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ21hcHMnKV0pLnRoZW4oXG4gICAgICAgICAgICAoW21hcCwgbGliXSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKG1hcCwgKGxpYiBhcyBnb29nbGUubWFwcy5NYXBzTGlicmFyeSkuVHJhbnNpdExheWVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShtYXA6IGdvb2dsZS5tYXBzLk1hcCwgbGF5ZXJDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcikge1xuICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0TGF5ZXIgPSBuZXcgbGF5ZXJDb25zdHJ1Y3RvcigpO1xuICAgICAgdGhpcy50cmFuc2l0TGF5ZXJJbml0aWFsaXplZC5lbWl0KHRoaXMudHJhbnNpdExheWVyKTtcbiAgICAgIHRoaXMuX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMudHJhbnNpdExheWVyLnNldE1hcChtYXApO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy50cmFuc2l0TGF5ZXI/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHt0cmFuc2l0TGF5ZXI6IGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcn0ge1xuICAgIGlmICghdGhpcy50cmFuc2l0TGF5ZXIpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIFRyYW5zaXQgTGF5ZXIgYmVmb3JlIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBUcmFuc2l0IExheWVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19