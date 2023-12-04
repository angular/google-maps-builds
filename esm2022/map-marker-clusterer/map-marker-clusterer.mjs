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
import { ChangeDetectionStrategy, Component, ContentChildren, Input, NgZone, Output, QueryList, ViewEncapsulation, inject, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import { MapMarker } from '../map-marker/map-marker';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/** Default options for a clusterer. */
const DEFAULT_CLUSTERER_OPTIONS = {};
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export class MapMarkerClusterer {
    set averageCenter(averageCenter) {
        this._averageCenter = averageCenter;
    }
    set batchSizeIE(batchSizeIE) {
        this._batchSizeIE = batchSizeIE;
    }
    set calculator(calculator) {
        this._calculator = calculator;
    }
    set clusterClass(clusterClass) {
        this._clusterClass = clusterClass;
    }
    set enableRetinaIcons(enableRetinaIcons) {
        this._enableRetinaIcons = enableRetinaIcons;
    }
    set gridSize(gridSize) {
        this._gridSize = gridSize;
    }
    set ignoreHidden(ignoreHidden) {
        this._ignoreHidden = ignoreHidden;
    }
    set imageExtension(imageExtension) {
        this._imageExtension = imageExtension;
    }
    set imagePath(imagePath) {
        this._imagePath = imagePath;
    }
    set imageSizes(imageSizes) {
        this._imageSizes = imageSizes;
    }
    set maxZoom(maxZoom) {
        this._maxZoom = maxZoom;
    }
    set minimumClusterSize(minimumClusterSize) {
        this._minimumClusterSize = minimumClusterSize;
    }
    set styles(styles) {
        this._styles = styles;
    }
    set title(title) {
        this._title = title;
    }
    set zIndex(zIndex) {
        this._zIndex = zIndex;
    }
    set zoomOnClick(zoomOnClick) {
        this._zoomOnClick = zoomOnClick;
    }
    set options(options) {
        this._options = options;
    }
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._currentMarkers = new Set();
        this._eventManager = new MapEventManager(inject(NgZone));
        this._destroy = new Subject();
        this.ariaLabelFn = () => '';
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/
         * _google_markerclustererplus.html#clusteringbegin
         */
        this.clusteringbegin = this._eventManager.getLazyEmitter('clusteringbegin');
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
         */
        this.clusteringend = this._eventManager.getLazyEmitter('clusteringend');
        /** Emits when a cluster has been clicked. */
        this.clusterClick = this._eventManager.getLazyEmitter('click');
        this._canInitialize = this._googleMap._isBrowser;
    }
    ngOnInit() {
        if (this._canInitialize) {
            if (typeof MarkerClusterer !== 'function' &&
                (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('MarkerClusterer class not found, cannot construct a marker cluster. ' +
                    'Please install the MarkerClustererPlus library: ' +
                    'https://github.com/googlemaps/js-markerclustererplus');
            }
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.markerClusterer = new MarkerClusterer(this._googleMap.googleMap, [], this._combineOptions());
            });
            this._assertInitialized();
            this._eventManager.setTarget(this.markerClusterer);
        }
    }
    ngAfterContentInit() {
        if (this._canInitialize) {
            this._watchForMarkerChanges();
        }
    }
    ngOnChanges(changes) {
        const { markerClusterer: clusterer, ariaLabelFn, _averageCenter, _batchSizeIE, _calculator, _styles, _clusterClass, _enableRetinaIcons, _gridSize, _ignoreHidden, _imageExtension, _imagePath, _imageSizes, _maxZoom, _minimumClusterSize, _title, _zIndex, _zoomOnClick, } = this;
        if (clusterer) {
            if (changes['options']) {
                clusterer.setOptions(this._combineOptions());
            }
            if (changes['ariaLabelFn']) {
                clusterer.ariaLabelFn = ariaLabelFn;
            }
            if (changes['averageCenter'] && _averageCenter !== undefined) {
                clusterer.setAverageCenter(_averageCenter);
            }
            if (changes['batchSizeIE'] && _batchSizeIE !== undefined) {
                clusterer.setBatchSizeIE(_batchSizeIE);
            }
            if (changes['calculator'] && !!_calculator) {
                clusterer.setCalculator(_calculator);
            }
            if (changes['clusterClass'] && _clusterClass !== undefined) {
                clusterer.setClusterClass(_clusterClass);
            }
            if (changes['enableRetinaIcons'] && _enableRetinaIcons !== undefined) {
                clusterer.setEnableRetinaIcons(_enableRetinaIcons);
            }
            if (changes['gridSize'] && _gridSize !== undefined) {
                clusterer.setGridSize(_gridSize);
            }
            if (changes['ignoreHidden'] && _ignoreHidden !== undefined) {
                clusterer.setIgnoreHidden(_ignoreHidden);
            }
            if (changes['imageExtension'] && _imageExtension !== undefined) {
                clusterer.setImageExtension(_imageExtension);
            }
            if (changes['imagePath'] && _imagePath !== undefined) {
                clusterer.setImagePath(_imagePath);
            }
            if (changes['imageSizes'] && _imageSizes) {
                clusterer.setImageSizes(_imageSizes);
            }
            if (changes['maxZoom'] && _maxZoom !== undefined) {
                clusterer.setMaxZoom(_maxZoom);
            }
            if (changes['minimumClusterSize'] && _minimumClusterSize !== undefined) {
                clusterer.setMinimumClusterSize(_minimumClusterSize);
            }
            if (changes['styles'] && _styles) {
                clusterer.setStyles(_styles);
            }
            if (changes['title'] && _title !== undefined) {
                clusterer.setTitle(_title);
            }
            if (changes['zIndex'] && _zIndex !== undefined) {
                clusterer.setZIndex(_zIndex);
            }
            if (changes['zoomOnClick'] && _zoomOnClick !== undefined) {
                clusterer.setZoomOnClick(_zoomOnClick);
            }
        }
    }
    ngOnDestroy() {
        this._destroy.next();
        this._destroy.complete();
        this._eventManager.destroy();
        if (this.markerClusterer) {
            this.markerClusterer.setMap(null);
        }
    }
    fitMapToMarkers(padding) {
        this._assertInitialized();
        this.markerClusterer.fitMapToMarkers(padding);
    }
    getAverageCenter() {
        this._assertInitialized();
        return this.markerClusterer.getAverageCenter();
    }
    getBatchSizeIE() {
        this._assertInitialized();
        return this.markerClusterer.getBatchSizeIE();
    }
    getCalculator() {
        this._assertInitialized();
        return this.markerClusterer.getCalculator();
    }
    getClusterClass() {
        this._assertInitialized();
        return this.markerClusterer.getClusterClass();
    }
    getClusters() {
        this._assertInitialized();
        return this.markerClusterer.getClusters();
    }
    getEnableRetinaIcons() {
        this._assertInitialized();
        return this.markerClusterer.getEnableRetinaIcons();
    }
    getGridSize() {
        this._assertInitialized();
        return this.markerClusterer.getGridSize();
    }
    getIgnoreHidden() {
        this._assertInitialized();
        return this.markerClusterer.getIgnoreHidden();
    }
    getImageExtension() {
        this._assertInitialized();
        return this.markerClusterer.getImageExtension();
    }
    getImagePath() {
        this._assertInitialized();
        return this.markerClusterer.getImagePath();
    }
    getImageSizes() {
        this._assertInitialized();
        return this.markerClusterer.getImageSizes();
    }
    getMaxZoom() {
        this._assertInitialized();
        return this.markerClusterer.getMaxZoom();
    }
    getMinimumClusterSize() {
        this._assertInitialized();
        return this.markerClusterer.getMinimumClusterSize();
    }
    getStyles() {
        this._assertInitialized();
        return this.markerClusterer.getStyles();
    }
    getTitle() {
        this._assertInitialized();
        return this.markerClusterer.getTitle();
    }
    getTotalClusters() {
        this._assertInitialized();
        return this.markerClusterer.getTotalClusters();
    }
    getTotalMarkers() {
        this._assertInitialized();
        return this.markerClusterer.getTotalMarkers();
    }
    getZIndex() {
        this._assertInitialized();
        return this.markerClusterer.getZIndex();
    }
    getZoomOnClick() {
        this._assertInitialized();
        return this.markerClusterer.getZoomOnClick();
    }
    _combineOptions() {
        const options = this._options || DEFAULT_CLUSTERER_OPTIONS;
        return {
            ...options,
            ariaLabelFn: this.ariaLabelFn ?? options.ariaLabelFn,
            averageCenter: this._averageCenter ?? options.averageCenter,
            batchSize: this.batchSize ?? options.batchSize,
            batchSizeIE: this._batchSizeIE ?? options.batchSizeIE,
            calculator: this._calculator ?? options.calculator,
            clusterClass: this._clusterClass ?? options.clusterClass,
            enableRetinaIcons: this._enableRetinaIcons ?? options.enableRetinaIcons,
            gridSize: this._gridSize ?? options.gridSize,
            ignoreHidden: this._ignoreHidden ?? options.ignoreHidden,
            imageExtension: this._imageExtension ?? options.imageExtension,
            imagePath: this._imagePath ?? options.imagePath,
            imageSizes: this._imageSizes ?? options.imageSizes,
            maxZoom: this._maxZoom ?? options.maxZoom,
            minimumClusterSize: this._minimumClusterSize ?? options.minimumClusterSize,
            styles: this._styles ?? options.styles,
            title: this._title ?? options.title,
            zIndex: this._zIndex ?? options.zIndex,
            zoomOnClick: this._zoomOnClick ?? options.zoomOnClick,
        };
    }
    _watchForMarkerChanges() {
        this._assertInitialized();
        const initialMarkers = [];
        for (const marker of this._getInternalMarkers(this._markers.toArray())) {
            this._currentMarkers.add(marker);
            initialMarkers.push(marker);
        }
        this.markerClusterer.addMarkers(initialMarkers);
        this._markers.changes
            .pipe(takeUntil(this._destroy))
            .subscribe((markerComponents) => {
            this._assertInitialized();
            const newMarkers = new Set(this._getInternalMarkers(markerComponents));
            const markersToAdd = [];
            const markersToRemove = [];
            for (const marker of Array.from(newMarkers)) {
                if (!this._currentMarkers.has(marker)) {
                    this._currentMarkers.add(marker);
                    markersToAdd.push(marker);
                }
            }
            for (const marker of Array.from(this._currentMarkers)) {
                if (!newMarkers.has(marker)) {
                    markersToRemove.push(marker);
                }
            }
            this.markerClusterer.addMarkers(markersToAdd, true);
            this.markerClusterer.removeMarkers(markersToRemove, true);
            this.markerClusterer.repaint();
            for (const marker of markersToRemove) {
                this._currentMarkers.delete(marker);
            }
        });
    }
    _getInternalMarkers(markers) {
        return markers
            .filter(markerComponent => !!markerComponent.marker)
            .map(markerComponent => markerComponent.marker);
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.markerClusterer) {
                throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' +
                    'Please wait for the MarkerClusterer to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapMarkerClusterer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.1.0-next.2", type: MapMarkerClusterer, isStandalone: true, selector: "map-marker-clusterer", inputs: { ariaLabelFn: "ariaLabelFn", averageCenter: "averageCenter", batchSize: "batchSize", batchSizeIE: "batchSizeIE", calculator: "calculator", clusterClass: "clusterClass", enableRetinaIcons: "enableRetinaIcons", gridSize: "gridSize", ignoreHidden: "ignoreHidden", imageExtension: "imageExtension", imagePath: "imagePath", imageSizes: "imageSizes", maxZoom: "maxZoom", minimumClusterSize: "minimumClusterSize", styles: "styles", title: "title", zIndex: "zIndex", zoomOnClick: "zoomOnClick", options: "options" }, outputs: { clusteringbegin: "clusteringbegin", clusteringend: "clusteringend", clusterClick: "clusterClick" }, queries: [{ propertyName: "_markers", predicate: MapMarker, descendants: true }], exportAs: ["mapMarkerClusterer"], usesOnChanges: true, ngImport: i0, template: '<ng-content />', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapMarkerClusterer, decorators: [{
            type: Component,
            args: [{
                    selector: 'map-marker-clusterer',
                    exportAs: 'mapMarkerClusterer',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: true,
                    template: '<ng-content />',
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { ariaLabelFn: [{
                type: Input
            }], averageCenter: [{
                type: Input
            }], batchSize: [{
                type: Input
            }], batchSizeIE: [{
                type: Input
            }], calculator: [{
                type: Input
            }], clusterClass: [{
                type: Input
            }], enableRetinaIcons: [{
                type: Input
            }], gridSize: [{
                type: Input
            }], ignoreHidden: [{
                type: Input
            }], imageExtension: [{
                type: Input
            }], imagePath: [{
                type: Input
            }], imageSizes: [{
                type: Input
            }], maxZoom: [{
                type: Input
            }], minimumClusterSize: [{
                type: Input
            }], styles: [{
                type: Input
            }], title: [{
                type: Input
            }], zIndex: [{
                type: Input
            }], zoomOnClick: [{
                type: Input
            }], options: [{
                type: Input
            }], clusteringbegin: [{
                type: Output
            }], clusteringend: [{
                type: Output
            }], clusterClick: [{
                type: Output
            }], _markers: [{
                type: ContentChildren,
                args: [MapMarker, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsRUFDakIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7O0FBVW5ELHVDQUF1QztBQUN2QyxNQUFNLHlCQUF5QixHQUEyQixFQUFFLENBQUM7QUFRN0Q7Ozs7R0FJRztBQVNILE1BQU0sT0FBTyxrQkFBa0I7SUFXN0IsSUFDSSxhQUFhLENBQUMsYUFBc0I7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7SUFDdEMsQ0FBQztJQUtELElBQ0ksV0FBVyxDQUFDLFdBQW1CO1FBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQ2xDLENBQUM7SUFHRCxJQUNJLFVBQVUsQ0FBQyxVQUFzQjtRQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBR0QsSUFDSSxZQUFZ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QWlCLENBQUMsSUFBSTtpQkFDdEM7bUdBVUMsV0FBVztzQkFEVixLQUFLO2dCQUlGLGFBQWE7c0JBRGhCLEtBQUs7Z0JBTUcsU0FBUztzQkFBakIsS0FBSztnQkFHRixXQUFXO3NCQURkLEtBQUs7Z0JBT0YsVUFBVTtzQkFEYixLQUFLO2dCQU9GLFlBQVk7c0JBRGYsS0FBSztnQkFPRixpQkFBaUI7c0JBRHBCLEtBQUs7Z0JBT0YsUUFBUTtzQkFEWCxLQUFLO2dCQU9GLFlBQVk7c0JBRGYsS0FBSztnQkFPRixjQUFjO3NCQURqQixLQUFLO2dCQU9GLFNBQVM7c0JBRFosS0FBSztnQkFPRixVQUFVO3NCQURiLEtBQUs7Z0JBT0YsT0FBTztzQkFEVixLQUFLO2dCQU9GLGtCQUFrQjtzQkFEckIsS0FBSztnQkFPRixNQUFNO3NCQURULEtBQUs7Z0JBT0YsS0FBSztzQkFEUixLQUFLO2dCQU9GLE1BQU07c0JBRFQsS0FBSztnQkFPRixXQUFXO3NCQURkLEtBQUs7Z0JBT0YsT0FBTztzQkFEVixLQUFLO2dCQVdhLGVBQWU7c0JBQWpDLE1BQU07Z0JBT1ksYUFBYTtzQkFBL0IsTUFBTTtnQkFLRSxZQUFZO3NCQURwQixNQUFNO2dCQUcwQyxRQUFRO3NCQUF4RCxlQUFlO3VCQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuLi9tYXAtbWFya2VyL21hcC1tYXJrZXInO1xuaW1wb3J0IHtcbiAgQXJpYUxhYmVsRm4sXG4gIENhbGN1bGF0b3IsXG4gIENsdXN0ZXIsXG4gIENsdXN0ZXJJY29uU3R5bGUsXG4gIE1hcmtlckNsdXN0ZXJlciBhcyBNYXJrZXJDbHVzdGVyZXJJbnN0YW5jZSxcbiAgTWFya2VyQ2x1c3RlcmVyT3B0aW9ucyxcbn0gZnJvbSAnLi9tYXJrZXItY2x1c3RlcmVyLXR5cGVzJztcblxuLyoqIERlZmF1bHQgb3B0aW9ucyBmb3IgYSBjbHVzdGVyZXIuICovXG5jb25zdCBERUZBVUxUX0NMVVNURVJFUl9PUFRJT05TOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zID0ge307XG5cbi8qKlxuICogVGhlIGNsdXN0ZXJlciBoYXMgdG8gYmUgZGVmaW5lZCBhbmQgcmVmZXJyZWQgdG8gYXMgYSBnbG9iYWwgdmFyaWFibGUsXG4gKiBvdGhlcndpc2UgaXQnbGwgY2F1c2UgaXNzdWVzIHdoZW4gbWluaWZpZWQgdGhyb3VnaCBDbG9zdXJlLlxuICovXG5kZWNsYXJlIGNvbnN0IE1hcmtlckNsdXN0ZXJlcjogdHlwZW9mIE1hcmtlckNsdXN0ZXJlckluc3RhbmNlO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IGZvciBpbXBsZW1lbnRpbmcgYSBHb29nbGUgTWFwcyBNYXJrZXIgQ2x1c3RlcmVyLlxuICpcbiAqIFNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9tYXJrZXItY2x1c3RlcmluZ1xuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXAtbWFya2VyLWNsdXN0ZXJlcicsXG4gIGV4cG9ydEFzOiAnbWFwTWFya2VyQ2x1c3RlcmVyJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQgLz4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXJDbHVzdGVyZXIgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfY3VycmVudE1hcmtlcnMgPSBuZXcgU2V0PGdvb2dsZS5tYXBzLk1hcmtlcj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbHVzdGVyZXIgaXMgYWxsb3dlZCB0byBiZSBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY2FuSW5pdGlhbGl6ZTogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBhcmlhTGFiZWxGbjogQXJpYUxhYmVsRm4gPSAoKSA9PiAnJztcblxuICBASW5wdXQoKVxuICBzZXQgYXZlcmFnZUNlbnRlcihhdmVyYWdlQ2VudGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXZlcmFnZUNlbnRlciA9IGF2ZXJhZ2VDZW50ZXI7XG4gIH1cbiAgcHJpdmF0ZSBfYXZlcmFnZUNlbnRlcjogYm9vbGVhbjtcblxuICBASW5wdXQoKSBiYXRjaFNpemU/OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGJhdGNoU2l6ZUlFKGJhdGNoU2l6ZUlFOiBudW1iZXIpIHtcbiAgICB0aGlzLl9iYXRjaFNpemVJRSA9IGJhdGNoU2l6ZUlFO1xuICB9XG4gIHByaXZhdGUgX2JhdGNoU2l6ZUlFOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGNhbGN1bGF0b3IoY2FsY3VsYXRvcjogQ2FsY3VsYXRvcikge1xuICAgIHRoaXMuX2NhbGN1bGF0b3IgPSBjYWxjdWxhdG9yO1xuICB9XG4gIHByaXZhdGUgX2NhbGN1bGF0b3I6IENhbGN1bGF0b3I7XG5cbiAgQElucHV0KClcbiAgc2V0IGNsdXN0ZXJDbGFzcyhjbHVzdGVyQ2xhc3M6IHN0cmluZykge1xuICAgIHRoaXMuX2NsdXN0ZXJDbGFzcyA9IGNsdXN0ZXJDbGFzcztcbiAgfVxuICBwcml2YXRlIF9jbHVzdGVyQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgZW5hYmxlUmV0aW5hSWNvbnMoZW5hYmxlUmV0aW5hSWNvbnM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVSZXRpbmFJY29ucyA9IGVuYWJsZVJldGluYUljb25zO1xuICB9XG4gIHByaXZhdGUgX2VuYWJsZVJldGluYUljb25zOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBncmlkU2l6ZShncmlkU2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fZ3JpZFNpemUgPSBncmlkU2l6ZTtcbiAgfVxuICBwcml2YXRlIF9ncmlkU2l6ZTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpZ25vcmVIaWRkZW4oaWdub3JlSGlkZGVuOiBib29sZWFuKSB7XG4gICAgdGhpcy5faWdub3JlSGlkZGVuID0gaWdub3JlSGlkZGVuO1xuICB9XG4gIHByaXZhdGUgX2lnbm9yZUhpZGRlbjogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VFeHRlbnNpb24oaW1hZ2VFeHRlbnNpb246IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlRXh0ZW5zaW9uID0gaW1hZ2VFeHRlbnNpb247XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VFeHRlbnNpb246IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VQYXRoKGltYWdlUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5faW1hZ2VQYXRoID0gaW1hZ2VQYXRoO1xuICB9XG4gIHByaXZhdGUgX2ltYWdlUGF0aDogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZVNpemVzKGltYWdlU2l6ZXM6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faW1hZ2VTaXplcyA9IGltYWdlU2l6ZXM7XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VTaXplczogbnVtYmVyW107XG5cbiAgQElucHV0KClcbiAgc2V0IG1heFpvb20obWF4Wm9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWF4Wm9vbSA9IG1heFpvb207XG4gIH1cbiAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBtaW5pbXVtQ2x1c3RlclNpemUobWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUgPSBtaW5pbXVtQ2x1c3RlclNpemU7XG4gIH1cbiAgcHJpdmF0ZSBfbWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IHN0eWxlcyhzdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXSkge1xuICAgIHRoaXMuX3N0eWxlcyA9IHN0eWxlcztcbiAgfVxuICBwcml2YXRlIF9zdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXTtcblxuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdGl0bGU7XG4gIH1cbiAgcHJpdmF0ZSBfdGl0bGU6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgekluZGV4KHpJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fekluZGV4ID0gekluZGV4O1xuICB9XG4gIHByaXZhdGUgX3pJbmRleDogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB6b29tT25DbGljayh6b29tT25DbGljazogYm9vbGVhbikge1xuICAgIHRoaXMuX3pvb21PbkNsaWNrID0gem9vbU9uQ2xpY2s7XG4gIH1cbiAgcHJpdmF0ZSBfem9vbU9uQ2xpY2s6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9cbiAgICogX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLmh0bWwjY2x1c3RlcmluZ2JlZ2luXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2x1c3RlcmluZ2JlZ2luOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NsdXN0ZXJpbmdiZWdpbicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L21vZHVsZXMvX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLmh0bWwjY2x1c3RlcmluZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsdXN0ZXJpbmdlbmQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2VuZCcpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgY2x1c3RlciBoYXMgYmVlbiBjbGlja2VkLiAqL1xuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgY2x1c3RlckNsaWNrOiBPYnNlcnZhYmxlPENsdXN0ZXI+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPENsdXN0ZXI+KCdjbGljaycpO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWFwTWFya2VyLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfbWFya2VyczogUXVlcnlMaXN0PE1hcE1hcmtlcj47XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIE1hcmtlckNsdXN0ZXJlciBvYmplY3QuXG4gICAqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvY2xhc3Nlcy9cbiAgICogX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLm1hcmtlcmNsdXN0ZXJlci5odG1sXG4gICAqL1xuICBtYXJrZXJDbHVzdGVyZXI/OiBNYXJrZXJDbHVzdGVyZXJJbnN0YW5jZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7XG4gICAgdGhpcy5fY2FuSW5pdGlhbGl6ZSA9IHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2NhbkluaXRpYWxpemUpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIE1hcmtlckNsdXN0ZXJlciAhPT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdNYXJrZXJDbHVzdGVyZXIgY2xhc3Mgbm90IGZvdW5kLCBjYW5ub3QgY29uc3RydWN0IGEgbWFya2VyIGNsdXN0ZXIuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSBpbnN0YWxsIHRoZSBNYXJrZXJDbHVzdGVyZXJQbHVzIGxpYnJhcnk6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGVtYXBzL2pzLW1hcmtlcmNsdXN0ZXJlcnBsdXMnLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlciA9IG5ldyBNYXJrZXJDbHVzdGVyZXIoXG4gICAgICAgICAgdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEsXG4gICAgICAgICAgW10sXG4gICAgICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLm1hcmtlckNsdXN0ZXJlcik7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0aGlzLl9jYW5Jbml0aWFsaXplKSB7XG4gICAgICB0aGlzLl93YXRjaEZvck1hcmtlckNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qge1xuICAgICAgbWFya2VyQ2x1c3RlcmVyOiBjbHVzdGVyZXIsXG4gICAgICBhcmlhTGFiZWxGbixcbiAgICAgIF9hdmVyYWdlQ2VudGVyLFxuICAgICAgX2JhdGNoU2l6ZUlFLFxuICAgICAgX2NhbGN1bGF0b3IsXG4gICAgICBfc3R5bGVzLFxuICAgICAgX2NsdXN0ZXJDbGFzcyxcbiAgICAgIF9lbmFibGVSZXRpbmFJY29ucyxcbiAgICAgIF9ncmlkU2l6ZSxcbiAgICAgIF9pZ25vcmVIaWRkZW4sXG4gICAgICBfaW1hZ2VFeHRlbnNpb24sXG4gICAgICBfaW1hZ2VQYXRoLFxuICAgICAgX2ltYWdlU2l6ZXMsXG4gICAgICBfbWF4Wm9vbSxcbiAgICAgIF9taW5pbXVtQ2x1c3RlclNpemUsXG4gICAgICBfdGl0bGUsXG4gICAgICBfekluZGV4LFxuICAgICAgX3pvb21PbkNsaWNrLFxuICAgIH0gPSB0aGlzO1xuXG4gICAgaWYgKGNsdXN0ZXJlcikge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydhcmlhTGFiZWxGbiddKSB7XG4gICAgICAgIGNsdXN0ZXJlci5hcmlhTGFiZWxGbiA9IGFyaWFMYWJlbEZuO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2F2ZXJhZ2VDZW50ZXInXSAmJiBfYXZlcmFnZUNlbnRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRBdmVyYWdlQ2VudGVyKF9hdmVyYWdlQ2VudGVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydiYXRjaFNpemVJRSddICYmIF9iYXRjaFNpemVJRSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRCYXRjaFNpemVJRShfYmF0Y2hTaXplSUUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2NhbGN1bGF0b3InXSAmJiAhIV9jYWxjdWxhdG9yKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRDYWxjdWxhdG9yKF9jYWxjdWxhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydjbHVzdGVyQ2xhc3MnXSAmJiBfY2x1c3RlckNsYXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldENsdXN0ZXJDbGFzcyhfY2x1c3RlckNsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydlbmFibGVSZXRpbmFJY29ucyddICYmIF9lbmFibGVSZXRpbmFJY29ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRFbmFibGVSZXRpbmFJY29ucyhfZW5hYmxlUmV0aW5hSWNvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2dyaWRTaXplJ10gJiYgX2dyaWRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEdyaWRTaXplKF9ncmlkU2l6ZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaWdub3JlSGlkZGVuJ10gJiYgX2lnbm9yZUhpZGRlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJZ25vcmVIaWRkZW4oX2lnbm9yZUhpZGRlbik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VFeHRlbnNpb24nXSAmJiBfaW1hZ2VFeHRlbnNpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SW1hZ2VFeHRlbnNpb24oX2ltYWdlRXh0ZW5zaW9uKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpbWFnZVBhdGgnXSAmJiBfaW1hZ2VQYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEltYWdlUGF0aChfaW1hZ2VQYXRoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpbWFnZVNpemVzJ10gJiYgX2ltYWdlU2l6ZXMpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEltYWdlU2l6ZXMoX2ltYWdlU2l6ZXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ21heFpvb20nXSAmJiBfbWF4Wm9vbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRNYXhab29tKF9tYXhab29tKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydtaW5pbXVtQ2x1c3RlclNpemUnXSAmJiBfbWluaW11bUNsdXN0ZXJTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldE1pbmltdW1DbHVzdGVyU2l6ZShfbWluaW11bUNsdXN0ZXJTaXplKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydzdHlsZXMnXSAmJiBfc3R5bGVzKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRTdHlsZXMoX3N0eWxlcyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1sndGl0bGUnXSAmJiBfdGl0bGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0VGl0bGUoX3RpdGxlKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWyd6SW5kZXgnXSAmJiBfekluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFpJbmRleChfekluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWyd6b29tT25DbGljayddICYmIF96b29tT25DbGljayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRab29tT25DbGljayhfem9vbU9uQ2xpY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlcikge1xuICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGZpdE1hcFRvTWFya2VycyhwYWRkaW5nOiBudW1iZXIgfCBnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5maXRNYXBUb01hcmtlcnMocGFkZGluZyk7XG4gIH1cblxuICBnZXRBdmVyYWdlQ2VudGVyKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEF2ZXJhZ2VDZW50ZXIoKTtcbiAgfVxuXG4gIGdldEJhdGNoU2l6ZUlFKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0QmF0Y2hTaXplSUUoKTtcbiAgfVxuXG4gIGdldENhbGN1bGF0b3IoKTogQ2FsY3VsYXRvciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2FsY3VsYXRvcigpO1xuICB9XG5cbiAgZ2V0Q2x1c3RlckNsYXNzKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2x1c3RlckNsYXNzKCk7XG4gIH1cblxuICBnZXRDbHVzdGVycygpOiBDbHVzdGVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENsdXN0ZXJzKCk7XG4gIH1cblxuICBnZXRFbmFibGVSZXRpbmFJY29ucygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRFbmFibGVSZXRpbmFJY29ucygpO1xuICB9XG5cbiAgZ2V0R3JpZFNpemUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRHcmlkU2l6ZSgpO1xuICB9XG5cbiAgZ2V0SWdub3JlSGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldElnbm9yZUhpZGRlbigpO1xuICB9XG5cbiAgZ2V0SW1hZ2VFeHRlbnNpb24oKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZUV4dGVuc2lvbigpO1xuICB9XG5cbiAgZ2V0SW1hZ2VQYXRoKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SW1hZ2VQYXRoKCk7XG4gIH1cblxuICBnZXRJbWFnZVNpemVzKCk6IG51bWJlcltdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZVNpemVzKCk7XG4gIH1cblxuICBnZXRNYXhab29tKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0TWF4Wm9vbSgpO1xuICB9XG5cbiAgZ2V0TWluaW11bUNsdXN0ZXJTaXplKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0TWluaW11bUNsdXN0ZXJTaXplKCk7XG4gIH1cblxuICBnZXRTdHlsZXMoKTogQ2x1c3Rlckljb25TdHlsZVtdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRTdHlsZXMoKTtcbiAgfVxuXG4gIGdldFRpdGxlKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0VGl0bGUoKTtcbiAgfVxuXG4gIGdldFRvdGFsQ2x1c3RlcnMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUb3RhbENsdXN0ZXJzKCk7XG4gIH1cblxuICBnZXRUb3RhbE1hcmtlcnMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUb3RhbE1hcmtlcnMoKTtcbiAgfVxuXG4gIGdldFpJbmRleCgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFpJbmRleCgpO1xuICB9XG5cbiAgZ2V0Wm9vbU9uQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Wm9vbU9uQ2xpY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IERFRkFVTFRfQ0xVU1RFUkVSX09QVElPTlM7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBhcmlhTGFiZWxGbjogdGhpcy5hcmlhTGFiZWxGbiA/PyBvcHRpb25zLmFyaWFMYWJlbEZuLFxuICAgICAgYXZlcmFnZUNlbnRlcjogdGhpcy5fYXZlcmFnZUNlbnRlciA/PyBvcHRpb25zLmF2ZXJhZ2VDZW50ZXIsXG4gICAgICBiYXRjaFNpemU6IHRoaXMuYmF0Y2hTaXplID8/IG9wdGlvbnMuYmF0Y2hTaXplLFxuICAgICAgYmF0Y2hTaXplSUU6IHRoaXMuX2JhdGNoU2l6ZUlFID8/IG9wdGlvbnMuYmF0Y2hTaXplSUUsXG4gICAgICBjYWxjdWxhdG9yOiB0aGlzLl9jYWxjdWxhdG9yID8/IG9wdGlvbnMuY2FsY3VsYXRvcixcbiAgICAgIGNsdXN0ZXJDbGFzczogdGhpcy5fY2x1c3RlckNsYXNzID8/IG9wdGlvbnMuY2x1c3RlckNsYXNzLFxuICAgICAgZW5hYmxlUmV0aW5hSWNvbnM6IHRoaXMuX2VuYWJsZVJldGluYUljb25zID8/IG9wdGlvbnMuZW5hYmxlUmV0aW5hSWNvbnMsXG4gICAgICBncmlkU2l6ZTogdGhpcy5fZ3JpZFNpemUgPz8gb3B0aW9ucy5ncmlkU2l6ZSxcbiAgICAgIGlnbm9yZUhpZGRlbjogdGhpcy5faWdub3JlSGlkZGVuID8/IG9wdGlvbnMuaWdub3JlSGlkZGVuLFxuICAgICAgaW1hZ2VFeHRlbnNpb246IHRoaXMuX2ltYWdlRXh0ZW5zaW9uID8/IG9wdGlvbnMuaW1hZ2VFeHRlbnNpb24sXG4gICAgICBpbWFnZVBhdGg6IHRoaXMuX2ltYWdlUGF0aCA/PyBvcHRpb25zLmltYWdlUGF0aCxcbiAgICAgIGltYWdlU2l6ZXM6IHRoaXMuX2ltYWdlU2l6ZXMgPz8gb3B0aW9ucy5pbWFnZVNpemVzLFxuICAgICAgbWF4Wm9vbTogdGhpcy5fbWF4Wm9vbSA/PyBvcHRpb25zLm1heFpvb20sXG4gICAgICBtaW5pbXVtQ2x1c3RlclNpemU6IHRoaXMuX21pbmltdW1DbHVzdGVyU2l6ZSA/PyBvcHRpb25zLm1pbmltdW1DbHVzdGVyU2l6ZSxcbiAgICAgIHN0eWxlczogdGhpcy5fc3R5bGVzID8/IG9wdGlvbnMuc3R5bGVzLFxuICAgICAgdGl0bGU6IHRoaXMuX3RpdGxlID8/IG9wdGlvbnMudGl0bGUsXG4gICAgICB6SW5kZXg6IHRoaXMuX3pJbmRleCA/PyBvcHRpb25zLnpJbmRleCxcbiAgICAgIHpvb21PbkNsaWNrOiB0aGlzLl96b29tT25DbGljayA/PyBvcHRpb25zLnpvb21PbkNsaWNrLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck1hcmtlckNoYW5nZXMoKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICBjb25zdCBpbml0aWFsTWFya2VyczogZ29vZ2xlLm1hcHMuTWFya2VyW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLl9nZXRJbnRlcm5hbE1hcmtlcnModGhpcy5fbWFya2Vycy50b0FycmF5KCkpKSB7XG4gICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5hZGQobWFya2VyKTtcbiAgICAgIGluaXRpYWxNYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICB9XG4gICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2Vycyhpbml0aWFsTWFya2Vycyk7XG5cbiAgICB0aGlzLl9tYXJrZXJzLmNoYW5nZXNcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKG1hcmtlckNvbXBvbmVudHM6IE1hcE1hcmtlcltdKSA9PiB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIGNvbnN0IG5ld01hcmtlcnMgPSBuZXcgU2V0PGdvb2dsZS5tYXBzLk1hcmtlcj4odGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlckNvbXBvbmVudHMpKTtcbiAgICAgICAgY29uc3QgbWFya2Vyc1RvQWRkOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICBjb25zdCBtYXJrZXJzVG9SZW1vdmU6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20obmV3TWFya2VycykpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5hZGQobWFya2VyKTtcbiAgICAgICAgICAgIG1hcmtlcnNUb0FkZC5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20odGhpcy5fY3VycmVudE1hcmtlcnMpKSB7XG4gICAgICAgICAgaWYgKCFuZXdNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICBtYXJrZXJzVG9SZW1vdmUucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXJzKG1hcmtlcnNUb0FkZCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlbW92ZU1hcmtlcnMobWFya2Vyc1RvUmVtb3ZlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIucmVwYWludCgpO1xuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBtYXJrZXJzVG9SZW1vdmUpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5kZWxldGUobWFya2VyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRJbnRlcm5hbE1hcmtlcnMobWFya2VyczogTWFwTWFya2VyW10pOiBnb29nbGUubWFwcy5NYXJrZXJbXSB7XG4gICAgcmV0dXJuIG1hcmtlcnNcbiAgICAgIC5maWx0ZXIobWFya2VyQ29tcG9uZW50ID0+ICEhbWFya2VyQ29tcG9uZW50Lm1hcmtlcilcbiAgICAgIC5tYXAobWFya2VyQ29tcG9uZW50ID0+IG1hcmtlckNvbXBvbmVudC5tYXJrZXIhKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7bWFya2VyQ2x1c3RlcmVyOiBNYXJrZXJDbHVzdGVyZXJJbnN0YW5jZX0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLm1hcmtlckNsdXN0ZXJlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBNYXJrZXJDbHVzdGVyZXIgYmVmb3JlIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIE1hcmtlckNsdXN0ZXJlciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19