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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapDirectionsRenderer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapDirectionsRenderer, isStandalone: true, selector: "map-directions-renderer", inputs: { directions: "directions", options: "options" }, outputs: { directionsChanged: "directionsChanged", directionsRendererInitialized: "directionsRendererInitialized" }, exportAs: ["mapDirectionsRenderer"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapDirectionsRenderer, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFJTixNQUFNLEVBRU4sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBRXJEOzs7OztHQUtHO0FBTUgsTUFBTSxPQUFPLHFCQUFxQjtJQUdoQzs7O09BR0c7SUFDSCxJQUNJLFVBQVUsQ0FBQyxVQUF3QztRQUNyRCxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsSUFDSSxPQUFPLENBQUMsT0FBOEM7UUFDeEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDMUIsQ0FBQztJQWtCRCxZQUNtQixVQUFxQixFQUM5QixPQUFlO1FBRE4sZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUM5QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBdkNqQixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBc0I1RDs7O1dBR0c7UUFFTSxzQkFBaUIsR0FDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQU8sb0JBQW9CLENBQUMsQ0FBQztRQUVoRSxpRUFB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SUFDSCxhQUFhO1FBQ1gsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVPLGVBQWU7UUFDckIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDcEMsT0FBTztZQUNMLEdBQUcsT0FBTztZQUNWLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxVQUFVO1lBQ2xELEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7U0FDL0IsQ0FBQztJQUNKLENBQUM7SUFFTyxrQkFBa0I7UUFHeEIsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxFQUFFLENBQUM7WUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUM3QixNQUFNLEtBQUssQ0FDVCwyRUFBMkU7b0JBQ3pFLDZFQUE2RTtvQkFDN0Usc0JBQXNCLENBQ3pCLENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7OEdBNUlVLHFCQUFxQjtrR0FBckIscUJBQXFCOzsyRkFBckIscUJBQXFCO2tCQUxqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjttR0FTSyxVQUFVO3NCQURiLEtBQUs7Z0JBV0YsT0FBTztzQkFEVixLQUFLO2dCQVdHLGlCQUFpQjtzQkFEekIsTUFBTTtnQkFLWSw2QkFBNkI7c0JBQS9DLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIERpcmVjdGlvbnMgUmVuZGVyZXIgdmlhIHRoZSBHb29nbGUgTWFwc1xuICogSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9ucyNEaXJlY3Rpb25zUmVuZGVyZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXInLFxuICBleHBvcnRBczogJ21hcERpcmVjdGlvbnNSZW5kZXJlcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcERpcmVjdGlvbnNSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKGluamVjdChOZ1pvbmUpKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9ucy5kaXJlY3Rpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgZGlyZWN0aW9ucyhkaXJlY3Rpb25zOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVzdWx0KSB7XG4gICAgdGhpcy5fZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfZGlyZWN0aW9uczogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1Jlc3VsdDtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlck9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlci5kaXJlY3Rpb25zX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBkaXJlY3Rpb25zQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkaXJlY3Rpb25zX2NoYW5nZWQnKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkaXJlY3Rpb25zIHJlbmRlcmVyIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGlyZWN0aW9uc1JlbmRlcmVySW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXI+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcj4oKTtcblxuICAvKiogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyIG9iamVjdC4gKi9cbiAgZGlyZWN0aW9uc1JlbmRlcmVyPzogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyICYmIHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5fZ29vZ2xlTWFwLl9yZXNvbHZlTWFwKCksIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ3JvdXRlcycpXSkudGhlbihcbiAgICAgICAgICAgIChbbWFwLCBsaWJdKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLlJvdXRlc0xpYnJhcnkpLkRpcmVjdGlvbnNSZW5kZXJlcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUoXG4gICAgbWFwOiBnb29nbGUubWFwcy5NYXAsXG4gICAgcmVuZGVyZXJDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcixcbiAgKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyID0gbmV3IHJlbmRlcmVyQ29uc3RydWN0b3IodGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuc2V0TWFwKG1hcCk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyKTtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVySW5pdGlhbGl6ZWQuZW1pdCh0aGlzLmRpcmVjdGlvbnNSZW5kZXJlcik7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyLnNldE9wdGlvbnModGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydkaXJlY3Rpb25zJ10gJiYgdGhpcy5fZGlyZWN0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyLnNldERpcmVjdGlvbnModGhpcy5fZGlyZWN0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlcj8uc2V0TWFwKG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlci5nZXREaXJlY3Rpb25zXG4gICAqL1xuICBnZXREaXJlY3Rpb25zKCk6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZXN1bHQgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5nZXREaXJlY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyLmdldFBhbmVsXG4gICAqL1xuICBnZXRQYW5lbCgpOiBOb2RlIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuZ2V0UGFuZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zUmVuZGVyZXIuZ2V0Um91dGVJbmRleFxuICAgKi9cbiAgZ2V0Um91dGVJbmRleCgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyLmdldFJvdXRlSW5kZXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZGlyZWN0aW9uczogdGhpcy5fZGlyZWN0aW9ucyB8fCBvcHRpb25zLmRpcmVjdGlvbnMsXG4gICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7XG4gICAgZGlyZWN0aW9uc1JlbmRlcmVyOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXI7XG4gIH0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBEaXJlY3Rpb25zIFJlbmRlcmVyIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBEaXJlY3Rpb25zIFJlbmRlcmVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyAnICtcbiAgICAgICAgICAgICd0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=