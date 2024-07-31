/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" preserve="true" />
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapHeatmapLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapHeatmapLayer, isStandalone: true, selector: "map-heatmap-layer", inputs: { data: "data", options: "options" }, outputs: { heatmapInitialized: "heatmapInitialized" }, exportAs: ["mapHeatmapLayer"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapHeatmapLayer, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWhlYXRtYXAtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWhlYXRtYXAtbGF5ZXIvbWFwLWhlYXRtYXAtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQ0wsS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEVBR1QsTUFBTSxFQUNOLFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7OztBQVNuRDs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGVBQWU7SUFDMUI7OztPQUdHO0lBQ0gsSUFDSSxJQUFJLENBQUMsSUFBaUI7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUdEOzs7T0FHRztJQUNILElBQ0ksT0FBTyxDQUFDLE9BQStEO1FBQ3pFLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFjRCxZQUNtQixVQUFxQixFQUM5QixPQUFlO1FBRE4sZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUM5QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBTnpCLHFEQUFxRDtRQUNsQyx1QkFBa0IsR0FDbkMsSUFBSSxZQUFZLEVBQTBDLENBQUM7SUFLMUQsQ0FBQztJQUVKLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0IsSUFDRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWE7Z0JBQ25DLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDbEMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQy9DLENBQUM7Z0JBQ0Qs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biAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIHByZXNlcnZlPVwidHJ1ZVwiIC8+XG5cbmltcG9ydCB7XG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgTmdab25lLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcblxuLyoqIFBvc3NpYmxlIGRhdGEgdGhhdCBjYW4gYmUgc2hvd24gb24gYSBoZWF0bWFwIGxheWVyLiAqL1xuZXhwb3J0IHR5cGUgSGVhdG1hcERhdGEgPVxuICB8IGdvb2dsZS5tYXBzLk1WQ0FycmF5PFxuICAgICAgZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uIHwgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbFxuICAgID5cbiAgfCAoZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uIHwgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbClbXTtcblxuLyoqXG4gKiBBbmd1bGFyIGRpcmVjdGl2ZSB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBoZWF0bWFwIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvblxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtaGVhdG1hcC1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwSGVhdG1hcExheWVyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwSGVhdG1hcExheWVyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBEYXRhIHNob3duIG9uIHRoZSBoZWF0bWFwLlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgZGF0YShkYXRhOiBIZWF0bWFwRGF0YSkge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG4gIHByaXZhdGUgX2RhdGE6IEhlYXRtYXBEYXRhO1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIHVzZWQgdG8gY29uZmlndXJlIHRoZSBoZWF0bWFwLiBTZWU6XG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvbiNIZWF0bWFwTGF5ZXJPcHRpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyT3B0aW9ucz4pIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICBwcml2YXRlIF9vcHRpb25zOiBQYXJ0aWFsPGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyT3B0aW9ucz47XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvblxuICAgKi9cbiAgaGVhdG1hcD86IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGhlYXRtYXAgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBoZWF0bWFwSW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcj4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXI+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXdpbmRvdy5nb29nbGU/Lm1hcHM/LnZpc3VhbGl6YXRpb24gJiZcbiAgICAgICAgIXdpbmRvdy5nb29nbGU/Lm1hcHMuaW1wb3J0TGlicmFyeSAmJlxuICAgICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdOYW1lc3BhY2UgYGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb25gIG5vdCBmb3VuZCwgY2Fubm90IGNvbnN0cnVjdCBoZWF0bWFwLiAnICtcbiAgICAgICAgICAgICdQbGVhc2UgaW5zdGFsbCB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkgd2l0aCB0aGUgXCJ2aXN1YWxpemF0aW9uXCIgbGlicmFyeTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvdmlzdWFsaXphdGlvbicsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChnb29nbGUubWFwcy52aXN1YWxpemF0aW9uPy5IZWF0bWFwTGF5ZXIgJiYgdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5fZ29vZ2xlTWFwLl9yZXNvbHZlTWFwKCksXG4gICAgICAgICAgICBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCd2aXN1YWxpemF0aW9uJyksXG4gICAgICAgICAgXSkudGhlbigoW21hcCwgbGliXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuVmlzdWFsaXphdGlvbkxpYnJhcnkpLkhlYXRtYXBMYXllcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUoXG4gICAgbWFwOiBnb29nbGUubWFwcy5NYXAsXG4gICAgaGVhdG1hcENvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXIsXG4gICkge1xuICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmhlYXRtYXAgPSBuZXcgaGVhdG1hcENvbnN0cnVjdG9yKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuaGVhdG1hcC5zZXRNYXAobWFwKTtcbiAgICAgIHRoaXMuaGVhdG1hcEluaXRpYWxpemVkLmVtaXQodGhpcy5oZWF0bWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7X2RhdGEsIGhlYXRtYXB9ID0gdGhpcztcblxuICAgIGlmIChoZWF0bWFwKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2RhdGEnXSAmJiBfZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0RGF0YSh0aGlzLl9ub3JtYWxpemVEYXRhKF9kYXRhKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5oZWF0bWFwPy5zZXRNYXAobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YSB0aGF0IGlzIGN1cnJlbnRseSBzaG93biBvbiB0aGUgaGVhdG1hcC5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb24jSGVhdG1hcExheWVyXG4gICAqL1xuICBnZXREYXRhKCk6IEhlYXRtYXBEYXRhIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmhlYXRtYXAuZ2V0RGF0YSgpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBjb21iaW5lZCBvcHRpb25zIG9iamVjdCB1c2luZyB0aGUgcGFzc2VkLWluIG9wdGlvbnMgYW5kIHRoZSBpbmRpdmlkdWFsIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGRhdGE6IHRoaXMuX25vcm1hbGl6ZURhdGEodGhpcy5fZGF0YSB8fCBvcHRpb25zLmRhdGEgfHwgW10pLFxuICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTW9zdCBHb29nbGUgTWFwcyBBUElzIHN1cHBvcnQgYm90aCBgTGF0TG5nYCBvYmplY3RzIGFuZCBgTGF0TG5nTGl0ZXJhbGAuIFRoZSBsYXR0ZXIgaXMgbW9yZVxuICAgKiBjb252ZW5pZW50IHRvIHdyaXRlIG91dCwgYmVjYXVzZSB0aGUgR29vZ2xlIE1hcHMgQVBJIGRvZXNuJ3QgaGF2ZSB0byBoYXZlIGJlZW4gbG9hZGVkIGluIG9yZGVyXG4gICAqIHRvIGNvbnN0cnVjdCB0aGVtLiBUaGUgYEhlYXRtYXBMYXllcmAgYXBwZWFycyB0byBiZSBhbiBleGNlcHRpb24gdGhhdCBvbmx5IGFsbG93cyBhIGBMYXRMbmdgXG4gICAqIG9iamVjdCwgb3IgaXQgdGhyb3dzIGEgcnVudGltZSBlcnJvci4gU2luY2UgaXQncyBtb3JlIGNvbnZlbmllbnQgYW5kIHdlIGV4cGVjdCB0aGF0IEFuZ3VsYXJcbiAgICogdXNlcnMgd2lsbCBsb2FkIHRoZSBBUEkgYXN5bmNocm9ub3VzbHksIHdlIGFsbG93IHRoZW0gdG8gcGFzcyBpbiBhIGBMYXRMbmdMaXRlcmFsYCBhbmQgd2VcbiAgICogY29udmVydCBpdCB0byBhIGBMYXRMbmdgIG9iamVjdCBiZWZvcmUgcGFzc2luZyBpdCBvZmYgdG8gR29vZ2xlIE1hcHMuXG4gICAqL1xuICBwcml2YXRlIF9ub3JtYWxpemVEYXRhKGRhdGE6IEhlYXRtYXBEYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0OiAoZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uKVtdID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICByZXN1bHQucHVzaChpc0xhdExuZ0xpdGVyYWwoaXRlbSkgPyBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGl0ZW0ubGF0LCBpdGVtLmxuZykgOiBpdGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQXNzZXJ0cyB0aGF0IHRoZSBoZWF0bWFwIG9iamVjdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtoZWF0bWFwOiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcn0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5oZWF0bWFwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgSGVhdG1hcExheWVyIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBoZWF0bWFwIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKiBBc3NlcnRzIHRoYXQgYW4gb2JqZWN0IGlzIGEgYExhdExuZ0xpdGVyYWxgLiAqL1xuZnVuY3Rpb24gaXNMYXRMbmdMaXRlcmFsKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sYXQgPT09ICdudW1iZXInICYmIHR5cGVvZiB2YWx1ZS5sbmcgPT09ICdudW1iZXInO1xufVxuIl19