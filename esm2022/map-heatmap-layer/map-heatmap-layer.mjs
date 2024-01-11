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
import { importLibrary } from '../import-library';
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
                        importLibrary('visualization', 'HeatmapLayer'),
                    ]).then(([map, heatmapConstructor]) => {
                        this._initialize(map, heatmapConstructor);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapHeatmapLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MapHeatmapLayer, isStandalone: true, selector: "map-heatmap-layer", inputs: { data: "data", options: "options" }, outputs: { heatmapInitialized: "heatmapInitialized" }, exportAs: ["mapHeatmapLayer"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapHeatmapLayer, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWhlYXRtYXAtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWhlYXRtYXAtbGF5ZXIvbWFwLWhlYXRtYXAtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxFQUdULE1BQU0sRUFDTixZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7O0FBU2hEOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8sZUFBZTtJQUMxQjs7O09BR0c7SUFDSCxJQUNJLElBQUksQ0FBQyxJQUFpQjtRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsSUFDSSxPQUFPLENBQUMsT0FBK0Q7UUFDekUsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDMUIsQ0FBQztJQWNELFlBQ21CLFVBQXFCLEVBQzlCLE9BQWU7UUFETixlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQzlCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFOekIscURBQXFEO1FBQ2xDLHVCQUFrQixHQUNuQyxJQUFJLFlBQVksRUFBMEMsQ0FBQztJQUsxRCxDQUFDO0lBRUosUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMvQixJQUNFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYTtnQkFDbkMsQ0FBRSxNQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO2dCQUMzQyxD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QUM7QUFDakYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBOZ1pvbmUsXG4gIERpcmVjdGl2ZSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtpbXBvcnRMaWJyYXJ5fSBmcm9tICcuLi9pbXBvcnQtbGlicmFyeSc7XG5cbi8qKiBQb3NzaWJsZSBkYXRhIHRoYXQgY2FuIGJlIHNob3duIG9uIGEgaGVhdG1hcCBsYXllci4gKi9cbmV4cG9ydCB0eXBlIEhlYXRtYXBEYXRhID1cbiAgfCBnb29nbGUubWFwcy5NVkNBcnJheTxcbiAgICAgIGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxcbiAgICA+XG4gIHwgKGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpW107XG5cbi8qKlxuICogQW5ndWxhciBkaXJlY3RpdmUgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgaGVhdG1hcCB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWhlYXRtYXAtbGF5ZXInLFxuICBleHBvcnRBczogJ21hcEhlYXRtYXBMYXllcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEhlYXRtYXBMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogRGF0YSBzaG93biBvbiB0aGUgaGVhdG1hcC5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvblxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGRhdGEoZGF0YTogSGVhdG1hcERhdGEpIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuICBwcml2YXRlIF9kYXRhOiBIZWF0bWFwRGF0YTtcblxuICAvKipcbiAgICogT3B0aW9ucyB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgaGVhdG1hcC4gU2VlOlxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb24jSGVhdG1hcExheWVyT3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogUGFydGlhbDxnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnM+KSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogUGFydGlhbDxnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnM+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAgICovXG4gIGhlYXRtYXA/OiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBoZWF0bWFwIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaGVhdG1hcEluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXI+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF3aW5kb3cuZ29vZ2xlPy5tYXBzPy52aXN1YWxpemF0aW9uICYmXG4gICAgICAgICEod2luZG93IGFzIGFueSkuZ29vZ2xlPy5tYXBzLmltcG9ydExpYnJhcnkgJiZcbiAgICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSlcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnTmFtZXNwYWNlIGBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uYCBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgaGVhdG1hcC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIGluc3RhbGwgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJIHdpdGggdGhlIFwidmlzdWFsaXphdGlvblwiIGxpYnJhcnk6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3Zpc3VhbGl6YXRpb24nLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbj8uSGVhdG1hcExheWVyICYmIHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuX2dvb2dsZU1hcC5fcmVzb2x2ZU1hcCgpLFxuICAgICAgICAgICAgaW1wb3J0TGlicmFyeTx0eXBlb2YgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXI+KFxuICAgICAgICAgICAgICAndmlzdWFsaXphdGlvbicsXG4gICAgICAgICAgICAgICdIZWF0bWFwTGF5ZXInLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdKS50aGVuKChbbWFwLCBoZWF0bWFwQ29uc3RydWN0b3JdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKG1hcCwgaGVhdG1hcENvbnN0cnVjdG9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShcbiAgICBtYXA6IGdvb2dsZS5tYXBzLk1hcCxcbiAgICBoZWF0bWFwQ29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcixcbiAgKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuaGVhdG1hcCA9IG5ldyBoZWF0bWFwQ29uc3RydWN0b3IodGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5oZWF0bWFwLnNldE1hcChtYXApO1xuICAgICAgdGhpcy5oZWF0bWFwSW5pdGlhbGl6ZWQuZW1pdCh0aGlzLmhlYXRtYXApO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHtfZGF0YSwgaGVhdG1hcH0gPSB0aGlzO1xuXG4gICAgaWYgKGhlYXRtYXApIHtcbiAgICAgIGlmIChjaGFuZ2VzWydvcHRpb25zJ10pIHtcbiAgICAgICAgaGVhdG1hcC5zZXRPcHRpb25zKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snZGF0YSddICYmIF9kYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaGVhdG1hcC5zZXREYXRhKHRoaXMuX25vcm1hbGl6ZURhdGEoX2RhdGEpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmhlYXRtYXA/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRhIHRoYXQgaXMgY3VycmVudGx5IHNob3duIG9uIHRoZSBoZWF0bWFwLlxuICAgKiBTZWU6IGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvbiNIZWF0bWFwTGF5ZXJcbiAgICovXG4gIGdldERhdGEoKTogSGVhdG1hcERhdGEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuaGVhdG1hcC5nZXREYXRhKCk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGNvbWJpbmVkIG9wdGlvbnMgb2JqZWN0IHVzaW5nIHRoZSBwYXNzZWQtaW4gb3B0aW9ucyBhbmQgdGhlIGluZGl2aWR1YWwgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZGF0YTogdGhpcy5fbm9ybWFsaXplRGF0YSh0aGlzLl9kYXRhIHx8IG9wdGlvbnMuZGF0YSB8fCBbXSksXG4gICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3N0IEdvb2dsZSBNYXBzIEFQSXMgc3VwcG9ydCBib3RoIGBMYXRMbmdgIG9iamVjdHMgYW5kIGBMYXRMbmdMaXRlcmFsYC4gVGhlIGxhdHRlciBpcyBtb3JlXG4gICAqIGNvbnZlbmllbnQgdG8gd3JpdGUgb3V0LCBiZWNhdXNlIHRoZSBHb29nbGUgTWFwcyBBUEkgZG9lc24ndCBoYXZlIHRvIGhhdmUgYmVlbiBsb2FkZWQgaW4gb3JkZXJcbiAgICogdG8gY29uc3RydWN0IHRoZW0uIFRoZSBgSGVhdG1hcExheWVyYCBhcHBlYXJzIHRvIGJlIGFuIGV4Y2VwdGlvbiB0aGF0IG9ubHkgYWxsb3dzIGEgYExhdExuZ2BcbiAgICogb2JqZWN0LCBvciBpdCB0aHJvd3MgYSBydW50aW1lIGVycm9yLiBTaW5jZSBpdCdzIG1vcmUgY29udmVuaWVudCBhbmQgd2UgZXhwZWN0IHRoYXQgQW5ndWxhclxuICAgKiB1c2VycyB3aWxsIGxvYWQgdGhlIEFQSSBhc3luY2hyb25vdXNseSwgd2UgYWxsb3cgdGhlbSB0byBwYXNzIGluIGEgYExhdExuZ0xpdGVyYWxgIGFuZCB3ZVxuICAgKiBjb252ZXJ0IGl0IHRvIGEgYExhdExuZ2Agb2JqZWN0IGJlZm9yZSBwYXNzaW5nIGl0IG9mZiB0byBHb29nbGUgTWFwcy5cbiAgICovXG4gIHByaXZhdGUgX25vcm1hbGl6ZURhdGEoZGF0YTogSGVhdG1hcERhdGEpIHtcbiAgICBjb25zdCByZXN1bHQ6IChnb29nbGUubWFwcy5MYXRMbmcgfCBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLldlaWdodGVkTG9jYXRpb24pW10gPSBbXTtcblxuICAgIGRhdGEuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIHJlc3VsdC5wdXNoKGlzTGF0TG5nTGl0ZXJhbChpdGVtKSA/IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoaXRlbS5sYXQsIGl0ZW0ubG5nKSA6IGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBBc3NlcnRzIHRoYXQgdGhlIGhlYXRtYXAgb2JqZWN0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2hlYXRtYXA6IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmhlYXRtYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBIZWF0bWFwTGF5ZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIGhlYXRtYXAgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEFzc2VydHMgdGhhdCBhbiBvYmplY3QgaXMgYSBgTGF0TG5nTGl0ZXJhbGAuICovXG5mdW5jdGlvbiBpc0xhdExuZ0xpdGVyYWwodmFsdWU6IGFueSk6IHZhbHVlIGlzIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxhdCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbHVlLmxuZyA9PT0gJ251bWJlcic7XG59XG4iXX0=