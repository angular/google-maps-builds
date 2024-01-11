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
import { ChangeDetectionStrategy, Component, ElementRef, Input, Output, ViewEncapsulation, Inject, PLATFORM_ID, NgZone, EventEmitter, inject, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { MapEventManager } from '../map-event-manager';
import { take } from 'rxjs/operators';
import { importLibrary } from '../import-library';
import * as i0 from "@angular/core";
/** default options set to the Googleplex */
export const DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17,
    // Note: the type conversion here isn't necessary for our CI, but it resolves a g3 failure.
    mapTypeId: 'roadmap',
};
/** Arbitrary default height for the map element */
export const DEFAULT_HEIGHT = '500px';
/** Arbitrary default width for the map element */
export const DEFAULT_WIDTH = '500px';
/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
export class GoogleMap {
    set center(center) {
        this._center = center;
    }
    set zoom(zoom) {
        this._zoom = zoom;
    }
    set options(options) {
        this._options = options || DEFAULT_OPTIONS;
    }
    constructor(_elementRef, _ngZone, platformId) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        /** Height of the map. Set this to `null` if you'd like to control the height through CSS. */
        this.height = DEFAULT_HEIGHT;
        /** Width of the map. Set this to `null` if you'd like to control the width through CSS. */
        this.width = DEFAULT_WIDTH;
        this._options = DEFAULT_OPTIONS;
        /** Event emitted when the map is initialized. */
        this.mapInitialized = new EventEmitter();
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/events#auth-errors
         */
        this.authFailure = new EventEmitter();
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
         */
        this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
         */
        this.centerChanged = this._eventManager.getLazyEmitter('center_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
         */
        this.mapClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
         */
        this.mapDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
         */
        this.mapDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
         */
        this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
         */
        this.headingChanged = this._eventManager.getLazyEmitter('heading_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
         */
        this.idle = this._eventManager.getLazyEmitter('idle');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
         */
        this.maptypeidChanged = this._eventManager.getLazyEmitter('maptypeid_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
         */
        this.mapMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
         */
        this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
         */
        this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
         */
        this.projectionChanged = this._eventManager.getLazyEmitter('projection_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
         */
        this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
         */
        this.tilesloaded = this._eventManager.getLazyEmitter('tilesloaded');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
         */
        this.tiltChanged = this._eventManager.getLazyEmitter('tilt_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
         */
        this.zoomChanged = this._eventManager.getLazyEmitter('zoom_changed');
        this._isBrowser = isPlatformBrowser(platformId);
        if (this._isBrowser) {
            const googleMapsWindow = window;
            if (!googleMapsWindow.google && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Namespace google not found, cannot construct embedded google ' +
                    'map. Please install the Google Maps JavaScript API: ' +
                    'https://developers.google.com/maps/documentation/javascript/' +
                    'tutorial#Loading_the_Maps_API');
            }
            this._existingAuthFailureCallback = googleMapsWindow.gm_authFailure;
            googleMapsWindow.gm_authFailure = () => {
                if (this._existingAuthFailureCallback) {
                    this._existingAuthFailureCallback();
                }
                this.authFailure.emit();
            };
        }
    }
    ngOnChanges(changes) {
        if (changes['height'] || changes['width']) {
            this._setSize();
        }
        const googleMap = this.googleMap;
        if (googleMap) {
            if (changes['options']) {
                googleMap.setOptions(this._combineOptions());
            }
            if (changes['center'] && this._center) {
                googleMap.setCenter(this._center);
            }
            // Note that the zoom can be zero.
            if (changes['zoom'] && this._zoom != null) {
                googleMap.setZoom(this._zoom);
            }
            if (changes['mapTypeId'] && this.mapTypeId) {
                googleMap.setMapTypeId(this.mapTypeId);
            }
        }
    }
    ngOnInit() {
        // It should be a noop during server-side rendering.
        if (this._isBrowser) {
            this._mapEl = this._elementRef.nativeElement.querySelector('.map-container');
            this._setSize();
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            if (google.maps.Map) {
                this._initialize(google.maps.Map);
            }
            else {
                this._ngZone.runOutsideAngular(() => {
                    importLibrary('maps', 'Map').then(mapConstructor => this._initialize(mapConstructor));
                });
            }
        }
    }
    _initialize(mapConstructor) {
        this._ngZone.runOutsideAngular(() => {
            this.googleMap = new mapConstructor(this._mapEl, this._combineOptions());
            this._eventManager.setTarget(this.googleMap);
            this.mapInitialized.emit(this.googleMap);
        });
    }
    ngOnDestroy() {
        this.mapInitialized.complete();
        this._eventManager.destroy();
        if (this._isBrowser) {
            const googleMapsWindow = window;
            googleMapsWindow.gm_authFailure = this._existingAuthFailureCallback;
        }
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     */
    fitBounds(bounds, padding) {
        this._assertInitialized();
        this.googleMap.fitBounds(bounds, padding);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
     */
    panBy(x, y) {
        this._assertInitialized();
        this.googleMap.panBy(x, y);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     */
    panTo(latLng) {
        this._assertInitialized();
        this.googleMap.panTo(latLng);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
     */
    panToBounds(latLngBounds, padding) {
        this._assertInitialized();
        this.googleMap.panToBounds(latLngBounds, padding);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     */
    getBounds() {
        this._assertInitialized();
        return this.googleMap.getBounds() || null;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     */
    getCenter() {
        this._assertInitialized();
        return this.googleMap.getCenter();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     */
    getClickableIcons() {
        this._assertInitialized();
        return this.googleMap.getClickableIcons();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     */
    getHeading() {
        this._assertInitialized();
        return this.googleMap.getHeading();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     */
    getMapTypeId() {
        this._assertInitialized();
        return this.googleMap.getMapTypeId();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     */
    getProjection() {
        this._assertInitialized();
        return this.googleMap.getProjection() || null;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     */
    getStreetView() {
        this._assertInitialized();
        return this.googleMap.getStreetView();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     */
    getTilt() {
        this._assertInitialized();
        return this.googleMap.getTilt();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     */
    getZoom() {
        this._assertInitialized();
        return this.googleMap.getZoom();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
     */
    get controls() {
        this._assertInitialized();
        return this.googleMap.controls;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
     */
    get data() {
        this._assertInitialized();
        return this.googleMap.data;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
     */
    get mapTypes() {
        this._assertInitialized();
        return this.googleMap.mapTypes;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
     */
    get overlayMapTypes() {
        this._assertInitialized();
        return this.googleMap.overlayMapTypes;
    }
    /** Returns a promise that resolves when the map has been initialized. */
    _resolveMap() {
        return this.googleMap
            ? Promise.resolve(this.googleMap)
            : this.mapInitialized.pipe(take(1)).toPromise();
    }
    _setSize() {
        if (this._mapEl) {
            const styles = this._mapEl.style;
            styles.height =
                this.height === null ? '' : coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
            styles.width = this.width === null ? '' : coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
        }
    }
    /** Combines the center and zoom and the other map options into a single object */
    _combineOptions() {
        const options = this._options || {};
        return {
            ...options,
            // It's important that we set **some** kind of `center` and `zoom`, otherwise
            // Google Maps will render a blank rectangle which looks broken.
            center: this._center || options.center || DEFAULT_OPTIONS.center,
            zoom: this._zoom ?? options.zoom ?? DEFAULT_OPTIONS.zoom,
            // Passing in an undefined `mapTypeId` seems to break tile loading
            // so make sure that we have some kind of default (see #22082).
            mapTypeId: this.mapTypeId || options.mapTypeId || DEFAULT_OPTIONS.mapTypeId,
        };
    }
    /** Asserts that the map has been initialized. */
    _assertInitialized() {
        if (!this.googleMap && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Cannot access Google Map information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: GoogleMap, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.1.0-next.5", type: GoogleMap, isStandalone: true, selector: "google-map", inputs: { height: "height", width: "width", mapTypeId: "mapTypeId", center: "center", zoom: "zoom", options: "options" }, outputs: { mapInitialized: "mapInitialized", authFailure: "authFailure", boundsChanged: "boundsChanged", centerChanged: "centerChanged", mapClick: "mapClick", mapDblclick: "mapDblclick", mapDrag: "mapDrag", mapDragend: "mapDragend", mapDragstart: "mapDragstart", headingChanged: "headingChanged", idle: "idle", maptypeidChanged: "maptypeidChanged", mapMousemove: "mapMousemove", mapMouseout: "mapMouseout", mapMouseover: "mapMouseover", projectionChanged: "projectionChanged", mapRightclick: "mapRightclick", tilesloaded: "tilesloaded", tiltChanged: "tiltChanged", zoomChanged: "zoomChanged" }, exportAs: ["googleMap"], usesOnChanges: true, ngImport: i0, template: '<div class="map-container"></div><ng-content />', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: GoogleMap, decorators: [{
            type: Component,
            args: [{
                    selector: 'google-map',
                    exportAs: 'googleMap',
                    standalone: true,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<div class="map-container"></div><ng-content />',
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { height: [{
                type: Input
            }], width: [{
                type: Input
            }], mapTypeId: [{
                type: Input
            }], center: [{
                type: Input
            }], zoom: [{
                type: Input
            }], options: [{
                type: Input
            }], mapInitialized: [{
                type: Output
            }], authFailure: [{
                type: Output
            }], boundsChanged: [{
                type: Output
            }], centerChanged: [{
                type: Output
            }], mapClick: [{
                type: Output
            }], mapDblclick: [{
                type: Output
            }], mapDrag: [{
                type: Output
            }], mapDragend: [{
                type: Output
            }], mapDragstart: [{
                type: Output
            }], headingChanged: [{
                type: Output
            }], idle: [{
                type: Output
            }], maptypeidChanged: [{
                type: Output
            }], mapMousemove: [{
                type: Output
            }], mapMouseout: [{
                type: Output
            }], mapMouseover: [{
                type: Output
            }], projectionChanged: [{
                type: Output
            }], mapRightclick: [{
                type: Output
            }], tilesloaded: [{
                type: Output
            }], tiltChanged: [{
                type: Output
            }], zoomChanged: [{
                type: Output
            }] } });
const cssUnitsPattern = /([A-Za-z%]+)$/;
/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : `${value}px`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFJTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixXQUFXLEVBQ1gsTUFBTSxFQUVOLFlBQVksRUFDWixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7QUFPaEQsNENBQTRDO0FBQzVDLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBMkI7SUFDckQsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7SUFDMUMsSUFBSSxFQUFFLEVBQUU7SUFDUiwyRkFBMkY7SUFDM0YsU0FBUyxFQUFFLFNBQTZDO0NBQ3pELENBQUM7QUFFRixtREFBbUQ7QUFDbkQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQztBQUN0QyxrREFBa0Q7QUFDbEQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUVyQzs7OztHQUlHO0FBU0gsTUFBTSxPQUFPLFNBQVM7SUEyQnBCLElBQ0ksTUFBTSxDQUFDLE1BQXNEO1FBQy9ELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLENBQUM7SUFHRCxJQUNJLElBQUksQ0FBQyxJQUFZO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFHRCxJQUNJLE9BQU8sQ0FBQyxPQUErQjtRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxlQUFlLENBQUM7SUFDN0MsQ0FBQztJQTRJRCxZQUNtQixXQUF1QixFQUNoQyxPQUFlLEVBQ0YsVUFBa0I7UUFGdEIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDaEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXZMakIsa0JBQWEsR0FBb0IsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFjN0UsNkZBQTZGO1FBQ3BGLFdBQU0sR0FBMkIsY0FBYyxDQUFDO1FBRXpELDJGQUEyRjtRQUNsRixVQUFLLEdBQTJCLGFBQWEsQ0FBQztRQXdCL0MsYUFBUSxHQUFHLGVBQWUsQ0FBQztRQUVuQyxpREFBaUQ7UUFDOUIsbUJBQWMsR0FDL0IsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFdEM7OztXQUdHO1FBQ2dCLGdCQUFXLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFFOUU7OztXQUdHO1FBQ2dCLGtCQUFhLEdBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLGdCQUFnQixDQUFDLENBQUM7UUFFNUQ7OztXQUdHO1FBQ2dCLGtCQUFhLEdBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLGdCQUFnQixDQUFDLENBQUM7UUFFNUQ7OztXQUdHO1FBQ2dCLGFBQVEsR0FDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQy9CLE9BQU8sQ0FDUixDQUFDO1FBRUo7OztXQUdHO1FBQ2dCLGdCQUFXLEdBQzVCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE0QixVQUFVLENBQUMsQ0FBQztRQUUzRTs7O1dBR0c7UUFDZ0IsWUFBTyxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxNQUFNLENBQUMsQ0FBQztRQUUvRjs7O1dBR0c7UUFDZ0IsZUFBVSxHQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxTQUFTLENBQUMsQ0FBQztRQUVyRDs7O1dBR0c7UUFDZ0IsaUJBQVksR0FDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQU8sV0FBVyxDQUFDLENBQUM7UUFFdkQ7OztXQUdHO1FBQ2dCLG1CQUFjLEdBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLGlCQUFpQixDQUFDLENBQUM7UUFFN0Q7OztXQUdHO1FBQ2dCLFNBQUksR0FBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQU8sTUFBTSxDQUFDLENBQUM7UUFFNUY7OztXQUdHO1FBQ2dCLHFCQUFnQixHQUNqQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxtQkFBbUIsQ0FBQyxDQUFDO1FBRS9EOzs7V0FHRztRQUVNLGlCQUFZLEdBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE0QixXQUFXLENBQUMsQ0FBQztRQUU1RTs7O1dBR0c7UUFDZ0IsZ0JBQVcsR0FDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTRCLFVBQVUsQ0FBQyxDQUFDO1FBRTNFOzs7V0FHRztRQUNnQixpQkFBWSxHQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBNEIsV0FBVyxDQUFDLENBQUM7UUFFNUU7OztXQUdHO1FBQ2dCLHNCQUFpQixHQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxvQkFBb0IsQ0FBQyxDQUFDO1FBRWhFOzs7V0FHRztRQUNnQixrQkFBYSxHQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBNEIsWUFBWSxDQUFDLENBQUM7UUFFN0U7OztXQUdHO1FBQ2dCLGdCQUFXLEdBQzVCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLGFBQWEsQ0FBQyxDQUFDO1FBRXpEOzs7V0FHRztRQUNnQixnQkFBVyxHQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxjQUFjLENBQUMsQ0FBQztRQUUxRDs7O1dBR0c7UUFDZ0IsZ0JBQVcsR0FDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQU8sY0FBYyxDQUFDLENBQUM7UUFPeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixNQUFNLGdCQUFnQixHQUFxQixNQUFNLENBQUM7WUFDbEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUNoRixNQUFNLEtBQUssQ0FDVCwrREFBK0Q7b0JBQzdELHNEQUFzRDtvQkFDdEQsOERBQThEO29CQUM5RCwrQkFBK0IsQ0FDbEMsQ0FBQztZQUNKLENBQUM7WUFFRCxJQUFJLENBQUMsNEJBQTRCLEdBQUcsZ0JBQWdCLENBQUMsY0FBYyxDQUFDO1lBQ3BFLGdCQUFnQixDQUFDLGNBQWMsR0FBRyxHQUFHLEVBQUU7Z0JBQ3JDLElBQUksSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7b0JBQ3RDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO2dCQUN0QyxDQUFDO2dCQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDMUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRWpDLElBQUksU0FBUyxFQUFFLENBQUM7WUFDZCxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUN2QixTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFFRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3RDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFFRCxrQ0FBa0M7WUFDbEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDMUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUVELElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDM0MsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLG9EQUFvRDtRQUNwRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBRSxDQUFDO1lBQzlFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUVoQixtRkFBbUY7WUFDbkYsbUZBQW1GO1lBQ25GLDBCQUEwQjtZQUMxQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQyxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ2xDLGFBQWEsQ0FBeUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUN6RSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUNqQyxDQUFDO2dCQUNKLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUFDLGNBQXNDO1FBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFN0IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDcEIsTUFBTSxnQkFBZ0IsR0FBcUIsTUFBTSxDQUFDO1lBQ2xELGdCQUFnQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUM7UUFDdEUsQ0FBQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQ1AsTUFBa0UsRUFDbEUsT0FBc0M7UUFFdEMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsTUFBc0Q7UUFDMUQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILFdBQVcsQ0FDVCxZQUF3RSxFQUN4RSxPQUFzQztRQUV0QyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVM7UUFDUCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDO0lBQzVDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTO1FBQ1AsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxpQkFBaUI7UUFDZixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsVUFBVTtRQUNSLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWTtRQUNWLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsYUFBYTtRQUNYLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxJQUFJLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWE7UUFDWCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU87UUFDTCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU87UUFDTCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksUUFBUTtRQUNWLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksSUFBSTtRQUNOLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksUUFBUTtRQUNWLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksZUFBZTtRQUNqQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDO0lBQ3hDLENBQUM7SUFFRCx5RUFBeUU7SUFDekUsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVM7WUFDbkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVPLFFBQVE7UUFDZCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQyxNQUFNLENBQUMsTUFBTTtnQkFDWCxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksY0FBYyxDQUFDO1lBQ2pGLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQztRQUM3RixDQUFDO0lBQ0gsQ0FBQztJQUVELGtGQUFrRjtJQUMxRSxlQUFlO1FBQ3JCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1FBQ3BDLE9BQU87WUFDTCxHQUFHLE9BQU87WUFDViw2RUFBNkU7WUFDN0UsZ0VBQWdFO1lBQ2hFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksZUFBZSxDQUFDLE1BQU07WUFDaEUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSTtZQUN4RCxrRUFBa0U7WUFDbEUsK0RBQStEO1lBQy9ELFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksZUFBZSxDQUFDLFNBQVM7U0FDNUUsQ0FBQztJQUNKLENBQUM7SUFFRCxpREFBaUQ7SUFDekMsa0JBQWtCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDdkUsTUFBTSxLQUFLLENBQ1QsNEVBQTRFO2dCQUMxRSxvRUFBb0UsQ0FDdkUsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO3FIQTFkVSxTQUFTLGtFQXlMVixXQUFXO3lHQXpMVixTQUFTLGkwQkFIVixpREFBaUQ7O2tHQUdoRCxTQUFTO2tCQVJyQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsV0FBVztvQkFDckIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxRQUFRLEVBQUUsaURBQWlEO29CQUMzRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEM7OzBCQTBMSSxNQUFNOzJCQUFDLFdBQVc7eUNBektaLE1BQU07c0JBQWQsS0FBSztnQkFHRyxLQUFLO3NCQUFiLEtBQUs7Z0JBTUcsU0FBUztzQkFBakIsS0FBSztnQkFHRixNQUFNO3NCQURULEtBQUs7Z0JBT0YsSUFBSTtzQkFEUCxLQUFLO2dCQU9GLE9BQU87c0JBRFYsS0FBSztnQkFPYSxjQUFjO3NCQUFoQyxNQUFNO2dCQU9ZLFdBQVc7c0JBQTdCLE1BQU07Z0JBTVksYUFBYTtzQkFBL0IsTUFBTTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNO2dCQU9ZLFFBQVE7c0JBQTFCLE1BQU07Z0JBU1ksV0FBVztzQkFBN0IsTUFBTTtnQkFPWSxPQUFPO3NCQUF6QixNQUFNO2dCQU1ZLFVBQVU7c0JBQTVCLE1BQU07Z0JBT1ksWUFBWTtzQkFBOUIsTUFBTTtnQkFPWSxjQUFjO3NCQUFoQyxNQUFNO2dCQU9ZLElBQUk7c0JBQXRCLE1BQU07Z0JBTVksZ0JBQWdCO3NCQUFsQyxNQUFNO2dCQVFFLFlBQVk7c0JBRHBCLE1BQU07Z0JBUVksV0FBVztzQkFBN0IsTUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQU9ZLGlCQUFpQjtzQkFBbkMsTUFBTTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNO2dCQU9ZLFdBQVc7c0JBQTdCLE1BQU07Z0JBT1ksV0FBVztzQkFBN0IsTUFBTTtnQkFPWSxXQUFXO3NCQUE3QixNQUFNOztBQTBTVCxNQUFNLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFFeEMsNENBQTRDO0FBQzVDLFNBQVMsbUJBQW1CLENBQUMsS0FBVTtJQUNyQyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQztBQUM1RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0LFxuICBQTEFURk9STV9JRCxcbiAgTmdab25lLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBFdmVudEVtaXR0ZXIsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7aW1wb3J0TGlicmFyeX0gZnJvbSAnLi4vaW1wb3J0LWxpYnJhcnknO1xuXG5pbnRlcmZhY2UgR29vZ2xlTWFwc1dpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gIGdtX2F1dGhGYWlsdXJlPzogKCkgPT4gdm9pZDtcbiAgZ29vZ2xlPzogdHlwZW9mIGdvb2dsZTtcbn1cblxuLyoqIGRlZmF1bHQgb3B0aW9ucyBzZXQgdG8gdGhlIEdvb2dsZXBsZXggKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMgPSB7XG4gIGNlbnRlcjoge2xhdDogMzcuNDIxOTk1LCBsbmc6IC0xMjIuMDg0MDkyfSxcbiAgem9vbTogMTcsXG4gIC8vIE5vdGU6IHRoZSB0eXBlIGNvbnZlcnNpb24gaGVyZSBpc24ndCBuZWNlc3NhcnkgZm9yIG91ciBDSSwgYnV0IGl0IHJlc29sdmVzIGEgZzMgZmFpbHVyZS5cbiAgbWFwVHlwZUlkOiAncm9hZG1hcCcgYXMgdW5rbm93biBhcyBnb29nbGUubWFwcy5NYXBUeXBlSWQsXG59O1xuXG4vKiogQXJiaXRyYXJ5IGRlZmF1bHQgaGVpZ2h0IGZvciB0aGUgbWFwIGVsZW1lbnQgKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0hFSUdIVCA9ICc1MDBweCc7XG4vKiogQXJiaXRyYXJ5IGRlZmF1bHQgd2lkdGggZm9yIHRoZSBtYXAgZWxlbWVudCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfV0lEVEggPSAnNTAwcHgnO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXAgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0XG4gKiBBUEkuXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ29vZ2xlLW1hcCcsXG4gIGV4cG9ydEFzOiAnZ29vZ2xlTWFwJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1hcC1jb250YWluZXJcIj48L2Rpdj48bmctY29udGVudCAvPicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIEdvb2dsZU1hcCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXI6IE1hcEV2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuICBwcml2YXRlIF9tYXBFbDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgX2V4aXN0aW5nQXV0aEZhaWx1cmVDYWxsYmFjazogR29vZ2xlTWFwc1dpbmRvd1snZ21fYXV0aEZhaWx1cmUnXTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuTWFwIG9iamVjdFxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwXG4gICAqL1xuICBnb29nbGVNYXA/OiBnb29nbGUubWFwcy5NYXA7XG5cbiAgLyoqIFdoZXRoZXIgd2UncmUgY3VycmVudGx5IHJlbmRlcmluZyBpbnNpZGUgYSBicm93c2VyLiAqL1xuICBfaXNCcm93c2VyOiBib29sZWFuO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIG1hcC4gU2V0IHRoaXMgdG8gYG51bGxgIGlmIHlvdSdkIGxpa2UgdG8gY29udHJvbCB0aGUgaGVpZ2h0IHRocm91Z2ggQ1NTLiAqL1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGwgPSBERUZBVUxUX0hFSUdIVDtcblxuICAvKiogV2lkdGggb2YgdGhlIG1hcC4gU2V0IHRoaXMgdG8gYG51bGxgIGlmIHlvdSdkIGxpa2UgdG8gY29udHJvbCB0aGUgd2lkdGggdGhyb3VnaCBDU1MuICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsID0gREVGQVVMVF9XSURUSDtcblxuICAvKipcbiAgICogVHlwZSBvZiBtYXAgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQuIEUuZy4gaHlicmlkIG1hcCwgdGVycmFpbiBtYXAgZXRjLlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwVHlwZUlkXG4gICAqL1xuICBASW5wdXQoKSBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZCB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBzZXQgY2VudGVyKGNlbnRlcjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX2NlbnRlciA9IGNlbnRlcjtcbiAgfVxuICBwcml2YXRlIF9jZW50ZXI6IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCBnb29nbGUubWFwcy5MYXRMbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IHpvb20oem9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fem9vbSA9IHpvb207XG4gIH1cbiAgcHJpdmF0ZSBfem9vbTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB8fCBERUZBVUxUX09QVElPTlM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9ucyA9IERFRkFVTFRfT1BUSU9OUztcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtYXAgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwPigpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvZXZlbnRzI2F1dGgtZXJyb3JzXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYXV0aEZhaWx1cmU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmJvdW5kc19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYm91bmRzQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdib3VuZHNfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuY2VudGVyX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjZW50ZXJDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NlbnRlcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQgfCBnb29nbGUubWFwcy5JY29uTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50IHwgZ29vZ2xlLm1hcHMuSWNvbk1vdXNlRXZlbnQ+KFxuICAgICAgJ2NsaWNrJyxcbiAgICApO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWc6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmhlYWRpbmdfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGhlYWRpbmdDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2hlYWRpbmdfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaWRsZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGlkbGU6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2lkbGUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcHR5cGVpZF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwdHlwZWlkQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdtYXB0eXBlaWRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgbWFwTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnByb2plY3Rpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHByb2plY3Rpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Byb2plY3Rpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsZXNsb2FkZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0aWxlc2xvYWRlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aWxlc2xvYWRlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdGlsdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndGlsdF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC56b29tX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB6b29tQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd6b29tX2NoYW5nZWQnKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgKSB7XG4gICAgdGhpcy5faXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCk7XG5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBnb29nbGVNYXBzV2luZG93OiBHb29nbGVNYXBzV2luZG93ID0gd2luZG93O1xuICAgICAgaWYgKCFnb29nbGVNYXBzV2luZG93Lmdvb2dsZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnTmFtZXNwYWNlIGdvb2dsZSBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgZW1iZWRkZWQgZ29vZ2xlICcgK1xuICAgICAgICAgICAgJ21hcC4gUGxlYXNlIGluc3RhbGwgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJOiAnICtcbiAgICAgICAgICAgICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC8nICtcbiAgICAgICAgICAgICd0dXRvcmlhbCNMb2FkaW5nX3RoZV9NYXBzX0FQSScsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2V4aXN0aW5nQXV0aEZhaWx1cmVDYWxsYmFjayA9IGdvb2dsZU1hcHNXaW5kb3cuZ21fYXV0aEZhaWx1cmU7XG4gICAgICBnb29nbGVNYXBzV2luZG93LmdtX2F1dGhGYWlsdXJlID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fZXhpc3RpbmdBdXRoRmFpbHVyZUNhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5fZXhpc3RpbmdBdXRoRmFpbHVyZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdXRoRmFpbHVyZS5lbWl0KCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1snaGVpZ2h0J10gfHwgY2hhbmdlc1snd2lkdGgnXSkge1xuICAgICAgdGhpcy5fc2V0U2l6ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGdvb2dsZU1hcCA9IHRoaXMuZ29vZ2xlTWFwO1xuXG4gICAgaWYgKGdvb2dsZU1hcCkge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICBnb29nbGVNYXAuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2NlbnRlciddICYmIHRoaXMuX2NlbnRlcikge1xuICAgICAgICBnb29nbGVNYXAuc2V0Q2VudGVyKHRoaXMuX2NlbnRlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGUgem9vbSBjYW4gYmUgemVyby5cbiAgICAgIGlmIChjaGFuZ2VzWyd6b29tJ10gJiYgdGhpcy5fem9vbSAhPSBudWxsKSB7XG4gICAgICAgIGdvb2dsZU1hcC5zZXRab29tKHRoaXMuX3pvb20pO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snbWFwVHlwZUlkJ10gJiYgdGhpcy5tYXBUeXBlSWQpIHtcbiAgICAgICAgZ29vZ2xlTWFwLnNldE1hcFR5cGVJZCh0aGlzLm1hcFR5cGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gSXQgc2hvdWxkIGJlIGEgbm9vcCBkdXJpbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX21hcEVsID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXAtY29udGFpbmVyJykhO1xuICAgICAgdGhpcy5fc2V0U2l6ZSgpO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuTWFwKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoZ29vZ2xlLm1hcHMuTWFwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgaW1wb3J0TGlicmFyeTx0eXBlb2YgZ29vZ2xlLm1hcHMuTWFwPignbWFwcycsICdNYXAnKS50aGVuKG1hcENvbnN0cnVjdG9yID0+XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKG1hcENvbnN0cnVjdG9yKSxcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKG1hcENvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMuTWFwKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuZ29vZ2xlTWFwID0gbmV3IG1hcENvbnN0cnVjdG9yKHRoaXMuX21hcEVsLCB0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5nb29nbGVNYXApO1xuICAgICAgdGhpcy5tYXBJbml0aWFsaXplZC5lbWl0KHRoaXMuZ29vZ2xlTWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMubWFwSW5pdGlhbGl6ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgY29uc3QgZ29vZ2xlTWFwc1dpbmRvdzogR29vZ2xlTWFwc1dpbmRvdyA9IHdpbmRvdztcbiAgICAgIGdvb2dsZU1hcHNXaW5kb3cuZ21fYXV0aEZhaWx1cmUgPSB0aGlzLl9leGlzdGluZ0F1dGhGYWlsdXJlQ2FsbGJhY2s7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5maXRCb3VuZHNcbiAgICovXG4gIGZpdEJvdW5kcyhcbiAgICBib3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwsXG4gICAgcGFkZGluZz86IG51bWJlciB8IGdvb2dsZS5tYXBzLlBhZGRpbmcsXG4gICkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5nb29nbGVNYXAuZml0Qm91bmRzKGJvdW5kcywgcGFkZGluZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhbkJ5XG4gICAqL1xuICBwYW5CeSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5nb29nbGVNYXAucGFuQnkoeCwgeSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhblRvXG4gICAqL1xuICBwYW5UbyhsYXRMbmc6IGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhblRvKGxhdExuZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhblRvQm91bmRzXG4gICAqL1xuICBwYW5Ub0JvdW5kcyhcbiAgICBsYXRMbmdCb3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwsXG4gICAgcGFkZGluZz86IG51bWJlciB8IGdvb2dsZS5tYXBzLlBhZGRpbmcsXG4gICkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5nb29nbGVNYXAucGFuVG9Cb3VuZHMobGF0TG5nQm91bmRzLCBwYWRkaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Qm91bmRzXG4gICAqL1xuICBnZXRCb3VuZHMoKTogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Qm91bmRzKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Q2VudGVyXG4gICAqL1xuICBnZXRDZW50ZXIoKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHwgdW5kZWZpbmVkIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Q2xpY2thYmxlSWNvbnNcbiAgICovXG4gIGdldENsaWNrYWJsZUljb25zKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldENsaWNrYWJsZUljb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldEhlYWRpbmdcbiAgICovXG4gIGdldEhlYWRpbmcoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRIZWFkaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldE1hcFR5cGVJZFxuICAgKi9cbiAgZ2V0TWFwVHlwZUlkKCk6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZCB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0TWFwVHlwZUlkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFByb2plY3Rpb25cbiAgICovXG4gIGdldFByb2plY3Rpb24oKTogZ29vZ2xlLm1hcHMuUHJvamVjdGlvbiB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFByb2plY3Rpb24oKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRTdHJlZXRWaWV3XG4gICAqL1xuICBnZXRTdHJlZXRWaWV3KCk6IGdvb2dsZS5tYXBzLlN0cmVldFZpZXdQYW5vcmFtYSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0U3RyZWV0VmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRUaWx0XG4gICAqL1xuICBnZXRUaWx0KCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0VGlsdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRab29tXG4gICAqL1xuICBnZXRab29tKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Wm9vbSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jb250cm9sc1xuICAgKi9cbiAgZ2V0IGNvbnRyb2xzKCk6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PE5vZGU+W10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmNvbnRyb2xzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kYXRhXG4gICAqL1xuICBnZXQgZGF0YSgpOiBnb29nbGUubWFwcy5EYXRhIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tYXBUeXBlc1xuICAgKi9cbiAgZ2V0IG1hcFR5cGVzKCk6IGdvb2dsZS5tYXBzLk1hcFR5cGVSZWdpc3RyeSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAubWFwVHlwZXM7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm92ZXJsYXlNYXBUeXBlc1xuICAgKi9cbiAgZ2V0IG92ZXJsYXlNYXBUeXBlcygpOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5NYXBUeXBlIHwgbnVsbD4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLm92ZXJsYXlNYXBUeXBlcztcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIG1hcCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgX3Jlc29sdmVNYXAoKTogUHJvbWlzZTxnb29nbGUubWFwcy5NYXA+IHtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXBcbiAgICAgID8gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZ29vZ2xlTWFwKVxuICAgICAgOiB0aGlzLm1hcEluaXRpYWxpemVkLnBpcGUodGFrZSgxKSkudG9Qcm9taXNlKCk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRTaXplKCkge1xuICAgIGlmICh0aGlzLl9tYXBFbCkge1xuICAgICAgY29uc3Qgc3R5bGVzID0gdGhpcy5fbWFwRWwuc3R5bGU7XG4gICAgICBzdHlsZXMuaGVpZ2h0ID1cbiAgICAgICAgdGhpcy5oZWlnaHQgPT09IG51bGwgPyAnJyA6IGNvZXJjZUNzc1BpeGVsVmFsdWUodGhpcy5oZWlnaHQpIHx8IERFRkFVTFRfSEVJR0hUO1xuICAgICAgc3R5bGVzLndpZHRoID0gdGhpcy53aWR0aCA9PT0gbnVsbCA/ICcnIDogY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0aGlzLndpZHRoKSB8fCBERUZBVUxUX1dJRFRIO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb21iaW5lcyB0aGUgY2VudGVyIGFuZCB6b29tIGFuZCB0aGUgb3RoZXIgbWFwIG9wdGlvbnMgaW50byBhIHNpbmdsZSBvYmplY3QgKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMuTWFwT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAvLyBJdCdzIGltcG9ydGFudCB0aGF0IHdlIHNldCAqKnNvbWUqKiBraW5kIG9mIGBjZW50ZXJgIGFuZCBgem9vbWAsIG90aGVyd2lzZVxuICAgICAgLy8gR29vZ2xlIE1hcHMgd2lsbCByZW5kZXIgYSBibGFuayByZWN0YW5nbGUgd2hpY2ggbG9va3MgYnJva2VuLlxuICAgICAgY2VudGVyOiB0aGlzLl9jZW50ZXIgfHwgb3B0aW9ucy5jZW50ZXIgfHwgREVGQVVMVF9PUFRJT05TLmNlbnRlcixcbiAgICAgIHpvb206IHRoaXMuX3pvb20gPz8gb3B0aW9ucy56b29tID8/IERFRkFVTFRfT1BUSU9OUy56b29tLFxuICAgICAgLy8gUGFzc2luZyBpbiBhbiB1bmRlZmluZWQgYG1hcFR5cGVJZGAgc2VlbXMgdG8gYnJlYWsgdGlsZSBsb2FkaW5nXG4gICAgICAvLyBzbyBtYWtlIHN1cmUgdGhhdCB3ZSBoYXZlIHNvbWUga2luZCBvZiBkZWZhdWx0IChzZWUgIzIyMDgyKS5cbiAgICAgIG1hcFR5cGVJZDogdGhpcy5tYXBUeXBlSWQgfHwgb3B0aW9ucy5tYXBUeXBlSWQgfHwgREVGQVVMVF9PUFRJT05TLm1hcFR5cGVJZCxcbiAgICB9O1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwfSB7XG4gICAgaWYgKCF0aGlzLmdvb2dsZU1hcCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgY3NzVW5pdHNQYXR0ZXJuID0gLyhbQS1aYS16JV0rKSQvO1xuXG4vKiogQ29lcmNlcyBhIHZhbHVlIHRvIGEgQ1NTIHBpeGVsIHZhbHVlLiAqL1xuZnVuY3Rpb24gY29lcmNlQ3NzUGl4ZWxWYWx1ZSh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gY3NzVW5pdHNQYXR0ZXJuLnRlc3QodmFsdWUpID8gdmFsdWUgOiBgJHt2YWx1ZX1weGA7XG59XG4iXX0=