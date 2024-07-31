/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" preserve="true" />
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapGroundOverlay, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapGroundOverlay, isStandalone: true, selector: "map-ground-overlay", inputs: { url: "url", bounds: "bounds", clickable: "clickable", opacity: "opacity" }, outputs: { mapClick: "mapClick", mapDblclick: "mapDblclick", groundOverlayInitialized: "groundOverlayInitialized" }, exportAs: ["mapGroundOverlay"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapGroundOverlay, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdyb3VuZC1vdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUdOLE1BQU0sRUFDTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFFckQ7Ozs7R0FJRztBQU1ILE1BQU0sT0FBTyxnQkFBZ0I7SUFrQjNCLDBEQUEwRDtJQUMxRCxJQUNJLEdBQUcsQ0FBQyxHQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCw4QkFBOEI7SUFDOUIsSUFDSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQU0sQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxNQUFNLENBQUMsTUFBa0U7UUFDM0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUtELDhCQUE4QjtJQUM5QixJQUNJLE9BQU8sQ0FBQyxPQUFlO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7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Q0FBQztJQUNILENBQUM7cUhBOUxVLGdCQUFnQjt5R0FBaEIsZ0JBQWdCOztrR0FBaEIsZ0JBQWdCO2tCQUw1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjttR0FxQkssR0FBRztzQkFETixLQUFLO2dCQU9GLE1BQU07c0JBRFQsS0FBSztnQkFTRyxTQUFTO3NCQUFqQixLQUFLO2dCQUlGLE9BQU87c0JBRFYsS0FBSztnQkFTYSxRQUFRO3NCQUExQixNQUFNO2dCQVFZLFdBQVc7c0JBQTdCLE1BQU07Z0JBSVksd0JBQXdCO3NCQUExQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiBwcmVzZXJ2ZT1cInRydWVcIiAvPlxuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBHcm91bmQgT3ZlcmxheSB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXkjR3JvdW5kT3ZlcmxheVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtZ3JvdW5kLW92ZXJsYXknLFxuICBleHBvcnRBczogJ21hcEdyb3VuZE92ZXJsYXknLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBHcm91bmRPdmVybGF5IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKGluamVjdChOZ1pvbmUpKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9vcGFjaXR5ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KDEpO1xuICBwcml2YXRlIHJlYWRvbmx5IF91cmwgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4oJycpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9ib3VuZHMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFxuICAgIGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwgfCB1bmRlZmluZWRcbiAgPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9oYXNXYXRjaGVyczogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheSBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXkjR3JvdW5kT3ZlcmxheVxuICAgKi9cbiAgZ3JvdW5kT3ZlcmxheT86IGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXk7XG5cbiAgLyoqIFVSTCBvZiB0aGUgaW1hZ2UgdGhhdCB3aWxsIGJlIHNob3duIGluIHRoZSBvdmVybGF5LiAqL1xuICBASW5wdXQoKVxuICBzZXQgdXJsKHVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXJsLm5leHQodXJsKTtcbiAgfVxuXG4gIC8qKiBCb3VuZHMgZm9yIHRoZSBvdmVybGF5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgYm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwge1xuICAgIHJldHVybiB0aGlzLl9ib3VuZHMudmFsdWUhO1xuICB9XG4gIHNldCBib3VuZHMoYm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsKSB7XG4gICAgdGhpcy5fYm91bmRzLm5leHQoYm91bmRzKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBvdmVybGF5IGlzIGNsaWNrYWJsZSAqL1xuICBASW5wdXQoKSBjbGlja2FibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogT3BhY2l0eSBvZiB0aGUgb3ZlcmxheS4gKi9cbiAgQElucHV0KClcbiAgc2V0IG9wYWNpdHkob3BhY2l0eTogbnVtYmVyKSB7XG4gICAgdGhpcy5fb3BhY2l0eS5uZXh0KG9wYWNpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXkjR3JvdW5kT3ZlcmxheS5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGdyb3VuZCBvdmVybGF5IGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZ3JvdW5kT3ZlcmxheUluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheT4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgLy8gVGhlIGdyb3VuZCBvdmVybGF5IHNldHVwIGlzIHNsaWdodGx5IGRpZmZlcmVudCBmcm9tIHRoZSBvdGhlciBHb29nbGUgTWFwcyBvYmplY3RzIGluIHRoYXRcbiAgICAgIC8vIHdlIGhhdmUgdG8gcmVjcmVhdGUgdGhlIGBHcm91bmRPdmVybGF5YCBvYmplY3Qgd2hlbmV2ZXIgdGhlIGJvdW5kcyBjaGFuZ2UsIGJlY2F1c2VcbiAgICAgIC8vIEdvb2dsZSBNYXBzIGRvZXNuJ3QgcHJvdmlkZSBhbiBBUEkgdG8gdXBkYXRlIHRoZSBib3VuZHMgb2YgYW4gZXhpc3Rpbmcgb3ZlcmxheS5cbiAgICAgIHRoaXMuX2JvdW5kcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoYm91bmRzID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZ3JvdW5kT3ZlcmxheSkge1xuICAgICAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgdGhpcy5ncm91bmRPdmVybGF5ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFib3VuZHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheSAmJiB0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9tYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5LCBib3VuZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5fbWFwLl9yZXNvbHZlTWFwKCksIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ21hcHMnKV0pLnRoZW4oXG4gICAgICAgICAgICAgIChbbWFwLCBsaWJdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuTWFwc0xpYnJhcnkpLkdyb3VuZE92ZXJsYXksIGJvdW5kcyk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIG1hcDogZ29vZ2xlLm1hcHMuTWFwLFxuICAgIG92ZXJsYXlDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXksXG4gICAgYm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICApIHtcbiAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5ncm91bmRPdmVybGF5ID0gbmV3IG92ZXJsYXlDb25zdHJ1Y3Rvcih0aGlzLl91cmwuZ2V0VmFsdWUoKSwgYm91bmRzLCB7XG4gICAgICAgIGNsaWNrYWJsZTogdGhpcy5jbGlja2FibGUsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMuX29wYWNpdHkudmFsdWUsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLmdyb3VuZE92ZXJsYXkuc2V0TWFwKG1hcCk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuZ3JvdW5kT3ZlcmxheSk7XG4gICAgICB0aGlzLmdyb3VuZE92ZXJsYXlJbml0aWFsaXplZC5lbWl0KHRoaXMuZ3JvdW5kT3ZlcmxheSk7XG5cbiAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBzZXQgdXAgdGhlIHdhdGNoZXJzIG9uY2UuXG4gICAgICBpZiAoIXRoaXMuX2hhc1dhdGNoZXJzKSB7XG4gICAgICAgIHRoaXMuX2hhc1dhdGNoZXJzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fd2F0Y2hGb3JPcGFjaXR5Q2hhbmdlcygpO1xuICAgICAgICB0aGlzLl93YXRjaEZvclVybENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLmdyb3VuZE92ZXJsYXk/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kT3ZlcmxheS5nZXRCb3VuZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldE9wYWNpdHlcbiAgICovXG4gIGdldE9wYWNpdHkoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0T3BhY2l0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0VXJsXG4gICAqL1xuICBnZXRVcmwoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0VXJsKCk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wYWNpdHlDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wYWNpdHkucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wYWNpdHkgPT4ge1xuICAgICAgaWYgKG9wYWNpdHkgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXk/LnNldE9wYWNpdHkob3BhY2l0eSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclVybENoYW5nZXMoKSB7XG4gICAgdGhpcy5fdXJsLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSh1cmwgPT4ge1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuZ3JvdW5kT3ZlcmxheTtcblxuICAgICAgaWYgKG92ZXJsYXkpIHtcbiAgICAgICAgb3ZlcmxheS5zZXQoJ3VybCcsIHVybCk7XG4gICAgICAgIC8vIEdvb2dsZSBNYXBzIG9ubHkgcmVkcmF3cyB0aGUgb3ZlcmxheSBpZiB3ZSByZS1zZXQgdGhlIG1hcC5cbiAgICAgICAgb3ZlcmxheS5zZXRNYXAobnVsbCk7XG4gICAgICAgIG92ZXJsYXkuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7Z3JvdW5kT3ZlcmxheTogZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheX0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5ncm91bmRPdmVybGF5KSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgR3JvdW5kT3ZlcmxheSBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgR3JvdW5kT3ZlcmxheSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19