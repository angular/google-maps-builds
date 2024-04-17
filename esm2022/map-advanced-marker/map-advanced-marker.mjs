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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapAdvancedMarker, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapAdvancedMarker, isStandalone: true, selector: "map-advanced-marker", inputs: { title: "title", position: "position", content: "content", gmpDraggable: "gmpDraggable", options: "options", zIndex: "zIndex" }, outputs: { mapClick: "mapClick", mapDrag: "mapDrag", mapDragend: "mapDragend", mapDragstart: "mapDragstart", markerInitialized: "markerInitialized" }, exportAs: ["mapAdvancedMarker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapAdvancedMarker, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWFkdmFuY2VkLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYWR2YW5jZWQtbWFya2VyL21hcC1hZHZhbmNlZC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFHVCxNQUFNLEVBQ04sWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7O0FBR2hDOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHO0lBQ3BDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFDO0NBQzdDLENBQUM7QUFFRjs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGlCQUFpQjtJQUc1Qjs7O09BR0c7SUFDSCxJQUNJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsSUFDSSxRQUFRLENBQ1YsUUFJcUM7UUFFckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUFvRDtRQUM5RCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILElBQ0ksWUFBWSxDQUFDLFNBQWtC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QURmLEtBQUs7Z0JBV0YsT0FBTztzQkFEVixLQUFLO2dCQVdGLE1BQU07c0JBRFQsS0FBSztnQkFVYSxRQUFRO3NCQUExQixNQUFNO2dCQU9ZLE9BQU87c0JBQXpCLE1BQU07Z0JBT1ksVUFBVTtzQkFBNUIsTUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQUlZLGlCQUFpQjtzQkFBbkMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGluamVjdCxcbiAgRXZlbnRFbWl0dGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWFwQW5jaG9yUG9pbnR9IGZyb20gJy4uL21hcC1hbmNob3ItcG9pbnQnO1xuXG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIEdvb2dsZSBNYXBzIG1hcmtlciBjb21wb25lbnQuIERpc3BsYXlzIGEgbWFya2VyXG4gKiBhdCB0aGUgR29vZ2xlcGxleC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFSS0VSX09QVElPTlMgPSB7XG4gIHBvc2l0aW9uOiB7bGF0OiAzNy4yMjE5OTUsIGxuZzogLTEyMi4xODQwOTJ9LFxufTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBtYXJrZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWFkdmFuY2VkLW1hcmtlcicsXG4gIGV4cG9ydEFzOiAnbWFwQWR2YW5jZWRNYXJrZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBBZHZhbmNlZE1hcmtlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE1hcEFuY2hvclBvaW50IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG5cbiAgLyoqXG4gICAqIFJvbGxvdmVyIHRleHQuIElmIHByb3ZpZGVkLCBhbiBhY2Nlc3NpYmlsaXR5IHRleHQgKGUuZy4gZm9yIHVzZSB3aXRoIHNjcmVlbiByZWFkZXJzKSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucy50aXRsZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHRpdGxlKHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICB9XG4gIHByaXZhdGUgX3RpdGxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCdzIHBvc2l0aW9uLiBBbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQgbWF5IGJlIGNvbnN0cnVjdGVkIHdpdGhvdXQgYSBwb3NpdGlvbiwgYnV0IHdpbGwgbm90IGJlIGRpc3BsYXllZCB1bnRpbCBpdHMgcG9zaXRpb24gaXMgcHJvdmlkZWQgLSBmb3IgZXhhbXBsZSwgYnkgYSB1c2VyJ3MgYWN0aW9ucyBvciBjaG9pY2VzLiBBbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQncyBwb3NpdGlvbiBjYW4gYmUgcHJvdmlkZWQgYnkgc2V0dGluZyBBZHZhbmNlZE1hcmtlckVsZW1lbnQucG9zaXRpb24gaWYgbm90IHByb3ZpZGVkIGF0IHRoZSBjb25zdHJ1Y3Rpb24uXG4gICAqIE5vdGU6IEFkdmFuY2VkTWFya2VyRWxlbWVudCB3aXRoIGFsdGl0dWRlIGlzIG9ubHkgc3VwcG9ydGVkIG9uIHZlY3RvciBtYXBzLlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLnBvc2l0aW9uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24oXG4gICAgcG9zaXRpb246XG4gICAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nXG4gICAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0FsdGl0dWRlXG4gICAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0FsdGl0dWRlTGl0ZXJhbCxcbiAgKSB7XG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgfVxuICBwcml2YXRlIF9wb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZztcblxuICAvKipcbiAgICogVGhlIERPTSBFbGVtZW50IGJhY2tpbmcgdGhlIHZpc3VhbCBvZiBhbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQuXG4gICAqIE5vdGU6IEFkdmFuY2VkTWFya2VyRWxlbWVudCBkb2VzIG5vdCBjbG9uZSB0aGUgcGFzc2VkLWluIERPTSBlbGVtZW50LiBPbmNlIHRoZSBET00gZWxlbWVudCBpcyBwYXNzZWQgdG8gYW4gQWR2YW5jZWRNYXJrZXJFbGVtZW50LCBwYXNzaW5nIHRoZSBzYW1lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgQWR2YW5jZWRNYXJrZXJFbGVtZW50IHdpbGwgbW92ZSB0aGUgRE9NIGVsZW1lbnQgYW5kIGNhdXNlIHRoZSBwcmV2aW91cyBBZHZhbmNlZE1hcmtlckVsZW1lbnQgdG8gbG9vayBlbXB0eS5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLmNvbnRlbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBjb250ZW50KGNvbnRlbnQ6IE5vZGUgfCBnb29nbGUubWFwcy5tYXJrZXIuUGluRWxlbWVudCB8IG51bGwpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcbiAgfVxuICBwcml2YXRlIF9jb250ZW50OiBOb2RlIHwgbnVsbDtcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCBjYW4gYmUgZHJhZ2dlZC5cbiAgICogTm90ZTogQWR2YW5jZWRNYXJrZXJFbGVtZW50IHdpdGggYWx0aXR1ZGUgaXMgbm90IGRyYWdnYWJsZS5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucy5nbXBEcmFnZ2FibGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBnbXBEcmFnZ2FibGUoZHJhZ2dhYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZHJhZ2dhYmxlID0gZHJhZ2dhYmxlO1xuICB9XG4gIHByaXZhdGUgX2RyYWdnYWJsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgY29uc3RydWN0aW5nIGFuIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICBwcml2YXRlIF9vcHRpb25zOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucztcblxuICAvKipcbiAgICogQWR2YW5jZWRNYXJrZXJFbGVtZW50cyBvbiB0aGUgbWFwIGFyZSBwcmlvcml0aXplZCBieSB6SW5kZXgsIHdpdGggaGlnaGVyIHZhbHVlcyBpbmRpY2F0aW5nIGhpZ2hlciBkaXNwbGF5LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLnpJbmRleFxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHpJbmRleCh6SW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuX3pJbmRleCA9IHpJbmRleDtcbiAgfVxuICBwcml2YXRlIF96SW5kZXg6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQgZWxlbWVudCBpcyBjbGlja2VkLlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnQuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIHJlcGVhdGVkbHkgZmlyZWQgd2hpbGUgdGhlIHVzZXIgZHJhZ3MgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50LmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIHN0b3BzIGRyYWdnaW5nIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudC5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBzdGFydHMgZHJhZ2dpbmcgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50LmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtYXJrZXIgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXJrZXJJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudFxuICAgKi9cbiAgYWR2YW5jZWRNYXJrZXI6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChnb29nbGUubWFwcy5tYXJrZXI/LkFkdmFuY2VkTWFya2VyRWxlbWVudCAmJiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwKSB7XG4gICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5fZ29vZ2xlTWFwLl9yZXNvbHZlTWFwKCksIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ21hcmtlcicpXSkudGhlbihcbiAgICAgICAgICAoW21hcCwgbGliXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIChsaWIgYXMgZ29vZ2xlLm1hcHMuTWFya2VyTGlicmFyeSkuQWR2YW5jZWRNYXJrZXJFbGVtZW50KTtcbiAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZShcbiAgICBtYXA6IGdvb2dsZS5tYXBzLk1hcCxcbiAgICBhZHZhbmNlZE1hcmtlckNvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudCxcbiAgKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuYWR2YW5jZWRNYXJrZXIgPSBuZXcgYWR2YW5jZWRNYXJrZXJDb25zdHJ1Y3Rvcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLmFkdmFuY2VkTWFya2VyLm1hcCA9IG1hcDtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5hZHZhbmNlZE1hcmtlcik7XG4gICAgICB0aGlzLm1hcmtlckluaXRpYWxpemVkLm5leHQodGhpcy5hZHZhbmNlZE1hcmtlcik7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qge2FkdmFuY2VkTWFya2VyLCBfY29udGVudCwgX3Bvc2l0aW9uLCBfdGl0bGUsIF9kcmFnZ2FibGUsIF96SW5kZXh9ID0gdGhpcztcbiAgICBpZiAoYWR2YW5jZWRNYXJrZXIpIHtcbiAgICAgIGlmIChjaGFuZ2VzWyd0aXRsZSddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLnRpdGxlID0gX3RpdGxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snY29udGVudCddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLmNvbnRlbnQgPSBfY29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2dtcERyYWdnYWJsZSddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLmdtcERyYWdnYWJsZSA9IF9kcmFnZ2FibGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydjb250ZW50J10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuY29udGVudCA9IF9jb250ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1sncG9zaXRpb24nXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci5wb3NpdGlvbiA9IF9wb3NpdGlvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ3pJbmRleCddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLnpJbmRleCA9IF96SW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5tYXJrZXJJbml0aWFsaXplZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG5cbiAgICBpZiAodGhpcy5hZHZhbmNlZE1hcmtlcikge1xuICAgICAgdGhpcy5hZHZhbmNlZE1hcmtlci5tYXAgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldEFuY2hvcigpOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmFkdmFuY2VkTWFya2VyO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBjb21iaW5lZCBvcHRpb25zIG9iamVjdCB1c2luZyB0aGUgcGFzc2VkLWluIG9wdGlvbnMgYW5kIHRoZSBpbmRpdmlkdWFsIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IERFRkFVTFRfTUFSS0VSX09QVElPTlM7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0aXRsZTogdGhpcy5fdGl0bGUgfHwgb3B0aW9ucy50aXRsZSxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLl9wb3NpdGlvbiB8fCBvcHRpb25zLnBvc2l0aW9uLFxuICAgICAgY29udGVudDogdGhpcy5fY29udGVudCB8fCBvcHRpb25zLmNvbnRlbnQsXG4gICAgICB6SW5kZXg6IHRoaXMuX3pJbmRleCA/PyBvcHRpb25zLnpJbmRleCxcbiAgICAgIGdtcERyYWdnYWJsZTogdGhpcy5fZHJhZ2dhYmxlID8/IG9wdGlvbnMuZ21wRHJhZ2dhYmxlLFxuICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLFxuICAgIH07XG4gIH1cblxuICAvKiogQXNzZXJ0cyB0aGF0IHRoZSBtYXAgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7bWFya2VyOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50fSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmFkdmFuY2VkTWFya2VyKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgTWFya2VyIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBNYXJrZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==