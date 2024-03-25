/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" />
import { Input, Output, NgZone, Directive, inject, EventEmitter, } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 */
export const DEFAULT_MARKER_OPTIONS = {
    position: { lat: 37.221995, lng: -122.184092 },
};
/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/marker
 */
export class MapAdvancedMarker {
    /**
     * Rollover text. If provided, an accessibility text (e.g. for use with screen readers) will be added to the AdvancedMarkerElement with the provided value.
     * See: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.title
     */
    set title(title) {
        this._title = title;
    }
    /**
     * Sets the AdvancedMarkerElement's position. An AdvancedMarkerElement may be constructed without a position, but will not be displayed until its position is provided - for example, by a user's actions or choices. An AdvancedMarkerElement's position can be provided by setting AdvancedMarkerElement.position if not provided at the construction.
     * Note: AdvancedMarkerElement with altitude is only supported on vector maps.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.position
     */
    set position(position) {
        this._position = position;
    }
    /**
     * The DOM Element backing the visual of an AdvancedMarkerElement.
     * Note: AdvancedMarkerElement does not clone the passed-in DOM element. Once the DOM element is passed to an AdvancedMarkerElement, passing the same DOM element to another AdvancedMarkerElement will move the DOM element and cause the previous AdvancedMarkerElement to look empty.
     * See: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.content
     */
    set content(content) {
        this._content = content;
    }
    /**
     * If true, the AdvancedMarkerElement can be dragged.
     * Note: AdvancedMarkerElement with altitude is not draggable.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpDraggable
     */
    set gmpDraggable(draggable) {
        this._draggable = draggable;
    }
    /**
     * Options for constructing an AdvancedMarkerElement.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions
     */
    set options(options) {
        this._options = options;
    }
    /**
     * AdvancedMarkerElements on the map are prioritized by zIndex, with higher values indicating higher display.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.zIndex
     */
    set zIndex(zIndex) {
        this._zIndex = zIndex;
    }
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        /**
         * This event is fired when the AdvancedMarkerElement element is clicked.
         * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.click
         */
        this.mapClick = this._eventManager.getLazyEmitter('click');
        /**
         * This event is repeatedly fired while the user drags the AdvancedMarkerElement.
         * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.drag
         */
        this.mapDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * This event is fired when the user stops dragging the AdvancedMarkerElement.
         * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.dragend
         */
        this.mapDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * This event is fired when the user starts dragging the AdvancedMarkerElement.
         * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.dragstart
         */
        this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
        /** Event emitted when the marker is initialized. */
        this.markerInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (!this._googleMap._isBrowser) {
            return;
        }
        if (google.maps.marker?.AdvancedMarkerElement && this._googleMap.googleMap) {
            this._initialize(this._googleMap.googleMap, google.maps.marker.AdvancedMarkerElement);
        }
        else {
            this._ngZone.runOutsideAngular(() => {
                Promise.all([this._googleMap._resolveMap(), google.maps.importLibrary('marker')]).then(([map, lib]) => {
                    this._initialize(map, lib.AdvancedMarkerElement);
                });
            });
        }
    }
    _initialize(map, advancedMarkerConstructor) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.advancedMarker = new advancedMarkerConstructor(this._combineOptions());
            this._assertInitialized();
            this.advancedMarker.map = map;
            this._eventManager.setTarget(this.advancedMarker);
            this.markerInitialized.next(this.advancedMarker);
        });
    }
    ngOnChanges(changes) {
        const { advancedMarker, _content, _position, _title, _draggable, _zIndex } = this;
        if (advancedMarker) {
            if (changes['title']) {
                advancedMarker.title = _title;
            }
            if (changes['content']) {
                advancedMarker.content = _content;
            }
            if (changes['gmpDraggable']) {
                advancedMarker.gmpDraggable = _draggable;
            }
            if (changes['content']) {
                advancedMarker.content = _content;
            }
            if (changes['position']) {
                advancedMarker.position = _position;
            }
            if (changes['zIndex']) {
                advancedMarker.zIndex = _zIndex;
            }
        }
    }
    ngOnDestroy() {
        this.markerInitialized.complete();
        this._eventManager.destroy();
        if (this.advancedMarker) {
            this.advancedMarker.map = null;
        }
    }
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    _combineOptions() {
        const options = this._options || DEFAULT_MARKER_OPTIONS;
        return {
            ...options,
            title: this._title || options.title,
            position: this._position || options.position,
            content: this._content || options.content,
            zIndex: this._zIndex ?? options.zIndex,
            gmpDraggable: this._draggable ?? options.gmpDraggable,
            map: this._googleMap.googleMap,
        };
    }
    /** Asserts that the map has been initialized. */
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.advancedMarker) {
                throw Error('Cannot interact with a Google Map Marker before it has been ' +
                    'initialized. Please wait for the Marker to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.1", ngImport: i0, type: MapAdvancedMarker, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.0-next.1", type: MapAdvancedMarker, isStandalone: true, selector: "map-advanced-marker", inputs: { title: "title", position: "position", content: "content", gmpDraggable: "gmpDraggable", options: "options", zIndex: "zIndex" }, outputs: { mapClick: "mapClick", mapDrag: "mapDrag", mapDragend: "mapDragend", mapDragstart: "mapDragstart", markerInitialized: "markerInitialized" }, exportAs: ["mapAdvancedMarker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.1", ngImport: i0, type: MapAdvancedMarker, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-advanced-marker',
                    exportAs: 'mapAdvancedMarker',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { title: [{
                type: Input
            }], position: [{
                type: Input
            }], content: [{
                type: Input
            }], gmpDraggable: [{
                type: Input
            }], options: [{
                type: Input
            }], zIndex: [{
                type: Input
            }], mapClick: [{
                type: Output
            }], mapDrag: [{
                type: Output
            }], mapDragend: [{
                type: Output
            }], mapDragstart: [{
                type: Output
            }], markerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWFkdmFuY2VkLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYWR2YW5jZWQtbWFya2VyL21hcC1hZHZhbmNlZC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFDQUFxQztBQUVyQyxPQUFPLEVBQ0wsS0FBSyxFQUdMLE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUdULE1BQU0sRUFDTixZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7QUFFaEM7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7Q0FDN0MsQ0FBQztBQUVGOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8saUJBQWlCO0lBRzVCOzs7T0FHRztJQUNILElBQ0ksS0FBSyxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxJQUNJLFFBQVEsQ0FDVixRQUlxQztRQUVyQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILElBQ0ksT0FBTyxDQUFDLE9BQTZDO1FBQ3ZELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsSUFDSSxZQUFZLENBQUMsU0FBa0I7UUFDakMsSUFBSSxD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TTtnQkFPWSxVQUFVO3NCQUE1QixNQUFNO2dCQU9ZLFlBQVk7c0JBQTlCLE1BQU07Z0JBSVksaUJBQWlCO3NCQUFuQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgTmdab25lLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgaW5qZWN0LFxuICBFdmVudEVtaXR0ZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIEdvb2dsZSBNYXBzIG1hcmtlciBjb21wb25lbnQuIERpc3BsYXlzIGEgbWFya2VyXG4gKiBhdCB0aGUgR29vZ2xlcGxleC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFSS0VSX09QVElPTlMgPSB7XG4gIHBvc2l0aW9uOiB7bGF0OiAzNy4yMjE5OTUsIGxuZzogLTEyMi4xODQwOTJ9LFxufTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBtYXJrZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWFkdmFuY2VkLW1hcmtlcicsXG4gIGV4cG9ydEFzOiAnbWFwQWR2YW5jZWRNYXJrZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBBZHZhbmNlZE1hcmtlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKGluamVjdChOZ1pvbmUpKTtcblxuICAvKipcbiAgICogUm9sbG92ZXIgdGV4dC4gSWYgcHJvdmlkZWQsIGFuIGFjY2Vzc2liaWxpdHkgdGV4dCAoZS5nLiBmb3IgdXNlIHdpdGggc2NyZWVuIHJlYWRlcnMpIHdpbGwgYmUgYWRkZWQgdG8gdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLnRpdGxlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdGl0bGU7XG4gIH1cbiAgcHJpdmF0ZSBfdGl0bGU6IHN0cmluZztcblxuICAvKipcbiAgICogU2V0cyB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50J3MgcG9zaXRpb24uIEFuIEFkdmFuY2VkTWFya2VyRWxlbWVudCBtYXkgYmUgY29uc3RydWN0ZWQgd2l0aG91dCBhIHBvc2l0aW9uLCBidXQgd2lsbCBub3QgYmUgZGlzcGxheWVkIHVudGlsIGl0cyBwb3NpdGlvbiBpcyBwcm92aWRlZCAtIGZvciBleGFtcGxlLCBieSBhIHVzZXIncyBhY3Rpb25zIG9yIGNob2ljZXMuIEFuIEFkdmFuY2VkTWFya2VyRWxlbWVudCdzIHBvc2l0aW9uIGNhbiBiZSBwcm92aWRlZCBieSBzZXR0aW5nIEFkdmFuY2VkTWFya2VyRWxlbWVudC5wb3NpdGlvbiBpZiBub3QgcHJvdmlkZWQgYXQgdGhlIGNvbnN0cnVjdGlvbi5cbiAgICogTm90ZTogQWR2YW5jZWRNYXJrZXJFbGVtZW50IHdpdGggYWx0aXR1ZGUgaXMgb25seSBzdXBwb3J0ZWQgb24gdmVjdG9yIG1hcHMuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMucG9zaXRpb25cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihcbiAgICBwb3NpdGlvbjpcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbFxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQWx0aXR1ZGVcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQWx0aXR1ZGVMaXRlcmFsLFxuICApIHtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICB9XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHwgZ29vZ2xlLm1hcHMuTGF0TG5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRE9NIEVsZW1lbnQgYmFja2luZyB0aGUgdmlzdWFsIG9mIGFuIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogTm90ZTogQWR2YW5jZWRNYXJrZXJFbGVtZW50IGRvZXMgbm90IGNsb25lIHRoZSBwYXNzZWQtaW4gRE9NIGVsZW1lbnQuIE9uY2UgdGhlIERPTSBlbGVtZW50IGlzIHBhc3NlZCB0byBhbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQsIHBhc3NpbmcgdGhlIHNhbWUgRE9NIGVsZW1lbnQgdG8gYW5vdGhlciBBZHZhbmNlZE1hcmtlckVsZW1lbnQgd2lsbCBtb3ZlIHRoZSBET00gZWxlbWVudCBhbmQgY2F1c2UgdGhlIHByZXZpb3VzIEFkdmFuY2VkTWFya2VyRWxlbWVudCB0byBsb29rIGVtcHR5LlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMuY29udGVudFxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGNvbnRlbnQoY29udGVudDogTm9kZSB8IGdvb2dsZS5tYXBzLm1hcmtlci5QaW5FbGVtZW50KSB7XG4gICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XG4gIH1cbiAgcHJpdmF0ZSBfY29udGVudDogTm9kZTtcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCBjYW4gYmUgZHJhZ2dlZC5cbiAgICogTm90ZTogQWR2YW5jZWRNYXJrZXJFbGVtZW50IHdpdGggYWx0aXR1ZGUgaXMgbm90IGRyYWdnYWJsZS5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucy5nbXBEcmFnZ2FibGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBnbXBEcmFnZ2FibGUoZHJhZ2dhYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZHJhZ2dhYmxlID0gZHJhZ2dhYmxlO1xuICB9XG4gIHByaXZhdGUgX2RyYWdnYWJsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgY29uc3RydWN0aW5nIGFuIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICBwcml2YXRlIF9vcHRpb25zOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucztcblxuICAvKipcbiAgICogQWR2YW5jZWRNYXJrZXJFbGVtZW50cyBvbiB0aGUgbWFwIGFyZSBwcmlvcml0aXplZCBieSB6SW5kZXgsIHdpdGggaGlnaGVyIHZhbHVlcyBpbmRpY2F0aW5nIGhpZ2hlciBkaXNwbGF5LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLnpJbmRleFxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHpJbmRleCh6SW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuX3pJbmRleCA9IHpJbmRleDtcbiAgfVxuICBwcml2YXRlIF96SW5kZXg6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQgZWxlbWVudCBpcyBjbGlja2VkLlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnQuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIHJlcGVhdGVkbHkgZmlyZWQgd2hpbGUgdGhlIHVzZXIgZHJhZ3MgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50LmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIHN0b3BzIGRyYWdnaW5nIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudC5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBzdGFydHMgZHJhZ2dpbmcgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50LmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtYXJrZXIgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXJrZXJJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudFxuICAgKi9cbiAgYWR2YW5jZWRNYXJrZXI6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChnb29nbGUubWFwcy5tYXJrZXI/LkFkdmFuY2VkTWFya2VyRWxlbWVudCAmJiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwKSB7XG4gICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5fZ29vZ2xlTWFwLl9yZXNvbHZlTWFwKCksIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ21hcmtlcicpXSkudGhlbihcbiAgICAgICAgICAoW21hcCwgbGliXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuTWFya2VyTGlicmFyeSkuQWR2YW5jZWRNYXJrZXJFbGVtZW50KTtcbiAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShcbiAgICBtYXA6IGdvb2dsZS5tYXBzLk1hcCxcbiAgICBhZHZhbmNlZE1hcmtlckNvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudCxcbiAgKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuYWR2YW5jZWRNYXJrZXIgPSBuZXcgYWR2YW5jZWRNYXJrZXJDb25zdHJ1Y3Rvcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLmFkdmFuY2VkTWFya2VyLm1hcCA9IG1hcDtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5hZHZhbmNlZE1hcmtlcik7XG4gICAgICB0aGlzLm1hcmtlckluaXRpYWxpemVkLm5leHQodGhpcy5hZHZhbmNlZE1hcmtlcik7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qge2FkdmFuY2VkTWFya2VyLCBfY29udGVudCwgX3Bvc2l0aW9uLCBfdGl0bGUsIF9kcmFnZ2FibGUsIF96SW5kZXh9ID0gdGhpcztcbiAgICBpZiAoYWR2YW5jZWRNYXJrZXIpIHtcbiAgICAgIGlmIChjaGFuZ2VzWyd0aXRsZSddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLnRpdGxlID0gX3RpdGxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snY29udGVudCddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLmNvbnRlbnQgPSBfY29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2dtcERyYWdnYWJsZSddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLmdtcERyYWdnYWJsZSA9IF9kcmFnZ2FibGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydjb250ZW50J10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuY29udGVudCA9IF9jb250ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1sncG9zaXRpb24nXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci5wb3NpdGlvbiA9IF9wb3NpdGlvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ3pJbmRleCddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLnpJbmRleCA9IF96SW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5tYXJrZXJJbml0aWFsaXplZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG5cbiAgICBpZiAodGhpcy5hZHZhbmNlZE1hcmtlcikge1xuICAgICAgdGhpcy5hZHZhbmNlZE1hcmtlci5tYXAgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgY29tYmluZWQgb3B0aW9ucyBvYmplY3QgdXNpbmcgdGhlIHBhc3NlZC1pbiBvcHRpb25zIGFuZCB0aGUgaW5kaXZpZHVhbCBpbnB1dHMuICovXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCBERUZBVUxUX01BUktFUl9PUFRJT05TO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdGl0bGU6IHRoaXMuX3RpdGxlIHx8IG9wdGlvbnMudGl0bGUsXG4gICAgICBwb3NpdGlvbjogdGhpcy5fcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgIGNvbnRlbnQ6IHRoaXMuX2NvbnRlbnQgfHwgb3B0aW9ucy5jb250ZW50LFxuICAgICAgekluZGV4OiB0aGlzLl96SW5kZXggPz8gb3B0aW9ucy56SW5kZXgsXG4gICAgICBnbXBEcmFnZ2FibGU6IHRoaXMuX2RyYWdnYWJsZSA/PyBvcHRpb25zLmdtcERyYWdnYWJsZSxcbiAgICAgIG1hcDogdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCxcbiAgICB9O1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlcjogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudH0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5hZHZhbmNlZE1hcmtlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIE1hcmtlciBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgTWFya2VyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=