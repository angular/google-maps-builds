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
     * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     */
    open(anchor, shouldFocus) {
        this._assertInitialized();
        const anchorObject = anchor ? anchor.getAnchor() : undefined;
        // Prevent the info window from initializing when trying to reopen on the same anchor.
        // Note that when the window is opened for the first time, the anchor will always be
        // undefined. If that's the case, we have to allow it to open in order to handle the
        // case where the window doesn't have an anchor, but is placed at a particular position.
        if (this.infoWindow.get('anchor') !== anchorObject || !anchorObject) {
            this._elementRef.nativeElement.style.display = '';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0-rc.1", ngImport: i0, type: MapInfoWindow, deps: [{ token: i1.GoogleMap }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0-rc.1", type: MapInfoWindow, isStandalone: true, selector: "map-info-window", inputs: { options: "options", position: "position" }, outputs: { closeclick: "closeclick", contentChanged: "contentChanged", domready: "domready", positionChanged: "positionChanged", zindexChanged: "zindexChanged", infoWindowInitialized: "infoWindowInitialized" }, host: { styleAttribute: "display: none" }, exportAs: ["mapInfoWindow"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0-rc.1", ngImport: i0, type: MapInfoWindow, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWluZm8td2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1pbmZvLXdpbmRvdy9tYXAtaW5mby13aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7OztBQUdyRDs7OztHQUlHO0FBT0gsTUFBTSxPQUFPLGFBQWE7SUFleEIsSUFDSSxPQUFPLENBQUMsT0FBc0M7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUNJLFFBQVEsQ0FBQyxRQUF3RDtRQUNuRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBNENELFlBQ21CLFVBQXFCLEVBQzlCLFdBQW9DLEVBQ3BDLE9BQWU7UUFGTixlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBckVqQixrQkFBYSxHQUFHLElB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QUFDLENBQUM7WUFDeEMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNyQixNQUFNLEtBQUssQ0FDVCxtRUFBbUU7b0JBQ2pFLHNGQUFzRjtvQkFDdEYsS0FBSyxDQUNSLENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7bUhBeE5VLGFBQWE7dUdBQWIsYUFBYTs7Z0dBQWIsYUFBYTtrQkFOekIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixRQUFRLEVBQUUsZUFBZTtvQkFDekIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUM7aUJBQ2pDOzRIQWlCSyxPQUFPO3NCQURWLEtBQUs7Z0JBTUYsUUFBUTtzQkFEWCxLQUFLO2dCQVNhLFVBQVU7c0JBQTVCLE1BQU07Z0JBUVksY0FBYztzQkFBaEMsTUFBTTtnQkFPWSxRQUFRO3NCQUExQixNQUFNO2dCQVFZLGVBQWU7c0JBQWpDLE1BQU07Z0JBUVksYUFBYTtzQkFBL0IsTUFBTTtnQkFJWSxxQkFBcUI7c0JBQXZDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge01hcEFuY2hvclBvaW50fSBmcm9tICcuLi9tYXAtYW5jaG9yLXBvaW50JztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBpbmZvIHdpbmRvdyB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1pbmZvLXdpbmRvdycsXG4gIGV4cG9ydEFzOiAnbWFwSW5mb1dpbmRvdycsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGhvc3Q6IHsnc3R5bGUnOiAnZGlzcGxheTogbm9uZSd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXBJbmZvV2luZG93IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKGluamVjdChOZ1pvbmUpKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcG9zaXRpb24gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFxuICAgIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCBnb29nbGUubWFwcy5MYXRMbmcgfCB1bmRlZmluZWRcbiAgPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVW5kZXJseWluZyBnb29nbGUubWFwcy5JbmZvV2luZG93XG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93I0luZm9XaW5kb3dcbiAgICovXG4gIGluZm9XaW5kb3c/OiBnb29nbGUubWFwcy5JbmZvV2luZG93O1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLkluZm9XaW5kb3dPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5uZXh0KG9wdGlvbnMgfHwge30pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHBvc2l0aW9uKHBvc2l0aW9uOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHwgZ29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fcG9zaXRpb24ubmV4dChwb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5jbG9zZWNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VjbGljazogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbG9zZWNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gICAqICNJbmZvV2luZG93LmNvbnRlbnRfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNvbnRlbnRDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NvbnRlbnRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmRvbXJlYWR5XG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZG9tcmVhZHk6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZG9tcmVhZHknKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAgICogI0luZm9XaW5kb3cucG9zaXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvc2l0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdwb3NpdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gICAqICNJbmZvV2luZG93LnppbmRleF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgemluZGV4Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd6aW5kZXhfY2hhbmdlZCcpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGluZm8gd2luZG93IGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5mb1dpbmRvd0luaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuSW5mb1dpbmRvdz4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuSW5mb1dpbmRvdz4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKVxuICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIGlmIChnb29nbGUubWFwcy5JbmZvV2luZG93KSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKGdvb2dsZS5tYXBzLkluZm9XaW5kb3csIG9wdGlvbnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdtYXBzJykudGhlbihsaWIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUoKGxpYiBhcyBnb29nbGUubWFwcy5NYXBzTGlicmFyeSkuSW5mb1dpbmRvdywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIGluZm9XaW5kb3dDb25zdHJ1Y3RvcjogdHlwZW9mIGdvb2dsZS5tYXBzLkluZm9XaW5kb3csXG4gICAgb3B0aW9uczogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnMsXG4gICkge1xuICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmluZm9XaW5kb3cgPSBuZXcgaW5mb1dpbmRvd0NvbnN0cnVjdG9yKG9wdGlvbnMpO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmluZm9XaW5kb3cpO1xuICAgICAgdGhpcy5pbmZvV2luZG93SW5pdGlhbGl6ZWQuZW1pdCh0aGlzLmluZm9XaW5kb3cpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JQb3NpdGlvbkNoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuXG4gICAgLy8gSWYgbm8gaW5mbyB3aW5kb3cgaGFzIGJlZW4gY3JlYXRlZCBvbiB0aGUgc2VydmVyLCB3ZSBkbyBub3QgdHJ5IGNsb3NpbmcgaXQuXG4gICAgLy8gT24gdGhlIHNlcnZlciwgYW4gaW5mbyB3aW5kb3cgY2Fubm90IGJlIGNyZWF0ZWQgYW5kIHRoaXMgd291bGQgY2F1c2UgZXJyb3JzLlxuICAgIGlmICh0aGlzLmluZm9XaW5kb3cpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5jbG9zZVxuICAgKi9cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmluZm9XaW5kb3cuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmdldENvbnRlbnRcbiAgICovXG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHwgTm9kZSB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5mb1dpbmRvdy5nZXRDb250ZW50KCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy5nZXRQb3NpdGlvblxuICAgKi9cbiAgZ2V0UG9zaXRpb24oKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5pbmZvV2luZG93LmdldFBvc2l0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmdldFpJbmRleFxuICAgKi9cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5pbmZvV2luZG93LmdldFpJbmRleCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBNYXBJbmZvV2luZG93IHVzaW5nIHRoZSBwcm92aWRlZCBhbmNob3IuIElmIHRoZSBhbmNob3IgaXMgbm90IHNldCxcbiAgICogdGhlbiB0aGUgcG9zaXRpb24gcHJvcGVydHkgb2YgdGhlIG9wdGlvbnMgaW5wdXQgaXMgdXNlZCBpbnN0ZWFkLlxuICAgKi9cbiAgb3BlbihhbmNob3I/OiBNYXBBbmNob3JQb2ludCwgc2hvdWxkRm9jdXM/OiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICBjb25zdCBhbmNob3JPYmplY3QgPSBhbmNob3IgPyBhbmNob3IuZ2V0QW5jaG9yKCkgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBQcmV2ZW50IHRoZSBpbmZvIHdpbmRvdyBmcm9tIGluaXRpYWxpemluZyB3aGVuIHRyeWluZyB0byByZW9wZW4gb24gdGhlIHNhbWUgYW5jaG9yLlxuICAgIC8vIE5vdGUgdGhhdCB3aGVuIHRoZSB3aW5kb3cgaXMgb3BlbmVkIGZvciB0aGUgZmlyc3QgdGltZSwgdGhlIGFuY2hvciB3aWxsIGFsd2F5cyBiZVxuICAgIC8vIHVuZGVmaW5lZC4gSWYgdGhhdCdzIHRoZSBjYXNlLCB3ZSBoYXZlIHRvIGFsbG93IGl0IHRvIG9wZW4gaW4gb3JkZXIgdG8gaGFuZGxlIHRoZVxuICAgIC8vIGNhc2Ugd2hlcmUgdGhlIHdpbmRvdyBkb2Vzbid0IGhhdmUgYW4gYW5jaG9yLCBidXQgaXMgcGxhY2VkIGF0IGEgcGFydGljdWxhciBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5pbmZvV2luZG93LmdldCgnYW5jaG9yJykgIT09IGFuY2hvck9iamVjdCB8fCAhYW5jaG9yT2JqZWN0KSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgdGhpcy5pbmZvV2luZG93Lm9wZW4oe1xuICAgICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgICAgIGFuY2hvcjogYW5jaG9yT2JqZWN0LFxuICAgICAgICBzaG91bGRGb2N1cyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fcG9zaXRpb25dKS5waXBlKFxuICAgICAgbWFwKChbb3B0aW9ucywgcG9zaXRpb25dKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnMgPSB7XG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICBjb250ZW50OiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5pbmZvV2luZG93LnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHBvc2l0aW9uID0+IHtcbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtpbmZvV2luZG93OiBnb29nbGUubWFwcy5JbmZvV2luZG93fSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmluZm9XaW5kb3cpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBJbmZvIFdpbmRvdyBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgSW5mbyBXaW5kb3cgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggJyArXG4gICAgICAgICAgICAnaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==