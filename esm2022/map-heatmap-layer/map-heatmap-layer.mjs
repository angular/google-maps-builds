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
import { Input, NgZone, Directive, Output, EventEmitter, } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular directive that renders a Google Maps heatmap via the Google Maps JavaScript API.
 *
 * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
 */
export class MapHeatmapLayer {
    /**
     * Data shown on the heatmap.
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    set data(data) {
        this._data = data;
    }
    /**
     * Options used to configure the heatmap. See:
     * developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions
     */
    set options(options) {
        this._options = options;
    }
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        /** Event emitted when the heatmap is initialized. */
        this.heatmapInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            if (!window.google?.maps?.visualization &&
                !window.google?.maps.importLibrary &&
                (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Namespace `google.maps.visualization` not found, cannot construct heatmap. ' +
                    'Please install the Google Maps JavaScript API with the "visualization" library: ' +
                    'https://developers.google.com/maps/documentation/javascript/visualization');
            }
            if (google.maps.visualization?.HeatmapLayer && this._googleMap.googleMap) {
                this._initialize(this._googleMap.googleMap, google.maps.visualization.HeatmapLayer);
            }
            else {
                this._ngZone.runOutsideAngular(() => {
                    Promise.all([
                        this._googleMap._resolveMap(),
                        google.maps.importLibrary('visualization'),
                    ]).then(([map, lib]) => {
                        this._initialize(map, lib.HeatmapLayer);
                    });
                });
            }
        }
    }
    _initialize(map, heatmapConstructor) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.heatmap = new heatmapConstructor(this._combineOptions());
            this._assertInitialized();
            this.heatmap.setMap(map);
            this.heatmapInitialized.emit(this.heatmap);
        });
    }
    ngOnChanges(changes) {
        const { _data, heatmap } = this;
        if (heatmap) {
            if (changes['options']) {
                heatmap.setOptions(this._combineOptions());
            }
            if (changes['data'] && _data !== undefined) {
                heatmap.setData(this._normalizeData(_data));
            }
        }
    }
    ngOnDestroy() {
        this.heatmap?.setMap(null);
    }
    /**
     * Gets the data that is currently shown on the heatmap.
     * See: developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayer
     */
    getData() {
        this._assertInitialized();
        return this.heatmap.getData();
    }
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    _combineOptions() {
        const options = this._options || {};
        return {
            ...options,
            data: this._normalizeData(this._data || options.data || []),
            map: this._googleMap.googleMap,
        };
    }
    /**
     * Most Google Maps APIs support both `LatLng` objects and `LatLngLiteral`. The latter is more
     * convenient to write out, because the Google Maps API doesn't have to have been loaded in order
     * to construct them. The `HeatmapLayer` appears to be an exception that only allows a `LatLng`
     * object, or it throws a runtime error. Since it's more convenient and we expect that Angular
     * users will load the API asynchronously, we allow them to pass in a `LatLngLiteral` and we
     * convert it to a `LatLng` object before passing it off to Google Maps.
     */
    _normalizeData(data) {
        const result = [];
        data.forEach(item => {
            result.push(isLatLngLiteral(item) ? new google.maps.LatLng(item.lat, item.lng) : item);
        });
        return result;
    }
    /** Asserts that the heatmap object has been initialized. */
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.heatmap) {
                throw Error('Cannot interact with a Google Map HeatmapLayer before it has been ' +
                    'initialized. Please wait for the heatmap to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapHeatmapLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapHeatmapLayer, isStandalone: true, selector: "map-heatmap-layer", inputs: { data: "data", options: "options" }, outputs: { heatmapInitialized: "heatmapInitialized" }, exportAs: ["mapHeatmapLayer"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapHeatmapLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-heatmap-layer',
                    exportAs: 'mapHeatmapLayer',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { data: [{
                type: Input
            }], options: [{
                type: Input
            }], heatmapInitialized: [{
                type: Output
            }] } });
/** Asserts that an object is a `LatLngLiteral`. */
function isLatLngLiteral(value) {
    return value && typeof value.lat === 'number' && typeof value.lng === 'number';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWhlYXRtYXAtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWhlYXRtYXAtbGF5ZXIvbWFwLWhlYXRtYXAtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxFQUdULE1BQU0sRUFDTixZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7QUFTbkQ7Ozs7R0FJRztBQU1ILE1BQU0sT0FBTyxlQUFlO0lBQzFCOzs7T0FHRztJQUNILElBQ0ksSUFBSSxDQUFDLElBQWlCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUErRDtRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBY0QsWUFDbUIsVUFBcUIsRUFDOUIsT0FBZTtRQUROLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQU56QixxREFBcUQ7UUFDbEMsdUJBQWtCLEdBQ25DLElBQUksWUFBWSxFQUEwQyxDQUFDO0lBSzFELENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQy9CLElBQ0UsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhO2dCQUNuQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWE7Z0JBQ2xDLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUMv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bnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE5nWm9uZSxcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5cbi8qKiBQb3NzaWJsZSBkYXRhIHRoYXQgY2FuIGJlIHNob3duIG9uIGEgaGVhdG1hcCBsYXllci4gKi9cbmV4cG9ydCB0eXBlIEhlYXRtYXBEYXRhID1cbiAgfCBnb29nbGUubWFwcy5NVkNBcnJheTxcbiAgICAgIGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxcbiAgICA+XG4gIHwgKGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpW107XG5cbi8qKlxuICogQW5ndWxhciBkaXJlY3RpdmUgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgaGVhdG1hcCB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWhlYXRtYXAtbGF5ZXInLFxuICBleHBvcnRBczogJ21hcEhlYXRtYXBMYXllcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEhlYXRtYXBMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogRGF0YSBzaG93biBvbiB0aGUgaGVhdG1hcC5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvblxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGRhdGEoZGF0YTogSGVhdG1hcERhdGEpIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuICBwcml2YXRlIF9kYXRhOiBIZWF0bWFwRGF0YTtcblxuICAvKipcbiAgICogT3B0aW9ucyB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgaGVhdG1hcC4gU2VlOlxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb24jSGVhdG1hcExheWVyT3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogUGFydGlhbDxnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnM+KSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogUGFydGlhbDxnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnM+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAgICovXG4gIGhlYXRtYXA/OiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBoZWF0bWFwIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaGVhdG1hcEluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXI+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF3aW5kb3cuZ29vZ2xlPy5tYXBzPy52aXN1YWxpemF0aW9uICYmXG4gICAgICAgICF3aW5kb3cuZ29vZ2xlPy5tYXBzLmltcG9ydExpYnJhcnkgJiZcbiAgICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSlcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnTmFtZXNwYWNlIGBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uYCBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgaGVhdG1hcC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIGluc3RhbGwgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJIHdpdGggdGhlIFwidmlzdWFsaXphdGlvblwiIGxpYnJhcnk6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3Zpc3VhbGl6YXRpb24nLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbj8uSGVhdG1hcExheWVyICYmIHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuX2dvb2dsZU1hcC5fcmVzb2x2ZU1hcCgpLFxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuaW1wb3J0TGlicmFyeSgndmlzdWFsaXphdGlvbicpLFxuICAgICAgICAgIF0pLnRoZW4oKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLlZpc3VhbGl6YXRpb25MaWJyYXJ5KS5IZWF0bWFwTGF5ZXIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIG1hcDogZ29vZ2xlLm1hcHMuTWFwLFxuICAgIGhlYXRtYXBDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyLFxuICApIHtcbiAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5oZWF0bWFwID0gbmV3IGhlYXRtYXBDb25zdHJ1Y3Rvcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLmhlYXRtYXAuc2V0TWFwKG1hcCk7XG4gICAgICB0aGlzLmhlYXRtYXBJbml0aWFsaXplZC5lbWl0KHRoaXMuaGVhdG1hcCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qge19kYXRhLCBoZWF0bWFwfSA9IHRoaXM7XG5cbiAgICBpZiAoaGVhdG1hcCkge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICBoZWF0bWFwLnNldE9wdGlvbnModGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydkYXRhJ10gJiYgX2RhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBoZWF0bWFwLnNldERhdGEodGhpcy5fbm9ybWFsaXplRGF0YShfZGF0YSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuaGVhdG1hcD8uc2V0TWFwKG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRhdGEgdGhhdCBpcyBjdXJyZW50bHkgc2hvd24gb24gdGhlIGhlYXRtYXAuXG4gICAqIFNlZTogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uI0hlYXRtYXBMYXllclxuICAgKi9cbiAgZ2V0RGF0YSgpOiBIZWF0bWFwRGF0YSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5oZWF0bWFwLmdldERhdGEoKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgY29tYmluZWQgb3B0aW9ucyBvYmplY3QgdXNpbmcgdGhlIHBhc3NlZC1pbiBvcHRpb25zIGFuZCB0aGUgaW5kaXZpZHVhbCBpbnB1dHMuICovXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBkYXRhOiB0aGlzLl9ub3JtYWxpemVEYXRhKHRoaXMuX2RhdGEgfHwgb3B0aW9ucy5kYXRhIHx8IFtdKSxcbiAgICAgIG1hcDogdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1vc3QgR29vZ2xlIE1hcHMgQVBJcyBzdXBwb3J0IGJvdGggYExhdExuZ2Agb2JqZWN0cyBhbmQgYExhdExuZ0xpdGVyYWxgLiBUaGUgbGF0dGVyIGlzIG1vcmVcbiAgICogY29udmVuaWVudCB0byB3cml0ZSBvdXQsIGJlY2F1c2UgdGhlIEdvb2dsZSBNYXBzIEFQSSBkb2Vzbid0IGhhdmUgdG8gaGF2ZSBiZWVuIGxvYWRlZCBpbiBvcmRlclxuICAgKiB0byBjb25zdHJ1Y3QgdGhlbS4gVGhlIGBIZWF0bWFwTGF5ZXJgIGFwcGVhcnMgdG8gYmUgYW4gZXhjZXB0aW9uIHRoYXQgb25seSBhbGxvd3MgYSBgTGF0TG5nYFxuICAgKiBvYmplY3QsIG9yIGl0IHRocm93cyBhIHJ1bnRpbWUgZXJyb3IuIFNpbmNlIGl0J3MgbW9yZSBjb252ZW5pZW50IGFuZCB3ZSBleHBlY3QgdGhhdCBBbmd1bGFyXG4gICAqIHVzZXJzIHdpbGwgbG9hZCB0aGUgQVBJIGFzeW5jaHJvbm91c2x5LCB3ZSBhbGxvdyB0aGVtIHRvIHBhc3MgaW4gYSBgTGF0TG5nTGl0ZXJhbGAgYW5kIHdlXG4gICAqIGNvbnZlcnQgaXQgdG8gYSBgTGF0TG5nYCBvYmplY3QgYmVmb3JlIHBhc3NpbmcgaXQgb2ZmIHRvIEdvb2dsZSBNYXBzLlxuICAgKi9cbiAgcHJpdmF0ZSBfbm9ybWFsaXplRGF0YShkYXRhOiBIZWF0bWFwRGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdDogKGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbilbXSA9IFtdO1xuXG4gICAgZGF0YS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgcmVzdWx0LnB1c2goaXNMYXRMbmdMaXRlcmFsKGl0ZW0pID8gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhpdGVtLmxhdCwgaXRlbS5sbmcpIDogaXRlbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgaGVhdG1hcCBvYmplY3QgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7aGVhdG1hcDogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJ9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuaGVhdG1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEhlYXRtYXBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgaGVhdG1hcCB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiogQXNzZXJ0cyB0aGF0IGFuIG9iamVjdCBpcyBhIGBMYXRMbmdMaXRlcmFsYC4gKi9cbmZ1bmN0aW9uIGlzTGF0TG5nTGl0ZXJhbCh2YWx1ZTogYW55KTogdmFsdWUgaXMgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGF0ID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgdmFsdWUubG5nID09PSAnbnVtYmVyJztcbn1cbiJdfQ==