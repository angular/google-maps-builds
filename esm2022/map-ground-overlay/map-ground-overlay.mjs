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
import { importLibrary } from '../import-library';
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
                        Promise.all([
                            this._map._resolveMap(),
                            importLibrary('maps', 'GroundOverlay'),
                        ]).then(([map, overlayConstructor]) => {
                            this._initialize(map, overlayConstructor, bounds);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapGroundOverlay, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.2", type: MapGroundOverlay, isStandalone: true, selector: "map-ground-overlay", inputs: { url: "url", bounds: "bounds", clickable: "clickable", opacity: "opacity" }, outputs: { mapClick: "mapClick", mapDblclick: "mapDblclick", groundOverlayInitialized: "groundOverlayInitialized" }, exportAs: ["mapGroundOverlay"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapGroundOverlay, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdyb3VuZC1vdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBQ04sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7OztBQUVoRDs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGdCQUFnQjtJQWtCM0IsMERBQTBEO0lBQzFELElBQ0ksR0FBRyxDQUFDLEdBQVc7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELDhCQUE4QjtJQUM5QixJQUNJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBTSxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLE1BQU0sQ0FBQyxNQUFrRTtRQUMzRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBS0QsOEJBQThCO0lBQzlCLElBQ0ksT0FBTyxDQUFDLE9BQWU7UUFDekIs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QUFrRjtvQkFDaEYsOEVBQThFLENBQ2pGLENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7cUhBL0xVLGdCQUFnQjt5R0FBaEIsZ0JBQWdCOztrR0FBaEIsZ0JBQWdCO2tCQUw1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjttR0FxQkssR0FBRztzQkFETixLQUFLO2dCQU9GLE1BQU07c0JBRFQsS0FBSztnQkFTRyxTQUFTO3NCQUFqQixLQUFLO2dCQUlGLE9BQU87c0JBRFYsS0FBSztnQkFTYSxRQUFRO3NCQUExQixNQUFNO2dCQVFZLFdBQVc7c0JBQTdCLE1BQU07Z0JBSVksd0JBQXdCO3NCQUExQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7aW1wb3J0TGlicmFyeX0gZnJvbSAnLi4vaW1wb3J0LWxpYnJhcnknO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIEdyb3VuZCBPdmVybGF5IHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1ncm91bmQtb3ZlcmxheScsXG4gIGV4cG9ydEFzOiAnbWFwR3JvdW5kT3ZlcmxheScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEdyb3VuZE92ZXJsYXkgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX29wYWNpdHkgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4oMSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3VybCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPignJyk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2JvdW5kcyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8XG4gICAgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCB8IHVuZGVmaW5lZFxuICA+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2hhc1dhdGNoZXJzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5IG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5XG4gICAqL1xuICBncm91bmRPdmVybGF5PzogZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheTtcblxuICAvKiogVVJMIG9mIHRoZSBpbWFnZSB0aGF0IHdpbGwgYmUgc2hvd24gaW4gdGhlIG92ZXJsYXkuICovXG4gIEBJbnB1dCgpXG4gIHNldCB1cmwodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cmwubmV4dCh1cmwpO1xuICB9XG5cbiAgLyoqIEJvdW5kcyBmb3IgdGhlIG92ZXJsYXkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBib3VuZHMoKTogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCB7XG4gICAgcmV0dXJuIHRoaXMuX2JvdW5kcy52YWx1ZSE7XG4gIH1cbiAgc2V0IGJvdW5kcyhib3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwpIHtcbiAgICB0aGlzLl9ib3VuZHMubmV4dChib3VuZHMpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG92ZXJsYXkgaXMgY2xpY2thYmxlICovXG4gIEBJbnB1dCgpIGNsaWNrYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBPcGFjaXR5IG9mIHRoZSBvdmVybGF5LiAqL1xuICBASW5wdXQoKVxuICBzZXQgb3BhY2l0eShvcGFjaXR5OiBudW1iZXIpIHtcbiAgICB0aGlzLl9vcGFjaXR5Lm5leHQob3BhY2l0eSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5LmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheVxuICAgKiAjR3JvdW5kT3ZlcmxheS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZ3JvdW5kIG92ZXJsYXkgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBncm91bmRPdmVybGF5SW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICAvLyBUaGUgZ3JvdW5kIG92ZXJsYXkgc2V0dXAgaXMgc2xpZ2h0bHkgZGlmZmVyZW50IGZyb20gdGhlIG90aGVyIEdvb2dsZSBNYXBzIG9iamVjdHMgaW4gdGhhdFxuICAgICAgLy8gd2UgaGF2ZSB0byByZWNyZWF0ZSB0aGUgYEdyb3VuZE92ZXJsYXlgIG9iamVjdCB3aGVuZXZlciB0aGUgYm91bmRzIGNoYW5nZSwgYmVjYXVzZVxuICAgICAgLy8gR29vZ2xlIE1hcHMgZG9lc24ndCBwcm92aWRlIGFuIEFQSSB0byB1cGRhdGUgdGhlIGJvdW5kcyBvZiBhbiBleGlzdGluZyBvdmVybGF5LlxuICAgICAgdGhpcy5fYm91bmRzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShib3VuZHMgPT4ge1xuICAgICAgICBpZiAodGhpcy5ncm91bmRPdmVybGF5KSB7XG4gICAgICAgICAgdGhpcy5ncm91bmRPdmVybGF5LnNldE1hcChudWxsKTtcbiAgICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWJvdW5kcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5ICYmIHRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX21hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXksIGJvdW5kcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgdGhpcy5fbWFwLl9yZXNvbHZlTWFwKCksXG4gICAgICAgICAgICAgIGltcG9ydExpYnJhcnk8dHlwZW9mIGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXk+KCdtYXBzJywgJ0dyb3VuZE92ZXJsYXknKSxcbiAgICAgICAgICAgIF0pLnRoZW4oKFttYXAsIG92ZXJsYXlDb25zdHJ1Y3Rvcl0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIG92ZXJsYXlDb25zdHJ1Y3RvciwgYm91bmRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIG1hcDogZ29vZ2xlLm1hcHMuTWFwLFxuICAgIG92ZXJsYXlDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXksXG4gICAgYm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICApIHtcbiAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5ncm91bmRPdmVybGF5ID0gbmV3IG92ZXJsYXlDb25zdHJ1Y3Rvcih0aGlzLl91cmwuZ2V0VmFsdWUoKSwgYm91bmRzLCB7XG4gICAgICAgIGNsaWNrYWJsZTogdGhpcy5jbGlja2FibGUsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMuX29wYWNpdHkudmFsdWUsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLmdyb3VuZE92ZXJsYXkuc2V0TWFwKG1hcCk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuZ3JvdW5kT3ZlcmxheSk7XG4gICAgICB0aGlzLmdyb3VuZE92ZXJsYXlJbml0aWFsaXplZC5lbWl0KHRoaXMuZ3JvdW5kT3ZlcmxheSk7XG5cbiAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBzZXQgdXAgdGhlIHdhdGNoZXJzIG9uY2UuXG4gICAgICBpZiAoIXRoaXMuX2hhc1dhdGNoZXJzKSB7XG4gICAgICAgIHRoaXMuX2hhc1dhdGNoZXJzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fd2F0Y2hGb3JPcGFjaXR5Q2hhbmdlcygpO1xuICAgICAgICB0aGlzLl93YXRjaEZvclVybENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLmdyb3VuZE92ZXJsYXk/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kT3ZlcmxheS5nZXRCb3VuZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldE9wYWNpdHlcbiAgICovXG4gIGdldE9wYWNpdHkoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0T3BhY2l0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0VXJsXG4gICAqL1xuICBnZXRVcmwoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0VXJsKCk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wYWNpdHlDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wYWNpdHkucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wYWNpdHkgPT4ge1xuICAgICAgaWYgKG9wYWNpdHkgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXk/LnNldE9wYWNpdHkob3BhY2l0eSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclVybENoYW5nZXMoKSB7XG4gICAgdGhpcy5fdXJsLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSh1cmwgPT4ge1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuZ3JvdW5kT3ZlcmxheTtcblxuICAgICAgaWYgKG92ZXJsYXkpIHtcbiAgICAgICAgb3ZlcmxheS5zZXQoJ3VybCcsIHVybCk7XG4gICAgICAgIC8vIEdvb2dsZSBNYXBzIG9ubHkgcmVkcmF3cyB0aGUgb3ZlcmxheSBpZiB3ZSByZS1zZXQgdGhlIG1hcC5cbiAgICAgICAgb3ZlcmxheS5zZXRNYXAobnVsbCk7XG4gICAgICAgIG92ZXJsYXkuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7Z3JvdW5kT3ZlcmxheTogZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheX0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5ncm91bmRPdmVybGF5KSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgR3JvdW5kT3ZlcmxheSBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgR3JvdW5kT3ZlcmxheSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19