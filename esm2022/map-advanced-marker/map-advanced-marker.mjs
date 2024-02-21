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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWFkdmFuY2VkLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYWR2YW5jZWQtbWFya2VyL21hcC1hZHZhbmNlZC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFHVCxNQUFNLEVBQ04sWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7O0FBRWhDOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHO0lBQ3BDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFDO0NBQzdDLENBQUM7QUFFRjs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGlCQUFpQjtJQUc1Qjs7O09BR0c7SUFDSCxJQUNJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsSUFDSSxRQUFRLENBQ1YsUUFJcUM7UUFFckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUE2QztRQUN2RCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILElBQ0ksWUFBWSxDQUFDLFNBQWtC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QU87c0JBQXpCLE1BQU07Z0JBT1ksVUFBVTtzQkFBNUIsTUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQUlZLGlCQUFpQjtzQkFBbkMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGluamVjdCxcbiAgRXZlbnRFbWl0dGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBHb29nbGUgTWFwcyBtYXJrZXIgY29tcG9uZW50LiBEaXNwbGF5cyBhIG1hcmtlclxuICogYXQgdGhlIEdvb2dsZXBsZXguXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX01BUktFUl9PUFRJT05TID0ge1xuICBwb3NpdGlvbjoge2xhdDogMzcuMjIxOTk1LCBsbmc6IC0xMjIuMTg0MDkyfSxcbn07XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgbWFya2VyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1hZHZhbmNlZC1tYXJrZXInLFxuICBleHBvcnRBczogJ21hcEFkdmFuY2VkTWFya2VyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwQWR2YW5jZWRNYXJrZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG5cbiAgLyoqXG4gICAqIFJvbGxvdmVyIHRleHQuIElmIHByb3ZpZGVkLCBhbiBhY2Nlc3NpYmlsaXR5IHRleHQgKGUuZy4gZm9yIHVzZSB3aXRoIHNjcmVlbiByZWFkZXJzKSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucy50aXRsZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHRpdGxlKHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICB9XG4gIHByaXZhdGUgX3RpdGxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCdzIHBvc2l0aW9uLiBBbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQgbWF5IGJlIGNvbnN0cnVjdGVkIHdpdGhvdXQgYSBwb3NpdGlvbiwgYnV0IHdpbGwgbm90IGJlIGRpc3BsYXllZCB1bnRpbCBpdHMgcG9zaXRpb24gaXMgcHJvdmlkZWQgLSBmb3IgZXhhbXBsZSwgYnkgYSB1c2VyJ3MgYWN0aW9ucyBvciBjaG9pY2VzLiBBbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQncyBwb3NpdGlvbiBjYW4gYmUgcHJvdmlkZWQgYnkgc2V0dGluZyBBZHZhbmNlZE1hcmtlckVsZW1lbnQucG9zaXRpb24gaWYgbm90IHByb3ZpZGVkIGF0IHRoZSBjb25zdHJ1Y3Rpb24uXG4gICAqIE5vdGU6IEFkdmFuY2VkTWFya2VyRWxlbWVudCB3aXRoIGFsdGl0dWRlIGlzIG9ubHkgc3VwcG9ydGVkIG9uIHZlY3RvciBtYXBzLlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLnBvc2l0aW9uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24oXG4gICAgcG9zaXRpb246XG4gICAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nXG4gICAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0FsdGl0dWRlXG4gICAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0FsdGl0dWRlTGl0ZXJhbCxcbiAgKSB7XG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgfVxuICBwcml2YXRlIF9wb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZztcblxuICAvKipcbiAgICogVGhlIERPTSBFbGVtZW50IGJhY2tpbmcgdGhlIHZpc3VhbCBvZiBhbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQuXG4gICAqIE5vdGU6IEFkdmFuY2VkTWFya2VyRWxlbWVudCBkb2VzIG5vdCBjbG9uZSB0aGUgcGFzc2VkLWluIERPTSBlbGVtZW50LiBPbmNlIHRoZSBET00gZWxlbWVudCBpcyBwYXNzZWQgdG8gYW4gQWR2YW5jZWRNYXJrZXJFbGVtZW50LCBwYXNzaW5nIHRoZSBzYW1lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgQWR2YW5jZWRNYXJrZXJFbGVtZW50IHdpbGwgbW92ZSB0aGUgRE9NIGVsZW1lbnQgYW5kIGNhdXNlIHRoZSBwcmV2aW91cyBBZHZhbmNlZE1hcmtlckVsZW1lbnQgdG8gbG9vayBlbXB0eS5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLmNvbnRlbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBjb250ZW50KGNvbnRlbnQ6IE5vZGUgfCBnb29nbGUubWFwcy5tYXJrZXIuUGluRWxlbWVudCkge1xuICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xuICB9XG4gIHByaXZhdGUgX2NvbnRlbnQ6IE5vZGU7XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQgY2FuIGJlIGRyYWdnZWQuXG4gICAqIE5vdGU6IEFkdmFuY2VkTWFya2VyRWxlbWVudCB3aXRoIGFsdGl0dWRlIGlzIG5vdCBkcmFnZ2FibGUuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMuZ21wRHJhZ2dhYmxlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgZ21wRHJhZ2dhYmxlKGRyYWdnYWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2RyYWdnYWJsZSA9IGRyYWdnYWJsZTtcbiAgfVxuICBwcml2YXRlIF9kcmFnZ2FibGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIGNvbnN0cnVjdGluZyBhbiBBZHZhbmNlZE1hcmtlckVsZW1lbnQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEFkdmFuY2VkTWFya2VyRWxlbWVudHMgb24gdGhlIG1hcCBhcmUgcHJpb3JpdGl6ZWQgYnkgekluZGV4LCB3aXRoIGhpZ2hlciB2YWx1ZXMgaW5kaWNhdGluZyBoaWdoZXIgZGlzcGxheS5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucy56SW5kZXhcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCB6SW5kZXgoekluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLl96SW5kZXggPSB6SW5kZXg7XG4gIH1cbiAgcHJpdmF0ZSBfekluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50IGVsZW1lbnQgaXMgY2xpY2tlZC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50LmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyByZXBlYXRlZGx5IGZpcmVkIHdoaWxlIHRoZSB1c2VyIGRyYWdzIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudC5kcmFnXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBzdG9wcyBkcmFnZ2luZyB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnQuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHVzZXIgc3RhcnRzIGRyYWdnaW5nIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudC5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWFya2VyIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFya2VySW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50IG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRcbiAgICovXG4gIGFkdmFuY2VkTWFya2VyOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZ29vZ2xlLm1hcHMubWFya2VyPy5BZHZhbmNlZE1hcmtlckVsZW1lbnQgJiYgdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgUHJvbWlzZS5hbGwoW3RoaXMuX2dvb2dsZU1hcC5fcmVzb2x2ZU1hcCgpLCBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdtYXJrZXInKV0pLnRoZW4oXG4gICAgICAgICAgKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLk1hcmtlckxpYnJhcnkpLkFkdmFuY2VkTWFya2VyRWxlbWVudCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUoXG4gICAgbWFwOiBnb29nbGUubWFwcy5NYXAsXG4gICAgYWR2YW5jZWRNYXJrZXJDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnQsXG4gICkge1xuICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmFkdmFuY2VkTWFya2VyID0gbmV3IGFkdmFuY2VkTWFya2VyQ29uc3RydWN0b3IodGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5hZHZhbmNlZE1hcmtlci5tYXAgPSBtYXA7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuYWR2YW5jZWRNYXJrZXIpO1xuICAgICAgdGhpcy5tYXJrZXJJbml0aWFsaXplZC5uZXh0KHRoaXMuYWR2YW5jZWRNYXJrZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHthZHZhbmNlZE1hcmtlciwgX2NvbnRlbnQsIF9wb3NpdGlvbiwgX3RpdGxlLCBfZHJhZ2dhYmxlLCBfekluZGV4fSA9IHRoaXM7XG4gICAgaWYgKGFkdmFuY2VkTWFya2VyKSB7XG4gICAgICBpZiAoY2hhbmdlc1sndGl0bGUnXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci50aXRsZSA9IF90aXRsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2NvbnRlbnQnXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci5jb250ZW50ID0gX2NvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydnbXBEcmFnZ2FibGUnXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci5nbXBEcmFnZ2FibGUgPSBfZHJhZ2dhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snY29udGVudCddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLmNvbnRlbnQgPSBfY29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIucG9zaXRpb24gPSBfcG9zaXRpb247XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWyd6SW5kZXgnXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci56SW5kZXggPSBfekluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMubWFya2VySW5pdGlhbGl6ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuXG4gICAgaWYgKHRoaXMuYWR2YW5jZWRNYXJrZXIpIHtcbiAgICAgIHRoaXMuYWR2YW5jZWRNYXJrZXIubWFwID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGNvbWJpbmVkIG9wdGlvbnMgb2JqZWN0IHVzaW5nIHRoZSBwYXNzZWQtaW4gb3B0aW9ucyBhbmQgdGhlIGluZGl2aWR1YWwgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgREVGQVVMVF9NQVJLRVJfT1BUSU9OUztcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHRpdGxlOiB0aGlzLl90aXRsZSB8fCBvcHRpb25zLnRpdGxlLFxuICAgICAgcG9zaXRpb246IHRoaXMuX3Bvc2l0aW9uIHx8IG9wdGlvbnMucG9zaXRpb24sXG4gICAgICBjb250ZW50OiB0aGlzLl9jb250ZW50IHx8IG9wdGlvbnMuY29udGVudCxcbiAgICAgIHpJbmRleDogdGhpcy5fekluZGV4ID8/IG9wdGlvbnMuekluZGV4LFxuICAgICAgZ21wRHJhZ2dhYmxlOiB0aGlzLl9kcmFnZ2FibGUgPz8gb3B0aW9ucy5nbXBEcmFnZ2FibGUsXG4gICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBBc3NlcnRzIHRoYXQgdGhlIG1hcCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHttYXJrZXI6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnR9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuYWR2YW5jZWRNYXJrZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBNYXJrZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIE1hcmtlciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19