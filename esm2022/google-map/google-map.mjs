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
            this._ngZone.runOutsideAngular(() => {
                this.googleMap = new google.maps.Map(this._mapEl, this._combineOptions());
            });
            this._eventManager.setTarget(this.googleMap);
            this.mapInitialized.emit(this.googleMap);
        }
    }
    ngOnDestroy() {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: GoogleMap, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.0", type: GoogleMap, isStandalone: true, selector: "google-map", inputs: { height: "height", width: "width", mapTypeId: "mapTypeId", center: "center", zoom: "zoom", options: "options" }, outputs: { mapInitialized: "mapInitialized", authFailure: "authFailure", boundsChanged: "boundsChanged", centerChanged: "centerChanged", mapClick: "mapClick", mapDblclick: "mapDblclick", mapDrag: "mapDrag", mapDragend: "mapDragend", mapDragstart: "mapDragstart", headingChanged: "headingChanged", idle: "idle", maptypeidChanged: "maptypeidChanged", mapMousemove: "mapMousemove", mapMouseout: "mapMouseout", mapMouseover: "mapMouseover", projectionChanged: "projectionChanged", mapRightclick: "mapRightclick", tilesloaded: "tilesloaded", tiltChanged: "tiltChanged", zoomChanged: "zoomChanged" }, exportAs: ["googleMap"], usesOnChanges: true, ngImport: i0, template: '<div class="map-container"></div><ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: GoogleMap, decorators: [{
            type: Component,
            args: [{
                    selector: 'google-map',
                    exportAs: 'googleMap',
                    standalone: true,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<div class="map-container"></div><ng-content></ng-content>',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFJTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixXQUFXLEVBQ1gsTUFBTSxFQUVOLFlBQVksRUFDWixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7O0FBT3JELDRDQUE0QztBQUM1QyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQTJCO0lBQ3JELE1BQU0sRUFBRSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFDO0lBQzFDLElBQUksRUFBRSxFQUFFO0lBQ1IsMkZBQTJGO0lBQzNGLFNBQVMsRUFBRSxTQUE2QztDQUN6RCxDQUFDO0FBRUYsbURBQW1EO0FBQ25ELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFDdEMsa0RBQWtEO0FBQ2xELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7QUFFckM7Ozs7R0FJRztBQVNILE1BQU0sT0FBTyxTQUFTO0lBMkJwQixJQUNJLE1BQU0sQ0FBQyxNQUFzRDtRQUMvRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUN4QixDQUFDO0lBR0QsSUFDSSxJQUFJLENBQUMsSUFBWTtRQUNu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TTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNO2dCQU9ZLFFBQVE7c0JBQTFCLE1BQU07Z0JBU1ksV0FBVztzQkFBN0IsTUFBTTtnQkFPWSxPQUFPO3NCQUF6QixNQUFNO2dCQU1ZLFVBQVU7c0JBQTVCLE1BQU07Z0JBT1ksWUFBWTtzQkFBOUIsTUFBTTtnQkFPWSxjQUFjO3NCQUFoQyxNQUFNO2dCQU9ZLElBQUk7c0JBQXRCLE1BQU07Z0JBTVksZ0JBQWdCO3NCQUFsQyxNQUFNO2dCQVFFLFlBQVk7c0JBRHBCLE1BQU07Z0JBUVksV0FBVztzQkFBN0IsTUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQU9ZLGlCQUFpQjtzQkFBbkMsTUFBTTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNO2dCQU9ZLFdBQVc7c0JBQTdCLE1BQU07Z0JBT1ksV0FBVztzQkFBN0IsTUFBTTtnQkFPWSxXQUFXO3NCQUE3QixNQUFNOztBQXNSVCxNQUFNLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFFeEMsNENBQTRDO0FBQzVDLFNBQVMsbUJBQW1CLENBQUMsS0FBVTtJQUNyQyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDO0FBQzVELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIFBMQVRGT1JNX0lELFxuICBOZ1pvbmUsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEV2ZW50RW1pdHRlcixcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuaW50ZXJmYWNlIEdvb2dsZU1hcHNXaW5kb3cgZXh0ZW5kcyBXaW5kb3cge1xuICBnbV9hdXRoRmFpbHVyZT86ICgpID0+IHZvaWQ7XG4gIGdvb2dsZT86IHR5cGVvZiBnb29nbGU7XG59XG5cbi8qKiBkZWZhdWx0IG9wdGlvbnMgc2V0IHRvIHRoZSBHb29nbGVwbGV4ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9PUFRJT05TOiBnb29nbGUubWFwcy5NYXBPcHRpb25zID0ge1xuICBjZW50ZXI6IHtsYXQ6IDM3LjQyMTk5NSwgbG5nOiAtMTIyLjA4NDA5Mn0sXG4gIHpvb206IDE3LFxuICAvLyBOb3RlOiB0aGUgdHlwZSBjb252ZXJzaW9uIGhlcmUgaXNuJ3QgbmVjZXNzYXJ5IGZvciBvdXIgQ0ksIGJ1dCBpdCByZXNvbHZlcyBhIGczIGZhaWx1cmUuXG4gIG1hcFR5cGVJZDogJ3JvYWRtYXAnIGFzIHVua25vd24gYXMgZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLFxufTtcblxuLyoqIEFyYml0cmFyeSBkZWZhdWx0IGhlaWdodCBmb3IgdGhlIG1hcCBlbGVtZW50ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9IRUlHSFQgPSAnNTAwcHgnO1xuLyoqIEFyYml0cmFyeSBkZWZhdWx0IHdpZHRoIGZvciB0aGUgbWFwIGVsZW1lbnQgKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1dJRFRIID0gJzUwMHB4JztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdFxuICogQVBJLlxuICogQHNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dvb2dsZS1tYXAnLFxuICBleHBvcnRBczogJ2dvb2dsZU1hcCcsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtYXAtY29udGFpbmVyXCI+PC9kaXY+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIEdvb2dsZU1hcCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXI6IE1hcEV2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuICBwcml2YXRlIF9tYXBFbDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgX2V4aXN0aW5nQXV0aEZhaWx1cmVDYWxsYmFjazogR29vZ2xlTWFwc1dpbmRvd1snZ21fYXV0aEZhaWx1cmUnXTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuTWFwIG9iamVjdFxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwXG4gICAqL1xuICBnb29nbGVNYXA/OiBnb29nbGUubWFwcy5NYXA7XG5cbiAgLyoqIFdoZXRoZXIgd2UncmUgY3VycmVudGx5IHJlbmRlcmluZyBpbnNpZGUgYSBicm93c2VyLiAqL1xuICBfaXNCcm93c2VyOiBib29sZWFuO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIG1hcC4gU2V0IHRoaXMgdG8gYG51bGxgIGlmIHlvdSdkIGxpa2UgdG8gY29udHJvbCB0aGUgaGVpZ2h0IHRocm91Z2ggQ1NTLiAqL1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZyB8IG51bWJlciB8IG51bGwgPSBERUZBVUxUX0hFSUdIVDtcblxuICAvKiogV2lkdGggb2YgdGhlIG1hcC4gU2V0IHRoaXMgdG8gYG51bGxgIGlmIHlvdSdkIGxpa2UgdG8gY29udHJvbCB0aGUgd2lkdGggdGhyb3VnaCBDU1MuICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsID0gREVGQVVMVF9XSURUSDtcblxuICAvKipcbiAgICogVHlwZSBvZiBtYXAgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQuIEUuZy4gaHlicmlkIG1hcCwgdGVycmFpbiBtYXAgZXRjLlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwVHlwZUlkXG4gICAqL1xuICBASW5wdXQoKSBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZCB8IHVuZGVmaW5lZDtcblxuICBASW5wdXQoKVxuICBzZXQgY2VudGVyKGNlbnRlcjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX2NlbnRlciA9IGNlbnRlcjtcbiAgfVxuICBwcml2YXRlIF9jZW50ZXI6IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCBnb29nbGUubWFwcy5MYXRMbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IHpvb20oem9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fem9vbSA9IHpvb207XG4gIH1cbiAgcHJpdmF0ZSBfem9vbTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB8fCBERUZBVUxUX09QVElPTlM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9ucyA9IERFRkFVTFRfT1BUSU9OUztcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtYXAgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwPigpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvZXZlbnRzI2F1dGgtZXJyb3JzXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYXV0aEZhaWx1cmU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmJvdW5kc19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYm91bmRzQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdib3VuZHNfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuY2VudGVyX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjZW50ZXJDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NlbnRlcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQgfCBnb29nbGUubWFwcy5JY29uTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50IHwgZ29vZ2xlLm1hcHMuSWNvbk1vdXNlRXZlbnQ+KFxuICAgICAgJ2NsaWNrJyxcbiAgICApO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWc6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmhlYWRpbmdfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGhlYWRpbmdDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2hlYWRpbmdfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaWRsZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGlkbGU6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2lkbGUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcHR5cGVpZF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwdHlwZWlkQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdtYXB0eXBlaWRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgbWFwTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnByb2plY3Rpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHByb2plY3Rpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Byb2plY3Rpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsZXNsb2FkZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0aWxlc2xvYWRlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aWxlc2xvYWRlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdGlsdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndGlsdF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC56b29tX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB6b29tQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd6b29tX2NoYW5nZWQnKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgKSB7XG4gICAgdGhpcy5faXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCk7XG5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBnb29nbGVNYXBzV2luZG93OiBHb29nbGVNYXBzV2luZG93ID0gd2luZG93O1xuICAgICAgaWYgKCFnb29nbGVNYXBzV2luZG93Lmdvb2dsZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnTmFtZXNwYWNlIGdvb2dsZSBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgZW1iZWRkZWQgZ29vZ2xlICcgK1xuICAgICAgICAgICAgJ21hcC4gUGxlYXNlIGluc3RhbGwgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJOiAnICtcbiAgICAgICAgICAgICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC8nICtcbiAgICAgICAgICAgICd0dXRvcmlhbCNMb2FkaW5nX3RoZV9NYXBzX0FQSScsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2V4aXN0aW5nQXV0aEZhaWx1cmVDYWxsYmFjayA9IGdvb2dsZU1hcHNXaW5kb3cuZ21fYXV0aEZhaWx1cmU7XG4gICAgICBnb29nbGVNYXBzV2luZG93LmdtX2F1dGhGYWlsdXJlID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fZXhpc3RpbmdBdXRoRmFpbHVyZUNhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5fZXhpc3RpbmdBdXRoRmFpbHVyZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdXRoRmFpbHVyZS5lbWl0KCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1snaGVpZ2h0J10gfHwgY2hhbmdlc1snd2lkdGgnXSkge1xuICAgICAgdGhpcy5fc2V0U2l6ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGdvb2dsZU1hcCA9IHRoaXMuZ29vZ2xlTWFwO1xuXG4gICAgaWYgKGdvb2dsZU1hcCkge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICBnb29nbGVNYXAuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2NlbnRlciddICYmIHRoaXMuX2NlbnRlcikge1xuICAgICAgICBnb29nbGVNYXAuc2V0Q2VudGVyKHRoaXMuX2NlbnRlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGUgem9vbSBjYW4gYmUgemVyby5cbiAgICAgIGlmIChjaGFuZ2VzWyd6b29tJ10gJiYgdGhpcy5fem9vbSAhPSBudWxsKSB7XG4gICAgICAgIGdvb2dsZU1hcC5zZXRab29tKHRoaXMuX3pvb20pO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snbWFwVHlwZUlkJ10gJiYgdGhpcy5tYXBUeXBlSWQpIHtcbiAgICAgICAgZ29vZ2xlTWFwLnNldE1hcFR5cGVJZCh0aGlzLm1hcFR5cGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gSXQgc2hvdWxkIGJlIGEgbm9vcCBkdXJpbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX21hcEVsID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXAtY29udGFpbmVyJykhO1xuICAgICAgdGhpcy5fc2V0U2l6ZSgpO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLmdvb2dsZU1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAodGhpcy5fbWFwRWwsIHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuZ29vZ2xlTWFwKTtcbiAgICAgIHRoaXMubWFwSW5pdGlhbGl6ZWQuZW1pdCh0aGlzLmdvb2dsZU1hcCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcblxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGNvbnN0IGdvb2dsZU1hcHNXaW5kb3c6IEdvb2dsZU1hcHNXaW5kb3cgPSB3aW5kb3c7XG4gICAgICBnb29nbGVNYXBzV2luZG93LmdtX2F1dGhGYWlsdXJlID0gdGhpcy5fZXhpc3RpbmdBdXRoRmFpbHVyZUNhbGxiYWNrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZml0Qm91bmRzXG4gICAqL1xuICBmaXRCb3VuZHMoXG4gICAgYm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICAgIHBhZGRpbmc/OiBudW1iZXIgfCBnb29nbGUubWFwcy5QYWRkaW5nLFxuICApIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLmZpdEJvdW5kcyhib3VuZHMsIHBhZGRpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5CeVxuICAgKi9cbiAgcGFuQnkoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhbkJ5KHgsIHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5Ub1xuICAgKi9cbiAgcGFuVG8obGF0TG5nOiBnb29nbGUubWFwcy5MYXRMbmcgfCBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmdvb2dsZU1hcC5wYW5UbyhsYXRMbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5Ub0JvdW5kc1xuICAgKi9cbiAgcGFuVG9Cb3VuZHMoXG4gICAgbGF0TG5nQm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICAgIHBhZGRpbmc/OiBudW1iZXIgfCBnb29nbGUubWFwcy5QYWRkaW5nLFxuICApIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhblRvQm91bmRzKGxhdExuZ0JvdW5kcywgcGFkZGluZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldEJvdW5kcygpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldENlbnRlclxuICAgKi9cbiAgZ2V0Q2VudGVyKCk6IGdvb2dsZS5tYXBzLkxhdExuZyB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldENsaWNrYWJsZUljb25zXG4gICAqL1xuICBnZXRDbGlja2FibGVJY29ucygpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRDbGlja2FibGVJY29ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRIZWFkaW5nXG4gICAqL1xuICBnZXRIZWFkaW5nKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0SGVhZGluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRNYXBUeXBlSWRcbiAgICovXG4gIGdldE1hcFR5cGVJZCgpOiBnb29nbGUubWFwcy5NYXBUeXBlSWQgfCBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldE1hcFR5cGVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRQcm9qZWN0aW9uXG4gICAqL1xuICBnZXRQcm9qZWN0aW9uKCk6IGdvb2dsZS5tYXBzLlByb2plY3Rpb24gfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRQcm9qZWN0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0U3RyZWV0Vmlld1xuICAgKi9cbiAgZ2V0U3RyZWV0VmlldygpOiBnb29nbGUubWFwcy5TdHJlZXRWaWV3UGFub3JhbWEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFN0cmVldFZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0VGlsdFxuICAgKi9cbiAgZ2V0VGlsdCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFRpbHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Wm9vbVxuICAgKi9cbiAgZ2V0Wm9vbSgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFpvb20oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuY29udHJvbHNcbiAgICovXG4gIGdldCBjb250cm9scygpOiBnb29nbGUubWFwcy5NVkNBcnJheTxOb2RlPltdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5jb250cm9scztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZGF0YVxuICAgKi9cbiAgZ2V0IGRhdGEoKTogZ29vZ2xlLm1hcHMuRGF0YSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubWFwVHlwZXNcbiAgICovXG4gIGdldCBtYXBUeXBlcygpOiBnb29nbGUubWFwcy5NYXBUeXBlUmVnaXN0cnkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLm1hcFR5cGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5vdmVybGF5TWFwVHlwZXNcbiAgICovXG4gIGdldCBvdmVybGF5TWFwVHlwZXMoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTWFwVHlwZSB8IG51bGw+IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5vdmVybGF5TWFwVHlwZXM7XG4gIH1cblxuICBwcml2YXRlIF9zZXRTaXplKCkge1xuICAgIGlmICh0aGlzLl9tYXBFbCkge1xuICAgICAgY29uc3Qgc3R5bGVzID0gdGhpcy5fbWFwRWwuc3R5bGU7XG4gICAgICBzdHlsZXMuaGVpZ2h0ID1cbiAgICAgICAgdGhpcy5oZWlnaHQgPT09IG51bGwgPyAnJyA6IGNvZXJjZUNzc1BpeGVsVmFsdWUodGhpcy5oZWlnaHQpIHx8IERFRkFVTFRfSEVJR0hUO1xuICAgICAgc3R5bGVzLndpZHRoID0gdGhpcy53aWR0aCA9PT0gbnVsbCA/ICcnIDogY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0aGlzLndpZHRoKSB8fCBERUZBVUxUX1dJRFRIO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb21iaW5lcyB0aGUgY2VudGVyIGFuZCB6b29tIGFuZCB0aGUgb3RoZXIgbWFwIG9wdGlvbnMgaW50byBhIHNpbmdsZSBvYmplY3QgKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMuTWFwT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAvLyBJdCdzIGltcG9ydGFudCB0aGF0IHdlIHNldCAqKnNvbWUqKiBraW5kIG9mIGBjZW50ZXJgIGFuZCBgem9vbWAsIG90aGVyd2lzZVxuICAgICAgLy8gR29vZ2xlIE1hcHMgd2lsbCByZW5kZXIgYSBibGFuayByZWN0YW5nbGUgd2hpY2ggbG9va3MgYnJva2VuLlxuICAgICAgY2VudGVyOiB0aGlzLl9jZW50ZXIgfHwgb3B0aW9ucy5jZW50ZXIgfHwgREVGQVVMVF9PUFRJT05TLmNlbnRlcixcbiAgICAgIHpvb206IHRoaXMuX3pvb20gPz8gb3B0aW9ucy56b29tID8/IERFRkFVTFRfT1BUSU9OUy56b29tLFxuICAgICAgLy8gUGFzc2luZyBpbiBhbiB1bmRlZmluZWQgYG1hcFR5cGVJZGAgc2VlbXMgdG8gYnJlYWsgdGlsZSBsb2FkaW5nXG4gICAgICAvLyBzbyBtYWtlIHN1cmUgdGhhdCB3ZSBoYXZlIHNvbWUga2luZCBvZiBkZWZhdWx0IChzZWUgIzIyMDgyKS5cbiAgICAgIG1hcFR5cGVJZDogdGhpcy5tYXBUeXBlSWQgfHwgb3B0aW9ucy5tYXBUeXBlSWQgfHwgREVGQVVMVF9PUFRJT05TLm1hcFR5cGVJZCxcbiAgICB9O1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwfSB7XG4gICAgaWYgKCF0aGlzLmdvb2dsZU1hcCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgY3NzVW5pdHNQYXR0ZXJuID0gLyhbQS1aYS16JV0rKSQvO1xuXG4vKiogQ29lcmNlcyBhIHZhbHVlIHRvIGEgQ1NTIHBpeGVsIHZhbHVlLiAqL1xuZnVuY3Rpb24gY29lcmNlQ3NzUGl4ZWxWYWx1ZSh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gY3NzVW5pdHNQYXR0ZXJuLnRlc3QodmFsdWUpID8gdmFsdWUgOiBgJHt2YWx1ZX1weGA7XG59XG4iXX0=