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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.1", ngImport: i0, type: MapAdvancedMarker, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.1", type: MapAdvancedMarker, isStandalone: true, selector: "map-advanced-marker", inputs: { title: "title", position: "position", content: "content", gmpDraggable: "gmpDraggable", options: "options", zIndex: "zIndex" }, outputs: { mapClick: "mapClick", mapDrag: "mapDrag", mapDragend: "mapDragend", mapDragstart: "mapDragstart", markerInitialized: "markerInitialized" }, exportAs: ["mapAdvancedMarker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.1", ngImport: i0, type: MapAdvancedMarker, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWFkdmFuY2VkLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYWR2YW5jZWQtbWFya2VyL21hcC1hZHZhbmNlZC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFHVCxNQUFNLEVBQ04sWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7O0FBRWhDOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHO0lBQ3BDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFDO0NBQzdDLENBQUM7QUFFRjs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGlCQUFpQjtJQUc1Qjs7O09BR0c7SUFDSCxJQUNJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsSUFDSSxRQUFRLENBQ1YsUUFJcUM7UUFFckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUE2QztRQUN2RCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILElBQ0ksWUFBWSxDQUFDLFNBQWtC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Y2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBOZ1pvbmUsXG4gIERpcmVjdGl2ZSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBpbmplY3QsXG4gIEV2ZW50RW1pdHRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgR29vZ2xlIE1hcHMgbWFya2VyIGNvbXBvbmVudC4gRGlzcGxheXMgYSBtYXJrZXJcbiAqIGF0IHRoZSBHb29nbGVwbGV4LlxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9NQVJLRVJfT1BUSU9OUyA9IHtcbiAgcG9zaXRpb246IHtsYXQ6IDM3LjIyMTk5NSwgbG5nOiAtMTIyLjE4NDA5Mn0sXG59O1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIG1hcmtlciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtYWR2YW5jZWQtbWFya2VyJyxcbiAgZXhwb3J0QXM6ICdtYXBBZHZhbmNlZE1hcmtlcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEFkdmFuY2VkTWFya2VyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuXG4gIC8qKlxuICAgKiBSb2xsb3ZlciB0ZXh0LiBJZiBwcm92aWRlZCwgYW4gYWNjZXNzaWJpbGl0eSB0ZXh0IChlLmcuIGZvciB1c2Ugd2l0aCBzY3JlZW4gcmVhZGVycykgd2lsbCBiZSBhZGRlZCB0byB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50IHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMudGl0bGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB0aXRsZTtcbiAgfVxuICBwcml2YXRlIF90aXRsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBBZHZhbmNlZE1hcmtlckVsZW1lbnQncyBwb3NpdGlvbi4gQW4gQWR2YW5jZWRNYXJrZXJFbGVtZW50IG1heSBiZSBjb25zdHJ1Y3RlZCB3aXRob3V0IGEgcG9zaXRpb24sIGJ1dCB3aWxsIG5vdCBiZSBkaXNwbGF5ZWQgdW50aWwgaXRzIHBvc2l0aW9uIGlzIHByb3ZpZGVkIC0gZm9yIGV4YW1wbGUsIGJ5IGEgdXNlcidzIGFjdGlvbnMgb3IgY2hvaWNlcy4gQW4gQWR2YW5jZWRNYXJrZXJFbGVtZW50J3MgcG9zaXRpb24gY2FuIGJlIHByb3ZpZGVkIGJ5IHNldHRpbmcgQWR2YW5jZWRNYXJrZXJFbGVtZW50LnBvc2l0aW9uIGlmIG5vdCBwcm92aWRlZCBhdCB0aGUgY29uc3RydWN0aW9uLlxuICAgKiBOb3RlOiBBZHZhbmNlZE1hcmtlckVsZW1lbnQgd2l0aCBhbHRpdHVkZSBpcyBvbmx5IHN1cHBvcnRlZCBvbiB2ZWN0b3IgbWFwcy5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucy5wb3NpdGlvblxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHBvc2l0aW9uKFxuICAgIHBvc2l0aW9uOlxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsXG4gICAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ1xuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdBbHRpdHVkZVxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdBbHRpdHVkZUxpdGVyYWwsXG4gICkge1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gIH1cbiAgcHJpdmF0ZSBfcG9zaXRpb246IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCBnb29nbGUubWFwcy5MYXRMbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBET00gRWxlbWVudCBiYWNraW5nIHRoZSB2aXN1YWwgb2YgYW4gQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBOb3RlOiBBZHZhbmNlZE1hcmtlckVsZW1lbnQgZG9lcyBub3QgY2xvbmUgdGhlIHBhc3NlZC1pbiBET00gZWxlbWVudC4gT25jZSB0aGUgRE9NIGVsZW1lbnQgaXMgcGFzc2VkIHRvIGFuIEFkdmFuY2VkTWFya2VyRWxlbWVudCwgcGFzc2luZyB0aGUgc2FtZSBET00gZWxlbWVudCB0byBhbm90aGVyIEFkdmFuY2VkTWFya2VyRWxlbWVudCB3aWxsIG1vdmUgdGhlIERPTSBlbGVtZW50IGFuZCBjYXVzZSB0aGUgcHJldmlvdXMgQWR2YW5jZWRNYXJrZXJFbGVtZW50IHRvIGxvb2sgZW1wdHkuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucy5jb250ZW50XG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgY29udGVudChjb250ZW50OiBOb2RlIHwgZ29vZ2xlLm1hcHMubWFya2VyLlBpbkVsZW1lbnQpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcbiAgfVxuICBwcml2YXRlIF9jb250ZW50OiBOb2RlO1xuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50IGNhbiBiZSBkcmFnZ2VkLlxuICAgKiBOb3RlOiBBZHZhbmNlZE1hcmtlckVsZW1lbnQgd2l0aCBhbHRpdHVkZSBpcyBub3QgZHJhZ2dhYmxlLlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zLmdtcERyYWdnYWJsZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGdtcERyYWdnYWJsZShkcmFnZ2FibGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kcmFnZ2FibGUgPSBkcmFnZ2FibGU7XG4gIH1cbiAgcHJpdmF0ZSBfZHJhZ2dhYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIGZvciBjb25zdHJ1Y3RpbmcgYW4gQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50T3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBBZHZhbmNlZE1hcmtlckVsZW1lbnRzIG9uIHRoZSBtYXAgYXJlIHByaW9yaXRpemVkIGJ5IHpJbmRleCwgd2l0aCBoaWdoZXIgdmFsdWVzIGluZGljYXRpbmcgaGlnaGVyIGRpc3BsYXkuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudE9wdGlvbnMuekluZGV4XG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgekluZGV4KHpJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fekluZGV4ID0gekluZGV4O1xuICB9XG4gIHByaXZhdGUgX3pJbmRleDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudCBlbGVtZW50IGlzIGNsaWNrZWQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9hZHZhbmNlZC1tYXJrZXJzI0FkdmFuY2VkTWFya2VyRWxlbWVudC5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgcmVwZWF0ZWRseSBmaXJlZCB3aGlsZSB0aGUgdXNlciBkcmFncyB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnQuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHVzZXIgc3RvcHMgZHJhZ2dpbmcgdGhlIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50LmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIHN0YXJ0cyBkcmFnZ2luZyB0aGUgQWR2YW5jZWRNYXJrZXJFbGVtZW50LlxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvYWR2YW5jZWQtbWFya2VycyNBZHZhbmNlZE1hcmtlckVsZW1lbnQuZHJhZ3N0YXJ0XG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1hcmtlciBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcmtlckluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudD4oKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudCBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2FkdmFuY2VkLW1hcmtlcnMjQWR2YW5jZWRNYXJrZXJFbGVtZW50XG4gICAqL1xuICBhZHZhbmNlZE1hcmtlcjogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGdvb2dsZS5tYXBzLm1hcmtlcj8uQWR2YW5jZWRNYXJrZXJFbGVtZW50ICYmIHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpemUodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCwgZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIFByb21pc2UuYWxsKFt0aGlzLl9nb29nbGVNYXAuX3Jlc29sdmVNYXAoKSwgZ29vZ2xlLm1hcHMuaW1wb3J0TGlicmFyeSgnbWFya2VyJyldKS50aGVuKFxuICAgICAgICAgIChbbWFwLCBsaWJdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKG1hcCwgKGxpYiBhcyBnb29nbGUubWFwcy5NYXJrZXJMaWJyYXJ5KS5BZHZhbmNlZE1hcmtlckVsZW1lbnQpO1xuICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIG1hcDogZ29vZ2xlLm1hcHMuTWFwLFxuICAgIGFkdmFuY2VkTWFya2VyQ29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy5tYXJrZXIuQWR2YW5jZWRNYXJrZXJFbGVtZW50LFxuICApIHtcbiAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5hZHZhbmNlZE1hcmtlciA9IG5ldyBhZHZhbmNlZE1hcmtlckNvbnN0cnVjdG9yKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuYWR2YW5jZWRNYXJrZXIubWFwID0gbWFwO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmFkdmFuY2VkTWFya2VyKTtcbiAgICAgIHRoaXMubWFya2VySW5pdGlhbGl6ZWQubmV4dCh0aGlzLmFkdmFuY2VkTWFya2VyKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7YWR2YW5jZWRNYXJrZXIsIF9jb250ZW50LCBfcG9zaXRpb24sIF90aXRsZSwgX2RyYWdnYWJsZSwgX3pJbmRleH0gPSB0aGlzO1xuICAgIGlmIChhZHZhbmNlZE1hcmtlcikge1xuICAgICAgaWYgKGNoYW5nZXNbJ3RpdGxlJ10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIudGl0bGUgPSBfdGl0bGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydjb250ZW50J10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuY29udGVudCA9IF9jb250ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snZ21wRHJhZ2dhYmxlJ10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuZ21wRHJhZ2dhYmxlID0gX2RyYWdnYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2NvbnRlbnQnXSkge1xuICAgICAgICBhZHZhbmNlZE1hcmtlci5jb250ZW50ID0gX2NvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddKSB7XG4gICAgICAgIGFkdmFuY2VkTWFya2VyLnBvc2l0aW9uID0gX3Bvc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snekluZGV4J10pIHtcbiAgICAgICAgYWR2YW5jZWRNYXJrZXIuekluZGV4ID0gX3pJbmRleDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLm1hcmtlckluaXRpYWxpemVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgY29tYmluZWQgb3B0aW9ucyBvYmplY3QgdXNpbmcgdGhlIHBhc3NlZC1pbiBvcHRpb25zIGFuZCB0aGUgaW5kaXZpZHVhbCBpbnB1dHMuICovXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IGdvb2dsZS5tYXBzLm1hcmtlci5BZHZhbmNlZE1hcmtlckVsZW1lbnRPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCBERUZBVUxUX01BUktFUl9PUFRJT05TO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdGl0bGU6IHRoaXMuX3RpdGxlIHx8IG9wdGlvbnMudGl0bGUsXG4gICAgICBwb3NpdGlvbjogdGhpcy5fcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgIGNvbnRlbnQ6IHRoaXMuX2NvbnRlbnQgfHwgb3B0aW9ucy5jb250ZW50LFxuICAgICAgekluZGV4OiB0aGlzLl96SW5kZXggPz8gb3B0aW9ucy56SW5kZXgsXG4gICAgICBnbXBEcmFnZ2FibGU6IHRoaXMuX2RyYWdnYWJsZSA/PyBvcHRpb25zLmdtcERyYWdnYWJsZSxcbiAgICAgIG1hcDogdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCxcbiAgICB9O1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlcjogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudH0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5hZHZhbmNlZE1hcmtlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIE1hcmtlciBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgTWFya2VyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=