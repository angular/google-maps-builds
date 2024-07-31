/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" preserve="true" />
import { Directive, ElementRef, EventEmitter, Input, NgZone, Output, inject, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
export class MapInfoWindow {
    set options(options) {
        this._options.next(options || {});
    }
    set position(position) {
        this._position.next(position);
    }
    constructor(_googleMap, _elementRef, _ngZone) {
        this._googleMap = _googleMap;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
        this._options = new BehaviorSubject({});
        this._position = new BehaviorSubject(undefined);
        this._destroy = new Subject();
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
         */
        this.closeclick = this._eventManager.getLazyEmitter('closeclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.content_changed
         */
        this.contentChanged = this._eventManager.getLazyEmitter('content_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
         */
        this.domready = this._eventManager.getLazyEmitter('domready');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.position_changed
         */
        this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.zindex_changed
         */
        this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
        /** Event emitted when the info window is initialized. */
        this.infoWindowInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            this._combineOptions()
                .pipe(take(1))
                .subscribe(options => {
                if (google.maps.InfoWindow) {
                    this._initialize(google.maps.InfoWindow, options);
                }
                else {
                    this._ngZone.runOutsideAngular(() => {
                        google.maps.importLibrary('maps').then(lib => {
                            this._initialize(lib.InfoWindow, options);
                        });
                    });
                }
            });
        }
    }
    _initialize(infoWindowConstructor, options) {
        // Create the object outside the zone so its events don't trigger change detection.
        // We'll bring it back in inside the `MapEventManager` only for the events that the
        // user has subscribed to.
        this._ngZone.runOutsideAngular(() => {
            this.infoWindow = new infoWindowConstructor(options);
            this._eventManager.setTarget(this.infoWindow);
            this.infoWindowInitialized.emit(this.infoWindow);
            this._watchForOptionsChanges();
            this._watchForPositionChanges();
        });
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroy.next();
        this._destroy.complete();
        // If no info window has been created on the server, we do not try closing it.
        // On the server, an info window cannot be created and this would cause errors.
        if (this.infoWindow) {
            this.close();
        }
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
     */
    close() {
        this._assertInitialized();
        this.infoWindow.close();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     */
    getContent() {
        this._assertInitialized();
        return this.infoWindow.getContent() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     */
    getPosition() {
        this._assertInitialized();
        return this.infoWindow.getPosition() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     */
    getZIndex() {
        this._assertInitialized();
        return this.infoWindow.getZIndex();
    }
    /**
     * Opens the MapInfoWindow using the provided AdvancedMarkerElement.
     * @deprecated Use the `open` method instead.
     * @breaking-change 20.0.0
     */
    openAdvancedMarkerElement(advancedMarkerElement, content) {
        this.open({
            getAnchor: () => advancedMarkerElement,
        }, undefined, content);
    }
    /**
     * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     */
    open(anchor, shouldFocus, content) {
        this._assertInitialized();
        if ((typeof ngDevMode === 'undefined' || ngDevMode) && anchor && !anchor.getAnchor) {
            throw new Error('Specified anchor does not implement the `getAnchor` method. ' +
                'It cannot be used to open an info window.');
        }
        const anchorObject = anchor ? anchor.getAnchor() : undefined;
        // Prevent the info window from initializing when trying to reopen on the same anchor.
        // Note that when the window is opened for the first time, the anchor will always be
        // undefined. If that's the case, we have to allow it to open in order to handle the
        // case where the window doesn't have an anchor, but is placed at a particular position.
        if (this.infoWindow.get('anchor') !== anchorObject || !anchorObject) {
            this._elementRef.nativeElement.style.display = '';
            if (content) {
                this.infoWindow.setContent(content);
            }
            this.infoWindow.open({
                map: this._googleMap.googleMap,
                anchor: anchorObject,
                shouldFocus,
            });
        }
    }
    _combineOptions() {
        return combineLatest([this._options, this._position]).pipe(map(([options, position]) => {
            const combinedOptions = {
                ...options,
                position: position || options.position,
                content: this._elementRef.nativeElement,
            };
            return combinedOptions;
        }));
    }
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroy)).subscribe(options => {
            this._assertInitialized();
            this.infoWindow.setOptions(options);
        });
    }
    _watchForPositionChanges() {
        this._position.pipe(takeUntil(this._destroy)).subscribe(position => {
            if (position) {
                this._assertInitialized();
                this.infoWindow.setPosition(position);
            }
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.infoWindow) {
                throw Error('Cannot interact with a Google Map Info Window before it has been ' +
                    'initialized. Please wait for the Info Window to load before trying to interact with ' +
                    'it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapInfoWindow, deps: [{ token: i1.GoogleMap }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapInfoWindow, isStandalone: true, selector: "map-info-window", inputs: { options: "options", position: "position" }, outputs: { closeclick: "closeclick", contentChanged: "contentChanged", domready: "domready", positionChanged: "positionChanged", zindexChanged: "zindexChanged", infoWindowInitialized: "infoWindowInitialized" }, host: { styleAttribute: "display: none" }, exportAs: ["mapInfoWindow"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapInfoWindow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-info-window',
                    exportAs: 'mapInfoWindow',
                    standalone: true,
                    host: { 'style': 'display: none' },
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.ElementRef }, { type: i0.NgZone }], propDecorators: { options: [{
                type: Input
            }], position: [{
                type: Input
            }], closeclick: [{
                type: Output
            }], contentChanged: [{
                type: Output
            }], domready: [{
                type: Output
            }], positionChanged: [{
                type: Output
            }], zindexChanged: [{
                type: Output
            }], infoWindowInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWluZm8td2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1pbmZvLXdpbmRvdy9tYXAtaW5mby13aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBQ04sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBR3JEOzs7O0dBSUc7QUFPSCxNQUFNLE9BQU8sYUFBYTtJQWV4QixJQUNJLE9BQU8sQ0FBQyxPQUFzQztRQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQ0ksUUFBUSxDQUFDLFFBQXdEO1FBQ25FLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUE0Q0QsWUFDbUIsVUFBcUIsRUFDOUIsV0FBb0MsRUFDcEMsT0FBZTtRQUZOLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDOUIsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFyRWpCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0MsYUFBUSxHQUFHLElBQUksZUFBZSxDQUFnQyxFQUFFLENBQUMsQ0FBQztRQUNsRSxjQUFTLEdBQUcsSUFBSSxlQUFlLENBRTlDLFNBQVMsQ0FBQyxDQUFDO1FBQ0ksYUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFtQmhEOzs7V0FHRztRQUNnQixlQUFVLEdBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLFlBQVksQ0FBQyxDQUFDO1FBRXhEOzs7O1dBSUc7UUFDZ0IsbUJBQWMsR0FDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQU8saUJBQWlCLENBQUMsQ0FBQztRQUU3RDs7O1dBR0c7UUFDZ0IsYUFBUSxHQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxVQUFVLENBQUMsQ0FBQztRQUV0RDs7OztXQUlHO1FBQ2dCLG9CQUFlLEdBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLGtCQUFrQixDQUFDLENBQUM7UUFFOUQ7Ozs7V0FJRztRQUNnQixrQkFBYSxHQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTVELHlEQUF5RDtRQUN0QywwQkFBcUIsR0FDdEMsSUFBSSxZQUFZLEVBQTBCLENBQUM7SUFNMUMsQ0FBQztJQUVKLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLGVBQWUsRUFBRTtpQkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDYixTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ25CLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEQsQ0FBQztxQkFBTSxDQUFDO29CQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO3dCQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQzNDLElBQUksQ0FBQyxXQUFXLENBQUUsR0FBK0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ3pFLENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUNqQixxQkFBb0QsRUFDcEQsT0FBc0M7UUFFdEMsbUZBQW1GO1FBQ25GLG1GQUFtRjtRQUNuRiwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFekIsOEVBQThFO1FBQzlFLCtFQUErRTtRQUMvRSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSztRQUNILElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFVBQVU7UUFDUixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDO0lBQzlDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsV0FBVztRQUNULElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVM7UUFDUCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx5QkFBeUIsQ0FDdkIscUJBQStELEVBQy9ELE9BQWlDO1FBRWpDLElBQUksQ0FBQyxJQUFJLENBQ1A7WUFDRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMscUJBQXFCO1NBQ3ZDLEVBQ0QsU0FBUyxFQUNULE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksQ0FBQyxNQUF1QixFQUFFLFdBQXFCLEVBQUUsT0FBaUM7UUFDcEYsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsSUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkYsTUFBTSxJQUFJLEtBQUssQ0FDYiw4REFBOEQ7Z0JBQzVELDJDQUEyQyxDQUM5QyxDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFN0Qsc0ZBQXNGO1FBQ3RGLG9GQUFvRjtRQUNwRixvRkFBb0Y7UUFDcEYsd0ZBQXdGO1FBQ3hGLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEQsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDWixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7Z0JBQzlCLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixXQUFXO2FBQ1osQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFTyxlQUFlO1FBQ3JCLE9BQU8sYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3hELEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxlQUFlLEdBQWtDO2dCQUNyRCxHQUFHLE9BQU87Z0JBQ1YsUUFBUSxFQUFFLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUTtnQkFDdEMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYTthQUN4QyxDQUFDO1lBQ0YsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMvRCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyx3QkFBd0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNqRSxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNiLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3hCLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3JCLE1BQU0sS0FBSyxDQUNULG1FQUFtRTtvQkFDakUsc0ZBQXNGO29CQUN0RixLQUFLLENBQ1IsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztxSEFyUFUsYUFBYTt5R0FBYixhQUFhOztrR0FBYixhQUFhO2tCQU56QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRSxlQUFlO29CQUN6QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBQztpQkFDakM7NEhBaUJLLE9BQU87c0JBRFYsS0FBSztnQkFNRixRQUFRO3NCQURYLEtBQUs7Z0JBU2EsVUFBVTtzQkFBNUIsTUFBTTtnQkFRWSxjQUFjO3NCQUFoQyxNQUFNO2dCQU9ZLFFBQVE7c0JBQTFCLE1BQU07Z0JBUVksZUFBZTtzQkFBakMsTUFBTTtnQkFRWSxhQUFhO3NCQUEvQixNQUFNO2dCQUlZLHFCQUFxQjtzQkFBdkMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgcHJlc2VydmU9XCJ0cnVlXCIgLz5cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7TWFwQW5jaG9yUG9pbnR9IGZyb20gJy4uL21hcC1hbmNob3ItcG9pbnQnO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIGluZm8gd2luZG93IHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWluZm8td2luZG93JyxcbiAgZXhwb3J0QXM6ICdtYXBJbmZvV2luZG93JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaG9zdDogeydzdHlsZSc6ICdkaXNwbGF5OiBub25lJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hcEluZm9XaW5kb3cgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5JbmZvV2luZG93T3B0aW9ucz4oe30pO1xuICBwcml2YXRlIHJlYWRvbmx5IF9wb3NpdGlvbiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8XG4gICAgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZyB8IHVuZGVmaW5lZFxuICA+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBVbmRlcmx5aW5nIGdvb2dsZS5tYXBzLkluZm9XaW5kb3dcbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvd1xuICAgKi9cbiAgaW5mb1dpbmRvdz86IGdvb2dsZS5tYXBzLkluZm9XaW5kb3c7XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCBnb29nbGUubWFwcy5MYXRMbmcpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5uZXh0KHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmNsb3NlY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbG9zZWNsaWNrOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2Nsb3NlY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAgICogI0luZm9XaW5kb3cuY29udGVudF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY29udGVudENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY29udGVudF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93I0luZm9XaW5kb3cuZG9tcmVhZHlcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkb21yZWFkeTogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkb21yZWFkeScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy5wb3NpdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9zaXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Bvc2l0aW9uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAgICogI0luZm9XaW5kb3cuemluZGV4X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB6aW5kZXhDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3ppbmRleF9jaGFuZ2VkJyk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgaW5mbyB3aW5kb3cgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBpbmZvV2luZG93SW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5JbmZvV2luZG93PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5JbmZvV2luZG93PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpXG4gICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgICAgaWYgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdywgb3B0aW9ucyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ21hcHMnKS50aGVuKGxpYiA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgobGliIGFzIGdvb2dsZS5tYXBzLk1hcHNMaWJyYXJ5KS5JbmZvV2luZG93LCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemUoXG4gICAgaW5mb1dpbmRvd0NvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyxcbiAgICBvcHRpb25zOiBnb29nbGUubWFwcy5JbmZvV2luZG93T3B0aW9ucyxcbiAgKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuaW5mb1dpbmRvdyA9IG5ldyBpbmZvV2luZG93Q29uc3RydWN0b3Iob3B0aW9ucyk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuaW5mb1dpbmRvdyk7XG4gICAgICB0aGlzLmluZm9XaW5kb3dJbml0aWFsaXplZC5lbWl0KHRoaXMuaW5mb1dpbmRvdyk7XG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG5cbiAgICAvLyBJZiBubyBpbmZvIHdpbmRvdyBoYXMgYmVlbiBjcmVhdGVkIG9uIHRoZSBzZXJ2ZXIsIHdlIGRvIG5vdCB0cnkgY2xvc2luZyBpdC5cbiAgICAvLyBPbiB0aGUgc2VydmVyLCBhbiBpbmZvIHdpbmRvdyBjYW5ub3QgYmUgY3JlYXRlZCBhbmQgdGhpcyB3b3VsZCBjYXVzZSBlcnJvcnMuXG4gICAgaWYgKHRoaXMuaW5mb1dpbmRvdykge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmNsb3NlXG4gICAqL1xuICBjbG9zZSgpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuaW5mb1dpbmRvdy5jbG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93I0luZm9XaW5kb3cuZ2V0Q29udGVudFxuICAgKi9cbiAgZ2V0Q29udGVudCgpOiBzdHJpbmcgfCBOb2RlIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5pbmZvV2luZG93LmdldENvbnRlbnQoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gICAqICNJbmZvV2luZG93LmdldFBvc2l0aW9uXG4gICAqL1xuICBnZXRQb3NpdGlvbigpOiBnb29nbGUubWFwcy5MYXRMbmcgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmluZm9XaW5kb3cuZ2V0UG9zaXRpb24oKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93I0luZm9XaW5kb3cuZ2V0WkluZGV4XG4gICAqL1xuICBnZXRaSW5kZXgoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmluZm9XaW5kb3cuZ2V0WkluZGV4KCk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIE1hcEluZm9XaW5kb3cgdXNpbmcgdGhlIHByb3ZpZGVkIEFkdmFuY2VkTWFya2VyRWxlbWVudC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBgb3BlbmAgbWV0aG9kIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMjAuMC4wXG4gICAqL1xuICBvcGVuQWR2YW5jZWRNYXJrZXJFbGVtZW50KFxuICAgIGFkdmFuY2VkTWFya2VyRWxlbWVudDogZ29vZ2xlLm1hcHMubWFya2VyLkFkdmFuY2VkTWFya2VyRWxlbWVudCxcbiAgICBjb250ZW50Pzogc3RyaW5nIHwgRWxlbWVudCB8IFRleHQsXG4gICk6IHZvaWQge1xuICAgIHRoaXMub3BlbihcbiAgICAgIHtcbiAgICAgICAgZ2V0QW5jaG9yOiAoKSA9PiBhZHZhbmNlZE1hcmtlckVsZW1lbnQsXG4gICAgICB9LFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgY29udGVudCxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBNYXBJbmZvV2luZG93IHVzaW5nIHRoZSBwcm92aWRlZCBhbmNob3IuIElmIHRoZSBhbmNob3IgaXMgbm90IHNldCxcbiAgICogdGhlbiB0aGUgcG9zaXRpb24gcHJvcGVydHkgb2YgdGhlIG9wdGlvbnMgaW5wdXQgaXMgdXNlZCBpbnN0ZWFkLlxuICAgKi9cbiAgb3BlbihhbmNob3I/OiBNYXBBbmNob3JQb2ludCwgc2hvdWxkRm9jdXM/OiBib29sZWFuLCBjb250ZW50Pzogc3RyaW5nIHwgRWxlbWVudCB8IFRleHQpOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuXG4gICAgaWYgKCh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmIGFuY2hvciAmJiAhYW5jaG9yLmdldEFuY2hvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnU3BlY2lmaWVkIGFuY2hvciBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlIGBnZXRBbmNob3JgIG1ldGhvZC4gJyArXG4gICAgICAgICAgJ0l0IGNhbm5vdCBiZSB1c2VkIHRvIG9wZW4gYW4gaW5mbyB3aW5kb3cuJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYW5jaG9yT2JqZWN0ID0gYW5jaG9yID8gYW5jaG9yLmdldEFuY2hvcigpIDogdW5kZWZpbmVkO1xuXG4gICAgLy8gUHJldmVudCB0aGUgaW5mbyB3aW5kb3cgZnJvbSBpbml0aWFsaXppbmcgd2hlbiB0cnlpbmcgdG8gcmVvcGVuIG9uIHRoZSBzYW1lIGFuY2hvci5cbiAgICAvLyBOb3RlIHRoYXQgd2hlbiB0aGUgd2luZG93IGlzIG9wZW5lZCBmb3IgdGhlIGZpcnN0IHRpbWUsIHRoZSBhbmNob3Igd2lsbCBhbHdheXMgYmVcbiAgICAvLyB1bmRlZmluZWQuIElmIHRoYXQncyB0aGUgY2FzZSwgd2UgaGF2ZSB0byBhbGxvdyBpdCB0byBvcGVuIGluIG9yZGVyIHRvIGhhbmRsZSB0aGVcbiAgICAvLyBjYXNlIHdoZXJlIHRoZSB3aW5kb3cgZG9lc24ndCBoYXZlIGFuIGFuY2hvciwgYnV0IGlzIHBsYWNlZCBhdCBhIHBhcnRpY3VsYXIgcG9zaXRpb24uXG4gICAgaWYgKHRoaXMuaW5mb1dpbmRvdy5nZXQoJ2FuY2hvcicpICE9PSBhbmNob3JPYmplY3QgfHwgIWFuY2hvck9iamVjdCkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIHRoaXMuaW5mb1dpbmRvdy5zZXRDb250ZW50KGNvbnRlbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmZvV2luZG93Lm9wZW4oe1xuICAgICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgICAgIGFuY2hvcjogYW5jaG9yT2JqZWN0LFxuICAgICAgICBzaG91bGRGb2N1cyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fcG9zaXRpb25dKS5waXBlKFxuICAgICAgbWFwKChbb3B0aW9ucywgcG9zaXRpb25dKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnMgPSB7XG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICBjb250ZW50OiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5pbmZvV2luZG93LnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHBvc2l0aW9uID0+IHtcbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtpbmZvV2luZG93OiBnb29nbGUubWFwcy5JbmZvV2luZG93fSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmluZm9XaW5kb3cpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBJbmZvIFdpbmRvdyBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgSW5mbyBXaW5kb3cgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggJyArXG4gICAgICAgICAgICAnaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==