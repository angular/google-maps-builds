/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" preserve="true" />
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapMarkerClusterer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MapMarkerClusterer, isStandalone: true, selector: "map-marker-clusterer", inputs: { ariaLabelFn: "ariaLabelFn", averageCenter: "averageCenter", batchSize: "batchSize", batchSizeIE: "batchSizeIE", calculator: "calculator", clusterClass: "clusterClass", enableRetinaIcons: "enableRetinaIcons", gridSize: "gridSize", ignoreHidden: "ignoreHidden", imageExtension: "imageExtension", imagePath: "imagePath", imageSizes: "imageSizes", maxZoom: "maxZoom", minimumClusterSize: "minimumClusterSize", styles: "styles", title: "title", zIndex: "zIndex", zoomOnClick: "zoomOnClick", options: "options" }, outputs: { clusteringbegin: "clusteringbegin", clusteringend: "clusteringend", clusterClick: "clusterClick", markerClustererInitialized: "markerClustererInitialized" }, queries: [{ propertyName: "_markers", predicate: MapMarker, descendants: true }], exportAs: ["mapMarkerClusterer"], usesOnChanges: true, ngImport: i0, template: '<ng-content />', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapMarkerClusterer, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsRUFDakIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7OztBQVVuRCx1Q0FBdUM7QUFDdkMsTUFBTSx5QkFBeUIsR0FBMkIsRUFBRSxDQUFDO0FBUTdEOzs7O0dBSUc7QUFTSCxNQUFNLE9BQU8sa0JBQWtCO0lBVzdCLElBQ0ksYUFBYSxDQUFDLGFBQXNCO1FBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0lBQ3RDLENBQUM7SUFLRCxJQUNJLFdBQVcsQ0FBQyxXQUFtQjtRQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNsQyxDQUFDO0lBR0QsSUFDSSxVQUFVLENBQUMsVUFBc0I7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQztJQUdELElB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QkFPRixNQUFNO3NCQURULEtBQUs7Z0JBT0YsS0FBSztzQkFEUixLQUFLO2dCQU9GLE1BQU07c0JBRFQsS0FBSztnQkFPRixXQUFXO3NCQURkLEtBQUs7Z0JBT0YsT0FBTztzQkFEVixLQUFLO2dCQVdhLGVBQWU7c0JBQWpDLE1BQU07Z0JBT1ksYUFBYTtzQkFBL0IsTUFBTTtnQkFLRSxZQUFZO3NCQURwQixNQUFNO2dCQUcwQyxRQUFRO3NCQUF4RCxlQUFlO3VCQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBWTVCLDBCQUEwQjtzQkFBNUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgcHJlc2VydmU9XCJ0cnVlXCIgLz5cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge01hcE1hcmtlcn0gZnJvbSAnLi4vbWFwLW1hcmtlci9tYXAtbWFya2VyJztcbmltcG9ydCB7XG4gIEFyaWFMYWJlbEZuLFxuICBDYWxjdWxhdG9yLFxuICBDbHVzdGVyLFxuICBDbHVzdGVySWNvblN0eWxlLFxuICBNYXJrZXJDbHVzdGVyZXIgYXMgTWFya2VyQ2x1c3RlcmVySW5zdGFuY2UsXG4gIE1hcmtlckNsdXN0ZXJlck9wdGlvbnMsXG59IGZyb20gJy4vbWFya2VyLWNsdXN0ZXJlci10eXBlcyc7XG5cbi8qKiBEZWZhdWx0IG9wdGlvbnMgZm9yIGEgY2x1c3RlcmVyLiAqL1xuY29uc3QgREVGQVVMVF9DTFVTVEVSRVJfT1BUSU9OUzogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucyA9IHt9O1xuXG4vKipcbiAqIFRoZSBjbHVzdGVyZXIgaGFzIHRvIGJlIGRlZmluZWQgYW5kIHJlZmVycmVkIHRvIGFzIGEgZ2xvYmFsIHZhcmlhYmxlLFxuICogb3RoZXJ3aXNlIGl0J2xsIGNhdXNlIGlzc3VlcyB3aGVuIG1pbmlmaWVkIHRocm91Z2ggQ2xvc3VyZS5cbiAqL1xuZGVjbGFyZSBjb25zdCBNYXJrZXJDbHVzdGVyZXI6IHR5cGVvZiBNYXJrZXJDbHVzdGVyZXJJbnN0YW5jZTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCBmb3IgaW1wbGVtZW50aW5nIGEgR29vZ2xlIE1hcHMgTWFya2VyIENsdXN0ZXJlci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvbWFya2VyLWNsdXN0ZXJpbmdcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWFwLW1hcmtlci1jbHVzdGVyZXInLFxuICBleHBvcnRBczogJ21hcE1hcmtlckNsdXN0ZXJlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50IC8+JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwTWFya2VyQ2x1c3RlcmVyIGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2N1cnJlbnRNYXJrZXJzID0gbmV3IFNldDxnb29nbGUubWFwcy5NYXJrZXI+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIoaW5qZWN0KE5nWm9uZSkpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY2x1c3RlcmVyIGlzIGFsbG93ZWQgdG8gYmUgaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NhbkluaXRpYWxpemU6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgYXJpYUxhYmVsRm46IEFyaWFMYWJlbEZuID0gKCkgPT4gJyc7XG5cbiAgQElucHV0KClcbiAgc2V0IGF2ZXJhZ2VDZW50ZXIoYXZlcmFnZUNlbnRlcjogYm9vbGVhbikge1xuICAgIHRoaXMuX2F2ZXJhZ2VDZW50ZXIgPSBhdmVyYWdlQ2VudGVyO1xuICB9XG4gIHByaXZhdGUgX2F2ZXJhZ2VDZW50ZXI6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgYmF0Y2hTaXplPzogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBiYXRjaFNpemVJRShiYXRjaFNpemVJRTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYmF0Y2hTaXplSUUgPSBiYXRjaFNpemVJRTtcbiAgfVxuICBwcml2YXRlIF9iYXRjaFNpemVJRTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBjYWxjdWxhdG9yKGNhbGN1bGF0b3I6IENhbGN1bGF0b3IpIHtcbiAgICB0aGlzLl9jYWxjdWxhdG9yID0gY2FsY3VsYXRvcjtcbiAgfVxuICBwcml2YXRlIF9jYWxjdWxhdG9yOiBDYWxjdWxhdG9yO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBjbHVzdGVyQ2xhc3MoY2x1c3RlckNsYXNzOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9jbHVzdGVyQ2xhc3MgPSBjbHVzdGVyQ2xhc3M7XG4gIH1cbiAgcHJpdmF0ZSBfY2x1c3RlckNsYXNzOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IGVuYWJsZVJldGluYUljb25zKGVuYWJsZVJldGluYUljb25zOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlUmV0aW5hSWNvbnMgPSBlbmFibGVSZXRpbmFJY29ucztcbiAgfVxuICBwcml2YXRlIF9lbmFibGVSZXRpbmFJY29uczogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBzZXQgZ3JpZFNpemUoZ3JpZFNpemU6IG51bWJlcikge1xuICAgIHRoaXMuX2dyaWRTaXplID0gZ3JpZFNpemU7XG4gIH1cbiAgcHJpdmF0ZSBfZ3JpZFNpemU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgaWdub3JlSGlkZGVuKGlnbm9yZUhpZGRlbjogYm9vbGVhbikge1xuICAgIHRoaXMuX2lnbm9yZUhpZGRlbiA9IGlnbm9yZUhpZGRlbjtcbiAgfVxuICBwcml2YXRlIF9pZ25vcmVIaWRkZW46IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgc2V0IGltYWdlRXh0ZW5zaW9uKGltYWdlRXh0ZW5zaW9uOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pbWFnZUV4dGVuc2lvbiA9IGltYWdlRXh0ZW5zaW9uO1xuICB9XG4gIHByaXZhdGUgX2ltYWdlRXh0ZW5zaW9uOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IGltYWdlUGF0aChpbWFnZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlUGF0aCA9IGltYWdlUGF0aDtcbiAgfVxuICBwcml2YXRlIF9pbWFnZVBhdGg6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VTaXplcyhpbWFnZVNpemVzOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2ltYWdlU2l6ZXMgPSBpbWFnZVNpemVzO1xuICB9XG4gIHByaXZhdGUgX2ltYWdlU2l6ZXM6IG51bWJlcltdO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBtYXhab29tKG1heFpvb206IG51bWJlcikge1xuICAgIHRoaXMuX21heFpvb20gPSBtYXhab29tO1xuICB9XG4gIHByaXZhdGUgX21heFpvb206IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgbWluaW11bUNsdXN0ZXJTaXplKG1pbmltdW1DbHVzdGVyU2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWluaW11bUNsdXN0ZXJTaXplID0gbWluaW11bUNsdXN0ZXJTaXplO1xuICB9XG4gIHByaXZhdGUgX21pbmltdW1DbHVzdGVyU2l6ZTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBzdHlsZXMoc3R5bGVzOiBDbHVzdGVySWNvblN0eWxlW10pIHtcbiAgICB0aGlzLl9zdHlsZXMgPSBzdHlsZXM7XG4gIH1cbiAgcHJpdmF0ZSBfc3R5bGVzOiBDbHVzdGVySWNvblN0eWxlW107XG5cbiAgQElucHV0KClcbiAgc2V0IHRpdGxlKHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICB9XG4gIHByaXZhdGUgX3RpdGxlOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IHpJbmRleCh6SW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuX3pJbmRleCA9IHpJbmRleDtcbiAgfVxuICBwcml2YXRlIF96SW5kZXg6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgem9vbU9uQ2xpY2soem9vbU9uQ2xpY2s6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl96b29tT25DbGljayA9IHpvb21PbkNsaWNrO1xuICB9XG4gIHByaXZhdGUgX3pvb21PbkNsaWNrOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICBwcml2YXRlIF9vcHRpb25zOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L21vZHVsZXMvXG4gICAqIF9nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5odG1sI2NsdXN0ZXJpbmdiZWdpblxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsdXN0ZXJpbmdiZWdpbjogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbHVzdGVyaW5nYmVnaW4nKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9tb2R1bGVzL19nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5odG1sI2NsdXN0ZXJpbmdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbHVzdGVyaW5nZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NsdXN0ZXJpbmdlbmQnKTtcblxuICAvKiogRW1pdHMgd2hlbiBhIGNsdXN0ZXIgaGFzIGJlZW4gY2xpY2tlZC4gKi9cbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IGNsdXN0ZXJDbGljazogT2JzZXJ2YWJsZTxDbHVzdGVyPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxDbHVzdGVyPignY2xpY2snKTtcblxuICBAQ29udGVudENoaWxkcmVuKE1hcE1hcmtlciwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX21hcmtlcnM6IFF1ZXJ5TGlzdDxNYXBNYXJrZXI+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBNYXJrZXJDbHVzdGVyZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L2NsYXNzZXMvXG4gICAqIF9nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5tYXJrZXJjbHVzdGVyZXIuaHRtbFxuICAgKi9cbiAgbWFya2VyQ2x1c3RlcmVyPzogTWFya2VyQ2x1c3RlcmVySW5zdGFuY2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2x1c3RlcmVyIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFya2VyQ2x1c3RlcmVySW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxNYXJrZXJDbHVzdGVyZXJJbnN0YW5jZT4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWFya2VyQ2x1c3RlcmVySW5zdGFuY2U+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICkge1xuICAgIHRoaXMuX2NhbkluaXRpYWxpemUgPSBfZ29vZ2xlTWFwLl9pc0Jyb3dzZXI7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fY2FuSW5pdGlhbGl6ZSkge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5fZ29vZ2xlTWFwLl9yZXNvbHZlTWFwKCkudGhlbihtYXAgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBNYXJrZXJDbHVzdGVyZXIgIT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICAgJ01hcmtlckNsdXN0ZXJlciBjbGFzcyBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgYSBtYXJrZXIgY2x1c3Rlci4gJyArXG4gICAgICAgICAgICAgICAgJ1BsZWFzZSBpbnN0YWxsIHRoZSBNYXJrZXJDbHVzdGVyZXJQbHVzIGxpYnJhcnk6ICcgK1xuICAgICAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlbWFwcy9qcy1tYXJrZXJjbHVzdGVyZXJwbHVzJyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIgPSB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXJrZXJDbHVzdGVyZXIobWFwLCBbXSwgdGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5tYXJrZXJDbHVzdGVyZXIpO1xuICAgICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVySW5pdGlhbGl6ZWQuZW1pdCh0aGlzLm1hcmtlckNsdXN0ZXJlcik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0aGlzLl9jYW5Jbml0aWFsaXplKSB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgICAgdGhpcy5fd2F0Y2hGb3JNYXJrZXJDaGFuZ2VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlckluaXRpYWxpemVkXG4gICAgICAgICAgLnBpcGUodGFrZSgxKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fd2F0Y2hGb3JNYXJrZXJDaGFuZ2VzKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7XG4gICAgICBtYXJrZXJDbHVzdGVyZXI6IGNsdXN0ZXJlcixcbiAgICAgIGFyaWFMYWJlbEZuLFxuICAgICAgX2F2ZXJhZ2VDZW50ZXIsXG4gICAgICBfYmF0Y2hTaXplSUUsXG4gICAgICBfY2FsY3VsYXRvcixcbiAgICAgIF9zdHlsZXMsXG4gICAgICBfY2x1c3RlckNsYXNzLFxuICAgICAgX2VuYWJsZVJldGluYUljb25zLFxuICAgICAgX2dyaWRTaXplLFxuICAgICAgX2lnbm9yZUhpZGRlbixcbiAgICAgIF9pbWFnZUV4dGVuc2lvbixcbiAgICAgIF9pbWFnZVBhdGgsXG4gICAgICBfaW1hZ2VTaXplcyxcbiAgICAgIF9tYXhab29tLFxuICAgICAgX21pbmltdW1DbHVzdGVyU2l6ZSxcbiAgICAgIF90aXRsZSxcbiAgICAgIF96SW5kZXgsXG4gICAgICBfem9vbU9uQ2xpY2ssXG4gICAgfSA9IHRoaXM7XG5cbiAgICBpZiAoY2x1c3RlcmVyKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRPcHRpb25zKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2FyaWFMYWJlbEZuJ10pIHtcbiAgICAgICAgY2x1c3RlcmVyLmFyaWFMYWJlbEZuID0gYXJpYUxhYmVsRm47XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snYXZlcmFnZUNlbnRlciddICYmIF9hdmVyYWdlQ2VudGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEF2ZXJhZ2VDZW50ZXIoX2F2ZXJhZ2VDZW50ZXIpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2JhdGNoU2l6ZUlFJ10gJiYgX2JhdGNoU2l6ZUlFICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEJhdGNoU2l6ZUlFKF9iYXRjaFNpemVJRSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snY2FsY3VsYXRvciddICYmICEhX2NhbGN1bGF0b3IpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldENhbGN1bGF0b3IoX2NhbGN1bGF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2NsdXN0ZXJDbGFzcyddICYmIF9jbHVzdGVyQ2xhc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Q2x1c3RlckNsYXNzKF9jbHVzdGVyQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2VuYWJsZVJldGluYUljb25zJ10gJiYgX2VuYWJsZVJldGluYUljb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEVuYWJsZVJldGluYUljb25zKF9lbmFibGVSZXRpbmFJY29ucyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snZ3JpZFNpemUnXSAmJiBfZ3JpZFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0R3JpZFNpemUoX2dyaWRTaXplKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpZ25vcmVIaWRkZW4nXSAmJiBfaWdub3JlSGlkZGVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldElnbm9yZUhpZGRlbihfaWdub3JlSGlkZGVuKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpbWFnZUV4dGVuc2lvbiddICYmIF9pbWFnZUV4dGVuc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZUV4dGVuc2lvbihfaW1hZ2VFeHRlbnNpb24pO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2ltYWdlUGF0aCddICYmIF9pbWFnZVBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SW1hZ2VQYXRoKF9pbWFnZVBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2ltYWdlU2l6ZXMnXSAmJiBfaW1hZ2VTaXplcykge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SW1hZ2VTaXplcyhfaW1hZ2VTaXplcyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snbWF4Wm9vbSddICYmIF9tYXhab29tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldE1heFpvb20oX21heFpvb20pO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ21pbmltdW1DbHVzdGVyU2l6ZSddICYmIF9taW5pbXVtQ2x1c3RlclNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0TWluaW11bUNsdXN0ZXJTaXplKF9taW5pbXVtQ2x1c3RlclNpemUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3N0eWxlcyddICYmIF9zdHlsZXMpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFN0eWxlcyhfc3R5bGVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWyd0aXRsZSddICYmIF90aXRsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRUaXRsZShfdGl0bGUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3pJbmRleCddICYmIF96SW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0WkluZGV4KF96SW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3pvb21PbkNsaWNrJ10gJiYgX3pvb21PbkNsaWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFpvb21PbkNsaWNrKF96b29tT25DbGljayk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5tYXJrZXJDbHVzdGVyZXI/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIGZpdE1hcFRvTWFya2VycyhwYWRkaW5nOiBudW1iZXIgfCBnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5maXRNYXBUb01hcmtlcnMocGFkZGluZyk7XG4gIH1cblxuICBnZXRBdmVyYWdlQ2VudGVyKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEF2ZXJhZ2VDZW50ZXIoKTtcbiAgfVxuXG4gIGdldEJhdGNoU2l6ZUlFKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0QmF0Y2hTaXplSUUoKTtcbiAgfVxuXG4gIGdldENhbGN1bGF0b3IoKTogQ2FsY3VsYXRvciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2FsY3VsYXRvcigpO1xuICB9XG5cbiAgZ2V0Q2x1c3RlckNsYXNzKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2x1c3RlckNsYXNzKCk7XG4gIH1cblxuICBnZXRDbHVzdGVycygpOiBDbHVzdGVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENsdXN0ZXJzKCk7XG4gIH1cblxuICBnZXRFbmFibGVSZXRpbmFJY29ucygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRFbmFibGVSZXRpbmFJY29ucygpO1xuICB9XG5cbiAgZ2V0R3JpZFNpemUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRHcmlkU2l6ZSgpO1xuICB9XG5cbiAgZ2V0SWdub3JlSGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldElnbm9yZUhpZGRlbigpO1xuICB9XG5cbiAgZ2V0SW1hZ2VFeHRlbnNpb24oKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZUV4dGVuc2lvbigpO1xuICB9XG5cbiAgZ2V0SW1hZ2VQYXRoKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SW1hZ2VQYXRoKCk7XG4gIH1cblxuICBnZXRJbWFnZVNpemVzKCk6IG51bWJlcltdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZVNpemVzKCk7XG4gIH1cblxuICBnZXRNYXhab29tKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0TWF4Wm9vbSgpO1xuICB9XG5cbiAgZ2V0TWluaW11bUNsdXN0ZXJTaXplKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0TWluaW11bUNsdXN0ZXJTaXplKCk7XG4gIH1cblxuICBnZXRTdHlsZXMoKTogQ2x1c3Rlckljb25TdHlsZVtdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRTdHlsZXMoKTtcbiAgfVxuXG4gIGdldFRpdGxlKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0VGl0bGUoKTtcbiAgfVxuXG4gIGdldFRvdGFsQ2x1c3RlcnMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUb3RhbENsdXN0ZXJzKCk7XG4gIH1cblxuICBnZXRUb3RhbE1hcmtlcnMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUb3RhbE1hcmtlcnMoKTtcbiAgfVxuXG4gIGdldFpJbmRleCgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFpJbmRleCgpO1xuICB9XG5cbiAgZ2V0Wm9vbU9uQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Wm9vbU9uQ2xpY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IERFRkFVTFRfQ0xVU1RFUkVSX09QVElPTlM7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBhcmlhTGFiZWxGbjogdGhpcy5hcmlhTGFiZWxGbiA/PyBvcHRpb25zLmFyaWFMYWJlbEZuLFxuICAgICAgYXZlcmFnZUNlbnRlcjogdGhpcy5fYXZlcmFnZUNlbnRlciA/PyBvcHRpb25zLmF2ZXJhZ2VDZW50ZXIsXG4gICAgICBiYXRjaFNpemU6IHRoaXMuYmF0Y2hTaXplID8/IG9wdGlvbnMuYmF0Y2hTaXplLFxuICAgICAgYmF0Y2hTaXplSUU6IHRoaXMuX2JhdGNoU2l6ZUlFID8/IG9wdGlvbnMuYmF0Y2hTaXplSUUsXG4gICAgICBjYWxjdWxhdG9yOiB0aGlzLl9jYWxjdWxhdG9yID8/IG9wdGlvbnMuY2FsY3VsYXRvcixcbiAgICAgIGNsdXN0ZXJDbGFzczogdGhpcy5fY2x1c3RlckNsYXNzID8/IG9wdGlvbnMuY2x1c3RlckNsYXNzLFxuICAgICAgZW5hYmxlUmV0aW5hSWNvbnM6IHRoaXMuX2VuYWJsZVJldGluYUljb25zID8/IG9wdGlvbnMuZW5hYmxlUmV0aW5hSWNvbnMsXG4gICAgICBncmlkU2l6ZTogdGhpcy5fZ3JpZFNpemUgPz8gb3B0aW9ucy5ncmlkU2l6ZSxcbiAgICAgIGlnbm9yZUhpZGRlbjogdGhpcy5faWdub3JlSGlkZGVuID8/IG9wdGlvbnMuaWdub3JlSGlkZGVuLFxuICAgICAgaW1hZ2VFeHRlbnNpb246IHRoaXMuX2ltYWdlRXh0ZW5zaW9uID8/IG9wdGlvbnMuaW1hZ2VFeHRlbnNpb24sXG4gICAgICBpbWFnZVBhdGg6IHRoaXMuX2ltYWdlUGF0aCA/PyBvcHRpb25zLmltYWdlUGF0aCxcbiAgICAgIGltYWdlU2l6ZXM6IHRoaXMuX2ltYWdlU2l6ZXMgPz8gb3B0aW9ucy5pbWFnZVNpemVzLFxuICAgICAgbWF4Wm9vbTogdGhpcy5fbWF4Wm9vbSA/PyBvcHRpb25zLm1heFpvb20sXG4gICAgICBtaW5pbXVtQ2x1c3RlclNpemU6IHRoaXMuX21pbmltdW1DbHVzdGVyU2l6ZSA/PyBvcHRpb25zLm1pbmltdW1DbHVzdGVyU2l6ZSxcbiAgICAgIHN0eWxlczogdGhpcy5fc3R5bGVzID8/IG9wdGlvbnMuc3R5bGVzLFxuICAgICAgdGl0bGU6IHRoaXMuX3RpdGxlID8/IG9wdGlvbnMudGl0bGUsXG4gICAgICB6SW5kZXg6IHRoaXMuX3pJbmRleCA/PyBvcHRpb25zLnpJbmRleCxcbiAgICAgIHpvb21PbkNsaWNrOiB0aGlzLl96b29tT25DbGljayA/PyBvcHRpb25zLnpvb21PbkNsaWNrLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck1hcmtlckNoYW5nZXMoKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcblxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9nZXRJbnRlcm5hbE1hcmtlcnModGhpcy5fbWFya2VycykudGhlbihtYXJrZXJzID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbE1hcmtlcnM6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIG1hcmtlcnMpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5hZGQobWFya2VyKTtcbiAgICAgICAgICBpbml0aWFsTWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2Vycyhpbml0aWFsTWFya2Vycyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX21hcmtlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgobWFya2VyQ29tcG9uZW50czogTWFwTWFya2VyW10pID0+IHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9nZXRJbnRlcm5hbE1hcmtlcnMobWFya2VyQ29tcG9uZW50cykudGhlbihtYXJrZXJzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld01hcmtlcnMgPSBuZXcgU2V0KG1hcmtlcnMpO1xuICAgICAgICAgICAgY29uc3QgbWFya2Vyc1RvQWRkOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbWFya2Vyc1RvUmVtb3ZlOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgQXJyYXkuZnJvbShuZXdNYXJrZXJzKSkge1xuICAgICAgICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuYWRkKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgbWFya2Vyc1RvQWRkLnB1c2gobWFya2VyKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50TWFya2VycykpIHtcbiAgICAgICAgICAgICAgaWYgKCFuZXdNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICAgICAgbWFya2Vyc1RvUmVtb3ZlLnB1c2gobWFya2VyKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2VycyhtYXJrZXJzVG9BZGQsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIucmVtb3ZlTWFya2VycyhtYXJrZXJzVG9SZW1vdmUsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIucmVwYWludCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgbWFya2Vyc1RvUmVtb3ZlKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNYXJrZXJzLmRlbGV0ZShtYXJrZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SW50ZXJuYWxNYXJrZXJzKFxuICAgIG1hcmtlcnM6IE1hcE1hcmtlcltdIHwgUXVlcnlMaXN0PE1hcE1hcmtlcj4sXG4gICk6IFByb21pc2U8Z29vZ2xlLm1hcHMuTWFya2VyW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwobWFya2Vycy5tYXAobWFya2VyQ29tcG9uZW50ID0+IG1hcmtlckNvbXBvbmVudC5fcmVzb2x2ZU1hcmtlcigpKSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlckNsdXN0ZXJlcjogTWFya2VyQ2x1c3RlcmVySW5zdGFuY2V9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMubWFya2VyQ2x1c3RlcmVyKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIE1hcmtlckNsdXN0ZXJlciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgTWFya2VyQ2x1c3RlcmVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=