/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" preserve="true" />
import { Directive, Input, Output, NgZone, inject, EventEmitter, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
export class MapPolygon {
    set options(options) {
        this._options.next(options || {});
    }
    set paths(paths) {
        this._paths.next(paths);
    }
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        this._options = new BehaviorSubject({});
        this._paths = new BehaviorSubject(undefined);
        this._destroyed = new Subject();
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
         */
        this.polygonClick = this._eventManager.getLazyEmitter('click');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
         */
        this.polygonDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
         */
        this.polygonDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
         */
        this.polygonDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
         */
        this.polygonDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
         */
        this.polygonMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
         */
        this.polygonMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
         */
        this.polygonMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
         */
        this.polygonMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
         */
        this.polygonMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
         */
        this.polygonRightclick = this._eventManager.getLazyEmitter('rightclick');
        /** Event emitted when the polygon is initialized. */
        this.polygonInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            this._combineOptions()
                .pipe(take(1))
                .subscribe(options => {
                if (google.maps.Polygon && this._map.googleMap) {
                    this._initialize(this._map.googleMap, google.maps.Polygon, options);
                }
                else {
                    this._ngZone.runOutsideAngular(() => {
                        Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
                            this._initialize(map, lib.Polygon, options);
                        });
                    });
                }
            });
        }
    }
    _initialize(map, polygonConstructor, options) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.polygon = new polygonConstructor(options);
            this._assertInitialized();
            this.polygon.setMap(map);
            this._eventManager.setTarget(this.polygon);
            this.polygonInitialized.emit(this.polygon);
            this._watchForOptionsChanges();
            this._watchForPathChanges();
        });
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        this.polygon?.setMap(null);
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
     */
    getDraggable() {
        this._assertInitialized();
        return this.polygon.getDraggable();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
     */
    getEditable() {
        this._assertInitialized();
        return this.polygon.getEditable();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
     */
    getPath() {
        this._assertInitialized();
        return this.polygon.getPath();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
     */
    getPaths() {
        this._assertInitialized();
        return this.polygon.getPaths();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
     */
    getVisible() {
        this._assertInitialized();
        return this.polygon.getVisible();
    }
    _combineOptions() {
        return combineLatest([this._options, this._paths]).pipe(map(([options, paths]) => {
            const combinedOptions = {
                ...options,
                paths: paths || options.paths,
            };
            return combinedOptions;
        }));
    }
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
            this._assertInitialized();
            this.polygon.setOptions(options);
        });
    }
    _watchForPathChanges() {
        this._paths.pipe(takeUntil(this._destroyed)).subscribe(paths => {
            if (paths) {
                this._assertInitialized();
                this.polygon.setPaths(paths);
            }
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.polygon) {
                throw Error('Cannot interact with a Google Map Polygon before it has been ' +
                    'initialized. Please wait for the Polygon to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapPolygon, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapPolygon, isStandalone: true, selector: "map-polygon", inputs: { options: "options", paths: "paths" }, outputs: { polygonClick: "polygonClick", polygonDblclick: "polygonDblclick", polygonDrag: "polygonDrag", polygonDragend: "polygonDragend", polygonDragstart: "polygonDragstart", polygonMousedown: "polygonMousedown", polygonMousemove: "polygonMousemove", polygonMouseout: "polygonMouseout", polygonMouseover: "polygonMouseover", polygonMouseup: "polygonMouseup", polygonRightclick: "polygonRightclick", polygonInitialized: "polygonInitialized" }, exportAs: ["mapPolygon"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapPolygon, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-polygon',
                    exportAs: 'mapPolygon',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { options: [{
                type: Input
            }], paths: [{
                type: Input
            }], polygonClick: [{
                type: Output
            }], polygonDblclick: [{
                type: Output
            }], polygonDrag: [{
                type: Output
            }], polygonDragend: [{
                type: Output
            }], polygonDragstart: [{
                type: Output
            }], polygonMousedown: [{
                type: Output
            }], polygonMousemove: [{
                type: Output
            }], polygonMouseout: [{
                type: Output
            }], polygonMouseover: [{
                type: Output
            }], polygonMouseup: [{
                type: Output
            }], polygonRightclick: [{
                type: Output
            }], polygonInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlnb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXBvbHlnb24vbWFwLXBvbHlnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFFckQ7Ozs7R0FJRztBQU1ILE1BQU0sT0FBTyxVQUFVO0lBb0JyQixJQUNJLE9BQU8sQ0FBQyxPQUFtQztRQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQ0ksS0FBSyxDQUNQLEtBSStCO1FBRS9CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUF3RUQsWUFDbUIsSUFBZSxFQUNmLE9BQWU7UUFEZixTQUFJLEdBQUosSUFBSSxDQUFXO1FBQ2YsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQTNHMUIsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQTZCLEVB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LENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0QsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDVixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNsQixNQUFNLEtBQUssQ0FDVCwrREFBK0Q7b0JBQzdELHFGQUFxRixDQUN4RixDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO3FIQTNPVSxVQUFVO3lHQUFWLFVBQVU7O2tHQUFWLFVBQVU7a0JBTHRCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFFBQVEsRUFBRSxZQUFZO29CQUN0QixVQUFVLEVBQUUsSUFBSTtpQkFDakI7bUdBc0JLLE9BQU87c0JBRFYsS0FBSztnQkFNRixLQUFLO3NCQURSLEtBQUs7Z0JBY2EsWUFBWTtzQkFBOUIsTUFBTTtnQkFNWSxlQUFlO3NCQUFqQyxNQUFNO2dCQU1ZLFdBQVc7c0JBQTdCLE1BQU07Z0JBTVksY0FBYztzQkFBaEMsTUFBTTtnQkFNWSxnQkFBZ0I7c0JBQWxDLE1BQU07Z0JBTVksZ0JBQWdCO3NCQUFsQyxNQUFNO2dCQU1ZLGdCQUFnQjtzQkFBbEMsTUFBTTtnQkFNWSxlQUFlO3NCQUFqQyxNQUFNO2dCQU1ZLGdCQUFnQjtzQkFBbEMsTUFBTTtnQkFNWSxjQUFjO3NCQUFoQyxNQUFNO2dCQU1ZLGlCQUFpQjtzQkFBbkMsTUFBTTtnQkFJWSxrQkFBa0I7c0JBQXBDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIHByZXNlcnZlPVwidHJ1ZVwiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbiAgaW5qZWN0LFxuICBFdmVudEVtaXR0ZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgUG9seWdvbiB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvblxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtcG9seWdvbicsXG4gIGV4cG9ydEFzOiAnbWFwUG9seWdvbicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcFBvbHlnb24gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5Qb2x5Z29uT3B0aW9ucz4oe30pO1xuICBwcml2YXRlIHJlYWRvbmx5IF9wYXRocyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8XG4gICAgfCBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+PlxuICAgIHwgZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPlxuICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nW11cbiAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxbXVxuICAgIHwgdW5kZWZpbmVkXG4gID4odW5kZWZpbmVkKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5Qb2x5Z29uIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uXG4gICAqL1xuICBwb2x5Z29uPzogZ29vZ2xlLm1hcHMuUG9seWdvbjtcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5Z29uT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IHt9KTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBwYXRocyhcbiAgICBwYXRoczpcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPj5cbiAgICAgIHwgZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPlxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdbXVxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW10sXG4gICkge1xuICAgIHRoaXMuX3BhdGhzLm5leHQocGF0aHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlnb25DbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlnb25EYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5kcmFnXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9seWdvbkRyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24uZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlnb25EcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlnb25EcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5Z29uTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2Vkb3duJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5tb3VzZW1vdmVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5Z29uTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlnb25Nb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5Z29uTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9seWdvbk1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9seWdvblJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgcG9seWdvbiBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlnb25Jbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlnb24+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlnb24+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fbWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2NvbWJpbmVPcHRpb25zKClcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgICBpZiAoZ29vZ2xlLm1hcHMuUG9seWdvbiAmJiB0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKHRoaXMuX21hcC5nb29nbGVNYXAsIGdvb2dsZS5tYXBzLlBvbHlnb24sIG9wdGlvbnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5fbWFwLl9yZXNvbHZlTWFwKCksIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ21hcHMnKV0pLnRoZW4oXG4gICAgICAgICAgICAgICAgKFttYXAsIGxpYl0pID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUobWFwLCAobGliIGFzIGdvb2dsZS5tYXBzLk1hcHNMaWJyYXJ5KS5Qb2x5Z29uLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIG1hcDogZ29vZ2xlLm1hcHMuTWFwLFxuICAgIHBvbHlnb25Db25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLlBvbHlnb24sXG4gICAgb3B0aW9uczogZ29vZ2xlLm1hcHMuUG9seWdvbk9wdGlvbnMsXG4gICkge1xuICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLnBvbHlnb24gPSBuZXcgcG9seWdvbkNvbnN0cnVjdG9yKG9wdGlvbnMpO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMucG9seWdvbi5zZXRNYXAobWFwKTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5wb2x5Z29uKTtcbiAgICAgIHRoaXMucG9seWdvbkluaXRpYWxpemVkLmVtaXQodGhpcy5wb2x5Z29uKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yUGF0aENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLnBvbHlnb24/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24uZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5Z29uLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5nZXRFZGl0YWJsZVxuICAgKi9cbiAgZ2V0RWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5Z29uLmdldEVkaXRhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLmdldFBhdGhcbiAgICovXG4gIGdldFBhdGgoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5Z29uLmdldFBhdGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24uZ2V0UGF0aHNcbiAgICovXG4gIGdldFBhdGhzKCk6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz4+IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlnb24uZ2V0UGF0aHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24uZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlnb24uZ2V0VmlzaWJsZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5Z29uT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9wYXRoc10pLnBpcGUoXG4gICAgICBtYXAoKFtvcHRpb25zLCBwYXRoc10pID0+IHtcbiAgICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5Z29uT3B0aW9ucyA9IHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIHBhdGhzOiBwYXRocyB8fCBvcHRpb25zLnBhdGhzLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5wb2x5Z29uLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBhdGhDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3BhdGhzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShwYXRocyA9PiB7XG4gICAgICBpZiAocGF0aHMpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5wb2x5Z29uLnNldFBhdGhzKHBhdGhzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7cG9seWdvbjogZ29vZ2xlLm1hcHMuUG9seWdvbn0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5wb2x5Z29uKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgUG9seWdvbiBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgUG9seWdvbiB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19