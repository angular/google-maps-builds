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
import { Directive, Input, Output, NgZone, inject, EventEmitter, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
 */
export class MapRectangle {
    set options(options) {
        this._options.next(options || {});
    }
    set bounds(bounds) {
        this._bounds.next(bounds);
    }
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        this._options = new BehaviorSubject({});
        this._bounds = new BehaviorSubject(undefined);
        this._destroyed = new Subject();
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.boundsChanged
         */ this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
         */
        this.rectangleClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
         */
        this.rectangleDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
         */
        this.rectangleDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
         */
        this.rectangleDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
         */
        this.rectangleDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
         */
        this.rectangleMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
         */
        this.rectangleMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
         */
        this.rectangleMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
         */
        this.rectangleMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
         */
        this.rectangleMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.rightclick
         */
        this.rectangleRightclick = this._eventManager.getLazyEmitter('rightclick');
        /** Event emitted when the rectangle is initialized. */
        this.rectangleInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            this._combineOptions()
                .pipe(take(1))
                .subscribe(options => {
                if (google.maps.Rectangle && this._map.googleMap) {
                    this._initialize(this._map.googleMap, google.maps.Rectangle, options);
                }
                else {
                    this._ngZone.runOutsideAngular(() => {
                        Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
                            this._initialize(map, lib.Rectangle, options);
                        });
                    });
                }
            });
        }
    }
    _initialize(map, rectangleConstructor, options) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.rectangle = new rectangleConstructor(options);
            this._assertInitialized();
            this.rectangle.setMap(map);
            this._eventManager.setTarget(this.rectangle);
            this.rectangleInitialized.emit(this.rectangle);
            this._watchForOptionsChanges();
            this._watchForBoundsChanges();
        });
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        this.rectangle?.setMap(null);
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
     */
    getBounds() {
        this._assertInitialized();
        return this.rectangle.getBounds();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
     */
    getDraggable() {
        this._assertInitialized();
        return this.rectangle.getDraggable();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
     */
    getEditable() {
        this._assertInitialized();
        return this.rectangle.getEditable();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
     */
    getVisible() {
        this._assertInitialized();
        return this.rectangle.getVisible();
    }
    _combineOptions() {
        return combineLatest([this._options, this._bounds]).pipe(map(([options, bounds]) => {
            const combinedOptions = {
                ...options,
                bounds: bounds || options.bounds,
            };
            return combinedOptions;
        }));
    }
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
            this._assertInitialized();
            this.rectangle.setOptions(options);
        });
    }
    _watchForBoundsChanges() {
        this._bounds.pipe(takeUntil(this._destroyed)).subscribe(bounds => {
            if (bounds) {
                this._assertInitialized();
                this.rectangle.setBounds(bounds);
            }
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.rectangle) {
                throw Error('Cannot interact with a Google Map Rectangle before it has been initialized. ' +
                    'Please wait for the Rectangle to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapRectangle, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MapRectangle, isStandalone: true, selector: "map-rectangle", inputs: { options: "options", bounds: "bounds" }, outputs: { boundsChanged: "boundsChanged", rectangleClick: "rectangleClick", rectangleDblclick: "rectangleDblclick", rectangleDrag: "rectangleDrag", rectangleDragend: "rectangleDragend", rectangleDragstart: "rectangleDragstart", rectangleMousedown: "rectangleMousedown", rectangleMousemove: "rectangleMousemove", rectangleMouseout: "rectangleMouseout", rectangleMouseover: "rectangleMouseover", rectangleMouseup: "rectangleMouseup", rectangleRightclick: "rectangleRightclick", rectangleInitialized: "rectangleInitialized" }, exportAs: ["mapRectangle"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapRectangle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-rectangle',
                    exportAs: 'mapRectangle',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { options: [{
                type: Input
            }], bounds: [{
                type: Input
            }], boundsChanged: [{
                type: Output
            }], rectangleClick: [{
                type: Output
            }], rectangleDblclick: [{
                type: Output
            }], rectangleDrag: [{
                type: Output
            }], rectangleDragend: [{
                type: Output
            }], rectangleDragstart: [{
                type: Output
            }], rectangleMousedown: [{
                type: Output
            }], rectangleMousemove: [{
                type: Output
            }], rectangleMouseout: [{
                type: Output
            }], rectangleMouseover: [{
                type: Output
            }], rectangleMouseup: [{
                type: Output
            }], rectangleRightclick: [{
                type: Output
            }], rectangleInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXJlY3RhbmdsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtcmVjdGFuZ2xlL21hcC1yZWN0YW5nbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBR0wsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBRXJEOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8sWUFBWTtJQWdCdkIsSUFDSSxPQUFPLENBQUMsT0FBcUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUNJLE1BQU0sQ0FBQyxNQUFrRTtRQUMzRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBeUZELFlBQ21CLElBQWUsRUFDZixPQUFlO1FBRGYsU0FBSSxHQUFKLElBQUksQ0FBVztRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFsSDFCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0MsYUFBUSxHQUFH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eXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBOZ1pvbmUsXG4gIGluamVjdCxcbiAgRXZlbnRFbWl0dGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIFJlY3RhbmdsZSB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUmVjdGFuZ2xlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1yZWN0YW5nbGUnLFxuICBleHBvcnRBczogJ21hcFJlY3RhbmdsZScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcFJlY3RhbmdsZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLlJlY3RhbmdsZU9wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYm91bmRzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxcbiAgICBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsIHwgdW5kZWZpbmVkXG4gID4odW5kZWZpbmVkKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5SZWN0YW5nbGUgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZVxuICAgKi9cbiAgcmVjdGFuZ2xlPzogZ29vZ2xlLm1hcHMuUmVjdGFuZ2xlO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLlJlY3RhbmdsZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgYm91bmRzKGJvdW5kczogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCkge1xuICAgIHRoaXMuX2JvdW5kcy5uZXh0KGJvdW5kcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNSZWN0YW5nbGUuYm91bmRzQ2hhbmdlZFxuICAgKi8gQE91dHB1dCgpIHJlYWRvbmx5IGJvdW5kc0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignYm91bmRzX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNSZWN0YW5nbGUuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByZWN0YW5nbGVDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlY3RhbmdsZURibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUmVjdGFuZ2xlLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByZWN0YW5nbGVEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNSZWN0YW5nbGUuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlY3RhbmdsZURyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByZWN0YW5nbGVEcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUmVjdGFuZ2xlLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlY3RhbmdsZU1vdXNlZG93bjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNSZWN0YW5nbGUubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcmVjdGFuZ2xlTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlY3RhbmdsZU1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUmVjdGFuZ2xlLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlY3RhbmdsZU1vdXNlb3ZlcjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNSZWN0YW5nbGUubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlY3RhbmdsZU1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2V1cCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcmVjdGFuZ2xlUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgcmVjdGFuZ2xlIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcmVjdGFuZ2xlSW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5SZWN0YW5nbGU+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLlJlY3RhbmdsZT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKVxuICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIGlmIChnb29nbGUubWFwcy5SZWN0YW5nbGUgJiYgdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9tYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy5SZWN0YW5nbGUsIG9wdGlvbnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5fbWFwLl9yZXNvbHZlTWFwKCksIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ21hcHMnKV0pLnRoZW4oXG4gICAgICAgICAgICAgICAgKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLk1hcHNMaWJyYXJ5KS5SZWN0YW5nbGUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUoXG4gICAgbWFwOiBnb29nbGUubWFwcy5NYXAsXG4gICAgcmVjdGFuZ2xlQ29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy5SZWN0YW5nbGUsXG4gICAgb3B0aW9uczogZ29vZ2xlLm1hcHMuUmVjdGFuZ2xlT3B0aW9ucyxcbiAgKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMucmVjdGFuZ2xlID0gbmV3IHJlY3RhbmdsZUNvbnN0cnVjdG9yKG9wdGlvbnMpO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMucmVjdGFuZ2xlLnNldE1hcChtYXApO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLnJlY3RhbmdsZSk7XG4gICAgICB0aGlzLnJlY3RhbmdsZUluaXRpYWxpemVkLmVtaXQodGhpcy5yZWN0YW5nbGUpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JCb3VuZHNDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5yZWN0YW5nbGU/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5nZXRCb3VuZHNcbiAgICovXG4gIGdldEJvdW5kcygpOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnJlY3RhbmdsZS5nZXRCb3VuZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnJlY3RhbmdsZS5nZXREcmFnZ2FibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5nZXRFZGl0YWJsZVxuICAgKi9cbiAgZ2V0RWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5yZWN0YW5nbGUuZ2V0RWRpdGFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1JlY3RhbmdsZS5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMucmVjdGFuZ2xlLmdldFZpc2libGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUmVjdGFuZ2xlT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9ib3VuZHNdKS5waXBlKFxuICAgICAgbWFwKChbb3B0aW9ucywgYm91bmRzXSkgPT4ge1xuICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLlJlY3RhbmdsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICBib3VuZHM6IGJvdW5kcyB8fCBvcHRpb25zLmJvdW5kcyxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMucmVjdGFuZ2xlLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckJvdW5kc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fYm91bmRzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShib3VuZHMgPT4ge1xuICAgICAgaWYgKGJvdW5kcykge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLnJlY3RhbmdsZS5zZXRCb3VuZHMoYm91bmRzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7cmVjdGFuZ2xlOiBnb29nbGUubWFwcy5SZWN0YW5nbGV9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMucmVjdGFuZ2xlKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgUmVjdGFuZ2xlIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBSZWN0YW5nbGUgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==