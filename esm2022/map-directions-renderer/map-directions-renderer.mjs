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
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Directions Renderer via the Google Maps
 * JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer
 */
export class MapDirectionsRenderer {
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions.directions
     */
    set directions(directions) {
        this._directions = directions;
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions
     */
    set options(options) {
        this._options = options;
    }
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        /**
         * See developers.google.com/maps/documentation/javascript/reference/directions
         * #DirectionsRenderer.directions_changed
         */
        this.directionsChanged = this._eventManager.getLazyEmitter('directions_changed');
        /** Event emitted when the directions renderer is initialized. */
        this.directionsRendererInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            if (google.maps.DirectionsRenderer && this._googleMap.googleMap) {
                this._initialize(this._googleMap.googleMap, google.maps.DirectionsRenderer);
            }
            else {
                this._ngZone.runOutsideAngular(() => {
                    Promise.all([this._googleMap._resolveMap(), google.maps.importLibrary('routes')]).then(([map, lib]) => {
                        this._initialize(map, lib.DirectionsRenderer);
                    });
                });
            }
        }
    }
    _initialize(map, rendererConstructor) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.directionsRenderer = new rendererConstructor(this._combineOptions());
            this._assertInitialized();
            this.directionsRenderer.setMap(map);
            this._eventManager.setTarget(this.directionsRenderer);
            this.directionsRendererInitialized.emit(this.directionsRenderer);
        });
    }
    ngOnChanges(changes) {
        if (this.directionsRenderer) {
            if (changes['options']) {
                this.directionsRenderer.setOptions(this._combineOptions());
            }
            if (changes['directions'] && this._directions !== undefined) {
                this.directionsRenderer.setDirections(this._directions);
            }
        }
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this.directionsRenderer?.setMap(null);
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getDirections
     */
    getDirections() {
        this._assertInitialized();
        return this.directionsRenderer.getDirections();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getPanel
     */
    getPanel() {
        this._assertInitialized();
        return this.directionsRenderer.getPanel();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getRouteIndex
     */
    getRouteIndex() {
        this._assertInitialized();
        return this.directionsRenderer.getRouteIndex();
    }
    _combineOptions() {
        const options = this._options || {};
        return {
            ...options,
            directions: this._directions || options.directions,
            map: this._googleMap.googleMap,
        };
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.directionsRenderer) {
                throw Error('Cannot interact with a Google Map Directions Renderer before it has been ' +
                    'initialized. Please wait for the Directions Renderer to load before trying ' +
                    'to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapDirectionsRenderer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapDirectionsRenderer, isStandalone: true, selector: "map-directions-renderer", inputs: { directions: "directions", options: "options" }, outputs: { directionsChanged: "directionsChanged", directionsRendererInitialized: "directionsRendererInitialized" }, exportAs: ["mapDirectionsRenderer"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapDirectionsRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-directions-renderer',
                    exportAs: 'mapDirectionsRenderer',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { directions: [{
                type: Input
            }], options: [{
                type: Input
            }], directionsChanged: [{
                type: Output
            }], directionsRendererInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUlOLE1BQU0sRUFFTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFFckQ7Ozs7O0dBS0c7QUFNSCxNQUFNLE9BQU8scUJBQXFCO0lBR2hDOzs7T0FHRztJQUNILElBQ0ksVUFBVSxDQUFDLFVBQXdDO1FBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUE4QztRQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBa0JELFlBQ21CLFVBQXFCLEVBQzlCLE9BQWU7UUFETixlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQzlCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUF2Q2pCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFzQjVEOzs7V0FHRztRQUVNLHNCQUFpQixHQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxvQkFBb0IsQ0FBQyxDQUFDO1FBRWhFLGlFQUFpRTtRQUM5QyxrQ0FB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WCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRU8sZUFBZTtRQUNyQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNwQyxPQUFPO1lBQ0wsR0FBRyxPQUFPO1lBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFVBQVU7WUFDbEQsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUztTQUMvQixDQUFDO0lBQ0osQ0FBQztJQUVPLGtCQUFrQjtRQUd4QixJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzdCLE1BQU0sS0FBSyxDQUNULDJFQUEyRTtvQkFDekUsNkVBQTZFO29CQUM3RSxzQkFBc0IsQ0FDekIsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztxSEE1SVUscUJBQXFCO3lHQUFyQixxQkFBcUI7O2tHQUFyQixxQkFBcUI7a0JBTGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsVUFBVSxFQUFFLElBQUk7aUJBQ2pCO21HQVNLLFVBQVU7c0JBRGIsS0FBSztnQkFXRixPQUFPO3NCQURWLEtBQUs7Z0JBV0csaUJBQWlCO3NCQUR6QixNQUFNO2dCQUtZLDZCQUE2QjtzQkFBL0MsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgcHJlc2VydmU9XCJ0cnVlXCIgLz5cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgRGlyZWN0aW9ucyBSZW5kZXJlciB2aWEgdGhlIEdvb2dsZSBNYXBzXG4gKiBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zI0RpcmVjdGlvbnNSZW5kZXJlclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtZGlyZWN0aW9ucy1yZW5kZXJlcicsXG4gIGV4cG9ydEFzOiAnbWFwRGlyZWN0aW9uc1JlbmRlcmVyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwRGlyZWN0aW9uc1JlbmRlcmVyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zUmVuZGVyZXJPcHRpb25zLmRpcmVjdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBkaXJlY3Rpb25zKGRpcmVjdGlvbnM6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZXN1bHQpIHtcbiAgICB0aGlzLl9kaXJlY3Rpb25zID0gZGlyZWN0aW9ucztcbiAgfVxuICBwcml2YXRlIF9kaXJlY3Rpb25zOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVzdWx0O1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zUmVuZGVyZXJPcHRpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXJPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9ucztcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyLmRpcmVjdGlvbnNfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IGRpcmVjdGlvbnNDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RpcmVjdGlvbnNfY2hhbmdlZCcpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRpcmVjdGlvbnMgcmVuZGVyZXIgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkaXJlY3Rpb25zUmVuZGVyZXJJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcj4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyPigpO1xuXG4gIC8qKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIgb2JqZWN0LiAqL1xuICBkaXJlY3Rpb25zUmVuZGVyZXI/OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGlmIChnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIgJiYgdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIFByb21pc2UuYWxsKFt0aGlzLl9nb29nbGVNYXAuX3Jlc29sdmVNYXAoKSwgZ29vZ2xlLm1hcHMuaW1wb3J0TGlicmFyeSgncm91dGVzJyldKS50aGVuKFxuICAgICAgICAgICAgKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuUm91dGVzTGlicmFyeSkuRGlyZWN0aW9uc1JlbmRlcmVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShcbiAgICBtYXA6IGdvb2dsZS5tYXBzLk1hcCxcbiAgICByZW5kZXJlckNvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyLFxuICApIHtcbiAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIgPSBuZXcgcmVuZGVyZXJDb25zdHJ1Y3Rvcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5zZXRNYXAobWFwKTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIpO1xuICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXJJbml0aWFsaXplZC5lbWl0KHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAodGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIpIHtcbiAgICAgIGlmIChjaGFuZ2VzWydvcHRpb25zJ10pIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2RpcmVjdGlvbnMnXSAmJiB0aGlzLl9kaXJlY3Rpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuc2V0RGlyZWN0aW9ucyh0aGlzLl9kaXJlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyPy5zZXRNYXAobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyLmdldERpcmVjdGlvbnNcbiAgICovXG4gIGdldERpcmVjdGlvbnMoKTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1Jlc3VsdCB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyLmdldERpcmVjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zUmVuZGVyZXIuZ2V0UGFuZWxcbiAgICovXG4gIGdldFBhbmVsKCk6IE5vZGUgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5nZXRQYW5lbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlci5nZXRSb3V0ZUluZGV4XG4gICAqL1xuICBnZXRSb3V0ZUluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuZ2V0Um91dGVJbmRleCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBkaXJlY3Rpb25zOiB0aGlzLl9kaXJlY3Rpb25zIHx8IG9wdGlvbnMuZGlyZWN0aW9ucyxcbiAgICAgIG1hcDogdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtcbiAgICBkaXJlY3Rpb25zUmVuZGVyZXI6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcjtcbiAgfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmRpcmVjdGlvbnNSZW5kZXJlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIERpcmVjdGlvbnMgUmVuZGVyZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIERpcmVjdGlvbnMgUmVuZGVyZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nICcgK1xuICAgICAgICAgICAgJ3RvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==