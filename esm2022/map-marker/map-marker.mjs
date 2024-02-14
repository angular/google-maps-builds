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
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 */
export const DEFAULT_MARKER_OPTIONS = {
    position: { lat: 37.421995, lng: -122.084092 },
};
/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/marker
 */
export class MapMarker {
    /**
     * Title of the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.title
     */
    set title(title) {
        this._title = title;
    }
    /**
     * Position of the marker. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.position
     */
    set position(position) {
        this._position = position;
    }
    /**
     * Label for the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.label
     */
    set label(label) {
        this._label = label;
    }
    /**
     * Whether the marker is clickable. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.clickable
     */
    set clickable(clickable) {
        this._clickable = clickable;
    }
    /**
     * Options used to configure the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
     */
    set options(options) {
        this._options = options;
    }
    /**
     * Icon to be used for the marker.
     * See: https://developers.google.com/maps/documentation/javascript/reference/marker#Icon
     */
    set icon(icon) {
        this._icon = icon;
    }
    /**
     * Whether the marker is visible.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.visible
     */
    set visible(value) {
        this._visible = value;
    }
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
         */
        this.animationChanged = this._eventManager.getLazyEmitter('animation_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
         */
        this.mapClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
         */
        this.clickableChanged = this._eventManager.getLazyEmitter('clickable_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
         */
        this.cursorChanged = this._eventManager.getLazyEmitter('cursor_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
         */
        this.mapDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
         */
        this.mapDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
         */
        this.draggableChanged = this._eventManager.getLazyEmitter('draggable_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
         */
        this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
         */
        this.flatChanged = this._eventManager.getLazyEmitter('flat_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
         */
        this.iconChanged = this._eventManager.getLazyEmitter('icon_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
         */
        this.mapMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
         */
        this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
         */
        this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
         */
        this.mapMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
         */
        this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
         */
        this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
         */
        this.shapeChanged = this._eventManager.getLazyEmitter('shape_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
         */
        this.titleChanged = this._eventManager.getLazyEmitter('title_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
         */
        this.visibleChanged = this._eventManager.getLazyEmitter('visible_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
         */
        this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
        /** Event emitted when the marker is initialized. */
        this.markerInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (!this._googleMap._isBrowser) {
            return;
        }
        if (google.maps.Marker && this._googleMap.googleMap) {
            this._initialize(this._googleMap.googleMap, google.maps.Marker);
        }
        else {
            this._ngZone.runOutsideAngular(() => {
                Promise.all([this._googleMap._resolveMap(), google.maps.importLibrary('marker')]).then(([map, lib]) => {
                    this._initialize(map, lib.Marker);
                });
            });
        }
    }
    _initialize(map, markerConstructor) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.marker = new markerConstructor(this._combineOptions());
            this._assertInitialized();
            this.marker.setMap(map);
            this._eventManager.setTarget(this.marker);
            this.markerInitialized.next(this.marker);
        });
    }
    ngOnChanges(changes) {
        const { marker, _title, _position, _label, _clickable, _icon, _visible } = this;
        if (marker) {
            if (changes['options']) {
                marker.setOptions(this._combineOptions());
            }
            if (changes['title'] && _title !== undefined) {
                marker.setTitle(_title);
            }
            if (changes['position'] && _position) {
                marker.setPosition(_position);
            }
            if (changes['label'] && _label !== undefined) {
                marker.setLabel(_label);
            }
            if (changes['clickable'] && _clickable !== undefined) {
                marker.setClickable(_clickable);
            }
            if (changes['icon'] && _icon) {
                marker.setIcon(_icon);
            }
            if (changes['visible'] && _visible !== undefined) {
                marker.setVisible(_visible);
            }
        }
    }
    ngOnDestroy() {
        this.markerInitialized.complete();
        this._eventManager.destroy();
        this.marker?.setMap(null);
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
     */
    getAnimation() {
        this._assertInitialized();
        return this.marker.getAnimation() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
     */
    getClickable() {
        this._assertInitialized();
        return this.marker.getClickable();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
     */
    getCursor() {
        this._assertInitialized();
        return this.marker.getCursor() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
     */
    getDraggable() {
        this._assertInitialized();
        return !!this.marker.getDraggable();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
     */
    getIcon() {
        this._assertInitialized();
        return this.marker.getIcon() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
     */
    getLabel() {
        this._assertInitialized();
        return this.marker.getLabel() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
     */
    getOpacity() {
        this._assertInitialized();
        return this.marker.getOpacity() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
     */
    getPosition() {
        this._assertInitialized();
        return this.marker.getPosition() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
     */
    getShape() {
        this._assertInitialized();
        return this.marker.getShape() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
     */
    getTitle() {
        this._assertInitialized();
        return this.marker.getTitle() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
     */
    getVisible() {
        this._assertInitialized();
        return this.marker.getVisible();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
     */
    getZIndex() {
        this._assertInitialized();
        return this.marker.getZIndex() || null;
    }
    /** Gets the anchor point that can be used to attach other Google Maps objects. */
    getAnchor() {
        this._assertInitialized();
        return this.marker;
    }
    /** Returns a promise that resolves when the marker has been initialized. */
    _resolveMarker() {
        return this.marker
            ? Promise.resolve(this.marker)
            : this.markerInitialized.pipe(take(1)).toPromise();
    }
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    _combineOptions() {
        const options = this._options || DEFAULT_MARKER_OPTIONS;
        return {
            ...options,
            title: this._title || options.title,
            position: this._position || options.position,
            label: this._label || options.label,
            clickable: this._clickable ?? options.clickable,
            map: this._googleMap.googleMap,
            icon: this._icon || options.icon,
            visible: this._visible ?? options.visible,
        };
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.marker) {
                throw Error('Cannot interact with a Google Map Marker before it has been ' +
                    'initialized. Please wait for the Marker to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapMarker, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapMarker, isStandalone: true, selector: "map-marker", inputs: { title: "title", position: "position", label: "label", clickable: "clickable", options: "options", icon: "icon", visible: "visible" }, outputs: { animationChanged: "animationChanged", mapClick: "mapClick", clickableChanged: "clickableChanged", cursorChanged: "cursorChanged", mapDblclick: "mapDblclick", mapDrag: "mapDrag", mapDragend: "mapDragend", draggableChanged: "draggableChanged", mapDragstart: "mapDragstart", flatChanged: "flatChanged", iconChanged: "iconChanged", mapMousedown: "mapMousedown", mapMouseout: "mapMouseout", mapMouseover: "mapMouseover", mapMouseup: "mapMouseup", positionChanged: "positionChanged", mapRightclick: "mapRightclick", shapeChanged: "shapeChanged", titleChanged: "titleChanged", visibleChanged: "visibleChanged", zindexChanged: "zindexChanged", markerInitialized: "markerInitialized" }, exportAs: ["mapMarker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapMarker, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-marker',
                    exportAs: 'mapMarker',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { title: [{
                type: Input
            }], position: [{
                type: Input
            }], label: [{
                type: Input
            }], clickable: [{
                type: Input
            }], options: [{
                type: Input
            }], icon: [{
                type: Input
            }], visible: [{
                type: Input
            }], animationChanged: [{
                type: Output
            }], mapClick: [{
                type: Output
            }], clickableChanged: [{
                type: Output
            }], cursorChanged: [{
                type: Output
            }], mapDblclick: [{
                type: Output
            }], mapDrag: [{
                type: Output
            }], mapDragend: [{
                type: Output
            }], draggableChanged: [{
                type: Output
            }], mapDragstart: [{
                type: Output
            }], flatChanged: [{
                type: Output
            }], iconChanged: [{
                type: Output
            }], mapMousedown: [{
                type: Output
            }], mapMouseout: [{
                type: Output
            }], mapMouseover: [{
                type: Output
            }], mapMouseup: [{
                type: Output
            }], positionChanged: [{
                type: Output
            }], mapRightclick: [{
                type: Output
            }], shapeChanged: [{
                type: Output
            }], titleChanged: [{
                type: Output
            }], visibleChanged: [{
                type: Output
            }], zindexChanged: [{
                type: Output
            }], markerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFHVCxNQUFNLEVBQ04sWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7OztBQUdyRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRztJQUNwQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBQztDQUM3QyxDQUFDO0FBRUY7Ozs7R0FJRztBQU1ILE1BQU0sT0FBTyxTQUFTO0lBR3BCOzs7T0FHRztJQUNILElBQ0ksS0FBSyxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUdEOzs7T0FHRztJQUNILElBQ0ksUUFBUSxDQUFDLFFBQXdEO1FBQ25FLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLEtBQUssQ0FBQyxLQUF1QztRQUMvQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsSUFDSSxTQUFT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TUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQU9ZLFdBQVc7c0JBQTdCLE1BQU07Z0JBT1ksWUFBWTtzQkFBOUIsTUFBTTtnQkFPWSxVQUFVO3NCQUE1QixNQUFNO2dCQU9ZLGVBQWU7c0JBQWpDLE1BQU07Z0JBT1ksYUFBYTtzQkFBL0IsTUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQU9ZLFlBQVk7c0JBQTlCLE1BQU07Z0JBT1ksY0FBYztzQkFBaEMsTUFBTTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNO2dCQUlZLGlCQUFpQjtzQkFBbkMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGluamVjdCxcbiAgRXZlbnRFbWl0dGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtNYXBBbmNob3JQb2ludH0gZnJvbSAnLi4vbWFwLWFuY2hvci1wb2ludCc7XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgR29vZ2xlIE1hcHMgbWFya2VyIGNvbXBvbmVudC4gRGlzcGxheXMgYSBtYXJrZXJcbiAqIGF0IHRoZSBHb29nbGVwbGV4LlxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9NQVJLRVJfT1BUSU9OUyA9IHtcbiAgcG9zaXRpb246IHtsYXQ6IDM3LjQyMTk5NSwgbG5nOiAtMTIyLjA4NDA5Mn0sXG59O1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIG1hcmtlciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtbWFya2VyJyxcbiAgZXhwb3J0QXM6ICdtYXBNYXJrZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBNYXBBbmNob3JQb2ludCB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuXG4gIC8qKlxuICAgKiBUaXRsZSBvZiB0aGUgbWFya2VyLlxuICAgKiBTZWU6IGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlck9wdGlvbnMudGl0bGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB0aXRsZTtcbiAgfVxuICBwcml2YXRlIF90aXRsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgbWFya2VyLiBTZWU6XG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlck9wdGlvbnMucG9zaXRpb25cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gIH1cbiAgcHJpdmF0ZSBfcG9zaXRpb246IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCBnb29nbGUubWFwcy5MYXRMbmc7XG5cbiAgLyoqXG4gICAqIExhYmVsIGZvciB0aGUgbWFya2VyLlxuICAgKiBTZWU6IGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlck9wdGlvbnMubGFiZWxcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBsYWJlbChsYWJlbDogc3RyaW5nIHwgZ29vZ2xlLm1hcHMuTWFya2VyTGFiZWwpIHtcbiAgICB0aGlzLl9sYWJlbCA9IGxhYmVsO1xuICB9XG4gIHByaXZhdGUgX2xhYmVsOiBzdHJpbmcgfCBnb29nbGUubWFwcy5NYXJrZXJMYWJlbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbWFya2VyIGlzIGNsaWNrYWJsZS4gU2VlOlxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJPcHRpb25zLmNsaWNrYWJsZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGNsaWNrYWJsZShjbGlja2FibGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jbGlja2FibGUgPSBjbGlja2FibGU7XG4gIH1cbiAgcHJpdmF0ZSBfY2xpY2thYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIHVzZWQgdG8gY29uZmlndXJlIHRoZSBtYXJrZXIuXG4gICAqIFNlZTogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyT3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEljb24gdG8gYmUgdXNlZCBmb3IgdGhlIG1hcmtlci5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI0ljb25cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBpY29uKGljb246IHN0cmluZyB8IGdvb2dsZS5tYXBzLkljb24gfCBnb29nbGUubWFwcy5TeW1ib2wpIHtcbiAgICB0aGlzLl9pY29uID0gaWNvbjtcbiAgfVxuICBwcml2YXRlIF9pY29uOiBzdHJpbmcgfCBnb29nbGUubWFwcy5JY29uIHwgZ29vZ2xlLm1hcHMuU3ltYm9sO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBtYXJrZXIgaXMgdmlzaWJsZS5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJPcHRpb25zLnZpc2libGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX3Zpc2libGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuYW5pbWF0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2FuaW1hdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmNsaWNrYWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xpY2thYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbGlja2FibGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmN1cnNvcl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY3Vyc29yQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjdXJzb3JfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdnYWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZHJhZ2dhYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZ2FibGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5mbGF0X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBmbGF0Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdmbGF0X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5pY29uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBpY29uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdpY29uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBNb3VzZWRvd246IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2Vkb3duJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcE1vdXNlb3ZlcjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2V1cDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIucG9zaXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvc2l0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdwb3NpdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnNoYXBlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzaGFwZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignc2hhcGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnRpdGxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0aXRsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndGl0bGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnZpc2libGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZpc2libGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Zpc2libGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnppbmRleF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgemluZGV4Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd6aW5kZXhfY2hhbmdlZCcpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1hcmtlciBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcmtlckluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFya2VyPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5NYXJrZXI+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLk1hcmtlciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJcbiAgICovXG4gIG1hcmtlcj86IGdvb2dsZS5tYXBzLk1hcmtlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZ29vZ2xlLm1hcHMuTWFya2VyICYmIHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpemUodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCwgZ29vZ2xlLm1hcHMuTWFya2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgUHJvbWlzZS5hbGwoW3RoaXMuX2dvb2dsZU1hcC5fcmVzb2x2ZU1hcCgpLCBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdtYXJrZXInKV0pLnRoZW4oXG4gICAgICAgICAgKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLk1hcmtlckxpYnJhcnkpLk1hcmtlcik7XG4gICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUobWFwOiBnb29nbGUubWFwcy5NYXAsIG1hcmtlckNvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMuTWFya2VyKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMubWFya2VyID0gbmV3IG1hcmtlckNvbnN0cnVjdG9yKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMubWFya2VyLnNldE1hcChtYXApO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLm1hcmtlcik7XG4gICAgICB0aGlzLm1hcmtlckluaXRpYWxpemVkLm5leHQodGhpcy5tYXJrZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHttYXJrZXIsIF90aXRsZSwgX3Bvc2l0aW9uLCBfbGFiZWwsIF9jbGlja2FibGUsIF9pY29uLCBfdmlzaWJsZX0gPSB0aGlzO1xuXG4gICAgaWYgKG1hcmtlcikge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICBtYXJrZXIuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ3RpdGxlJ10gJiYgX3RpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWFya2VyLnNldFRpdGxlKF90aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddICYmIF9wb3NpdGlvbikge1xuICAgICAgICBtYXJrZXIuc2V0UG9zaXRpb24oX3Bvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2xhYmVsJ10gJiYgX2xhYmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWFya2VyLnNldExhYmVsKF9sYWJlbCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydjbGlja2FibGUnXSAmJiBfY2xpY2thYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWFya2VyLnNldENsaWNrYWJsZShfY2xpY2thYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2ljb24nXSAmJiBfaWNvbikge1xuICAgICAgICBtYXJrZXIuc2V0SWNvbihfaWNvbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWyd2aXNpYmxlJ10gJiYgX3Zpc2libGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtYXJrZXIuc2V0VmlzaWJsZShfdmlzaWJsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5tYXJrZXJJbml0aWFsaXplZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5tYXJrZXI/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEFuaW1hdGlvblxuICAgKi9cbiAgZ2V0QW5pbWF0aW9uKCk6IGdvb2dsZS5tYXBzLkFuaW1hdGlvbiB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldEFuaW1hdGlvbigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRDbGlja2FibGVcbiAgICovXG4gIGdldENsaWNrYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRDbGlja2FibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEN1cnNvclxuICAgKi9cbiAgZ2V0Q3Vyc29yKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldEN1cnNvcigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiAhIXRoaXMubWFya2VyLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0SWNvblxuICAgKi9cbiAgZ2V0SWNvbigpOiBzdHJpbmcgfCBnb29nbGUubWFwcy5JY29uIHwgZ29vZ2xlLm1hcHMuU3ltYm9sIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0SWNvbigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRMYWJlbFxuICAgKi9cbiAgZ2V0TGFiZWwoKTogZ29vZ2xlLm1hcHMuTWFya2VyTGFiZWwgfCBzdHJpbmcgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRMYWJlbCgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRPcGFjaXR5XG4gICAqL1xuICBnZXRPcGFjaXR5KCk6IG51bWJlciB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldE9wYWNpdHkoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0UG9zaXRpb25cbiAgICovXG4gIGdldFBvc2l0aW9uKCk6IGdvb2dsZS5tYXBzLkxhdExuZyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFBvc2l0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFNoYXBlXG4gICAqL1xuICBnZXRTaGFwZSgpOiBnb29nbGUubWFwcy5NYXJrZXJTaGFwZSB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFNoYXBlKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFRpdGxlXG4gICAqL1xuICBnZXRUaXRsZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRUaXRsZSgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFZpc2libGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFpJbmRleFxuICAgKi9cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFpJbmRleCgpIHx8IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYW5jaG9yIHBvaW50IHRoYXQgY2FuIGJlIHVzZWQgdG8gYXR0YWNoIG90aGVyIEdvb2dsZSBNYXBzIG9iamVjdHMuICovXG4gIGdldEFuY2hvcigpOiBnb29nbGUubWFwcy5NVkNPYmplY3Qge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgbWFya2VyIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBfcmVzb2x2ZU1hcmtlcigpOiBQcm9taXNlPGdvb2dsZS5tYXBzLk1hcmtlcj4ge1xuICAgIHJldHVybiB0aGlzLm1hcmtlclxuICAgICAgPyBQcm9taXNlLnJlc29sdmUodGhpcy5tYXJrZXIpXG4gICAgICA6IHRoaXMubWFya2VySW5pdGlhbGl6ZWQucGlwZSh0YWtlKDEpKS50b1Byb21pc2UoKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgY29tYmluZWQgb3B0aW9ucyBvYmplY3QgdXNpbmcgdGhlIHBhc3NlZC1pbiBvcHRpb25zIGFuZCB0aGUgaW5kaXZpZHVhbCBpbnB1dHMuICovXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IERFRkFVTFRfTUFSS0VSX09QVElPTlM7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0aXRsZTogdGhpcy5fdGl0bGUgfHwgb3B0aW9ucy50aXRsZSxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLl9wb3NpdGlvbiB8fCBvcHRpb25zLnBvc2l0aW9uLFxuICAgICAgbGFiZWw6IHRoaXMuX2xhYmVsIHx8IG9wdGlvbnMubGFiZWwsXG4gICAgICBjbGlja2FibGU6IHRoaXMuX2NsaWNrYWJsZSA/PyBvcHRpb25zLmNsaWNrYWJsZSxcbiAgICAgIG1hcDogdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCxcbiAgICAgIGljb246IHRoaXMuX2ljb24gfHwgb3B0aW9ucy5pY29uLFxuICAgICAgdmlzaWJsZTogdGhpcy5fdmlzaWJsZSA/PyBvcHRpb25zLnZpc2libGUsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7bWFya2VyOiBnb29nbGUubWFwcy5NYXJrZXJ9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMubWFya2VyKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgTWFya2VyIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBNYXJrZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==