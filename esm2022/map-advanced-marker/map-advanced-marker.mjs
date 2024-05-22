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
    getAnchor() {
        this._assertInitialized();
        return this.advancedMarker;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MapAdvancedMarker, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.0", type: MapAdvancedMarker, isStandalone: true, selector: "map-advanced-marker", inputs: { title: "title", position: "position", content: "content", gmpDraggable: "gmpDraggable", options: "options", zIndex: "zIndex" }, outputs: { mapClick: "mapClick", mapDrag: "mapDrag", mapDragend: "mapDragend", mapDragstart: "mapDragstart", markerInitialized: "markerInitialized" }, exportAs: ["mapAdvancedMarker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MapAdvancedMarker, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWFkdmFuY2VkLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYWR2YW5jZWQtbWFya2VyL21hcC1hZHZhbmNlZC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFDQUFxQztBQUVyQyxPQUFPLEVBQ0wsS0FBSyxFQUdMLE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUdULE1BQU0sRUFDTixZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7QUFHaEM7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7Q0FDN0MsQ0FBQztBQUVGOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8saUJBQWlCO0lBRzVCOzs7T0FHRztJQUNILElBQ0ksS0FBSyxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxJQUNJLFFBQVEsQ0FDVixRQUlxQztRQUVyQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILElBQ0ksT0FBTyxDQUFDLE9BQW9EO1FBQzlELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsSUFDSSxZQUFZLENBQUMsU0FBa0I7UUFDakMsSUFBSSxD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RixPQUFPO3NCQURWLEtBQUs7Z0JBV0YsTUFBTTtzQkFEVCxLQUFLO2dCQVVhLFFBQVE7c0JBQTFCLE1BQU07Z0JBT1ksT0FBTztzQkFBekIsTUFBTTtnQkFPWSxVQUFVO3NCQUE1QixNQUFNO2dCQU9ZLFlBQVk7c0JBQTlCLE1BQU07Z0JBSVksaUJBQWlCO3NCQUFuQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgTmdab25lLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgaW5qZWN0LFxuICBFdmVudEVtaXR0ZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXBBbmNob3JQb2ludH0gZnJvbSAnLi4vbWFwLWFuY2hvci1wb2ludCc7XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgR29vZ2xlIE1hcHMgbWFya2VyIGNvbXBvbmVudC4gRGlzcGxheXMgYSBtYXJrZXJcbiAqIGF0IHRoZSBHb29nbGVwbGV4LlxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9NQVJLRVJfT1BUSU9OUyA9IHtcbiAgcG9zaXRpb246IHtsYXQ6IDM3LjIyMTk5NSwgbG5nOiAtMTIyLjE4NDA5Mn0sXG59O1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIG1hcmtlciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtYWR2YW5jZWQtbWFya2VyJyxcbiAgZXhwb3J0QXM6ICdtYXBBZHZhbmNlZE1hcmtlcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEFkdmFuY2VkTWFya2VyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgTWFwQW5jaG9yUG9pbnQge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKGluamVjdChOZ1pvbmUpKTtcblxuICAvKipcbiAgICogUm9sbG92ZXIgdGV4dC4gSWYgcHJvdmlkZWQsIGFuIGFjY2Vzc2liaWxpdHkgdGV4dCAoZS5nLiBmb3IgdXNlIHdpdGggc2NyZWVuIHJlYWRlcnMpIHdpbGwgYmUgYWRkZWQgdG8gdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLnRpdGxlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdGl0bGU7XG4gIH1cbiAgcHJpdmF0ZSBfdGl0bGU6IHN0cmluZztcblxuICAvKipcbiAgICogU2V0cyB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50J3MgcG9zaXRpb24uIEFuIEFkdmFuY2VkTWFya2VyRWxlbWVudCBtYXkgYmUgY29uc3RydWN0ZWQgd2l0aG91dCBhIHBvc2l0aW9uLCBidXQgd2lsbCBub3QgYmUgZGlzcGxheWVkIHVudGlsIGl0cyBwb3NpdGlvbiBpcyBwcm92aWRlZCAtIGZvciBleGFtcGxlLCBieSBhIHVzZXIncyBhY3Rpb25zIG9yIGNob2ljZXMuIEFuIEFkdmFuY2VkTWFya2VyRWxlbWVudCdzIHBvc2l0aW9uIGNhbiBiZSBwcm92aWRlZCBieSBzZXR0aW5nIEFkdmFuY2VkTWFya2VyRWxlbWVudC5wb3NpdGlvbiBpZiBub3QgcHJvdmlkZWQgYXQgdGhlIGNvbnN0cnVjdGlvbi5cbiAgICogTm90ZTogQWR2YW5jZWRNYXJrZXJFbGVtZW50IHdpdGggYWx0aXR1ZGUgaXMgb25seSBzdXBwb3J0ZWQgb24gdmVjdG9yIG1hcHMuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMucG9zaXRpb25cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihcbiAgICBwb3NpdGlvbjpcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbFxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQWx0aXR1ZGVcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQWx0aXR1ZGVMaXRlcmFsLFxuICApIHtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICB9XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHwgZ29vZ2xlLm1hcHMuTGF0TG5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRE9NIEVsZW1lbnQgYmFja2luZyB0aGUgdmlzdWFsIG9mIGFuIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogTm90ZTogQWR2YW5jZWRNYXJrZXJFbGVtZW50IGRvZXMgbm90IGNsb25lIHRoZSBwYXNzZWQtaW4gRE9NIGVsZW1lbnQuIE9uY2UgdGhlIERPTSBlbGVtZW50IGlzIHBhc3NlZCB0byBhbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQsIHBhc3NpbmcgdGhlIHNhbWUgRE9NIGVsZW1lbnQgdG8gYW5vdGhlciBBZHZhbmNlZE1hcmtlckVsZW1lbnQgd2lsbCBtb3ZlIHRoZSBET00gZWxlbWVudCBhbmQgY2F1c2UgdGhlIHByZXZpb3VzIEFkdmFuY2VkTWFya2VyRWxlbWVudCB0byBsb29rIGVtcHR5LlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMuY29udGVudFxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGNvbnRlbnQoY29udGVudDogTm9kZSB8IGdvb2dsZS5tYXBzLm1hcmtlci5QaW5FbGVtZW50IHwgbnVsbCkge1xuICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xuICB9XG4gIHByaXZhdGUgX2NvbnRlbnQ6IE5vZGUgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50IGNhbiBiZSBkcmFnZ2VkLlxuICAgKiBOb3RlOiBBZHZhbmNlZE1hcmtlckVsZW1lbnQgd2l0aCBhbHRpdHVkZSBpcyBub3QgZHJhZ2dhYmxlLlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLmdtcERyYWdnYWJsZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGdtcERyYWdnYWJsZShkcmFnZ2FibGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kcmFnZ2FibGUgPSBkcmFnZ2FibGU7XG4gIH1cbiAgcHJpdmF0ZSBfZHJhZ2dhYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIGZvciBjb25zdHJ1Y3RpbmcgYW4gQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBBZHZhbmNlZE1hcmtlckVsZW1lbnRzIG9uIHRoZSBtYXAgYXJlIHByaW9yaXRpemVkIGJ5IHpJbmRleCwgd2l0aCBoaWdoZXIgdmFsdWVzIGluZGljYXRpbmcgaGlnaGVyIGRpc3BsYXkuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMuekluZGV4XG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgekluZGV4KHpJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fekluZGV4ID0gekluZGV4O1xuICB9XG4gIHByaXZhdGUgX3pJbmRleDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCBlbGVtZW50IGlzIGNsaWNrZWQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudC5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgcmVwZWF0ZWRseSBmaXJlZCB3aGlsZSB0aGUgdXNlciBkcmFncyB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnQuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHVzZXIgc3RvcHMgZHJhZ2dpbmcgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50LmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIHN0YXJ0cyBkcmFnZ2luZyB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnQuZHJhZ3N0YXJ0XG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1hcmtlciBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcmtlckluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudD4oKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudCBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50XG4gICAqL1xuICBhZHZhbmNlZE1hcmtlcjogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGdvb2dsZS5tYXBzLm1hcmtlcj8uQWR2YW5jZWRNYXJrZXJFbGVtZW50ICYmIHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpemUodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCwgZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIFByb21pc2UuYWxsKFt0aGlzLl9nb29nbGVNYXAuX3Jlc29sdmVNYXAoKSwgZ29vZ2xlLm1hcHMuaW1wb3J0TGlicmFyeSgnbWFya2VyJyldKS50aGVuKFxuICAgICAgICAgIChbbWFwLCBsaWJdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKG1hcCwgKGxpYiBhcyBnb29nbGUubWFwcy5NYXJrZXJMaWJyYXJ5KS5BZHZhbmNlZE1hcmtlckVsZW1lbnQpO1xuICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIG1hcDogZ29vZ2xlLm1hcHMuTWFwLFxuICAgIGFkdmFuY2VkTWFya2VyQ29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50LFxuICApIHtcbiAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5hZHZhbmNlZE1hcmtlciA9IG5ldyBhZHZhbmNlZE1hcmtlckNvbnN0cnVjdG9yKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuYWR2YW5jZWRNYXJrZXIubWFwID0gbWFwO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmFkdmFuY2VkTWFya2VyKTtcbiAgICAgIHRoaXMubWFya2VySW5pdGlhbGl6ZWQubmV4dCh0aGlzLmFkdmFuY2VkTWFya2VyKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7YWR2YW5jZWRNYXJrZXIsIF9jb250ZW50LCBfcG9zaXRpb24sIF90aXRsZSwgX2RyYWdnYWJsZSwgX3pJbmRleH0gPSB0aGlzO1xuICAgIGlmIChhZHZhbmNlZE1hcmtlcikge1xuICAgICAgaWYgKGNoYW5nZXNbJ3RpdGxlJ10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIudGl0bGUgPSBfdGl0bGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydjb250ZW50J10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuY29udGVudCA9IF9jb250ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snZ21wRHJhZ2dhYmxlJ10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuZ21wRHJhZ2dhYmxlID0gX2RyYWdnYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2NvbnRlbnQnXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci5jb250ZW50ID0gX2NvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLnBvc2l0aW9uID0gX3Bvc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snekluZGV4J10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuekluZGV4ID0gX3pJbmRleDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLm1hcmtlckluaXRpYWxpemVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcblxuICAgIGlmICh0aGlzLmFkdmFuY2VkTWFya2VyKSB7XG4gICAgICB0aGlzLmFkdmFuY2VkTWFya2VyLm1hcCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0QW5jaG9yKCk6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuYWR2YW5jZWRNYXJrZXI7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGNvbWJpbmVkIG9wdGlvbnMgb2JqZWN0IHVzaW5nIHRoZSBwYXNzZWQtaW4gb3B0aW9ucyBhbmQgdGhlIGluZGl2aWR1YWwgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgREVGQVVMVF9NQVJLRVJfT1BUSU9OUztcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHRpdGxlOiB0aGlzLl90aXRsZSB8fCBvcHRpb25zLnRpdGxlLFxuICAgICAgcG9zaXRpb246IHRoaXMuX3Bvc2l0aW9uIHx8IG9wdGlvbnMucG9zaXRpb24sXG4gICAgICBjb250ZW50OiB0aGlzLl9jb250ZW50IHx8IG9wdGlvbnMuY29udGVudCxcbiAgICAgIHpJbmRleDogdGhpcy5fekluZGV4ID8/IG9wdGlvbnMuekluZGV4LFxuICAgICAgZ21wRHJhZ2dhYmxlOiB0aGlzLl9kcmFnZ2FibGUgPz8gb3B0aW9ucy5nbXBEcmFnZ2FibGUsXG4gICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBBc3NlcnRzIHRoYXQgdGhlIG1hcCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHttYXJrZXI6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnR9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuYWR2YW5jZWRNYXJrZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBNYXJrZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIE1hcmtlciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19