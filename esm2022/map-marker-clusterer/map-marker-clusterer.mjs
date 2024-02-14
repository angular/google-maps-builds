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
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, NgZone, Output, QueryList, ViewEncapsulation, inject, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
        /** Event emitted when the clusterer is initialized. */
        this.markerClustererInitialized = new EventEmitter();
        this._canInitialize = _googleMap._isBrowser;
    }
    ngOnInit() {
        if (this._canInitialize) {
            this._ngZone.runOutsideAngular(() => {
                this._googleMap._resolveMap().then(map => {
                    if (typeof MarkerClusterer !== 'function' &&
                        (typeof ngDevMode === 'undefined' || ngDevMode)) {
                        throw Error('MarkerClusterer class not found, cannot construct a marker cluster. ' +
                            'Please install the MarkerClustererPlus library: ' +
                            'https://github.com/googlemaps/js-markerclustererplus');
                    }
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this.markerClusterer = this._ngZone.runOutsideAngular(() => {
                        return new MarkerClusterer(map, [], this._combineOptions());
                    });
                    this._assertInitialized();
                    this._eventManager.setTarget(this.markerClusterer);
                    this.markerClustererInitialized.emit(this.markerClusterer);
                });
            });
        }
    }
    ngAfterContentInit() {
        if (this._canInitialize) {
            if (this.markerClusterer) {
                this._watchForMarkerChanges();
            }
            else {
                this.markerClustererInitialized
                    .pipe(take(1), takeUntil(this._destroy))
                    .subscribe(() => this._watchForMarkerChanges());
            }
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
        this.markerClusterer?.setMap(null);
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
        this._ngZone.runOutsideAngular(() => {
            this._getInternalMarkers(this._markers).then(markers => {
                const initialMarkers = [];
                for (const marker of markers) {
                    this._currentMarkers.add(marker);
                    initialMarkers.push(marker);
                }
                this.markerClusterer.addMarkers(initialMarkers);
            });
        });
        this._markers.changes
            .pipe(takeUntil(this._destroy))
            .subscribe((markerComponents) => {
            this._assertInitialized();
            this._ngZone.runOutsideAngular(() => {
                this._getInternalMarkers(markerComponents).then(markers => {
                    const newMarkers = new Set(markers);
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
            });
        });
    }
    _getInternalMarkers(markers) {
        return Promise.all(markers.map(markerComponent => markerComponent._resolveMarker()));
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this.markerClusterer) {
                throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' +
                    'Please wait for the MarkerClusterer to load before trying to interact with it.');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapMarkerClusterer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.0", type: MapMarkerClusterer, isStandalone: true, selector: "map-marker-clusterer", inputs: { ariaLabelFn: "ariaLabelFn", averageCenter: "averageCenter", batchSize: "batchSize", batchSizeIE: "batchSizeIE", calculator: "calculator", clusterClass: "clusterClass", enableRetinaIcons: "enableRetinaIcons", gridSize: "gridSize", ignoreHidden: "ignoreHidden", imageExtension: "imageExtension", imagePath: "imagePath", imageSizes: "imageSizes", maxZoom: "maxZoom", minimumClusterSize: "minimumClusterSize", styles: "styles", title: "title", zIndex: "zIndex", zoomOnClick: "zoomOnClick", options: "options" }, outputs: { clusteringbegin: "clusteringbegin", clusteringend: "clusteringend", clusterClick: "clusterClick", markerClustererInitialized: "markerClustererInitialized" }, queries: [{ propertyName: "_markers", predicate: MapMarker, descendants: true }], exportAs: ["mapMarkerClusterer"], usesOnChanges: true, ngImport: i0, template: '<ng-content />', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapMarkerClusterer, decorators: [{
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
            }], markerClustererInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUlOLE1BQU0sRUFDTixTQUFTLEVBRVQsaUJBQWlCLEVBQ2pCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9DLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7QUFVbkQsdUNBQXVDO0FBQ3ZDLE1BQU0seUJBQXlCLEdBQTJCLEVBQUUsQ0FBQztBQVE3RDs7OztHQUlHO0FBU0gsTUFBTSxPQUFPLGtCQUFrQjtJQVc3QixJQUNJLGFBQWEsQ0FBQyxhQUFzQjtRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUN0QyxDQUFDO0lBS0QsSUFDSSxXQUFXLENBQUMsV0FBbUI7UUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDbEMsQ0FBQztJQUdELElBQ0ksVUFBVSxDQUFDLFVBQXNCO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2hD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c0JBRHJCLEtBQUs7Z0JBT0YsTUFBTTtzQkFEVCxLQUFLO2dCQU9GLEtBQUs7c0JBRFIsS0FBSztnQkFPRixNQUFNO3NCQURULEtBQUs7Z0JBT0YsV0FBVztzQkFEZCxLQUFLO2dCQU9GLE9BQU87c0JBRFYsS0FBSztnQkFXYSxlQUFlO3NCQUFqQyxNQUFNO2dCQU9ZLGFBQWE7c0JBQS9CLE1BQU07Z0JBS0UsWUFBWTtzQkFEcEIsTUFBTTtnQkFHMEMsUUFBUTtzQkFBeEQsZUFBZTt1QkFBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQVk1QiwwQkFBMEI7c0JBQTVDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtNYXBNYXJrZXJ9IGZyb20gJy4uL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5pbXBvcnQge1xuICBBcmlhTGFiZWxGbixcbiAgQ2FsY3VsYXRvcixcbiAgQ2x1c3RlcixcbiAgQ2x1c3Rlckljb25TdHlsZSxcbiAgTWFya2VyQ2x1c3RlcmVyIGFzIE1hcmtlckNsdXN0ZXJlckluc3RhbmNlLFxuICBNYXJrZXJDbHVzdGVyZXJPcHRpb25zLFxufSBmcm9tICcuL21hcmtlci1jbHVzdGVyZXItdHlwZXMnO1xuXG4vKiogRGVmYXVsdCBvcHRpb25zIGZvciBhIGNsdXN0ZXJlci4gKi9cbmNvbnN0IERFRkFVTFRfQ0xVU1RFUkVSX09QVElPTlM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMgPSB7fTtcblxuLyoqXG4gKiBUaGUgY2x1c3RlcmVyIGhhcyB0byBiZSBkZWZpbmVkIGFuZCByZWZlcnJlZCB0byBhcyBhIGdsb2JhbCB2YXJpYWJsZSxcbiAqIG90aGVyd2lzZSBpdCdsbCBjYXVzZSBpc3N1ZXMgd2hlbiBtaW5pZmllZCB0aHJvdWdoIENsb3N1cmUuXG4gKi9cbmRlY2xhcmUgY29uc3QgTWFya2VyQ2x1c3RlcmVyOiB0eXBlb2YgTWFya2VyQ2x1c3RlcmVySW5zdGFuY2U7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgZm9yIGltcGxlbWVudGluZyBhIEdvb2dsZSBNYXBzIE1hcmtlciBDbHVzdGVyZXIuXG4gKlxuICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L21hcmtlci1jbHVzdGVyaW5nXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hcC1tYXJrZXItY2x1c3RlcmVyJyxcbiAgZXhwb3J0QXM6ICdtYXBNYXJrZXJDbHVzdGVyZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudCAvPicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcE1hcmtlckNsdXN0ZXJlciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9jdXJyZW50TWFya2VycyA9IG5ldyBTZXQ8Z29vZ2xlLm1hcHMuTWFya2VyPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKGluamVjdChOZ1pvbmUpKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsdXN0ZXJlciBpcyBhbGxvd2VkIHRvIGJlIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jYW5Jbml0aWFsaXplOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIGFyaWFMYWJlbEZuOiBBcmlhTGFiZWxGbiA9ICgpID0+ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBhdmVyYWdlQ2VudGVyKGF2ZXJhZ2VDZW50ZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9hdmVyYWdlQ2VudGVyID0gYXZlcmFnZUNlbnRlcjtcbiAgfVxuICBwcml2YXRlIF9hdmVyYWdlQ2VudGVyOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpIGJhdGNoU2l6ZT86IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgYmF0Y2hTaXplSUUoYmF0Y2hTaXplSUU6IG51bWJlcikge1xuICAgIHRoaXMuX2JhdGNoU2l6ZUlFID0gYmF0Y2hTaXplSUU7XG4gIH1cbiAgcHJpdmF0ZSBfYmF0Y2hTaXplSUU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgY2FsY3VsYXRvcihjYWxjdWxhdG9yOiBDYWxjdWxhdG9yKSB7XG4gICAgdGhpcy5fY2FsY3VsYXRvciA9IGNhbGN1bGF0b3I7XG4gIH1cbiAgcHJpdmF0ZSBfY2FsY3VsYXRvcjogQ2FsY3VsYXRvcjtcblxuICBASW5wdXQoKVxuICBzZXQgY2x1c3RlckNsYXNzKGNsdXN0ZXJDbGFzczogc3RyaW5nKSB7XG4gICAgdGhpcy5fY2x1c3RlckNsYXNzID0gY2x1c3RlckNsYXNzO1xuICB9XG4gIHByaXZhdGUgX2NsdXN0ZXJDbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBlbmFibGVSZXRpbmFJY29ucyhlbmFibGVSZXRpbmFJY29uczogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZVJldGluYUljb25zID0gZW5hYmxlUmV0aW5hSWNvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfZW5hYmxlUmV0aW5hSWNvbnM6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgc2V0IGdyaWRTaXplKGdyaWRTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9ncmlkU2l6ZSA9IGdyaWRTaXplO1xuICB9XG4gIHByaXZhdGUgX2dyaWRTaXplOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGlnbm9yZUhpZGRlbihpZ25vcmVIaWRkZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pZ25vcmVIaWRkZW4gPSBpZ25vcmVIaWRkZW47XG4gIH1cbiAgcHJpdmF0ZSBfaWdub3JlSGlkZGVuOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZUV4dGVuc2lvbihpbWFnZUV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5faW1hZ2VFeHRlbnNpb24gPSBpbWFnZUV4dGVuc2lvbjtcbiAgfVxuICBwcml2YXRlIF9pbWFnZUV4dGVuc2lvbjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZVBhdGgoaW1hZ2VQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pbWFnZVBhdGggPSBpbWFnZVBhdGg7XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VQYXRoOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IGltYWdlU2l6ZXMoaW1hZ2VTaXplczogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9pbWFnZVNpemVzID0gaW1hZ2VTaXplcztcbiAgfVxuICBwcml2YXRlIF9pbWFnZVNpemVzOiBudW1iZXJbXTtcblxuICBASW5wdXQoKVxuICBzZXQgbWF4Wm9vbShtYXhab29tOiBudW1iZXIpIHtcbiAgICB0aGlzLl9tYXhab29tID0gbWF4Wm9vbTtcbiAgfVxuICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IG1pbmltdW1DbHVzdGVyU2l6ZShtaW5pbXVtQ2x1c3RlclNpemU6IG51bWJlcikge1xuICAgIHRoaXMuX21pbmltdW1DbHVzdGVyU2l6ZSA9IG1pbmltdW1DbHVzdGVyU2l6ZTtcbiAgfVxuICBwcml2YXRlIF9taW5pbXVtQ2x1c3RlclNpemU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgc3R5bGVzKHN0eWxlczogQ2x1c3Rlckljb25TdHlsZVtdKSB7XG4gICAgdGhpcy5fc3R5bGVzID0gc3R5bGVzO1xuICB9XG4gIHByaXZhdGUgX3N0eWxlczogQ2x1c3Rlckljb25TdHlsZVtdO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB0aXRsZTtcbiAgfVxuICBwcml2YXRlIF90aXRsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB6SW5kZXgoekluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLl96SW5kZXggPSB6SW5kZXg7XG4gIH1cbiAgcHJpdmF0ZSBfekluZGV4OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IHpvb21PbkNsaWNrKHpvb21PbkNsaWNrOiBib29sZWFuKSB7XG4gICAgdGhpcy5fem9vbU9uQ2xpY2sgPSB6b29tT25DbGljaztcbiAgfVxuICBwcml2YXRlIF96b29tT25DbGljazogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucztcblxuICAvKipcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9tb2R1bGVzL1xuICAgKiBfZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nYmVnaW5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbHVzdGVyaW5nYmVnaW46IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2JlZ2luJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9fZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2x1c3RlcmluZ2VuZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbHVzdGVyaW5nZW5kJyk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBjbHVzdGVyIGhhcyBiZWVuIGNsaWNrZWQuICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBjbHVzdGVyQ2xpY2s6IE9ic2VydmFibGU8Q2x1c3Rlcj4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Q2x1c3Rlcj4oJ2NsaWNrJyk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNYXBNYXJrZXIsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9tYXJrZXJzOiBRdWVyeUxpc3Q8TWFwTWFya2VyPjtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgTWFya2VyQ2x1c3RlcmVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9jbGFzc2VzL1xuICAgKiBfZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMubWFya2VyY2x1c3RlcmVyLmh0bWxcbiAgICovXG4gIG1hcmtlckNsdXN0ZXJlcj86IE1hcmtlckNsdXN0ZXJlckluc3RhbmNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNsdXN0ZXJlciBpcyBpbml0aWFsaXplZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcmtlckNsdXN0ZXJlckluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8TWFya2VyQ2x1c3RlcmVySW5zdGFuY2U+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hcmtlckNsdXN0ZXJlckluc3RhbmNlPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICApIHtcbiAgICB0aGlzLl9jYW5Jbml0aWFsaXplID0gX2dvb2dsZU1hcC5faXNCcm93c2VyO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2NhbkluaXRpYWxpemUpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuX2dvb2dsZU1hcC5fcmVzb2x2ZU1hcCgpLnRoZW4obWFwID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgTWFya2VyQ2x1c3RlcmVyICE9PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgICdNYXJrZXJDbHVzdGVyZXIgY2xhc3Mgbm90IGZvdW5kLCBjYW5ub3QgY29uc3RydWN0IGEgbWFya2VyIGNsdXN0ZXIuICcgK1xuICAgICAgICAgICAgICAgICdQbGVhc2UgaW5zdGFsbCB0aGUgTWFya2VyQ2x1c3RlcmVyUGx1cyBsaWJyYXJ5OiAnICtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZW1hcHMvanMtbWFya2VyY2x1c3RlcmVycGx1cycsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyID0gdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWFya2VyQ2x1c3RlcmVyKG1hcCwgW10sIHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMubWFya2VyQ2x1c3RlcmVyKTtcbiAgICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlckluaXRpYWxpemVkLmVtaXQodGhpcy5tYXJrZXJDbHVzdGVyZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fY2FuSW5pdGlhbGl6ZSkge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyKSB7XG4gICAgICAgIHRoaXMuX3dhdGNoRm9yTWFya2VyQ2hhbmdlcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXJJbml0aWFsaXplZFxuICAgICAgICAgIC5waXBlKHRha2UoMSksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX3dhdGNoRm9yTWFya2VyQ2hhbmdlcygpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qge1xuICAgICAgbWFya2VyQ2x1c3RlcmVyOiBjbHVzdGVyZXIsXG4gICAgICBhcmlhTGFiZWxGbixcbiAgICAgIF9hdmVyYWdlQ2VudGVyLFxuICAgICAgX2JhdGNoU2l6ZUlFLFxuICAgICAgX2NhbGN1bGF0b3IsXG4gICAgICBfc3R5bGVzLFxuICAgICAgX2NsdXN0ZXJDbGFzcyxcbiAgICAgIF9lbmFibGVSZXRpbmFJY29ucyxcbiAgICAgIF9ncmlkU2l6ZSxcbiAgICAgIF9pZ25vcmVIaWRkZW4sXG4gICAgICBfaW1hZ2VFeHRlbnNpb24sXG4gICAgICBfaW1hZ2VQYXRoLFxuICAgICAgX2ltYWdlU2l6ZXMsXG4gICAgICBfbWF4Wm9vbSxcbiAgICAgIF9taW5pbXVtQ2x1c3RlclNpemUsXG4gICAgICBfdGl0bGUsXG4gICAgICBfekluZGV4LFxuICAgICAgX3pvb21PbkNsaWNrLFxuICAgIH0gPSB0aGlzO1xuXG4gICAgaWYgKGNsdXN0ZXJlcikge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydhcmlhTGFiZWxGbiddKSB7XG4gICAgICAgIGNsdXN0ZXJlci5hcmlhTGFiZWxGbiA9IGFyaWFMYWJlbEZuO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2F2ZXJhZ2VDZW50ZXInXSAmJiBfYXZlcmFnZUNlbnRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRBdmVyYWdlQ2VudGVyKF9hdmVyYWdlQ2VudGVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydiYXRjaFNpemVJRSddICYmIF9iYXRjaFNpemVJRSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRCYXRjaFNpemVJRShfYmF0Y2hTaXplSUUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2NhbGN1bGF0b3InXSAmJiAhIV9jYWxjdWxhdG9yKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRDYWxjdWxhdG9yKF9jYWxjdWxhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydjbHVzdGVyQ2xhc3MnXSAmJiBfY2x1c3RlckNsYXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldENsdXN0ZXJDbGFzcyhfY2x1c3RlckNsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydlbmFibGVSZXRpbmFJY29ucyddICYmIF9lbmFibGVSZXRpbmFJY29ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRFbmFibGVSZXRpbmFJY29ucyhfZW5hYmxlUmV0aW5hSWNvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2dyaWRTaXplJ10gJiYgX2dyaWRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEdyaWRTaXplKF9ncmlkU2l6ZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaWdub3JlSGlkZGVuJ10gJiYgX2lnbm9yZUhpZGRlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJZ25vcmVIaWRkZW4oX2lnbm9yZUhpZGRlbik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VFeHRlbnNpb24nXSAmJiBfaW1hZ2VFeHRlbnNpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SW1hZ2VFeHRlbnNpb24oX2ltYWdlRXh0ZW5zaW9uKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpbWFnZVBhdGgnXSAmJiBfaW1hZ2VQYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEltYWdlUGF0aChfaW1hZ2VQYXRoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpbWFnZVNpemVzJ10gJiYgX2ltYWdlU2l6ZXMpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEltYWdlU2l6ZXMoX2ltYWdlU2l6ZXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ21heFpvb20nXSAmJiBfbWF4Wm9vbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRNYXhab29tKF9tYXhab29tKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydtaW5pbXVtQ2x1c3RlclNpemUnXSAmJiBfbWluaW11bUNsdXN0ZXJTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldE1pbmltdW1DbHVzdGVyU2l6ZShfbWluaW11bUNsdXN0ZXJTaXplKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydzdHlsZXMnXSAmJiBfc3R5bGVzKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRTdHlsZXMoX3N0eWxlcyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1sndGl0bGUnXSAmJiBfdGl0bGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0VGl0bGUoX3RpdGxlKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWyd6SW5kZXgnXSAmJiBfekluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFpJbmRleChfekluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWyd6b29tT25DbGljayddICYmIF96b29tT25DbGljayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRab29tT25DbGljayhfem9vbU9uQ2xpY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyPy5zZXRNYXAobnVsbCk7XG4gIH1cblxuICBmaXRNYXBUb01hcmtlcnMocGFkZGluZzogbnVtYmVyIHwgZ29vZ2xlLm1hcHMuUGFkZGluZykge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuZml0TWFwVG9NYXJrZXJzKHBhZGRpbmcpO1xuICB9XG5cbiAgZ2V0QXZlcmFnZUNlbnRlcigpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRBdmVyYWdlQ2VudGVyKCk7XG4gIH1cblxuICBnZXRCYXRjaFNpemVJRSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEJhdGNoU2l6ZUlFKCk7XG4gIH1cblxuICBnZXRDYWxjdWxhdG9yKCk6IENhbGN1bGF0b3Ige1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENhbGN1bGF0b3IoKTtcbiAgfVxuXG4gIGdldENsdXN0ZXJDbGFzcygpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENsdXN0ZXJDbGFzcygpO1xuICB9XG5cbiAgZ2V0Q2x1c3RlcnMoKTogQ2x1c3RlcltdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDbHVzdGVycygpO1xuICB9XG5cbiAgZ2V0RW5hYmxlUmV0aW5hSWNvbnMoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0RW5hYmxlUmV0aW5hSWNvbnMoKTtcbiAgfVxuXG4gIGdldEdyaWRTaXplKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0R3JpZFNpemUoKTtcbiAgfVxuXG4gIGdldElnbm9yZUhpZGRlbigpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJZ25vcmVIaWRkZW4oKTtcbiAgfVxuXG4gIGdldEltYWdlRXh0ZW5zaW9uKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SW1hZ2VFeHRlbnNpb24oKTtcbiAgfVxuXG4gIGdldEltYWdlUGF0aCgpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlUGF0aCgpO1xuICB9XG5cbiAgZ2V0SW1hZ2VTaXplcygpOiBudW1iZXJbXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SW1hZ2VTaXplcygpO1xuICB9XG5cbiAgZ2V0TWF4Wm9vbSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldE1heFpvb20oKTtcbiAgfVxuXG4gIGdldE1pbmltdW1DbHVzdGVyU2l6ZSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldE1pbmltdW1DbHVzdGVyU2l6ZSgpO1xuICB9XG5cbiAgZ2V0U3R5bGVzKCk6IENsdXN0ZXJJY29uU3R5bGVbXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0U3R5bGVzKCk7XG4gIH1cblxuICBnZXRUaXRsZSgpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRpdGxlKCk7XG4gIH1cblxuICBnZXRUb3RhbENsdXN0ZXJzKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0VG90YWxDbHVzdGVycygpO1xuICB9XG5cbiAgZ2V0VG90YWxNYXJrZXJzKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0VG90YWxNYXJrZXJzKCk7XG4gIH1cblxuICBnZXRaSW5kZXgoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRaSW5kZXgoKTtcbiAgfVxuXG4gIGdldFpvb21PbkNsaWNrKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFpvb21PbkNsaWNrKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCBERUZBVUxUX0NMVVNURVJFUl9PUFRJT05TO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgYXJpYUxhYmVsRm46IHRoaXMuYXJpYUxhYmVsRm4gPz8gb3B0aW9ucy5hcmlhTGFiZWxGbixcbiAgICAgIGF2ZXJhZ2VDZW50ZXI6IHRoaXMuX2F2ZXJhZ2VDZW50ZXIgPz8gb3B0aW9ucy5hdmVyYWdlQ2VudGVyLFxuICAgICAgYmF0Y2hTaXplOiB0aGlzLmJhdGNoU2l6ZSA/PyBvcHRpb25zLmJhdGNoU2l6ZSxcbiAgICAgIGJhdGNoU2l6ZUlFOiB0aGlzLl9iYXRjaFNpemVJRSA/PyBvcHRpb25zLmJhdGNoU2l6ZUlFLFxuICAgICAgY2FsY3VsYXRvcjogdGhpcy5fY2FsY3VsYXRvciA/PyBvcHRpb25zLmNhbGN1bGF0b3IsXG4gICAgICBjbHVzdGVyQ2xhc3M6IHRoaXMuX2NsdXN0ZXJDbGFzcyA/PyBvcHRpb25zLmNsdXN0ZXJDbGFzcyxcbiAgICAgIGVuYWJsZVJldGluYUljb25zOiB0aGlzLl9lbmFibGVSZXRpbmFJY29ucyA/PyBvcHRpb25zLmVuYWJsZVJldGluYUljb25zLFxuICAgICAgZ3JpZFNpemU6IHRoaXMuX2dyaWRTaXplID8/IG9wdGlvbnMuZ3JpZFNpemUsXG4gICAgICBpZ25vcmVIaWRkZW46IHRoaXMuX2lnbm9yZUhpZGRlbiA/PyBvcHRpb25zLmlnbm9yZUhpZGRlbixcbiAgICAgIGltYWdlRXh0ZW5zaW9uOiB0aGlzLl9pbWFnZUV4dGVuc2lvbiA/PyBvcHRpb25zLmltYWdlRXh0ZW5zaW9uLFxuICAgICAgaW1hZ2VQYXRoOiB0aGlzLl9pbWFnZVBhdGggPz8gb3B0aW9ucy5pbWFnZVBhdGgsXG4gICAgICBpbWFnZVNpemVzOiB0aGlzLl9pbWFnZVNpemVzID8/IG9wdGlvbnMuaW1hZ2VTaXplcyxcbiAgICAgIG1heFpvb206IHRoaXMuX21heFpvb20gPz8gb3B0aW9ucy5tYXhab29tLFxuICAgICAgbWluaW11bUNsdXN0ZXJTaXplOiB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUgPz8gb3B0aW9ucy5taW5pbXVtQ2x1c3RlclNpemUsXG4gICAgICBzdHlsZXM6IHRoaXMuX3N0eWxlcyA/PyBvcHRpb25zLnN0eWxlcyxcbiAgICAgIHRpdGxlOiB0aGlzLl90aXRsZSA/PyBvcHRpb25zLnRpdGxlLFxuICAgICAgekluZGV4OiB0aGlzLl96SW5kZXggPz8gb3B0aW9ucy56SW5kZXgsXG4gICAgICB6b29tT25DbGljazogdGhpcy5fem9vbU9uQ2xpY2sgPz8gb3B0aW9ucy56b29tT25DbGljayxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JNYXJrZXJDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKHRoaXMuX21hcmtlcnMpLnRoZW4obWFya2VycyA9PiB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxNYXJrZXJzOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBtYXJrZXJzKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuYWRkKG1hcmtlcik7XG4gICAgICAgICAgaW5pdGlhbE1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmFkZE1hcmtlcnMoaW5pdGlhbE1hcmtlcnMpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9tYXJrZXJzLmNoYW5nZXNcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKG1hcmtlckNvbXBvbmVudHM6IE1hcE1hcmtlcltdKSA9PiB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlckNvbXBvbmVudHMpLnRoZW4obWFya2VycyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdNYXJrZXJzID0gbmV3IFNldChtYXJrZXJzKTtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlcnNUb0FkZDogZ29vZ2xlLm1hcHMuTWFya2VyW10gPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlcnNUb1JlbW92ZTogZ29vZ2xlLm1hcHMuTWFya2VyW10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20obmV3TWFya2VycykpIHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLl9jdXJyZW50TWFya2Vycy5oYXMobWFya2VyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNYXJrZXJzLmFkZChtYXJrZXIpO1xuICAgICAgICAgICAgICAgIG1hcmtlcnNUb0FkZC5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20odGhpcy5fY3VycmVudE1hcmtlcnMpKSB7XG4gICAgICAgICAgICAgIGlmICghbmV3TWFya2Vycy5oYXMobWFya2VyKSkge1xuICAgICAgICAgICAgICAgIG1hcmtlcnNUb1JlbW92ZS5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmFkZE1hcmtlcnMobWFya2Vyc1RvQWRkLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlbW92ZU1hcmtlcnMobWFya2Vyc1RvUmVtb3ZlLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlcGFpbnQoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIG1hcmtlcnNUb1JlbW92ZSkge1xuICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5kZWxldGUobWFya2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEludGVybmFsTWFya2VycyhcbiAgICBtYXJrZXJzOiBNYXBNYXJrZXJbXSB8IFF1ZXJ5TGlzdDxNYXBNYXJrZXI+LFxuICApOiBQcm9taXNlPGdvb2dsZS5tYXBzLk1hcmtlcltdPiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG1hcmtlcnMubWFwKG1hcmtlckNvbXBvbmVudCA9PiBtYXJrZXJDb21wb25lbnQuX3Jlc29sdmVNYXJrZXIoKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHttYXJrZXJDbHVzdGVyZXI6IE1hcmtlckNsdXN0ZXJlckluc3RhbmNlfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLm1hcmtlckNsdXN0ZXJlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBNYXJrZXJDbHVzdGVyZXIgYmVmb3JlIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIE1hcmtlckNsdXN0ZXJlciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19