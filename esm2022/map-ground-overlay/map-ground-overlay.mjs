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
import { Directive, EventEmitter, Input, NgZone, Output, inject, } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
export class MapGroundOverlay {
    /** URL of the image that will be shown in the overlay. */
    set url(url) {
        this._url.next(url);
    }
    /** Bounds for the overlay. */
    get bounds() {
        return this._bounds.value;
    }
    set bounds(bounds) {
        this._bounds.next(bounds);
    }
    /** Opacity of the overlay. */
    set opacity(opacity) {
        this._opacity.next(opacity);
    }
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        this._opacity = new BehaviorSubject(1);
        this._url = new BehaviorSubject('');
        this._bounds = new BehaviorSubject(undefined);
        this._destroyed = new Subject();
        /** Whether the overlay is clickable */
        this.clickable = false;
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
         */
        this.mapClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        /** Event emitted when the ground overlay is initialized. */
        this.groundOverlayInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            // The ground overlay setup is slightly different from the other Google Maps objects in that
            // we have to recreate the `GroundOverlay` object whenever the bounds change, because
            // Google Maps doesn't provide an API to update the bounds of an existing overlay.
            this._bounds.pipe(takeUntil(this._destroyed)).subscribe(bounds => {
                if (this.groundOverlay) {
                    this.groundOverlay.setMap(null);
                    this.groundOverlay = undefined;
                }
                if (!bounds) {
                    return;
                }
                if (google.maps.GroundOverlay && this._map.googleMap) {
                    this._initialize(this._map.googleMap, google.maps.GroundOverlay, bounds);
                }
                else {
                    this._ngZone.runOutsideAngular(() => {
                        Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
                            this._initialize(map, lib.GroundOverlay, bounds);
                        });
                    });
                }
            });
        }
    }
    _initialize(map, overlayConstructor, bounds) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.groundOverlay = new overlayConstructor(this._url.getValue(), bounds, {
                clickable: this.clickable,
                opacity: this._opacity.value,
            });
            this._assertInitialized();
            this.groundOverlay.setMap(map);
            this._eventManager.setTarget(this.groundOverlay);
            this.groundOverlayInitialized.emit(this.groundOverlay);
            // We only need to set up the watchers once.
            if (!this._hasWatchers) {
                this._hasWatchers = true;
                this._watchForOpacityChanges();
                this._watchForUrlChanges();
            }
        });
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        this.groundOverlay?.setMap(null);
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getBounds
     */
    getBounds() {
        this._assertInitialized();
        return this.groundOverlay.getBounds();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getOpacity
     */
    getOpacity() {
        this._assertInitialized();
        return this.groundOverlay.getOpacity();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getUrl
     */
    getUrl() {
        this._assertInitialized();
        return this.groundOverlay.getUrl();
    }
    _watchForOpacityChanges() {
        this._opacity.pipe(takeUntil(this._destroyed)).subscribe(opacity => {
            if (opacity != null) {
                this.groundOverlay?.setOpacity(opacity);
            }
        });
    }
    _watchForUrlChanges() {
        this._url.pipe(takeUntil(this._destroyed)).subscribe(url => {
            const overlay = this.groundOverlay;
            if (overlay) {
                overlay.set('url', url);
                // Google Maps only redraws the overlay if we re-set the map.
                overlay.setMap(null);
                overlay.setMap(this._map.googleMap);
            }
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.groundOverlay) {
                throw Error('Cannot interact with a Google Map GroundOverlay before it has been initialized. ' +
                    'Please wait for the GroundOverlay to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapGroundOverlay, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapGroundOverlay, isStandalone: true, selector: "map-ground-overlay", inputs: { url: "url", bounds: "bounds", clickable: "clickable", opacity: "opacity" }, outputs: { mapClick: "mapClick", mapDblclick: "mapDblclick", groundOverlayInitialized: "groundOverlayInitialized" }, exportAs: ["mapGroundOverlay"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapGroundOverlay, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-ground-overlay',
                    exportAs: 'mapGroundOverlay',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { url: [{
                type: Input
            }], bounds: [{
                type: Input
            }], clickable: [{
                type: Input
            }], opacity: [{
                type: Input
            }], mapClick: [{
                type: Output
            }], mapDblclick: [{
                type: Output
            }], groundOverlayInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdyb3VuZC1vdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBQ04sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBRXJEOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8sZ0JBQWdCO0lBa0IzQiwwREFBMEQ7SUFDMUQsSUFDSSxHQUFHLENBQUMsR0FBVztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsOEJBQThCO0lBQzlCLElBQ0ksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFNLENBQUM7SUFDN0IsQ0FBQztJQUNELElBQUksTUFBTSxDQUFDLE1BQWtFO1FBQzNFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFLRCw4QkFBOEI7SUFDOUIsSUFDSSxPQUFPLENBQUMsT0FBZTtRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBcUJELFlBQ21CLElBQWUsRUFDZixPQUFlO1FBRGYsU0FBSSxHQUFKLElBQUksQ0FBVztRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUE5RDFCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFM0MsYUFBUSxHQUFHLElBQUksZUFBZSxDQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFDLFNBQUksR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUN2QyxZQUFPLEdBQUcsSUFBSSxlQUFlLENBRTVDLFNBQVMsQ0FBQyxDQUFDO1FBQ0ksZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUF5QmxELHVDQUF1QztRQUM5QixjQUFTLEdBQVksS0FBSyxDQUFDO1FBUXBDOzs7V0FHRztRQUNnQixhQUFRLEdBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE0QixPQUFPLENBQUMsQ0FBQztRQUV4RTs7OztXQUlHO1FBQ2dCLGdCQUFXLEdBQzVCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE0QixVQUFVLENBQUMsQ0FBQztRQUUzRSw0REFBNEQ7UUFDekMsNkJBQXdCLEdBQ3pDLElBQUksWUFBWSxFQUE2QixDQUFDO0lBSzdDLENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pCLDRGQUE0RjtZQUM1RixxRkFBcUY7WUFDckYsa0ZBQWtGO1lBQ2xGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQy9ELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7Z0JBQ2pDLENBQUM7Z0JBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNaLE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3JELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzNFLENBQUM7cUJBQU0sQ0FBQztvQkFDTixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTt3QkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDNUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFOzRCQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFHLEdBQStCLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNoRixDQUFDLENBQ0YsQ0FBQztvQkFDSixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVPLFdBQVcsQ0FDakIsR0FBb0IsRUFDcEIsa0JBQW9ELEVBQ3BELE1BQWtFO1FBRWxFLG1GQUFtRjtRQUNuRixtRkFBbUY7UUFDbkYsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRTtnQkFDeEUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLO2FBQzdCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUV2RCw0Q0FBNEM7WUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO2dCQUMvQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUM3QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUztRQUNQLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFVBQVU7UUFDUixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNO1FBQ0osSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqRSxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLG1CQUFtQjtRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3pELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFFbkMsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEIsNkRBQTZEO2dCQUM3RCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBVSxDQUFDLENBQUM7WUFDdkMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixNQUFNLEtBQUssQ0FDVCxrRkFBa0Y7b0JBQ2hGLDhFQUE4RSxDQUNqRixDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDOzhHQTlMVSxnQkFBZ0I7a0dBQWhCLGdCQUFnQjs7MkZBQWhCLGdCQUFnQjtrQkFMNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixVQUFVLEVBQUUsSUFBSTtpQkFDakI7bUdBcUJLLEdBQUc7c0JBRE4sS0FBSztnQkFPRixNQUFNO3NCQURULEtBQUs7Z0JBU0csU0FBUztzQkFBakIsS0FBSztnQkFJRixPQUFPO3NCQURWLEtBQUs7Z0JBU2EsUUFBUTtzQkFBMUIsTUFBTTtnQkFRWSxXQUFXO3NCQUE3QixNQUFNO2dCQUlZLHdCQUF3QjtzQkFBMUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgR3JvdW5kIE92ZXJsYXkgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5I0dyb3VuZE92ZXJsYXlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWdyb3VuZC1vdmVybGF5JyxcbiAgZXhwb3J0QXM6ICdtYXBHcm91bmRPdmVybGF5JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwR3JvdW5kT3ZlcmxheSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfb3BhY2l0eSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPigxKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfdXJsID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KCcnKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYm91bmRzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxcbiAgICBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsIHwgdW5kZWZpbmVkXG4gID4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfaGFzV2F0Y2hlcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXkgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5I0dyb3VuZE92ZXJsYXlcbiAgICovXG4gIGdyb3VuZE92ZXJsYXk/OiBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5O1xuXG4gIC8qKiBVUkwgb2YgdGhlIGltYWdlIHRoYXQgd2lsbCBiZSBzaG93biBpbiB0aGUgb3ZlcmxheS4gKi9cbiAgQElucHV0KClcbiAgc2V0IHVybCh1cmw6IHN0cmluZykge1xuICAgIHRoaXMuX3VybC5uZXh0KHVybCk7XG4gIH1cblxuICAvKiogQm91bmRzIGZvciB0aGUgb3ZlcmxheS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJvdW5kcygpOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsIHtcbiAgICByZXR1cm4gdGhpcy5fYm91bmRzLnZhbHVlITtcbiAgfVxuICBzZXQgYm91bmRzKGJvdW5kczogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCkge1xuICAgIHRoaXMuX2JvdW5kcy5uZXh0KGJvdW5kcyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgb3ZlcmxheSBpcyBjbGlja2FibGUgKi9cbiAgQElucHV0KCkgY2xpY2thYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE9wYWNpdHkgb2YgdGhlIG92ZXJsYXkuICovXG4gIEBJbnB1dCgpXG4gIHNldCBvcGFjaXR5KG9wYWNpdHk6IG51bWJlcikge1xuICAgIHRoaXMuX29wYWNpdHkubmV4dChvcGFjaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5I0dyb3VuZE92ZXJsYXkuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBncm91bmQgb3ZlcmxheSBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGdyb3VuZE92ZXJsYXlJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXk+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXk+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fbWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIC8vIFRoZSBncm91bmQgb3ZlcmxheSBzZXR1cCBpcyBzbGlnaHRseSBkaWZmZXJlbnQgZnJvbSB0aGUgb3RoZXIgR29vZ2xlIE1hcHMgb2JqZWN0cyBpbiB0aGF0XG4gICAgICAvLyB3ZSBoYXZlIHRvIHJlY3JlYXRlIHRoZSBgR3JvdW5kT3ZlcmxheWAgb2JqZWN0IHdoZW5ldmVyIHRoZSBib3VuZHMgY2hhbmdlLCBiZWNhdXNlXG4gICAgICAvLyBHb29nbGUgTWFwcyBkb2Vzbid0IHByb3ZpZGUgYW4gQVBJIHRvIHVwZGF0ZSB0aGUgYm91bmRzIG9mIGFuIGV4aXN0aW5nIG92ZXJsYXkuXG4gICAgICB0aGlzLl9ib3VuZHMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGJvdW5kcyA9PiB7XG4gICAgICAgIGlmICh0aGlzLmdyb3VuZE92ZXJsYXkpIHtcbiAgICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkuc2V0TWFwKG51bGwpO1xuICAgICAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYm91bmRzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXkgJiYgdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUodGhpcy5fbWFwLmdvb2dsZU1hcCwgZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheSwgYm91bmRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW3RoaXMuX21hcC5fcmVzb2x2ZU1hcCgpLCBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdtYXBzJyldKS50aGVuKFxuICAgICAgICAgICAgICAoW21hcCwgbGliXSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLk1hcHNMaWJyYXJ5KS5Hcm91bmRPdmVybGF5LCBib3VuZHMpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShcbiAgICBtYXA6IGdvb2dsZS5tYXBzLk1hcCxcbiAgICBvdmVybGF5Q29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5LFxuICAgIGJvdW5kczogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCxcbiAgKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheSA9IG5ldyBvdmVybGF5Q29uc3RydWN0b3IodGhpcy5fdXJsLmdldFZhbHVlKCksIGJvdW5kcywge1xuICAgICAgICBjbGlja2FibGU6IHRoaXMuY2xpY2thYmxlLFxuICAgICAgICBvcGFjaXR5OiB0aGlzLl9vcGFjaXR5LnZhbHVlLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5ncm91bmRPdmVybGF5LnNldE1hcChtYXApO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmdyb3VuZE92ZXJsYXkpO1xuICAgICAgdGhpcy5ncm91bmRPdmVybGF5SW5pdGlhbGl6ZWQuZW1pdCh0aGlzLmdyb3VuZE92ZXJsYXkpO1xuXG4gICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gc2V0IHVwIHRoZSB3YXRjaGVycyBvbmNlLlxuICAgICAgaWYgKCF0aGlzLl9oYXNXYXRjaGVycykge1xuICAgICAgICB0aGlzLl9oYXNXYXRjaGVycyA9IHRydWU7XG4gICAgICAgIHRoaXMuX3dhdGNoRm9yT3BhY2l0eUNoYW5nZXMoKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hGb3JVcmxDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5ncm91bmRPdmVybGF5Py5zZXRNYXAobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheVxuICAgKiAjR3JvdW5kT3ZlcmxheS5nZXRCb3VuZHNcbiAgICovXG4gIGdldEJvdW5kcygpOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0Qm91bmRzKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheVxuICAgKiAjR3JvdW5kT3ZlcmxheS5nZXRPcGFjaXR5XG4gICAqL1xuICBnZXRPcGFjaXR5KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5ncm91bmRPdmVybGF5LmdldE9wYWNpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldFVybFxuICAgKi9cbiAgZ2V0VXJsKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5ncm91bmRPdmVybGF5LmdldFVybCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcGFjaXR5Q2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcGFjaXR5LnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcGFjaXR5ID0+IHtcbiAgICAgIGlmIChvcGFjaXR5ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5ncm91bmRPdmVybGF5Py5zZXRPcGFjaXR5KG9wYWNpdHkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JVcmxDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3VybC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUodXJsID0+IHtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSB0aGlzLmdyb3VuZE92ZXJsYXk7XG5cbiAgICAgIGlmIChvdmVybGF5KSB7XG4gICAgICAgIG92ZXJsYXkuc2V0KCd1cmwnLCB1cmwpO1xuICAgICAgICAvLyBHb29nbGUgTWFwcyBvbmx5IHJlZHJhd3MgdGhlIG92ZXJsYXkgaWYgd2UgcmUtc2V0IHRoZSBtYXAuXG4gICAgICAgIG92ZXJsYXkuc2V0TWFwKG51bGwpO1xuICAgICAgICBvdmVybGF5LnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dyb3VuZE92ZXJsYXk6IGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXl9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuZ3JvdW5kT3ZlcmxheSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEdyb3VuZE92ZXJsYXkgYmVmb3JlIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEdyb3VuZE92ZXJsYXkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==