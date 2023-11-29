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
import { Input, Output, NgZone, Directive, inject, } from '@angular/core';
import { Observable } from 'rxjs';
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
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.marker = new google.maps.Marker(this._combineOptions());
            });
            this._assertInitialized();
            this.marker.setMap(this._googleMap.googleMap);
            this._eventManager.setTarget(this.marker);
        }
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
        this._eventManager.destroy();
        if (this.marker) {
            this.marker.setMap(null);
        }
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
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.marker) {
                throw Error('Cannot interact with a Google Map Marker before it has been ' +
                    'initialized. Please wait for the Marker to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MapMarker, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MapMarker, isStandalone: true, selector: "map-marker", inputs: { title: "title", position: "position", label: "label", clickable: "clickable", options: "options", icon: "icon", visible: "visible" }, outputs: { animationChanged: "animationChanged", mapClick: "mapClick", clickableChanged: "clickableChanged", cursorChanged: "cursorChanged", mapDblclick: "mapDblclick", mapDrag: "mapDrag", mapDragend: "mapDragend", draggableChanged: "draggableChanged", mapDragstart: "mapDragstart", flatChanged: "flatChanged", iconChanged: "iconChanged", mapMousedown: "mapMousedown", mapMouseout: "mapMouseout", mapMouseover: "mapMouseover", mapMouseup: "mapMouseup", positionChanged: "positionChanged", mapRightclick: "mapRightclick", shapeChanged: "shapeChanged", titleChanged: "titleChanged", visibleChanged: "visibleChanged", zindexChanged: "zindexChanged" }, exportAs: ["mapMarker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MapMarker, decorators: [{
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFHVCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUVoQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFHckQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7Q0FDN0MsQ0FBQztBQUVGOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8sU0FBUztJQUdwQjs7O09BR0c7SUFDSCxJQUNJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLFFBQVEsQ0FBQyxRQUF3RDtRQUNuRSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsSUFDSSxLQUFLLENBQUMsS0FBdUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUdEOzs7T0FHRztJQUNILElBQ0ksU0FBUyxDQUFDLFNBQWtCO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlC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WSxXQUFXO3NCQUE3QixNQUFNO2dCQU9ZLFlBQVk7c0JBQTlCLE1BQU07Z0JBT1ksVUFBVTtzQkFBNUIsTUFBTTtnQkFPWSxlQUFlO3NCQUFqQyxNQUFNO2dCQU9ZLGFBQWE7c0JBQS9CLE1BQU07Z0JBT1ksWUFBWTtzQkFBOUIsTUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQU9ZLGNBQWM7c0JBQWhDLE1BQU07Z0JBT1ksYUFBYTtzQkFBL0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge01hcEFuY2hvclBvaW50fSBmcm9tICcuLi9tYXAtYW5jaG9yLXBvaW50JztcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBHb29nbGUgTWFwcyBtYXJrZXIgY29tcG9uZW50LiBEaXNwbGF5cyBhIG1hcmtlclxuICogYXQgdGhlIEdvb2dsZXBsZXguXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX01BUktFUl9PUFRJT05TID0ge1xuICBwb3NpdGlvbjoge2xhdDogMzcuNDIxOTk1LCBsbmc6IC0xMjIuMDg0MDkyfSxcbn07XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgbWFya2VyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1tYXJrZXInLFxuICBleHBvcnRBczogJ21hcE1hcmtlcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcE1hcmtlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE1hcEFuY2hvclBvaW50IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG5cbiAgLyoqXG4gICAqIFRpdGxlIG9mIHRoZSBtYXJrZXIuXG4gICAqIFNlZTogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyT3B0aW9ucy50aXRsZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHRpdGxlKHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICB9XG4gIHByaXZhdGUgX3RpdGxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBtYXJrZXIuIFNlZTpcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyT3B0aW9ucy5wb3NpdGlvblxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHBvc2l0aW9uKHBvc2l0aW9uOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHwgZ29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgfVxuICBwcml2YXRlIF9wb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZztcblxuICAvKipcbiAgICogTGFiZWwgZm9yIHRoZSBtYXJrZXIuXG4gICAqIFNlZTogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyT3B0aW9ucy5sYWJlbFxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGxhYmVsKGxhYmVsOiBzdHJpbmcgfCBnb29nbGUubWFwcy5NYXJrZXJMYWJlbCkge1xuICAgIHRoaXMuX2xhYmVsID0gbGFiZWw7XG4gIH1cbiAgcHJpdmF0ZSBfbGFiZWw6IHN0cmluZyB8IGdvb2dsZS5tYXBzLk1hcmtlckxhYmVsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBtYXJrZXIgaXMgY2xpY2thYmxlLiBTZWU6XG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlck9wdGlvbnMuY2xpY2thYmxlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgY2xpY2thYmxlKGNsaWNrYWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2NsaWNrYWJsZSA9IGNsaWNrYWJsZTtcbiAgfVxuICBwcml2YXRlIF9jbGlja2FibGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgdXNlZCB0byBjb25maWd1cmUgdGhlIG1hcmtlci5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJPcHRpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogZ29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucztcblxuICAvKipcbiAgICogSWNvbiB0byBiZSB1c2VkIGZvciB0aGUgbWFya2VyLlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjSWNvblxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGljb24oaWNvbjogc3RyaW5nIHwgZ29vZ2xlLm1hcHMuSWNvbiB8IGdvb2dsZS5tYXBzLlN5bWJvbCkge1xuICAgIHRoaXMuX2ljb24gPSBpY29uO1xuICB9XG4gIHByaXZhdGUgX2ljb246IHN0cmluZyB8IGdvb2dsZS5tYXBzLkljb24gfCBnb29nbGUubWFwcy5TeW1ib2w7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIG1hcmtlciBpcyB2aXNpYmxlLlxuICAgKiBTZWU6IGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlck9wdGlvbnMudmlzaWJsZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl92aXNpYmxlID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfdmlzaWJsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5hbmltYXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFuaW1hdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignYW5pbWF0aW9uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY2xpY2thYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbGlja2FibGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NsaWNrYWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY3Vyc29yX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjdXJzb3JDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2N1cnNvcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ2dhYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnZ2FibGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdnYWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ3N0YXJ0XG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmZsYXRfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGZsYXRDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2ZsYXRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmljb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGljb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2ljb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcE1vdXNlZG93bjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcE1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNldXBcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBNb3VzZXVwOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNldXAnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5wb3NpdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9zaXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Bvc2l0aW9uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuc2hhcGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNoYXBlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdzaGFwZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIudGl0bGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHRpdGxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aXRsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIudmlzaWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmlzaWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndmlzaWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuemluZGV4X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB6aW5kZXhDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3ppbmRleF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLk1hcmtlciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJcbiAgICovXG4gIG1hcmtlcj86IGdvb2dsZS5tYXBzLk1hcmtlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5tYXJrZXIuc2V0TWFwKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAhKTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5tYXJrZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7bWFya2VyLCBfdGl0bGUsIF9wb3NpdGlvbiwgX2xhYmVsLCBfY2xpY2thYmxlLCBfaWNvbiwgX3Zpc2libGV9ID0gdGhpcztcblxuICAgIGlmIChtYXJrZXIpIHtcbiAgICAgIGlmIChjaGFuZ2VzWydvcHRpb25zJ10pIHtcbiAgICAgICAgbWFya2VyLnNldE9wdGlvbnModGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWyd0aXRsZSddICYmIF90aXRsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1hcmtlci5zZXRUaXRsZShfdGl0bGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1sncG9zaXRpb24nXSAmJiBfcG9zaXRpb24pIHtcbiAgICAgICAgbWFya2VyLnNldFBvc2l0aW9uKF9wb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydsYWJlbCddICYmIF9sYWJlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1hcmtlci5zZXRMYWJlbChfbGFiZWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snY2xpY2thYmxlJ10gJiYgX2NsaWNrYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1hcmtlci5zZXRDbGlja2FibGUoX2NsaWNrYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydpY29uJ10gJiYgX2ljb24pIHtcbiAgICAgICAgbWFya2VyLnNldEljb24oX2ljb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1sndmlzaWJsZSddICYmIF92aXNpYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWFya2VyLnNldFZpc2libGUoX3Zpc2libGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMubWFya2VyKSB7XG4gICAgICB0aGlzLm1hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0QW5pbWF0aW9uXG4gICAqL1xuICBnZXRBbmltYXRpb24oKTogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0QW5pbWF0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldENsaWNrYWJsZVxuICAgKi9cbiAgZ2V0Q2xpY2thYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldENsaWNrYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0Q3Vyc29yXG4gICAqL1xuICBnZXRDdXJzb3IoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0Q3Vyc29yKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldERyYWdnYWJsZVxuICAgKi9cbiAgZ2V0RHJhZ2dhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuICEhdGhpcy5tYXJrZXIuZ2V0RHJhZ2dhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRJY29uXG4gICAqL1xuICBnZXRJY29uKCk6IHN0cmluZyB8IGdvb2dsZS5tYXBzLkljb24gfCBnb29nbGUubWFwcy5TeW1ib2wgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRJY29uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldExhYmVsXG4gICAqL1xuICBnZXRMYWJlbCgpOiBnb29nbGUubWFwcy5NYXJrZXJMYWJlbCB8IHN0cmluZyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldExhYmVsKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldE9wYWNpdHlcbiAgICovXG4gIGdldE9wYWNpdHkoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0T3BhY2l0eSgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRQb3NpdGlvblxuICAgKi9cbiAgZ2V0UG9zaXRpb24oKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0UG9zaXRpb24oKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0U2hhcGVcbiAgICovXG4gIGdldFNoYXBlKCk6IGdvb2dsZS5tYXBzLk1hcmtlclNoYXBlIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0U2hhcGUoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0VGl0bGVcbiAgICovXG4gIGdldFRpdGxlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFRpdGxlKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFZpc2libGVcbiAgICovXG4gIGdldFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0VmlzaWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0WkluZGV4XG4gICAqL1xuICBnZXRaSW5kZXgoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0WkluZGV4KCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhbmNob3IgcG9pbnQgdGhhdCBjYW4gYmUgdXNlZCB0byBhdHRhY2ggb3RoZXIgR29vZ2xlIE1hcHMgb2JqZWN0cy4gKi9cbiAgZ2V0QW5jaG9yKCk6IGdvb2dsZS5tYXBzLk1WQ09iamVjdCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXI7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGNvbWJpbmVkIG9wdGlvbnMgb2JqZWN0IHVzaW5nIHRoZSBwYXNzZWQtaW4gb3B0aW9ucyBhbmQgdGhlIGluZGl2aWR1YWwgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCBERUZBVUxUX01BUktFUl9PUFRJT05TO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdGl0bGU6IHRoaXMuX3RpdGxlIHx8IG9wdGlvbnMudGl0bGUsXG4gICAgICBwb3NpdGlvbjogdGhpcy5fcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgIGxhYmVsOiB0aGlzLl9sYWJlbCB8fCBvcHRpb25zLmxhYmVsLFxuICAgICAgY2xpY2thYmxlOiB0aGlzLl9jbGlja2FibGUgPz8gb3B0aW9ucy5jbGlja2FibGUsXG4gICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgICBpY29uOiB0aGlzLl9pY29uIHx8IG9wdGlvbnMuaWNvbixcbiAgICAgIHZpc2libGU6IHRoaXMuX3Zpc2libGUgPz8gb3B0aW9ucy52aXNpYmxlLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlcjogZ29vZ2xlLm1hcHMuTWFya2VyfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubWFya2VyKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgTWFya2VyIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBNYXJrZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==