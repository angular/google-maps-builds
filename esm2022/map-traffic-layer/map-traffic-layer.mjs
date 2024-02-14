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
import { Directive, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Traffic Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
 */
export class MapTrafficLayer {
    /**
     * Whether the traffic layer refreshes with updated information automatically.
     */
    set autoRefresh(autoRefresh) {
        this._autoRefresh.next(autoRefresh);
    }
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._autoRefresh = new BehaviorSubject(true);
        this._destroyed = new Subject();
        /** Event emitted when the traffic layer is initialized. */
        this.trafficLayerInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            this._combineOptions()
                .pipe(take(1))
                .subscribe(options => {
                if (google.maps.TrafficLayer && this._map.googleMap) {
                    this._initialize(this._map.googleMap, google.maps.TrafficLayer, options);
                }
                else {
                    this._ngZone.runOutsideAngular(() => {
                        Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
                            this._initialize(map, lib.TrafficLayer, options);
                        });
                    });
                }
            });
        }
    }
    _initialize(map, layerConstructor, options) {
        this._ngZone.runOutsideAngular(() => {
            this.trafficLayer = new layerConstructor(options);
            this._assertInitialized();
            this.trafficLayer.setMap(map);
            this.trafficLayerInitialized.emit(this.trafficLayer);
            this._watchForAutoRefreshChanges();
        });
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this.trafficLayer?.setMap(null);
    }
    _combineOptions() {
        return this._autoRefresh.pipe(map(autoRefresh => {
            const combinedOptions = { autoRefresh };
            return combinedOptions;
        }));
    }
    _watchForAutoRefreshChanges() {
        this._combineOptions()
            .pipe(takeUntil(this._destroyed))
            .subscribe(options => {
            this._assertInitialized();
            this.trafficLayer.setOptions(options);
        });
    }
    _assertInitialized() {
        if (!this.trafficLayer) {
            throw Error('Cannot interact with a Google Map Traffic Layer before it has been initialized. ' +
                'Please wait for the Traffic Layer to load before trying to interact with it.');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapTrafficLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapTrafficLayer, isStandalone: true, selector: "map-traffic-layer", inputs: { autoRefresh: "autoRefresh" }, outputs: { trafficLayerInitialized: "trafficLayerInitialized" }, exportAs: ["mapTrafficLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapTrafficLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-traffic-layer',
                    exportAs: 'mapTrafficLayer',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { autoRefresh: [{
                type: Input
            }], trafficLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYWZmaWMtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYWZmaWMtbGF5ZXIvbWFwLXRyYWZmaWMtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBcUIsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hHLE9BQU8sRUFBQyxlQUFlLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7O0FBRW5EOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8sZUFBZTtJQVcxQjs7T0FFRztJQUNILElBQ0ksV0FBVyxDQUFDLFdBQW9CO1FBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFNRCxZQUNtQixJQUFlLEVBQ2YsT0FBZTtRQURmLFNBQUksR0FBSixJQUFJLENBQVc7UUFDZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBeEJqQixpQkFBWSxHQUFHLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ2xELGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBaUJsRCwyREFBMkQ7UUFDeEMsNEJBQXVCLEdBQ3hDLElBQUksWUFBWSxFQUE0QixDQUFDO0lBSzVDLENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxlQUFlLEVB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QixRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixVQUFVLEVBQUUsSUFBSTtpQkFDakI7bUdBZ0JLLFdBQVc7c0JBRGQsS0FBSztnQkFNYSx1QkFBdUI7c0JBQXpDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBUcmFmZmljIExheWVyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI1RyYWZmaWNMYXllclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtdHJhZmZpYy1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwVHJhZmZpY0xheWVyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwVHJhZmZpY0xheWVyIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9hdXRvUmVmcmVzaCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4odHJ1ZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNUcmFmZmljTGF5ZXJcbiAgICovXG4gIHRyYWZmaWNMYXllcj86IGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllcjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdHJhZmZpYyBsYXllciByZWZyZXNoZXMgd2l0aCB1cGRhdGVkIGluZm9ybWF0aW9uIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgYXV0b1JlZnJlc2goYXV0b1JlZnJlc2g6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9hdXRvUmVmcmVzaC5uZXh0KGF1dG9SZWZyZXNoKTtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHRyYWZmaWMgbGF5ZXIgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0cmFmZmljTGF5ZXJJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllcj4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpXG4gICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgICAgaWYgKGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllciAmJiB0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX21hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllciwgb3B0aW9ucyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgIFByb21pc2UuYWxsKFt0aGlzLl9tYXAuX3Jlc29sdmVNYXAoKSwgZ29vZ2xlLm1hcHMuaW1wb3J0TGlicmFyeSgnbWFwcycpXSkudGhlbihcbiAgICAgICAgICAgICAgICAoW21hcCwgbGliXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuTWFwc0xpYnJhcnkpLlRyYWZmaWNMYXllciwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShcbiAgICBtYXA6IGdvb2dsZS5tYXBzLk1hcCxcbiAgICBsYXllckNvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyLFxuICAgIG9wdGlvbnM6IGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllck9wdGlvbnMsXG4gICkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLnRyYWZmaWNMYXllciA9IG5ldyBsYXllckNvbnN0cnVjdG9yKG9wdGlvbnMpO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMudHJhZmZpY0xheWVyLnNldE1hcChtYXApO1xuICAgICAgdGhpcy50cmFmZmljTGF5ZXJJbml0aWFsaXplZC5lbWl0KHRoaXMudHJhZmZpY0xheWVyKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQXV0b1JlZnJlc2hDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMudHJhZmZpY0xheWVyPy5zZXRNYXAobnVsbCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllck9wdGlvbnM+IHtcbiAgICByZXR1cm4gdGhpcy5fYXV0b1JlZnJlc2gucGlwZShcbiAgICAgIG1hcChhdXRvUmVmcmVzaCA9PiB7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyT3B0aW9ucyA9IHthdXRvUmVmcmVzaH07XG4gICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JBdXRvUmVmcmVzaENoYW5nZXMoKSB7XG4gICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLnRyYWZmaWNMYXllci5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge3RyYWZmaWNMYXllcjogZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyfSB7XG4gICAgaWYgKCF0aGlzLnRyYWZmaWNMYXllcikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgVHJhZmZpYyBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIFRyYWZmaWMgTGF5ZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=