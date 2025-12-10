import * as i0 from '@angular/core';
import { inject, ElementRef, NgZone, EventEmitter, PLATFORM_ID, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, Directive, InjectionToken, ContentChildren, NgModule, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Subject, combineLatest, Subscription } from 'rxjs';
import { switchMap, take, map, takeUntil } from 'rxjs/operators';

class MapEventManager {
  _ngZone;
  _pending = [];
  _listeners = [];
  _targetStream = new BehaviorSubject(undefined);
  _clearListeners() {
    for (const listener of this._listeners) {
      listener.remove();
    }
    this._listeners = [];
  }
  constructor(_ngZone) {
    this._ngZone = _ngZone;
  }
  getLazyEmitter(name, type) {
    return this._targetStream.pipe(switchMap(target => {
      const observable = new Observable(observer => {
        if (!target) {
          this._pending.push({
            observable,
            observer
          });
          return undefined;
        }
        let handle;
        const listener = event => {
          this._ngZone.run(() => observer.next(event));
        };
        if (type === 'native') {
          if ((typeof ngDevMode === 'undefined' || ngDevMode) && (!target.addEventListener || !target.removeEventListener)) {
            throw new Error('Maps event target that uses native events must have `addEventListener` and `removeEventListener` methods.');
          }
          target.addEventListener(name, listener);
          handle = {
            remove: () => target.removeEventListener(name, listener)
          };
        } else {
          handle = target.addListener(name, listener);
        }
        if (!handle) {
          observer.complete();
          return undefined;
        }
        this._listeners.push(handle);
        return () => handle.remove();
      });
      return observable;
    }));
  }
  setTarget(target) {
    const currentTarget = this._targetStream.value;
    if (target === currentTarget) {
      return;
    }
    if (currentTarget) {
      this._clearListeners();
      this._pending = [];
    }
    this._targetStream.next(target);
    this._pending.forEach(subscriber => subscriber.observable.subscribe(subscriber.observer));
    this._pending = [];
  }
  destroy() {
    this._clearListeners();
    this._pending = [];
    this._targetStream.complete();
  }
}

const DEFAULT_OPTIONS = {
  center: {
    lat: 37.421995,
    lng: -122.084092
  },
  zoom: 17,
  mapTypeId: 'roadmap'
};
const DEFAULT_HEIGHT = '500px';
const DEFAULT_WIDTH = '500px';
class GoogleMap {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _mapEl;
  _existingAuthFailureCallback;
  googleMap;
  _isBrowser;
  height = DEFAULT_HEIGHT;
  width = DEFAULT_WIDTH;
  mapId;
  mapTypeId;
  set center(center) {
    this._center = center;
  }
  _center;
  set zoom(zoom) {
    this._zoom = zoom;
  }
  _zoom;
  set options(options) {
    this._options = options || DEFAULT_OPTIONS;
  }
  _options = DEFAULT_OPTIONS;
  mapInitialized = new EventEmitter();
  authFailure = new EventEmitter();
  boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
  centerChanged = this._eventManager.getLazyEmitter('center_changed');
  mapClick = this._eventManager.getLazyEmitter('click');
  mapDblclick = this._eventManager.getLazyEmitter('dblclick');
  mapDrag = this._eventManager.getLazyEmitter('drag');
  mapDragend = this._eventManager.getLazyEmitter('dragend');
  mapDragstart = this._eventManager.getLazyEmitter('dragstart');
  headingChanged = this._eventManager.getLazyEmitter('heading_changed');
  idle = this._eventManager.getLazyEmitter('idle');
  maptypeidChanged = this._eventManager.getLazyEmitter('maptypeid_changed');
  mapMousemove = this._eventManager.getLazyEmitter('mousemove');
  mapMouseout = this._eventManager.getLazyEmitter('mouseout');
  mapMouseover = this._eventManager.getLazyEmitter('mouseover');
  projectionChanged = this._eventManager.getLazyEmitter('projection_changed');
  mapRightclick = this._eventManager.getLazyEmitter('rightclick');
  tilesloaded = this._eventManager.getLazyEmitter('tilesloaded');
  tiltChanged = this._eventManager.getLazyEmitter('tilt_changed');
  zoomChanged = this._eventManager.getLazyEmitter('zoom_changed');
  constructor() {
    const platformId = inject(PLATFORM_ID);
    this._isBrowser = isPlatformBrowser(platformId);
    if (this._isBrowser) {
      const googleMapsWindow = window;
      if (!googleMapsWindow.google && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        throw Error('Namespace google not found, cannot construct embedded google ' + 'map. Please install the Google Maps JavaScript API: ' + 'https://developers.google.com/maps/documentation/javascript/' + 'tutorial#Loading_the_Maps_API');
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
      if (changes['zoom'] && this._zoom != null) {
        googleMap.setZoom(this._zoom);
      }
      if (changes['mapTypeId'] && this.mapTypeId) {
        googleMap.setMapTypeId(this.mapTypeId);
      }
    }
  }
  ngOnInit() {
    if (this._isBrowser) {
      this._mapEl = this._elementRef.nativeElement.querySelector('.map-container');
      this._setSize();
      if (google.maps.Map) {
        this._initialize(google.maps.Map);
      } else {
        this._ngZone.runOutsideAngular(() => {
          google.maps.importLibrary('maps').then(lib => this._initialize(lib.Map));
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
  fitBounds(bounds, padding) {
    this._assertInitialized();
    this.googleMap.fitBounds(bounds, padding);
  }
  panBy(x, y) {
    this._assertInitialized();
    this.googleMap.panBy(x, y);
  }
  panTo(latLng) {
    this._assertInitialized();
    this.googleMap.panTo(latLng);
  }
  panToBounds(latLngBounds, padding) {
    this._assertInitialized();
    this.googleMap.panToBounds(latLngBounds, padding);
  }
  getBounds() {
    this._assertInitialized();
    return this.googleMap.getBounds() || null;
  }
  getCenter() {
    this._assertInitialized();
    return this.googleMap.getCenter();
  }
  getClickableIcons() {
    this._assertInitialized();
    return this.googleMap.getClickableIcons();
  }
  getHeading() {
    this._assertInitialized();
    return this.googleMap.getHeading();
  }
  getMapTypeId() {
    this._assertInitialized();
    return this.googleMap.getMapTypeId();
  }
  getProjection() {
    this._assertInitialized();
    return this.googleMap.getProjection() || null;
  }
  getStreetView() {
    this._assertInitialized();
    return this.googleMap.getStreetView();
  }
  getTilt() {
    this._assertInitialized();
    return this.googleMap.getTilt();
  }
  getZoom() {
    this._assertInitialized();
    return this.googleMap.getZoom();
  }
  get controls() {
    this._assertInitialized();
    return this.googleMap.controls;
  }
  get data() {
    this._assertInitialized();
    return this.googleMap.data;
  }
  get mapTypes() {
    this._assertInitialized();
    return this.googleMap.mapTypes;
  }
  get overlayMapTypes() {
    this._assertInitialized();
    return this.googleMap.overlayMapTypes;
  }
  _resolveMap() {
    return this.googleMap ? Promise.resolve(this.googleMap) : this.mapInitialized.pipe(take(1)).toPromise();
  }
  _setSize() {
    if (this._mapEl) {
      const styles = this._mapEl.style;
      styles.height = this.height === null ? '' : coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
      styles.width = this.width === null ? '' : coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
    }
  }
  _combineOptions() {
    const options = this._options || {};
    return {
      ...options,
      center: this._center || options.center || DEFAULT_OPTIONS.center,
      zoom: this._zoom ?? options.zoom ?? DEFAULT_OPTIONS.zoom,
      mapTypeId: this.mapTypeId || options.mapTypeId || DEFAULT_OPTIONS.mapTypeId,
      mapId: this.mapId || options.mapId
    };
  }
  _assertInitialized() {
    if (!this.googleMap && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('Cannot access Google Map information before the API has been initialized. ' + 'Please wait for the API to load before trying to interact with it.');
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: GoogleMap,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: GoogleMap,
    isStandalone: true,
    selector: "google-map",
    inputs: {
      height: "height",
      width: "width",
      mapId: "mapId",
      mapTypeId: "mapTypeId",
      center: "center",
      zoom: "zoom",
      options: "options"
    },
    outputs: {
      mapInitialized: "mapInitialized",
      authFailure: "authFailure",
      boundsChanged: "boundsChanged",
      centerChanged: "centerChanged",
      mapClick: "mapClick",
      mapDblclick: "mapDblclick",
      mapDrag: "mapDrag",
      mapDragend: "mapDragend",
      mapDragstart: "mapDragstart",
      headingChanged: "headingChanged",
      idle: "idle",
      maptypeidChanged: "maptypeidChanged",
      mapMousemove: "mapMousemove",
      mapMouseout: "mapMouseout",
      mapMouseover: "mapMouseover",
      projectionChanged: "projectionChanged",
      mapRightclick: "mapRightclick",
      tilesloaded: "tilesloaded",
      tiltChanged: "tiltChanged",
      zoomChanged: "zoomChanged"
    },
    exportAs: ["googleMap"],
    usesOnChanges: true,
    ngImport: i0,
    template: '<div class="map-container"></div><ng-content />',
    isInline: true,
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: GoogleMap,
  decorators: [{
    type: Component,
    args: [{
      selector: 'google-map',
      exportAs: 'googleMap',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<div class="map-container"></div><ng-content />',
      encapsulation: ViewEncapsulation.None
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    height: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    mapId: [{
      type: Input
    }],
    mapTypeId: [{
      type: Input
    }],
    center: [{
      type: Input
    }],
    zoom: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    mapInitialized: [{
      type: Output
    }],
    authFailure: [{
      type: Output
    }],
    boundsChanged: [{
      type: Output
    }],
    centerChanged: [{
      type: Output
    }],
    mapClick: [{
      type: Output
    }],
    mapDblclick: [{
      type: Output
    }],
    mapDrag: [{
      type: Output
    }],
    mapDragend: [{
      type: Output
    }],
    mapDragstart: [{
      type: Output
    }],
    headingChanged: [{
      type: Output
    }],
    idle: [{
      type: Output
    }],
    maptypeidChanged: [{
      type: Output
    }],
    mapMousemove: [{
      type: Output
    }],
    mapMouseout: [{
      type: Output
    }],
    mapMouseover: [{
      type: Output
    }],
    projectionChanged: [{
      type: Output
    }],
    mapRightclick: [{
      type: Output
    }],
    tilesloaded: [{
      type: Output
    }],
    tiltChanged: [{
      type: Output
    }],
    zoomChanged: [{
      type: Output
    }]
  }
});
const cssUnitsPattern = /([A-Za-z%]+)$/;
function coerceCssPixelValue(value) {
  if (value == null) {
    return '';
  }
  return cssUnitsPattern.test(value) ? value : `${value}px`;
}

class MapBaseLayer {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  constructor() {}
  ngOnInit() {
    if (this._map._isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        this._initializeObject();
      });
      this._assertInitialized();
      this._setMap();
    }
  }
  ngOnDestroy() {
    this._unsetMap();
  }
  _assertInitialized() {
    if (!this._map.googleMap) {
      throw Error('Cannot access Google Map information before the API has been initialized. ' + 'Please wait for the API to load before trying to interact with it.');
    }
  }
  _initializeObject() {}
  _setMap() {}
  _unsetMap() {}
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapBaseLayer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapBaseLayer,
    isStandalone: true,
    selector: "map-base-layer",
    exportAs: ["mapBaseLayer"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapBaseLayer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-base-layer',
      exportAs: 'mapBaseLayer'
    }]
  }],
  ctorParameters: () => []
});

class MapBicyclingLayer {
  _map = inject(GoogleMap);
  _zone = inject(NgZone);
  bicyclingLayer;
  bicyclingLayerInitialized = new EventEmitter();
  ngOnInit() {
    if (this._map._isBrowser) {
      if (google.maps.BicyclingLayer && this._map.googleMap) {
        this._initialize(this._map.googleMap, google.maps.BicyclingLayer);
      } else {
        this._zone.runOutsideAngular(() => {
          Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
            this._initialize(map, lib.BicyclingLayer);
          });
        });
      }
    }
  }
  _initialize(map, layerConstructor) {
    this._zone.runOutsideAngular(() => {
      this.bicyclingLayer = new layerConstructor();
      this.bicyclingLayerInitialized.emit(this.bicyclingLayer);
      this._assertLayerInitialized();
      this.bicyclingLayer.setMap(map);
    });
  }
  ngOnDestroy() {
    this.bicyclingLayer?.setMap(null);
  }
  _assertLayerInitialized() {
    if (!this.bicyclingLayer) {
      throw Error('Cannot interact with a Google Map Bicycling Layer before it has been initialized. ' + 'Please wait for the Transit Layer to load before trying to interact with it.');
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapBicyclingLayer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapBicyclingLayer,
    isStandalone: true,
    selector: "map-bicycling-layer",
    outputs: {
      bicyclingLayerInitialized: "bicyclingLayerInitialized"
    },
    exportAs: ["mapBicyclingLayer"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapBicyclingLayer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-bicycling-layer',
      exportAs: 'mapBicyclingLayer'
    }]
  }],
  propDecorators: {
    bicyclingLayerInitialized: [{
      type: Output
    }]
  }
});

class MapCircle {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _options = new BehaviorSubject({});
  _center = new BehaviorSubject(undefined);
  _radius = new BehaviorSubject(undefined);
  _destroyed = new Subject();
  circle;
  set options(options) {
    this._options.next(options || {});
  }
  set center(center) {
    this._center.next(center);
  }
  set radius(radius) {
    this._radius.next(radius);
  }
  centerChanged = this._eventManager.getLazyEmitter('center_changed');
  circleClick = this._eventManager.getLazyEmitter('click');
  circleDblclick = this._eventManager.getLazyEmitter('dblclick');
  circleDrag = this._eventManager.getLazyEmitter('drag');
  circleDragend = this._eventManager.getLazyEmitter('dragend');
  circleDragstart = this._eventManager.getLazyEmitter('dragstart');
  circleMousedown = this._eventManager.getLazyEmitter('mousedown');
  circleMousemove = this._eventManager.getLazyEmitter('mousemove');
  circleMouseout = this._eventManager.getLazyEmitter('mouseout');
  circleMouseover = this._eventManager.getLazyEmitter('mouseover');
  circleMouseup = this._eventManager.getLazyEmitter('mouseup');
  radiusChanged = this._eventManager.getLazyEmitter('radius_changed');
  circleRightclick = this._eventManager.getLazyEmitter('rightclick');
  circleInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (!this._map._isBrowser) {
      return;
    }
    this._combineOptions().pipe(take(1)).subscribe(options => {
      if (google.maps.Circle && this._map.googleMap) {
        this._initialize(this._map.googleMap, google.maps.Circle, options);
      } else {
        this._ngZone.runOutsideAngular(() => {
          Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
            this._initialize(map, lib.Circle, options);
          });
        });
      }
    });
  }
  _initialize(map, circleConstructor, options) {
    this._ngZone.runOutsideAngular(() => {
      this.circle = new circleConstructor(options);
      this._assertInitialized();
      this.circle.setMap(map);
      this._eventManager.setTarget(this.circle);
      this.circleInitialized.emit(this.circle);
      this._watchForOptionsChanges();
      this._watchForCenterChanges();
      this._watchForRadiusChanges();
    });
  }
  ngOnDestroy() {
    this._eventManager.destroy();
    this._destroyed.next();
    this._destroyed.complete();
    this.circle?.setMap(null);
  }
  getBounds() {
    this._assertInitialized();
    return this.circle.getBounds();
  }
  getCenter() {
    this._assertInitialized();
    return this.circle.getCenter();
  }
  getDraggable() {
    this._assertInitialized();
    return this.circle.getDraggable();
  }
  getEditable() {
    this._assertInitialized();
    return this.circle.getEditable();
  }
  getRadius() {
    this._assertInitialized();
    return this.circle.getRadius();
  }
  getVisible() {
    this._assertInitialized();
    return this.circle.getVisible();
  }
  _combineOptions() {
    return combineLatest([this._options, this._center, this._radius]).pipe(map(([options, center, radius]) => {
      const combinedOptions = {
        ...options,
        center: center || options.center,
        radius: radius !== undefined ? radius : options.radius
      };
      return combinedOptions;
    }));
  }
  _watchForOptionsChanges() {
    this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
      this._assertInitialized();
      this.circle.setOptions(options);
    });
  }
  _watchForCenterChanges() {
    this._center.pipe(takeUntil(this._destroyed)).subscribe(center => {
      if (center) {
        this._assertInitialized();
        this.circle.setCenter(center);
      }
    });
  }
  _watchForRadiusChanges() {
    this._radius.pipe(takeUntil(this._destroyed)).subscribe(radius => {
      if (radius !== undefined) {
        this._assertInitialized();
        this.circle.setRadius(radius);
      }
    });
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.circle) {
        throw Error('Cannot interact with a Google Map Circle before it has been ' + 'initialized. Please wait for the Circle to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapCircle,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapCircle,
    isStandalone: true,
    selector: "map-circle",
    inputs: {
      options: "options",
      center: "center",
      radius: "radius"
    },
    outputs: {
      centerChanged: "centerChanged",
      circleClick: "circleClick",
      circleDblclick: "circleDblclick",
      circleDrag: "circleDrag",
      circleDragend: "circleDragend",
      circleDragstart: "circleDragstart",
      circleMousedown: "circleMousedown",
      circleMousemove: "circleMousemove",
      circleMouseout: "circleMouseout",
      circleMouseover: "circleMouseover",
      circleMouseup: "circleMouseup",
      radiusChanged: "radiusChanged",
      circleRightclick: "circleRightclick",
      circleInitialized: "circleInitialized"
    },
    exportAs: ["mapCircle"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapCircle,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-circle',
      exportAs: 'mapCircle'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    options: [{
      type: Input
    }],
    center: [{
      type: Input
    }],
    radius: [{
      type: Input
    }],
    centerChanged: [{
      type: Output
    }],
    circleClick: [{
      type: Output
    }],
    circleDblclick: [{
      type: Output
    }],
    circleDrag: [{
      type: Output
    }],
    circleDragend: [{
      type: Output
    }],
    circleDragstart: [{
      type: Output
    }],
    circleMousedown: [{
      type: Output
    }],
    circleMousemove: [{
      type: Output
    }],
    circleMouseout: [{
      type: Output
    }],
    circleMouseover: [{
      type: Output
    }],
    circleMouseup: [{
      type: Output
    }],
    radiusChanged: [{
      type: Output
    }],
    circleRightclick: [{
      type: Output
    }],
    circleInitialized: [{
      type: Output
    }]
  }
});

class MapDirectionsRenderer {
  _googleMap = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  set directions(directions) {
    this._directions = directions;
  }
  _directions;
  set options(options) {
    this._options = options;
  }
  _options;
  directionsChanged = this._eventManager.getLazyEmitter('directions_changed');
  directionsRendererInitialized = new EventEmitter();
  directionsRenderer;
  constructor() {}
  ngOnInit() {
    if (this._googleMap._isBrowser) {
      if (google.maps.DirectionsRenderer && this._googleMap.googleMap) {
        this._initialize(this._googleMap.googleMap, google.maps.DirectionsRenderer);
      } else {
        this._ngZone.runOutsideAngular(() => {
          Promise.all([this._googleMap._resolveMap(), google.maps.importLibrary('routes')]).then(([map, lib]) => {
            this._initialize(map, lib.DirectionsRenderer);
          });
        });
      }
    }
  }
  _initialize(map, rendererConstructor) {
    this._ngZone.runOutsideAngular(() => {
      this.directionsRenderer = new rendererConstructor(this._combineOptions());
      this._assertInitialized();
      this.directionsRenderer.setMap(map);
      this._eventManager.setTarget(this.directionsRenderer);
      this.directionsRendererInitialized.emit(this.directionsRenderer);
    });
  }
  ngOnChanges(changes) {
    if (this.directionsRenderer) {
      if (changes['options']) {
        this.directionsRenderer.setOptions(this._combineOptions());
      }
      if (changes['directions'] && this._directions !== undefined) {
        this.directionsRenderer.setDirections(this._directions);
      }
    }
  }
  ngOnDestroy() {
    this._eventManager.destroy();
    this.directionsRenderer?.setMap(null);
  }
  getDirections() {
    this._assertInitialized();
    return this.directionsRenderer.getDirections();
  }
  getPanel() {
    this._assertInitialized();
    return this.directionsRenderer.getPanel();
  }
  getRouteIndex() {
    this._assertInitialized();
    return this.directionsRenderer.getRouteIndex();
  }
  _combineOptions() {
    const options = this._options || {};
    return {
      ...options,
      directions: this._directions || options.directions,
      map: this._googleMap.googleMap
    };
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.directionsRenderer) {
        throw Error('Cannot interact with a Google Map Directions Renderer before it has been ' + 'initialized. Please wait for the Directions Renderer to load before trying ' + 'to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapDirectionsRenderer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapDirectionsRenderer,
    isStandalone: true,
    selector: "map-directions-renderer",
    inputs: {
      directions: "directions",
      options: "options"
    },
    outputs: {
      directionsChanged: "directionsChanged",
      directionsRendererInitialized: "directionsRendererInitialized"
    },
    exportAs: ["mapDirectionsRenderer"],
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapDirectionsRenderer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-directions-renderer',
      exportAs: 'mapDirectionsRenderer'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    directions: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    directionsChanged: [{
      type: Output
    }],
    directionsRendererInitialized: [{
      type: Output
    }]
  }
});

class MapGroundOverlay {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _opacity = new BehaviorSubject(1);
  _url = new BehaviorSubject('');
  _bounds = new BehaviorSubject(undefined);
  _destroyed = new Subject();
  _hasWatchers;
  groundOverlay;
  set url(url) {
    this._url.next(url);
  }
  get bounds() {
    return this._bounds.value;
  }
  set bounds(bounds) {
    this._bounds.next(bounds);
  }
  clickable = false;
  set opacity(opacity) {
    this._opacity.next(opacity);
  }
  mapClick = this._eventManager.getLazyEmitter('click');
  mapDblclick = this._eventManager.getLazyEmitter('dblclick');
  groundOverlayInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._map._isBrowser) {
      this._bounds.pipe(takeUntil(this._destroyed)).subscribe(bounds => {
        if (this.groundOverlay) {
          this.groundOverlay.setMap(null);
          this.groundOverlay = undefined;
        }
        if (!bounds) {
          return;
        }
        if (google.maps.GroundOverlay && this._map.googleMap) {
          this._initialize(this._map.googleMap, google.maps.GroundOverlay, bounds);
        } else {
          this._ngZone.runOutsideAngular(() => {
            Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
              this._initialize(map, lib.GroundOverlay, bounds);
            });
          });
        }
      });
    }
  }
  _initialize(map, overlayConstructor, bounds) {
    this._ngZone.runOutsideAngular(() => {
      this.groundOverlay = new overlayConstructor(this._url.getValue(), bounds, {
        clickable: this.clickable,
        opacity: this._opacity.value
      });
      this._assertInitialized();
      this.groundOverlay.setMap(map);
      this._eventManager.setTarget(this.groundOverlay);
      this.groundOverlayInitialized.emit(this.groundOverlay);
      if (!this._hasWatchers) {
        this._hasWatchers = true;
        this._watchForOpacityChanges();
        this._watchForUrlChanges();
      }
    });
  }
  ngOnDestroy() {
    this._eventManager.destroy();
    this._destroyed.next();
    this._destroyed.complete();
    this.groundOverlay?.setMap(null);
  }
  getBounds() {
    this._assertInitialized();
    return this.groundOverlay.getBounds();
  }
  getOpacity() {
    this._assertInitialized();
    return this.groundOverlay.getOpacity();
  }
  getUrl() {
    this._assertInitialized();
    return this.groundOverlay.getUrl();
  }
  _watchForOpacityChanges() {
    this._opacity.pipe(takeUntil(this._destroyed)).subscribe(opacity => {
      if (opacity != null) {
        this.groundOverlay?.setOpacity(opacity);
      }
    });
  }
  _watchForUrlChanges() {
    this._url.pipe(takeUntil(this._destroyed)).subscribe(url => {
      const overlay = this.groundOverlay;
      if (overlay) {
        overlay.set('url', url);
        overlay.setMap(null);
        overlay.setMap(this._map.googleMap);
      }
    });
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.groundOverlay) {
        throw Error('Cannot interact with a Google Map GroundOverlay before it has been initialized. ' + 'Please wait for the GroundOverlay to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapGroundOverlay,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapGroundOverlay,
    isStandalone: true,
    selector: "map-ground-overlay",
    inputs: {
      url: "url",
      bounds: "bounds",
      clickable: "clickable",
      opacity: "opacity"
    },
    outputs: {
      mapClick: "mapClick",
      mapDblclick: "mapDblclick",
      groundOverlayInitialized: "groundOverlayInitialized"
    },
    exportAs: ["mapGroundOverlay"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapGroundOverlay,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-ground-overlay',
      exportAs: 'mapGroundOverlay'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    url: [{
      type: Input
    }],
    bounds: [{
      type: Input
    }],
    clickable: [{
      type: Input
    }],
    opacity: [{
      type: Input
    }],
    mapClick: [{
      type: Output
    }],
    mapDblclick: [{
      type: Output
    }],
    groundOverlayInitialized: [{
      type: Output
    }]
  }
});

class MapInfoWindow {
  _googleMap = inject(GoogleMap);
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _options = new BehaviorSubject({});
  _position = new BehaviorSubject(undefined);
  _destroy = new Subject();
  infoWindow;
  set options(options) {
    this._options.next(options || {});
  }
  set position(position) {
    this._position.next(position);
  }
  closeclick = this._eventManager.getLazyEmitter('closeclick');
  contentChanged = this._eventManager.getLazyEmitter('content_changed');
  domready = this._eventManager.getLazyEmitter('domready');
  positionChanged = this._eventManager.getLazyEmitter('position_changed');
  zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
  infoWindowInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._googleMap._isBrowser) {
      this._combineOptions().pipe(take(1)).subscribe(options => {
        if (google.maps.InfoWindow) {
          this._initialize(google.maps.InfoWindow, options);
        } else {
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
    if (this.infoWindow) {
      this.close();
    }
  }
  close() {
    this._assertInitialized();
    this.infoWindow.close();
  }
  getContent() {
    this._assertInitialized();
    return this.infoWindow.getContent() || null;
  }
  getPosition() {
    this._assertInitialized();
    return this.infoWindow.getPosition() || null;
  }
  getZIndex() {
    this._assertInitialized();
    return this.infoWindow.getZIndex();
  }
  openAdvancedMarkerElement(advancedMarkerElement, content) {
    this.open({
      getAnchor: () => advancedMarkerElement
    }, undefined, content);
  }
  open(anchor, shouldFocus, content) {
    this._assertInitialized();
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && anchor && !anchor.getAnchor) {
      throw new Error('Specified anchor does not implement the `getAnchor` method. ' + 'It cannot be used to open an info window.');
    }
    const anchorObject = anchor ? anchor.getAnchor() : undefined;
    if (this.infoWindow.get('anchor') !== anchorObject || !anchorObject) {
      this._elementRef.nativeElement.style.display = content ? 'none' : '';
      if (content) {
        this.infoWindow.setContent(content);
      }
      this.infoWindow.open({
        map: this._googleMap.googleMap,
        anchor: anchorObject,
        shouldFocus
      });
    }
  }
  _combineOptions() {
    return combineLatest([this._options, this._position]).pipe(map(([options, position]) => {
      const combinedOptions = {
        ...options,
        position: position || options.position,
        content: this._elementRef.nativeElement
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
        throw Error('Cannot interact with a Google Map Info Window before it has been ' + 'initialized. Please wait for the Info Window to load before trying to interact with ' + 'it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapInfoWindow,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapInfoWindow,
    isStandalone: true,
    selector: "map-info-window",
    inputs: {
      options: "options",
      position: "position"
    },
    outputs: {
      closeclick: "closeclick",
      contentChanged: "contentChanged",
      domready: "domready",
      positionChanged: "positionChanged",
      zindexChanged: "zindexChanged",
      infoWindowInitialized: "infoWindowInitialized"
    },
    host: {
      styleAttribute: "display: none"
    },
    exportAs: ["mapInfoWindow"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapInfoWindow,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-info-window',
      exportAs: 'mapInfoWindow',
      host: {
        'style': 'display: none'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    options: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    closeclick: [{
      type: Output
    }],
    contentChanged: [{
      type: Output
    }],
    domready: [{
      type: Output
    }],
    positionChanged: [{
      type: Output
    }],
    zindexChanged: [{
      type: Output
    }],
    infoWindowInitialized: [{
      type: Output
    }]
  }
});

class MapKmlLayer {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _options = new BehaviorSubject({});
  _url = new BehaviorSubject('');
  _destroyed = new Subject();
  kmlLayer;
  set options(options) {
    this._options.next(options || {});
  }
  set url(url) {
    this._url.next(url);
  }
  kmlClick = this._eventManager.getLazyEmitter('click');
  defaultviewportChanged = this._eventManager.getLazyEmitter('defaultviewport_changed');
  statusChanged = this._eventManager.getLazyEmitter('status_changed');
  kmlLayerInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._map._isBrowser) {
      this._combineOptions().pipe(take(1)).subscribe(options => {
        if (google.maps.KmlLayer && this._map.googleMap) {
          this._initialize(this._map.googleMap, google.maps.KmlLayer, options);
        } else {
          this._ngZone.runOutsideAngular(() => {
            Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
              this._initialize(map, lib.KmlLayer, options);
            });
          });
        }
      });
    }
  }
  _initialize(map, layerConstructor, options) {
    this._ngZone.runOutsideAngular(() => {
      this.kmlLayer = new layerConstructor(options);
      this._assertInitialized();
      this.kmlLayer.setMap(map);
      this._eventManager.setTarget(this.kmlLayer);
      this.kmlLayerInitialized.emit(this.kmlLayer);
      this._watchForOptionsChanges();
      this._watchForUrlChanges();
    });
  }
  ngOnDestroy() {
    this._eventManager.destroy();
    this._destroyed.next();
    this._destroyed.complete();
    this.kmlLayer?.setMap(null);
  }
  getDefaultViewport() {
    this._assertInitialized();
    return this.kmlLayer.getDefaultViewport();
  }
  getMetadata() {
    this._assertInitialized();
    return this.kmlLayer.getMetadata();
  }
  getStatus() {
    this._assertInitialized();
    return this.kmlLayer.getStatus();
  }
  getUrl() {
    this._assertInitialized();
    return this.kmlLayer.getUrl();
  }
  getZIndex() {
    this._assertInitialized();
    return this.kmlLayer.getZIndex();
  }
  _combineOptions() {
    return combineLatest([this._options, this._url]).pipe(map(([options, url]) => {
      const combinedOptions = {
        ...options,
        url: url || options.url
      };
      return combinedOptions;
    }));
  }
  _watchForOptionsChanges() {
    this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
      if (this.kmlLayer) {
        this._assertInitialized();
        this.kmlLayer.setOptions(options);
      }
    });
  }
  _watchForUrlChanges() {
    this._url.pipe(takeUntil(this._destroyed)).subscribe(url => {
      if (url && this.kmlLayer) {
        this._assertInitialized();
        this.kmlLayer.setUrl(url);
      }
    });
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.kmlLayer) {
        throw Error('Cannot interact with a Google Map KmlLayer before it has been ' + 'initialized. Please wait for the KmlLayer to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapKmlLayer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapKmlLayer,
    isStandalone: true,
    selector: "map-kml-layer",
    inputs: {
      options: "options",
      url: "url"
    },
    outputs: {
      kmlClick: "kmlClick",
      defaultviewportChanged: "defaultviewportChanged",
      statusChanged: "statusChanged",
      kmlLayerInitialized: "kmlLayerInitialized"
    },
    exportAs: ["mapKmlLayer"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapKmlLayer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-kml-layer',
      exportAs: 'mapKmlLayer'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    options: [{
      type: Input
    }],
    url: [{
      type: Input
    }],
    kmlClick: [{
      type: Output
    }],
    defaultviewportChanged: [{
      type: Output
    }],
    statusChanged: [{
      type: Output
    }],
    kmlLayerInitialized: [{
      type: Output
    }]
  }
});

const MAP_MARKER = new InjectionToken('MAP_MARKER');

const DEFAULT_MARKER_OPTIONS$1 = {
  position: {
    lat: 37.421995,
    lng: -122.084092
  }
};
class MapMarker {
  _googleMap = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  set title(title) {
    this._title = title;
  }
  _title;
  set position(position) {
    this._position = position;
  }
  _position;
  set label(label) {
    this._label = label;
  }
  _label;
  set clickable(clickable) {
    this._clickable = clickable;
  }
  _clickable;
  set options(options) {
    this._options = options;
  }
  _options;
  set icon(icon) {
    this._icon = icon;
  }
  _icon;
  set visible(value) {
    this._visible = value;
  }
  _visible;
  animationChanged = this._eventManager.getLazyEmitter('animation_changed');
  mapClick = this._eventManager.getLazyEmitter('click');
  clickableChanged = this._eventManager.getLazyEmitter('clickable_changed');
  cursorChanged = this._eventManager.getLazyEmitter('cursor_changed');
  mapDblclick = this._eventManager.getLazyEmitter('dblclick');
  mapDrag = this._eventManager.getLazyEmitter('drag');
  mapDragend = this._eventManager.getLazyEmitter('dragend');
  draggableChanged = this._eventManager.getLazyEmitter('draggable_changed');
  mapDragstart = this._eventManager.getLazyEmitter('dragstart');
  flatChanged = this._eventManager.getLazyEmitter('flat_changed');
  iconChanged = this._eventManager.getLazyEmitter('icon_changed');
  mapMousedown = this._eventManager.getLazyEmitter('mousedown');
  mapMouseout = this._eventManager.getLazyEmitter('mouseout');
  mapMouseover = this._eventManager.getLazyEmitter('mouseover');
  mapMouseup = this._eventManager.getLazyEmitter('mouseup');
  positionChanged = this._eventManager.getLazyEmitter('position_changed');
  mapRightclick = this._eventManager.getLazyEmitter('rightclick');
  shapeChanged = this._eventManager.getLazyEmitter('shape_changed');
  titleChanged = this._eventManager.getLazyEmitter('title_changed');
  visibleChanged = this._eventManager.getLazyEmitter('visible_changed');
  zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
  markerInitialized = new EventEmitter();
  marker;
  constructor() {}
  ngOnInit() {
    if (!this._googleMap._isBrowser) {
      return;
    }
    if (google.maps.Marker && this._googleMap.googleMap) {
      this._initialize(this._googleMap.googleMap, google.maps.Marker);
    } else {
      this._ngZone.runOutsideAngular(() => {
        Promise.all([this._googleMap._resolveMap(), google.maps.importLibrary('marker')]).then(([map, lib]) => {
          this._initialize(map, lib.Marker);
        });
      });
    }
  }
  _initialize(map, markerConstructor) {
    this._ngZone.runOutsideAngular(() => {
      this.marker = new markerConstructor(this._combineOptions());
      this._assertInitialized();
      this.marker.setMap(map);
      this._eventManager.setTarget(this.marker);
      this.markerInitialized.next(this.marker);
    });
  }
  ngOnChanges(changes) {
    const {
      marker,
      _title,
      _position,
      _label,
      _clickable,
      _icon,
      _visible
    } = this;
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
    this.markerInitialized.complete();
    this._eventManager.destroy();
    this.marker?.setMap(null);
  }
  getAnimation() {
    this._assertInitialized();
    return this.marker.getAnimation() || null;
  }
  getClickable() {
    this._assertInitialized();
    return this.marker.getClickable();
  }
  getCursor() {
    this._assertInitialized();
    return this.marker.getCursor() || null;
  }
  getDraggable() {
    this._assertInitialized();
    return !!this.marker.getDraggable();
  }
  getIcon() {
    this._assertInitialized();
    return this.marker.getIcon() || null;
  }
  getLabel() {
    this._assertInitialized();
    return this.marker.getLabel() || null;
  }
  getOpacity() {
    this._assertInitialized();
    return this.marker.getOpacity() || null;
  }
  getPosition() {
    this._assertInitialized();
    return this.marker.getPosition() || null;
  }
  getShape() {
    this._assertInitialized();
    return this.marker.getShape() || null;
  }
  getTitle() {
    this._assertInitialized();
    return this.marker.getTitle() || null;
  }
  getVisible() {
    this._assertInitialized();
    return this.marker.getVisible();
  }
  getZIndex() {
    this._assertInitialized();
    return this.marker.getZIndex() || null;
  }
  getAnchor() {
    this._assertInitialized();
    return this.marker;
  }
  _resolveMarker() {
    return this.marker ? Promise.resolve(this.marker) : this.markerInitialized.pipe(take(1)).toPromise();
  }
  _combineOptions() {
    const options = this._options || DEFAULT_MARKER_OPTIONS$1;
    return {
      ...options,
      title: this._title || options.title,
      position: this._position || options.position,
      label: this._label || options.label,
      clickable: this._clickable ?? options.clickable,
      map: this._googleMap.googleMap,
      icon: this._icon || options.icon,
      visible: this._visible ?? options.visible
    };
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.marker) {
        throw Error('Cannot interact with a Google Map Marker before it has been ' + 'initialized. Please wait for the Marker to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapMarker,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapMarker,
    isStandalone: true,
    selector: "map-marker",
    inputs: {
      title: "title",
      position: "position",
      label: "label",
      clickable: "clickable",
      options: "options",
      icon: "icon",
      visible: "visible"
    },
    outputs: {
      animationChanged: "animationChanged",
      mapClick: "mapClick",
      clickableChanged: "clickableChanged",
      cursorChanged: "cursorChanged",
      mapDblclick: "mapDblclick",
      mapDrag: "mapDrag",
      mapDragend: "mapDragend",
      draggableChanged: "draggableChanged",
      mapDragstart: "mapDragstart",
      flatChanged: "flatChanged",
      iconChanged: "iconChanged",
      mapMousedown: "mapMousedown",
      mapMouseout: "mapMouseout",
      mapMouseover: "mapMouseover",
      mapMouseup: "mapMouseup",
      positionChanged: "positionChanged",
      mapRightclick: "mapRightclick",
      shapeChanged: "shapeChanged",
      titleChanged: "titleChanged",
      visibleChanged: "visibleChanged",
      zindexChanged: "zindexChanged",
      markerInitialized: "markerInitialized"
    },
    providers: [{
      provide: MAP_MARKER,
      useExisting: MapMarker
    }],
    exportAs: ["mapMarker"],
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapMarker,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-marker',
      exportAs: 'mapMarker',
      providers: [{
        provide: MAP_MARKER,
        useExisting: MapMarker
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    title: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    clickable: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    icon: [{
      type: Input
    }],
    visible: [{
      type: Input
    }],
    animationChanged: [{
      type: Output
    }],
    mapClick: [{
      type: Output
    }],
    clickableChanged: [{
      type: Output
    }],
    cursorChanged: [{
      type: Output
    }],
    mapDblclick: [{
      type: Output
    }],
    mapDrag: [{
      type: Output
    }],
    mapDragend: [{
      type: Output
    }],
    draggableChanged: [{
      type: Output
    }],
    mapDragstart: [{
      type: Output
    }],
    flatChanged: [{
      type: Output
    }],
    iconChanged: [{
      type: Output
    }],
    mapMousedown: [{
      type: Output
    }],
    mapMouseout: [{
      type: Output
    }],
    mapMouseover: [{
      type: Output
    }],
    mapMouseup: [{
      type: Output
    }],
    positionChanged: [{
      type: Output
    }],
    mapRightclick: [{
      type: Output
    }],
    shapeChanged: [{
      type: Output
    }],
    titleChanged: [{
      type: Output
    }],
    visibleChanged: [{
      type: Output
    }],
    zindexChanged: [{
      type: Output
    }],
    markerInitialized: [{
      type: Output
    }]
  }
});

const DEFAULT_CLUSTERER_OPTIONS = {};
class DeprecatedMapMarkerClusterer {
  _googleMap = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _currentMarkers = new Set();
  _eventManager = new MapEventManager(inject(NgZone));
  _destroy = new Subject();
  _canInitialize = this._googleMap._isBrowser;
  ariaLabelFn = () => '';
  set averageCenter(averageCenter) {
    this._averageCenter = averageCenter;
  }
  _averageCenter;
  batchSize;
  set batchSizeIE(batchSizeIE) {
    this._batchSizeIE = batchSizeIE;
  }
  _batchSizeIE;
  set calculator(calculator) {
    this._calculator = calculator;
  }
  _calculator;
  set clusterClass(clusterClass) {
    this._clusterClass = clusterClass;
  }
  _clusterClass;
  set enableRetinaIcons(enableRetinaIcons) {
    this._enableRetinaIcons = enableRetinaIcons;
  }
  _enableRetinaIcons;
  set gridSize(gridSize) {
    this._gridSize = gridSize;
  }
  _gridSize;
  set ignoreHidden(ignoreHidden) {
    this._ignoreHidden = ignoreHidden;
  }
  _ignoreHidden;
  set imageExtension(imageExtension) {
    this._imageExtension = imageExtension;
  }
  _imageExtension;
  set imagePath(imagePath) {
    this._imagePath = imagePath;
  }
  _imagePath;
  set imageSizes(imageSizes) {
    this._imageSizes = imageSizes;
  }
  _imageSizes;
  set maxZoom(maxZoom) {
    this._maxZoom = maxZoom;
  }
  _maxZoom;
  set minimumClusterSize(minimumClusterSize) {
    this._minimumClusterSize = minimumClusterSize;
  }
  _minimumClusterSize;
  set styles(styles) {
    this._styles = styles;
  }
  _styles;
  set title(title) {
    this._title = title;
  }
  _title;
  set zIndex(zIndex) {
    this._zIndex = zIndex;
  }
  _zIndex;
  set zoomOnClick(zoomOnClick) {
    this._zoomOnClick = zoomOnClick;
  }
  _zoomOnClick;
  set options(options) {
    this._options = options;
  }
  _options;
  clusteringbegin = this._eventManager.getLazyEmitter('clusteringbegin');
  clusteringend = this._eventManager.getLazyEmitter('clusteringend');
  clusterClick = this._eventManager.getLazyEmitter('click');
  _markers;
  markerClusterer;
  markerClustererInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._canInitialize) {
      this._ngZone.runOutsideAngular(() => {
        this._googleMap._resolveMap().then(map => {
          if (typeof MarkerClusterer !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('MarkerClusterer class not found, cannot construct a marker cluster. ' + 'Please install the MarkerClustererPlus library: ' + 'https://github.com/googlemaps/js-markerclustererplus');
          }
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
      } else {
        this.markerClustererInitialized.pipe(take(1), takeUntil(this._destroy)).subscribe(() => this._watchForMarkerChanges());
      }
    }
  }
  ngOnChanges(changes) {
    const {
      markerClusterer: clusterer,
      ariaLabelFn,
      _averageCenter,
      _batchSizeIE,
      _calculator,
      _styles,
      _clusterClass,
      _enableRetinaIcons,
      _gridSize,
      _ignoreHidden,
      _imageExtension,
      _imagePath,
      _imageSizes,
      _maxZoom,
      _minimumClusterSize,
      _title,
      _zIndex,
      _zoomOnClick
    } = this;
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
      zoomOnClick: this._zoomOnClick ?? options.zoomOnClick
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
    this._markers.changes.pipe(takeUntil(this._destroy)).subscribe(markerComponents => {
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
        throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' + 'Please wait for the MarkerClusterer to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: DeprecatedMapMarkerClusterer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: DeprecatedMapMarkerClusterer,
    isStandalone: true,
    selector: "deprecated-map-marker-clusterer",
    inputs: {
      ariaLabelFn: "ariaLabelFn",
      averageCenter: "averageCenter",
      batchSize: "batchSize",
      batchSizeIE: "batchSizeIE",
      calculator: "calculator",
      clusterClass: "clusterClass",
      enableRetinaIcons: "enableRetinaIcons",
      gridSize: "gridSize",
      ignoreHidden: "ignoreHidden",
      imageExtension: "imageExtension",
      imagePath: "imagePath",
      imageSizes: "imageSizes",
      maxZoom: "maxZoom",
      minimumClusterSize: "minimumClusterSize",
      styles: "styles",
      title: "title",
      zIndex: "zIndex",
      zoomOnClick: "zoomOnClick",
      options: "options"
    },
    outputs: {
      clusteringbegin: "clusteringbegin",
      clusteringend: "clusteringend",
      clusterClick: "clusterClick",
      markerClustererInitialized: "markerClustererInitialized"
    },
    queries: [{
      propertyName: "_markers",
      predicate: MapMarker,
      descendants: true
    }],
    exportAs: ["mapMarkerClusterer"],
    usesOnChanges: true,
    ngImport: i0,
    template: '<ng-content/>',
    isInline: true,
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: DeprecatedMapMarkerClusterer,
  decorators: [{
    type: Component,
    args: [{
      selector: 'deprecated-map-marker-clusterer',
      exportAs: 'mapMarkerClusterer',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<ng-content/>',
      encapsulation: ViewEncapsulation.None
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    ariaLabelFn: [{
      type: Input
    }],
    averageCenter: [{
      type: Input
    }],
    batchSize: [{
      type: Input
    }],
    batchSizeIE: [{
      type: Input
    }],
    calculator: [{
      type: Input
    }],
    clusterClass: [{
      type: Input
    }],
    enableRetinaIcons: [{
      type: Input
    }],
    gridSize: [{
      type: Input
    }],
    ignoreHidden: [{
      type: Input
    }],
    imageExtension: [{
      type: Input
    }],
    imagePath: [{
      type: Input
    }],
    imageSizes: [{
      type: Input
    }],
    maxZoom: [{
      type: Input
    }],
    minimumClusterSize: [{
      type: Input
    }],
    styles: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    zIndex: [{
      type: Input
    }],
    zoomOnClick: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    clusteringbegin: [{
      type: Output
    }],
    clusteringend: [{
      type: Output
    }],
    clusterClick: [{
      type: Output
    }],
    _markers: [{
      type: ContentChildren,
      args: [MapMarker, {
        descendants: true
      }]
    }],
    markerClustererInitialized: [{
      type: Output
    }]
  }
});

class MapPolygon {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _options = new BehaviorSubject({});
  _paths = new BehaviorSubject(undefined);
  _destroyed = new Subject();
  polygon;
  set options(options) {
    this._options.next(options || {});
  }
  set paths(paths) {
    this._paths.next(paths);
  }
  polygonClick = this._eventManager.getLazyEmitter('click');
  polygonDblclick = this._eventManager.getLazyEmitter('dblclick');
  polygonDrag = this._eventManager.getLazyEmitter('drag');
  polygonDragend = this._eventManager.getLazyEmitter('dragend');
  polygonDragstart = this._eventManager.getLazyEmitter('dragstart');
  polygonMousedown = this._eventManager.getLazyEmitter('mousedown');
  polygonMousemove = this._eventManager.getLazyEmitter('mousemove');
  polygonMouseout = this._eventManager.getLazyEmitter('mouseout');
  polygonMouseover = this._eventManager.getLazyEmitter('mouseover');
  polygonMouseup = this._eventManager.getLazyEmitter('mouseup');
  polygonRightclick = this._eventManager.getLazyEmitter('rightclick');
  polygonInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._map._isBrowser) {
      this._combineOptions().pipe(take(1)).subscribe(options => {
        if (google.maps.Polygon && this._map.googleMap) {
          this._initialize(this._map.googleMap, google.maps.Polygon, options);
        } else {
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
  getDraggable() {
    this._assertInitialized();
    return this.polygon.getDraggable();
  }
  getEditable() {
    this._assertInitialized();
    return this.polygon.getEditable();
  }
  getPath() {
    this._assertInitialized();
    return this.polygon.getPath();
  }
  getPaths() {
    this._assertInitialized();
    return this.polygon.getPaths();
  }
  getVisible() {
    this._assertInitialized();
    return this.polygon.getVisible();
  }
  _combineOptions() {
    return combineLatest([this._options, this._paths]).pipe(map(([options, paths]) => {
      const combinedOptions = {
        ...options,
        paths: paths || options.paths
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
        throw Error('Cannot interact with a Google Map Polygon before it has been ' + 'initialized. Please wait for the Polygon to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapPolygon,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapPolygon,
    isStandalone: true,
    selector: "map-polygon",
    inputs: {
      options: "options",
      paths: "paths"
    },
    outputs: {
      polygonClick: "polygonClick",
      polygonDblclick: "polygonDblclick",
      polygonDrag: "polygonDrag",
      polygonDragend: "polygonDragend",
      polygonDragstart: "polygonDragstart",
      polygonMousedown: "polygonMousedown",
      polygonMousemove: "polygonMousemove",
      polygonMouseout: "polygonMouseout",
      polygonMouseover: "polygonMouseover",
      polygonMouseup: "polygonMouseup",
      polygonRightclick: "polygonRightclick",
      polygonInitialized: "polygonInitialized"
    },
    exportAs: ["mapPolygon"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapPolygon,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-polygon',
      exportAs: 'mapPolygon'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    options: [{
      type: Input
    }],
    paths: [{
      type: Input
    }],
    polygonClick: [{
      type: Output
    }],
    polygonDblclick: [{
      type: Output
    }],
    polygonDrag: [{
      type: Output
    }],
    polygonDragend: [{
      type: Output
    }],
    polygonDragstart: [{
      type: Output
    }],
    polygonMousedown: [{
      type: Output
    }],
    polygonMousemove: [{
      type: Output
    }],
    polygonMouseout: [{
      type: Output
    }],
    polygonMouseover: [{
      type: Output
    }],
    polygonMouseup: [{
      type: Output
    }],
    polygonRightclick: [{
      type: Output
    }],
    polygonInitialized: [{
      type: Output
    }]
  }
});

class MapPolyline {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _options = new BehaviorSubject({});
  _path = new BehaviorSubject(undefined);
  _destroyed = new Subject();
  polyline;
  set options(options) {
    this._options.next(options || {});
  }
  set path(path) {
    this._path.next(path);
  }
  polylineClick = this._eventManager.getLazyEmitter('click');
  polylineDblclick = this._eventManager.getLazyEmitter('dblclick');
  polylineDrag = this._eventManager.getLazyEmitter('drag');
  polylineDragend = this._eventManager.getLazyEmitter('dragend');
  polylineDragstart = this._eventManager.getLazyEmitter('dragstart');
  polylineMousedown = this._eventManager.getLazyEmitter('mousedown');
  polylineMousemove = this._eventManager.getLazyEmitter('mousemove');
  polylineMouseout = this._eventManager.getLazyEmitter('mouseout');
  polylineMouseover = this._eventManager.getLazyEmitter('mouseover');
  polylineMouseup = this._eventManager.getLazyEmitter('mouseup');
  polylineRightclick = this._eventManager.getLazyEmitter('rightclick');
  polylineInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._map._isBrowser) {
      this._combineOptions().pipe(take(1)).subscribe(options => {
        if (google.maps.Polyline && this._map.googleMap) {
          this._initialize(this._map.googleMap, google.maps.Polyline, options);
        } else {
          this._ngZone.runOutsideAngular(() => {
            Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
              this._initialize(map, lib.Polyline, options);
            });
          });
        }
      });
    }
  }
  _initialize(map, polylineConstructor, options) {
    this._ngZone.runOutsideAngular(() => {
      this.polyline = new polylineConstructor(options);
      this._assertInitialized();
      this.polyline.setMap(map);
      this._eventManager.setTarget(this.polyline);
      this.polylineInitialized.emit(this.polyline);
      this._watchForOptionsChanges();
      this._watchForPathChanges();
    });
  }
  ngOnDestroy() {
    this._eventManager.destroy();
    this._destroyed.next();
    this._destroyed.complete();
    this.polyline?.setMap(null);
  }
  getDraggable() {
    this._assertInitialized();
    return this.polyline.getDraggable();
  }
  getEditable() {
    this._assertInitialized();
    return this.polyline.getEditable();
  }
  getPath() {
    this._assertInitialized();
    return this.polyline.getPath();
  }
  getVisible() {
    this._assertInitialized();
    return this.polyline.getVisible();
  }
  _combineOptions() {
    return combineLatest([this._options, this._path]).pipe(map(([options, path]) => {
      const combinedOptions = {
        ...options,
        path: path || options.path
      };
      return combinedOptions;
    }));
  }
  _watchForOptionsChanges() {
    this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
      this._assertInitialized();
      this.polyline.setOptions(options);
    });
  }
  _watchForPathChanges() {
    this._path.pipe(takeUntil(this._destroyed)).subscribe(path => {
      if (path) {
        this._assertInitialized();
        this.polyline.setPath(path);
      }
    });
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.polyline) {
        throw Error('Cannot interact with a Google Map Polyline before it has been ' + 'initialized. Please wait for the Polyline to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapPolyline,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapPolyline,
    isStandalone: true,
    selector: "map-polyline",
    inputs: {
      options: "options",
      path: "path"
    },
    outputs: {
      polylineClick: "polylineClick",
      polylineDblclick: "polylineDblclick",
      polylineDrag: "polylineDrag",
      polylineDragend: "polylineDragend",
      polylineDragstart: "polylineDragstart",
      polylineMousedown: "polylineMousedown",
      polylineMousemove: "polylineMousemove",
      polylineMouseout: "polylineMouseout",
      polylineMouseover: "polylineMouseover",
      polylineMouseup: "polylineMouseup",
      polylineRightclick: "polylineRightclick",
      polylineInitialized: "polylineInitialized"
    },
    exportAs: ["mapPolyline"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapPolyline,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-polyline',
      exportAs: 'mapPolyline'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    options: [{
      type: Input
    }],
    path: [{
      type: Input
    }],
    polylineClick: [{
      type: Output
    }],
    polylineDblclick: [{
      type: Output
    }],
    polylineDrag: [{
      type: Output
    }],
    polylineDragend: [{
      type: Output
    }],
    polylineDragstart: [{
      type: Output
    }],
    polylineMousedown: [{
      type: Output
    }],
    polylineMousemove: [{
      type: Output
    }],
    polylineMouseout: [{
      type: Output
    }],
    polylineMouseover: [{
      type: Output
    }],
    polylineMouseup: [{
      type: Output
    }],
    polylineRightclick: [{
      type: Output
    }],
    polylineInitialized: [{
      type: Output
    }]
  }
});

class MapRectangle {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  _options = new BehaviorSubject({});
  _bounds = new BehaviorSubject(undefined);
  _destroyed = new Subject();
  rectangle;
  set options(options) {
    this._options.next(options || {});
  }
  set bounds(bounds) {
    this._bounds.next(bounds);
  }
  boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
  rectangleClick = this._eventManager.getLazyEmitter('click');
  rectangleDblclick = this._eventManager.getLazyEmitter('dblclick');
  rectangleDrag = this._eventManager.getLazyEmitter('drag');
  rectangleDragend = this._eventManager.getLazyEmitter('dragend');
  rectangleDragstart = this._eventManager.getLazyEmitter('dragstart');
  rectangleMousedown = this._eventManager.getLazyEmitter('mousedown');
  rectangleMousemove = this._eventManager.getLazyEmitter('mousemove');
  rectangleMouseout = this._eventManager.getLazyEmitter('mouseout');
  rectangleMouseover = this._eventManager.getLazyEmitter('mouseover');
  rectangleMouseup = this._eventManager.getLazyEmitter('mouseup');
  rectangleRightclick = this._eventManager.getLazyEmitter('rightclick');
  rectangleInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._map._isBrowser) {
      this._combineOptions().pipe(take(1)).subscribe(options => {
        if (google.maps.Rectangle && this._map.googleMap) {
          this._initialize(this._map.googleMap, google.maps.Rectangle, options);
        } else {
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
  getBounds() {
    this._assertInitialized();
    return this.rectangle.getBounds();
  }
  getDraggable() {
    this._assertInitialized();
    return this.rectangle.getDraggable();
  }
  getEditable() {
    this._assertInitialized();
    return this.rectangle.getEditable();
  }
  getVisible() {
    this._assertInitialized();
    return this.rectangle.getVisible();
  }
  _combineOptions() {
    return combineLatest([this._options, this._bounds]).pipe(map(([options, bounds]) => {
      const combinedOptions = {
        ...options,
        bounds: bounds || options.bounds
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
        throw Error('Cannot interact with a Google Map Rectangle before it has been initialized. ' + 'Please wait for the Rectangle to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapRectangle,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapRectangle,
    isStandalone: true,
    selector: "map-rectangle",
    inputs: {
      options: "options",
      bounds: "bounds"
    },
    outputs: {
      boundsChanged: "boundsChanged",
      rectangleClick: "rectangleClick",
      rectangleDblclick: "rectangleDblclick",
      rectangleDrag: "rectangleDrag",
      rectangleDragend: "rectangleDragend",
      rectangleDragstart: "rectangleDragstart",
      rectangleMousedown: "rectangleMousedown",
      rectangleMousemove: "rectangleMousemove",
      rectangleMouseout: "rectangleMouseout",
      rectangleMouseover: "rectangleMouseover",
      rectangleMouseup: "rectangleMouseup",
      rectangleRightclick: "rectangleRightclick",
      rectangleInitialized: "rectangleInitialized"
    },
    exportAs: ["mapRectangle"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapRectangle,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-rectangle',
      exportAs: 'mapRectangle'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    options: [{
      type: Input
    }],
    bounds: [{
      type: Input
    }],
    boundsChanged: [{
      type: Output
    }],
    rectangleClick: [{
      type: Output
    }],
    rectangleDblclick: [{
      type: Output
    }],
    rectangleDrag: [{
      type: Output
    }],
    rectangleDragend: [{
      type: Output
    }],
    rectangleDragstart: [{
      type: Output
    }],
    rectangleMousedown: [{
      type: Output
    }],
    rectangleMousemove: [{
      type: Output
    }],
    rectangleMouseout: [{
      type: Output
    }],
    rectangleMouseover: [{
      type: Output
    }],
    rectangleMouseup: [{
      type: Output
    }],
    rectangleRightclick: [{
      type: Output
    }],
    rectangleInitialized: [{
      type: Output
    }]
  }
});

class MapTrafficLayer {
  _map = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _autoRefresh = new BehaviorSubject(true);
  _destroyed = new Subject();
  trafficLayer;
  set autoRefresh(autoRefresh) {
    this._autoRefresh.next(autoRefresh);
  }
  trafficLayerInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._map._isBrowser) {
      this._combineOptions().pipe(take(1)).subscribe(options => {
        if (google.maps.TrafficLayer && this._map.googleMap) {
          this._initialize(this._map.googleMap, google.maps.TrafficLayer, options);
        } else {
          this._ngZone.runOutsideAngular(() => {
            Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
              this._initialize(map, lib.TrafficLayer, options);
            });
          });
        }
      });
    }
  }
  _initialize(map, layerConstructor, options) {
    this._ngZone.runOutsideAngular(() => {
      this.trafficLayer = new layerConstructor(options);
      this._assertInitialized();
      this.trafficLayer.setMap(map);
      this.trafficLayerInitialized.emit(this.trafficLayer);
      this._watchForAutoRefreshChanges();
    });
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this.trafficLayer?.setMap(null);
  }
  _combineOptions() {
    return this._autoRefresh.pipe(map(autoRefresh => {
      const combinedOptions = {
        autoRefresh
      };
      return combinedOptions;
    }));
  }
  _watchForAutoRefreshChanges() {
    this._combineOptions().pipe(takeUntil(this._destroyed)).subscribe(options => {
      this._assertInitialized();
      this.trafficLayer.setOptions(options);
    });
  }
  _assertInitialized() {
    if (!this.trafficLayer) {
      throw Error('Cannot interact with a Google Map Traffic Layer before it has been initialized. ' + 'Please wait for the Traffic Layer to load before trying to interact with it.');
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapTrafficLayer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapTrafficLayer,
    isStandalone: true,
    selector: "map-traffic-layer",
    inputs: {
      autoRefresh: "autoRefresh"
    },
    outputs: {
      trafficLayerInitialized: "trafficLayerInitialized"
    },
    exportAs: ["mapTrafficLayer"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapTrafficLayer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-traffic-layer',
      exportAs: 'mapTrafficLayer'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    autoRefresh: [{
      type: Input
    }],
    trafficLayerInitialized: [{
      type: Output
    }]
  }
});

class MapTransitLayer {
  _map = inject(GoogleMap);
  _zone = inject(NgZone);
  transitLayer;
  transitLayerInitialized = new EventEmitter();
  ngOnInit() {
    if (this._map._isBrowser) {
      if (google.maps.TransitLayer && this._map.googleMap) {
        this._initialize(this._map.googleMap, google.maps.TransitLayer);
      } else {
        this._zone.runOutsideAngular(() => {
          Promise.all([this._map._resolveMap(), google.maps.importLibrary('maps')]).then(([map, lib]) => {
            this._initialize(map, lib.TransitLayer);
          });
        });
      }
    }
  }
  _initialize(map, layerConstructor) {
    this._zone.runOutsideAngular(() => {
      this.transitLayer = new layerConstructor();
      this.transitLayerInitialized.emit(this.transitLayer);
      this._assertLayerInitialized();
      this.transitLayer.setMap(map);
    });
  }
  ngOnDestroy() {
    this.transitLayer?.setMap(null);
  }
  _assertLayerInitialized() {
    if (!this.transitLayer) {
      throw Error('Cannot interact with a Google Map Transit Layer before it has been initialized. ' + 'Please wait for the Transit Layer to load before trying to interact with it.');
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapTransitLayer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapTransitLayer,
    isStandalone: true,
    selector: "map-transit-layer",
    outputs: {
      transitLayerInitialized: "transitLayerInitialized"
    },
    exportAs: ["mapTransitLayer"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapTransitLayer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-transit-layer',
      exportAs: 'mapTransitLayer'
    }]
  }],
  propDecorators: {
    transitLayerInitialized: [{
      type: Output
    }]
  }
});

class MapHeatmapLayer {
  _googleMap = inject(GoogleMap);
  _ngZone = inject(NgZone);
  set data(data) {
    this._data = data;
  }
  _data;
  set options(options) {
    this._options = options;
  }
  _options;
  heatmap;
  heatmapInitialized = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (this._googleMap._isBrowser) {
      if (!window.google?.maps?.visualization && !window.google?.maps.importLibrary && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        throw Error('Namespace `google.maps.visualization` not found, cannot construct heatmap. ' + 'Please install the Google Maps JavaScript API with the "visualization" library: ' + 'https://developers.google.com/maps/documentation/javascript/visualization');
      }
      if (google.maps.visualization?.HeatmapLayer && this._googleMap.googleMap) {
        this._initialize(this._googleMap.googleMap, google.maps.visualization.HeatmapLayer);
      } else {
        this._ngZone.runOutsideAngular(() => {
          Promise.all([this._googleMap._resolveMap(), google.maps.importLibrary('visualization')]).then(([map, lib]) => {
            this._initialize(map, lib.HeatmapLayer);
          });
        });
      }
    }
  }
  _initialize(map, heatmapConstructor) {
    this._ngZone.runOutsideAngular(() => {
      this.heatmap = new heatmapConstructor(this._combineOptions());
      this._assertInitialized();
      this.heatmap.setMap(map);
      this.heatmapInitialized.emit(this.heatmap);
    });
  }
  ngOnChanges(changes) {
    const {
      _data,
      heatmap
    } = this;
    if (heatmap) {
      if (changes['options']) {
        heatmap.setOptions(this._combineOptions());
      }
      if (changes['data'] && _data !== undefined) {
        heatmap.setData(this._normalizeData(_data));
      }
    }
  }
  ngOnDestroy() {
    this.heatmap?.setMap(null);
  }
  getData() {
    this._assertInitialized();
    return this.heatmap.getData();
  }
  _combineOptions() {
    const options = this._options || {};
    return {
      ...options,
      data: this._normalizeData(this._data || options.data || []),
      map: this._googleMap.googleMap
    };
  }
  _normalizeData(data) {
    const result = [];
    data.forEach(item => {
      result.push(isLatLngLiteral(item) ? new google.maps.LatLng(item.lat, item.lng) : item);
    });
    return result;
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.heatmap) {
        throw Error('Cannot interact with a Google Map HeatmapLayer before it has been ' + 'initialized. Please wait for the heatmap to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapHeatmapLayer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapHeatmapLayer,
    isStandalone: true,
    selector: "map-heatmap-layer",
    inputs: {
      data: "data",
      options: "options"
    },
    outputs: {
      heatmapInitialized: "heatmapInitialized"
    },
    exportAs: ["mapHeatmapLayer"],
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapHeatmapLayer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-heatmap-layer',
      exportAs: 'mapHeatmapLayer'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    data: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    heatmapInitialized: [{
      type: Output
    }]
  }
});
function isLatLngLiteral(value) {
  return value && typeof value.lat === 'number' && typeof value.lng === 'number';
}

const DEFAULT_MARKER_OPTIONS = {
  position: {
    lat: 37.221995,
    lng: -122.184092
  }
};
class MapAdvancedMarker {
  _googleMap = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _eventManager = new MapEventManager(inject(NgZone));
  set title(title) {
    this._title = title;
  }
  _title;
  set position(position) {
    this._position = position;
  }
  _position;
  set content(content) {
    this._content = content;
  }
  _content;
  set gmpDraggable(draggable) {
    this._draggable = draggable;
  }
  _draggable;
  set options(options) {
    this._options = options;
  }
  _options;
  set zIndex(zIndex) {
    this._zIndex = zIndex;
  }
  _zIndex;
  mapClick = this._eventManager.getLazyEmitter('click');
  mapDblclick = this._eventManager.getLazyEmitter('dblclick', 'native');
  mapMouseout = this._eventManager.getLazyEmitter('mouseout', 'native');
  mapMouseover = this._eventManager.getLazyEmitter('mouseover', 'native');
  mapMouseup = this._eventManager.getLazyEmitter('mouseup', 'native');
  mapRightclick = this._eventManager.getLazyEmitter('auxclick', 'native');
  mapDrag = this._eventManager.getLazyEmitter('drag');
  mapDragend = this._eventManager.getLazyEmitter('dragend');
  mapDragstart = this._eventManager.getLazyEmitter('dragstart');
  markerInitialized = new EventEmitter();
  advancedMarker;
  constructor() {}
  ngOnInit() {
    if (!this._googleMap._isBrowser) {
      return;
    }
    if (google.maps.marker?.AdvancedMarkerElement && this._googleMap.googleMap) {
      this._initialize(this._googleMap.googleMap, google.maps.marker.AdvancedMarkerElement);
    } else {
      this._ngZone.runOutsideAngular(() => {
        Promise.all([this._googleMap._resolveMap(), google.maps.importLibrary('marker')]).then(([map, lib]) => {
          this._initialize(map, lib.AdvancedMarkerElement);
        });
      });
    }
  }
  _initialize(map, advancedMarkerConstructor) {
    this._ngZone.runOutsideAngular(() => {
      this.advancedMarker = new advancedMarkerConstructor(this._combineOptions());
      this._assertInitialized();
      this.advancedMarker.map = map;
      this._eventManager.setTarget(this.advancedMarker);
      this.markerInitialized.next(this.advancedMarker);
    });
  }
  ngOnChanges(changes) {
    const {
      advancedMarker,
      _content,
      _position,
      _title,
      _draggable,
      _zIndex
    } = this;
    if (advancedMarker) {
      if (changes['title']) {
        advancedMarker.title = _title;
      }
      if (changes['gmpDraggable']) {
        advancedMarker.gmpDraggable = _draggable;
      }
      if (changes['content']) {
        advancedMarker.content = _content;
      }
      if (changes['position']) {
        advancedMarker.position = _position;
      }
      if (changes['zIndex']) {
        advancedMarker.zIndex = _zIndex;
      }
    }
  }
  ngOnDestroy() {
    this.markerInitialized.complete();
    this._eventManager.destroy();
    if (this.advancedMarker) {
      this.advancedMarker.map = null;
    }
  }
  getAnchor() {
    this._assertInitialized();
    return this.advancedMarker;
  }
  _resolveMarker() {
    return this.advancedMarker ? Promise.resolve(this.advancedMarker) : this.markerInitialized.pipe(take(1)).toPromise();
  }
  _combineOptions() {
    const options = this._options || DEFAULT_MARKER_OPTIONS;
    return {
      ...options,
      title: this._title || options.title,
      position: this._position || options.position,
      content: this._content || options.content,
      zIndex: this._zIndex ?? options.zIndex,
      gmpDraggable: this._draggable ?? options.gmpDraggable,
      map: this._googleMap.googleMap
    };
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this.advancedMarker) {
        throw Error('Cannot interact with a Google Map Marker before it has been ' + 'initialized. Please wait for the Marker to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapAdvancedMarker,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapAdvancedMarker,
    isStandalone: true,
    selector: "map-advanced-marker",
    inputs: {
      title: "title",
      position: "position",
      content: "content",
      gmpDraggable: "gmpDraggable",
      options: "options",
      zIndex: "zIndex"
    },
    outputs: {
      mapClick: "mapClick",
      mapDblclick: "mapDblclick",
      mapMouseout: "mapMouseout",
      mapMouseover: "mapMouseover",
      mapMouseup: "mapMouseup",
      mapRightclick: "mapRightclick",
      mapDrag: "mapDrag",
      mapDragend: "mapDragend",
      mapDragstart: "mapDragstart",
      markerInitialized: "markerInitialized"
    },
    providers: [{
      provide: MAP_MARKER,
      useExisting: MapAdvancedMarker
    }],
    exportAs: ["mapAdvancedMarker"],
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapAdvancedMarker,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'map-advanced-marker',
      exportAs: 'mapAdvancedMarker',
      providers: [{
        provide: MAP_MARKER,
        useExisting: MapAdvancedMarker
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    title: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    content: [{
      type: Input
    }],
    gmpDraggable: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    zIndex: [{
      type: Input
    }],
    mapClick: [{
      type: Output
    }],
    mapDblclick: [{
      type: Output
    }],
    mapMouseout: [{
      type: Output
    }],
    mapMouseover: [{
      type: Output
    }],
    mapMouseup: [{
      type: Output
    }],
    mapRightclick: [{
      type: Output
    }],
    mapDrag: [{
      type: Output
    }],
    mapDragend: [{
      type: Output
    }],
    mapDragstart: [{
      type: Output
    }],
    markerInitialized: [{
      type: Output
    }]
  }
});

class MapMarkerClusterer {
  _googleMap = inject(GoogleMap);
  _ngZone = inject(NgZone);
  _currentMarkers = new Set();
  _closestMapEventManager = new MapEventManager(this._ngZone);
  _markersSubscription = Subscription.EMPTY;
  _canInitialize = this._googleMap._isBrowser;
  renderer;
  algorithm;
  clusteringbegin = this._closestMapEventManager.getLazyEmitter('clusteringbegin');
  clusteringend = this._closestMapEventManager.getLazyEmitter('clusteringend');
  clusterClick = new EventEmitter();
  markerClustererInitialized = new EventEmitter();
  _markers;
  markerClusterer;
  async ngOnInit() {
    if (this._canInitialize) {
      await this._createCluster();
      this._closestMapEventManager.setTarget(this._googleMap.googleMap);
    }
  }
  async ngOnChanges(changes) {
    const change = changes['renderer'] || changes['algorithm'];
    if (this.markerClusterer && change && !change.isFirstChange()) {
      await this._createCluster();
    }
  }
  ngOnDestroy() {
    this._markersSubscription.unsubscribe();
    this._closestMapEventManager.destroy();
    this._destroyCluster();
  }
  async _createCluster() {
    if (!markerClusterer?.MarkerClusterer && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('MarkerClusterer class not found, cannot construct a marker cluster. ' + 'Please install the MarkerClusterer library: ' + 'https://github.com/googlemaps/js-markerclusterer');
    }
    const map = await this._googleMap._resolveMap();
    this._destroyCluster();
    this._ngZone.runOutsideAngular(() => {
      this.markerClusterer = new markerClusterer.MarkerClusterer({
        map,
        renderer: this.renderer,
        algorithm: this.algorithm,
        onClusterClick: (event, cluster, map) => {
          if (this.clusterClick.observers.length) {
            this._ngZone.run(() => this.clusterClick.emit(cluster));
          } else {
            markerClusterer.defaultOnClusterClickHandler(event, cluster, map);
          }
        }
      });
      this.markerClustererInitialized.emit(this.markerClusterer);
    });
    await this._watchForMarkerChanges();
  }
  async _watchForMarkerChanges() {
    this._assertInitialized();
    const initialMarkers = [];
    const markers = await this._getInternalMarkers(this._markers.toArray());
    for (const marker of markers) {
      this._currentMarkers.add(marker);
      initialMarkers.push(marker);
    }
    this.markerClusterer.addMarkers(initialMarkers);
    this._markersSubscription.unsubscribe();
    this._markersSubscription = this._markers.changes.subscribe(async markerComponents => {
      this._assertInitialized();
      const newMarkers = new Set(await this._getInternalMarkers(markerComponents));
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
      this.markerClusterer.render();
      for (const marker of markersToRemove) {
        this._currentMarkers.delete(marker);
      }
    });
  }
  _destroyCluster() {
    this.markerClusterer?.onRemove();
    this.markerClusterer = undefined;
  }
  _getInternalMarkers(markers) {
    return Promise.all(markers.map(marker => marker._resolveMarker()));
  }
  _assertInitialized() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this._googleMap.googleMap) {
        throw Error('Cannot access Google Map information before the API has been initialized. ' + 'Please wait for the API to load before trying to interact with it.');
      }
      if (!this.markerClusterer) {
        throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' + 'Please wait for the MarkerClusterer to load before trying to interact with it.');
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapMarkerClusterer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MapMarkerClusterer,
    isStandalone: true,
    selector: "map-marker-clusterer",
    inputs: {
      renderer: "renderer",
      algorithm: "algorithm"
    },
    outputs: {
      clusteringbegin: "clusteringbegin",
      clusteringend: "clusteringend",
      clusterClick: "clusterClick",
      markerClustererInitialized: "markerClustererInitialized"
    },
    queries: [{
      propertyName: "_markers",
      predicate: MAP_MARKER,
      descendants: true
    }],
    exportAs: ["mapMarkerClusterer"],
    usesOnChanges: true,
    ngImport: i0,
    template: '<ng-content/>',
    isInline: true,
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapMarkerClusterer,
  decorators: [{
    type: Component,
    args: [{
      selector: 'map-marker-clusterer',
      exportAs: 'mapMarkerClusterer',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<ng-content/>',
      encapsulation: ViewEncapsulation.None
    }]
  }],
  propDecorators: {
    renderer: [{
      type: Input
    }],
    algorithm: [{
      type: Input
    }],
    clusteringbegin: [{
      type: Output
    }],
    clusteringend: [{
      type: Output
    }],
    clusterClick: [{
      type: Output
    }],
    markerClustererInitialized: [{
      type: Output
    }],
    _markers: [{
      type: ContentChildren,
      args: [MAP_MARKER, {
        descendants: true
      }]
    }]
  }
});

const COMPONENTS = [GoogleMap, MapBaseLayer, MapBicyclingLayer, MapCircle, MapDirectionsRenderer, MapGroundOverlay, MapHeatmapLayer, MapInfoWindow, MapKmlLayer, MapMarker, MapAdvancedMarker, DeprecatedMapMarkerClusterer, MapPolygon, MapPolyline, MapRectangle, MapTrafficLayer, MapTransitLayer, MapMarkerClusterer];
class GoogleMapsModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: GoogleMapsModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: GoogleMapsModule,
    imports: [GoogleMap, MapBaseLayer, MapBicyclingLayer, MapCircle, MapDirectionsRenderer, MapGroundOverlay, MapHeatmapLayer, MapInfoWindow, MapKmlLayer, MapMarker, MapAdvancedMarker, DeprecatedMapMarkerClusterer, MapPolygon, MapPolyline, MapRectangle, MapTrafficLayer, MapTransitLayer, MapMarkerClusterer],
    exports: [GoogleMap, MapBaseLayer, MapBicyclingLayer, MapCircle, MapDirectionsRenderer, MapGroundOverlay, MapHeatmapLayer, MapInfoWindow, MapKmlLayer, MapMarker, MapAdvancedMarker, DeprecatedMapMarkerClusterer, MapPolygon, MapPolyline, MapRectangle, MapTrafficLayer, MapTransitLayer, MapMarkerClusterer]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: GoogleMapsModule
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: GoogleMapsModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: COMPONENTS,
      exports: COMPONENTS
    }]
  }]
});

class MapDirectionsService {
  _ngZone = inject(NgZone);
  _directionsService;
  constructor() {}
  route(request) {
    return new Observable(observer => {
      this._getService().then(service => {
        service.route(request, (result, status) => {
          this._ngZone.run(() => {
            observer.next({
              result: result || undefined,
              status
            });
            observer.complete();
          });
        });
      });
    });
  }
  _getService() {
    if (!this._directionsService) {
      if (google.maps.DirectionsService) {
        this._directionsService = new google.maps.DirectionsService();
      } else {
        return google.maps.importLibrary('routes').then(lib => {
          this._directionsService = new lib.DirectionsService();
          return this._directionsService;
        });
      }
    }
    return Promise.resolve(this._directionsService);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapDirectionsService,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapDirectionsService,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapDirectionsService,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }],
  ctorParameters: () => []
});

class MapGeocoder {
  _ngZone = inject(NgZone);
  _geocoder;
  constructor() {}
  geocode(request) {
    return new Observable(observer => {
      this._getGeocoder().then(geocoder => {
        geocoder.geocode(request, (results, status) => {
          this._ngZone.run(() => {
            observer.next({
              results: results || [],
              status
            });
            observer.complete();
          });
        });
      });
    });
  }
  _getGeocoder() {
    if (!this._geocoder) {
      if (google.maps.Geocoder) {
        this._geocoder = new google.maps.Geocoder();
      } else {
        return google.maps.importLibrary('geocoding').then(lib => {
          this._geocoder = new lib.Geocoder();
          return this._geocoder;
        });
      }
    }
    return Promise.resolve(this._geocoder);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapGeocoder,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MapGeocoder,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MapGeocoder,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }],
  ctorParameters: () => []
});

export { DeprecatedMapMarkerClusterer, GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapBaseLayer, MapBicyclingLayer, MapCircle, MapDirectionsRenderer, MapDirectionsService, MapEventManager, MapGeocoder, MapGroundOverlay, MapHeatmapLayer, MapInfoWindow, MapKmlLayer, MapMarker, MapMarkerClusterer, MapPolygon, MapPolyline, MapRectangle, MapTrafficLayer, MapTransitLayer };
//# sourceMappingURL=google-maps.mjs.map
