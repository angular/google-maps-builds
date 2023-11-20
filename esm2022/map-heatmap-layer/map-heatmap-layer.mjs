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
import { Input, NgZone, Directive } from '@angular/core';
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
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            if (!window.google?.maps?.visualization && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Namespace `google.maps.visualization` not found, cannot construct heatmap. ' +
                    'Please install the Google Maps JavaScript API with the "visualization" library: ' +
                    'https://developers.google.com/maps/documentation/javascript/visualization');
            }
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.heatmap = new google.maps.visualization.HeatmapLayer(this._combineOptions());
            });
            this._assertInitialized();
            this.heatmap.setMap(this._googleMap.googleMap);
        }
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
        if (this.heatmap) {
            this.heatmap.setMap(null);
        }
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
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.heatmap) {
                throw Error('Cannot interact with a Google Map HeatmapLayer before it has been ' +
                    'initialized. Please wait for the heatmap to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MapHeatmapLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MapHeatmapLayer, isStandalone: true, selector: "map-heatmap-layer", inputs: { data: "data", options: "options" }, exportAs: ["mapHeatmapLayer"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MapHeatmapLayer, decorators: [{
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
            }] } });
/** Asserts that an object is a `LatLngLiteral`. */
function isLatLngLiteral(value) {
    return value && typeof value.lat === 'number' && typeof value.lng === 'number';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWhlYXRtYXAtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWhlYXRtYXAtbGF5ZXIvbWFwLWhlYXRtYXAtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLEtBQUssRUFBcUIsTUFBTSxFQUFFLFNBQVMsRUFBMkIsTUFBTSxlQUFlLENBQUM7QUFFcEcsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7QUFTbkQ7Ozs7R0FJRztBQU1ILE1BQU0sT0FBTyxlQUFlO0lBQzFCOzs7T0FHRztJQUNILElBQ0ksSUFBSSxDQUFDLElBQWlCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUErRDtRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBVUQsWUFDbUIsVUFBcUIsRUFDOUIsT0FBZTtRQUROLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUN0QixDQUFDO0lBRUosUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtnQkFDMUYsTUFBTSxLQUFLLENBQ1QsNkVBQTZFO29CQUMzRSxrRkFBa0Y7b0JBQ2xGLDJFQUEyRSxDQUM5RSxDQUFDO2FBQ0g7WUFFRCxtRkFBbUY7WUFDbkYsbUZBQW1GO1lBQ25GLDBCQUEwQjtZQUMxQixJQUFJLENB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LEVBQUUsSUFBSTtpQkFDakI7bUdBT0ssSUFBSTtzQkFEUCxLQUFLO2dCQVdGLE9BQU87c0JBRFYsS0FBSzs7QUFtSFIsbURBQW1EO0FBQ25ELFNBQVMsZUFBZSxDQUFDLEtBQVU7SUFDakMsT0FBTyxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDO0FBQ2pGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7SW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBOZ1pvbmUsIERpcmVjdGl2ZSwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5cbi8qKiBQb3NzaWJsZSBkYXRhIHRoYXQgY2FuIGJlIHNob3duIG9uIGEgaGVhdG1hcCBsYXllci4gKi9cbmV4cG9ydCB0eXBlIEhlYXRtYXBEYXRhID1cbiAgfCBnb29nbGUubWFwcy5NVkNBcnJheTxcbiAgICAgIGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxcbiAgICA+XG4gIHwgKGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpW107XG5cbi8qKlxuICogQW5ndWxhciBkaXJlY3RpdmUgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgaGVhdG1hcCB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWhlYXRtYXAtbGF5ZXInLFxuICBleHBvcnRBczogJ21hcEhlYXRtYXBMYXllcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEhlYXRtYXBMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogRGF0YSBzaG93biBvbiB0aGUgaGVhdG1hcC5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvblxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGRhdGEoZGF0YTogSGVhdG1hcERhdGEpIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuICBwcml2YXRlIF9kYXRhOiBIZWF0bWFwRGF0YTtcblxuICAvKipcbiAgICogT3B0aW9ucyB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgaGVhdG1hcC4gU2VlOlxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb24jSGVhdG1hcExheWVyT3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogUGFydGlhbDxnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnM+KSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogUGFydGlhbDxnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnM+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAgICovXG4gIGhlYXRtYXA/OiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgaWYgKCF3aW5kb3cuZ29vZ2xlPy5tYXBzPy52aXN1YWxpemF0aW9uICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdOYW1lc3BhY2UgYGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb25gIG5vdCBmb3VuZCwgY2Fubm90IGNvbnN0cnVjdCBoZWF0bWFwLiAnICtcbiAgICAgICAgICAgICdQbGVhc2UgaW5zdGFsbCB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkgd2l0aCB0aGUgXCJ2aXN1YWxpemF0aW9uXCIgbGlicmFyeTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvdmlzdWFsaXphdGlvbicsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuaGVhdG1hcCA9IG5ldyBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuaGVhdG1hcC5zZXRNYXAodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7X2RhdGEsIGhlYXRtYXB9ID0gdGhpcztcblxuICAgIGlmIChoZWF0bWFwKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2RhdGEnXSAmJiBfZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0RGF0YSh0aGlzLl9ub3JtYWxpemVEYXRhKF9kYXRhKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuaGVhdG1hcCkge1xuICAgICAgdGhpcy5oZWF0bWFwLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YSB0aGF0IGlzIGN1cnJlbnRseSBzaG93biBvbiB0aGUgaGVhdG1hcC5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb24jSGVhdG1hcExheWVyXG4gICAqL1xuICBnZXREYXRhKCk6IEhlYXRtYXBEYXRhIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmhlYXRtYXAuZ2V0RGF0YSgpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBjb21iaW5lZCBvcHRpb25zIG9iamVjdCB1c2luZyB0aGUgcGFzc2VkLWluIG9wdGlvbnMgYW5kIHRoZSBpbmRpdmlkdWFsIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGRhdGE6IHRoaXMuX25vcm1hbGl6ZURhdGEodGhpcy5fZGF0YSB8fCBvcHRpb25zLmRhdGEgfHwgW10pLFxuICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTW9zdCBHb29nbGUgTWFwcyBBUElzIHN1cHBvcnQgYm90aCBgTGF0TG5nYCBvYmplY3RzIGFuZCBgTGF0TG5nTGl0ZXJhbGAuIFRoZSBsYXR0ZXIgaXMgbW9yZVxuICAgKiBjb252ZW5pZW50IHRvIHdyaXRlIG91dCwgYmVjYXVzZSB0aGUgR29vZ2xlIE1hcHMgQVBJIGRvZXNuJ3QgaGF2ZSB0byBoYXZlIGJlZW4gbG9hZGVkIGluIG9yZGVyXG4gICAqIHRvIGNvbnN0cnVjdCB0aGVtLiBUaGUgYEhlYXRtYXBMYXllcmAgYXBwZWFycyB0byBiZSBhbiBleGNlcHRpb24gdGhhdCBvbmx5IGFsbG93cyBhIGBMYXRMbmdgXG4gICAqIG9iamVjdCwgb3IgaXQgdGhyb3dzIGEgcnVudGltZSBlcnJvci4gU2luY2UgaXQncyBtb3JlIGNvbnZlbmllbnQgYW5kIHdlIGV4cGVjdCB0aGF0IEFuZ3VsYXJcbiAgICogdXNlcnMgd2lsbCBsb2FkIHRoZSBBUEkgYXN5bmNocm9ub3VzbHksIHdlIGFsbG93IHRoZW0gdG8gcGFzcyBpbiBhIGBMYXRMbmdMaXRlcmFsYCBhbmQgd2VcbiAgICogY29udmVydCBpdCB0byBhIGBMYXRMbmdgIG9iamVjdCBiZWZvcmUgcGFzc2luZyBpdCBvZmYgdG8gR29vZ2xlIE1hcHMuXG4gICAqL1xuICBwcml2YXRlIF9ub3JtYWxpemVEYXRhKGRhdGE6IEhlYXRtYXBEYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0OiAoZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uKVtdID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICByZXN1bHQucHVzaChpc0xhdExuZ0xpdGVyYWwoaXRlbSkgPyBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGl0ZW0ubGF0LCBpdGVtLmxuZykgOiBpdGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQXNzZXJ0cyB0aGF0IHRoZSBoZWF0bWFwIG9iamVjdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtoZWF0bWFwOiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcn0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmhlYXRtYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBIZWF0bWFwTGF5ZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIGhlYXRtYXAgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEFzc2VydHMgdGhhdCBhbiBvYmplY3QgaXMgYSBgTGF0TG5nTGl0ZXJhbGAuICovXG5mdW5jdGlvbiBpc0xhdExuZ0xpdGVyYWwodmFsdWU6IGFueSk6IHZhbHVlIGlzIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxhdCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbHVlLmxuZyA9PT0gJ251bWJlcic7XG59XG4iXX0=