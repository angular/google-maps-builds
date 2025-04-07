/// <reference types="google.maps" />
import * as i0 from '@angular/core';
import { OnChanges, OnInit, OnDestroy, EventEmitter, SimpleChanges, NgZone, AfterContentInit, QueryList } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
declare class GoogleMap implements OnChanges, OnInit, OnDestroy {
    private readonly _elementRef;
    private _ngZone;
    private _eventManager;
    private _mapEl;
    private _existingAuthFailureCallback;
    /**
     * The underlying google.maps.Map object
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#Map
     */
    googleMap?: google.maps.Map;
    /** Whether we're currently rendering inside a browser. */
    _isBrowser: boolean;
    /** Height of the map. Set this to `null` if you'd like to control the height through CSS. */
    height: string | number | null;
    /** Width of the map. Set this to `null` if you'd like to control the width through CSS. */
    width: string | number | null;
    /**
     * The Map ID of the map. This parameter cannot be set or changed after a map is instantiated.
     * See: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapId
     */
    mapId: string | undefined;
    /**
     * Type of map that should be rendered. E.g. hybrid map, terrain map etc.
     * See: https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
     */
    mapTypeId: google.maps.MapTypeId | undefined;
    set center(center: google.maps.LatLngLiteral | google.maps.LatLng);
    private _center;
    set zoom(zoom: number);
    private _zoom;
    set options(options: google.maps.MapOptions);
    private _options;
    /** Event emitted when the map is initialized. */
    readonly mapInitialized: EventEmitter<google.maps.Map>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/events#auth-errors
     */
    readonly authFailure: EventEmitter<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
     */
    readonly boundsChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
     */
    readonly centerChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
     */
    readonly mapClick: Observable<google.maps.MapMouseEvent | google.maps.IconMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
     */
    readonly mapDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
     */
    readonly mapDrag: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
     */
    readonly mapDragend: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
     */
    readonly mapDragstart: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
     */
    readonly headingChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
     */
    readonly idle: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
     */
    readonly maptypeidChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
     */
    readonly mapMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
     */
    readonly mapMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
     */
    readonly mapMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
     */
    readonly projectionChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
     */
    readonly mapRightclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
     */
    readonly tilesloaded: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
     */
    readonly tiltChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
     */
    readonly zoomChanged: Observable<void>;
    constructor(...args: unknown[]);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     */
    fitBounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
     */
    panBy(x: number, y: number): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     */
    panTo(latLng: google.maps.LatLng | google.maps.LatLngLiteral): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
     */
    panToBounds(latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     */
    getCenter(): google.maps.LatLng | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     */
    getClickableIcons(): boolean | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     */
    getHeading(): number | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     */
    getMapTypeId(): google.maps.MapTypeId | string | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     */
    getProjection(): google.maps.Projection | null;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     */
    getStreetView(): google.maps.StreetViewPanorama;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     */
    getTilt(): number | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     */
    getZoom(): number | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
     */
    get controls(): google.maps.MVCArray<Node>[];
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
     */
    get data(): google.maps.Data;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
     */
    get mapTypes(): google.maps.MapTypeRegistry;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
     */
    get overlayMapTypes(): google.maps.MVCArray<google.maps.MapType | null>;
    /** Returns a promise that resolves when the map has been initialized. */
    _resolveMap(): Promise<google.maps.Map>;
    private _setSize;
    /** Combines the center and zoom and the other map options into a single object */
    private _combineOptions;
    /** Asserts that the map has been initialized. */
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoogleMap, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GoogleMap, "google-map", ["googleMap"], { "height": { "alias": "height"; "required": false; }; "width": { "alias": "width"; "required": false; }; "mapId": { "alias": "mapId"; "required": false; }; "mapTypeId": { "alias": "mapTypeId"; "required": false; }; "center": { "alias": "center"; "required": false; }; "zoom": { "alias": "zoom"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, { "mapInitialized": "mapInitialized"; "authFailure": "authFailure"; "boundsChanged": "boundsChanged"; "centerChanged": "centerChanged"; "mapClick": "mapClick"; "mapDblclick": "mapDblclick"; "mapDrag": "mapDrag"; "mapDragend": "mapDragend"; "mapDragstart": "mapDragstart"; "headingChanged": "headingChanged"; "idle": "idle"; "maptypeidChanged": "maptypeidChanged"; "mapMousemove": "mapMousemove"; "mapMouseout": "mapMouseout"; "mapMouseover": "mapMouseover"; "projectionChanged": "projectionChanged"; "mapRightclick": "mapRightclick"; "tilesloaded": "tilesloaded"; "tiltChanged": "tiltChanged"; "zoomChanged": "zoomChanged"; }, never, ["*"], true, never>;
}

declare class MapBaseLayer implements OnInit, OnDestroy {
    protected readonly _map: GoogleMap;
    protected readonly _ngZone: NgZone;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _assertInitialized;
    protected _initializeObject(): void;
    protected _setMap(): void;
    protected _unsetMap(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapBaseLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapBaseLayer, "map-base-layer", ["mapBaseLayer"], {}, {}, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Bicycling Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
 */
declare class MapBicyclingLayer implements OnInit, OnDestroy {
    private _map;
    private _zone;
    /**
     * The underlying google.maps.BicyclingLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
     */
    bicyclingLayer?: google.maps.BicyclingLayer;
    /** Event emitted when the bicycling layer is initialized. */
    readonly bicyclingLayerInitialized: EventEmitter<google.maps.BicyclingLayer>;
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    private _assertLayerInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapBicyclingLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapBicyclingLayer, "map-bicycling-layer", ["mapBicyclingLayer"], {}, { "bicyclingLayerInitialized": "bicyclingLayerInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
 */
declare class MapCircle implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _center;
    private readonly _radius;
    private readonly _destroyed;
    /**
     * Underlying google.maps.Circle object.
     *
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     */
    circle?: google.maps.Circle;
    set options(options: google.maps.CircleOptions);
    set center(center: google.maps.LatLng | google.maps.LatLngLiteral);
    set radius(radius: number);
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.center_changed
     */
    readonly centerChanged: Observable<void>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.click
     */
    readonly circleClick: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dblclick
     */
    readonly circleDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.drag
     */
    readonly circleDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragend
     */
    readonly circleDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragstart
     */
    readonly circleDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousedown
     */
    readonly circleMousedown: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousemove
     */
    readonly circleMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseout
     */
    readonly circleMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseover
     */
    readonly circleMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseup
     */
    readonly circleMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.radius_changed
     */
    readonly radiusChanged: Observable<void>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.rightclick
     */
    readonly circleRightclick: Observable<google.maps.MapMouseEvent>;
    /** Event emitted when the circle is initialized. */
    readonly circleInitialized: EventEmitter<google.maps.Circle>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
     */
    getCenter(): google.maps.LatLng | null;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
     */
    getDraggable(): boolean;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
     */
    getEditable(): boolean;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getRadius
     */
    getRadius(): number;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForCenterChanges;
    private _watchForRadiusChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapCircle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapCircle, "map-circle", ["mapCircle"], { "options": { "alias": "options"; "required": false; }; "center": { "alias": "center"; "required": false; }; "radius": { "alias": "radius"; "required": false; }; }, { "centerChanged": "centerChanged"; "circleClick": "circleClick"; "circleDblclick": "circleDblclick"; "circleDrag": "circleDrag"; "circleDragend": "circleDragend"; "circleDragstart": "circleDragstart"; "circleMousedown": "circleMousedown"; "circleMousemove": "circleMousemove"; "circleMouseout": "circleMouseout"; "circleMouseover": "circleMouseover"; "circleMouseup": "circleMouseup"; "radiusChanged": "radiusChanged"; "circleRightclick": "circleRightclick"; "circleInitialized": "circleInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Directions Renderer via the Google Maps
 * JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer
 */
declare class MapDirectionsRenderer implements OnInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private _ngZone;
    private _eventManager;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions.directions
     */
    set directions(directions: google.maps.DirectionsResult);
    private _directions;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions
     */
    set options(options: google.maps.DirectionsRendererOptions);
    private _options;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.directions_changed
     */
    readonly directionsChanged: Observable<void>;
    /** Event emitted when the directions renderer is initialized. */
    readonly directionsRendererInitialized: EventEmitter<google.maps.DirectionsRenderer>;
    /** The underlying google.maps.DirectionsRenderer object. */
    directionsRenderer?: google.maps.DirectionsRenderer;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getDirections
     */
    getDirections(): google.maps.DirectionsResult | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getPanel
     */
    getPanel(): Node | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getRouteIndex
     */
    getRouteIndex(): number;
    private _combineOptions;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapDirectionsRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapDirectionsRenderer, "map-directions-renderer", ["mapDirectionsRenderer"], { "directions": { "alias": "directions"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, { "directionsChanged": "directionsChanged"; "directionsRendererInitialized": "directionsRendererInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
declare class MapGroundOverlay implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _opacity;
    private readonly _url;
    private readonly _bounds;
    private readonly _destroyed;
    private _hasWatchers;
    /**
     * The underlying google.maps.GroundOverlay object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     */
    groundOverlay?: google.maps.GroundOverlay;
    /** URL of the image that will be shown in the overlay. */
    set url(url: string);
    /** Bounds for the overlay. */
    get bounds(): google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    set bounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral);
    /** Whether the overlay is clickable */
    clickable: boolean;
    /** Opacity of the overlay. */
    set opacity(opacity: number);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
     */
    readonly mapClick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.dblclick
     */
    readonly mapDblclick: Observable<google.maps.MapMouseEvent>;
    /** Event emitted when the ground overlay is initialized. */
    readonly groundOverlayInitialized: EventEmitter<google.maps.GroundOverlay>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getOpacity
     */
    getOpacity(): number;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getUrl
     */
    getUrl(): string;
    private _watchForOpacityChanges;
    private _watchForUrlChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapGroundOverlay, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapGroundOverlay, "map-ground-overlay", ["mapGroundOverlay"], { "url": { "alias": "url"; "required": false; }; "bounds": { "alias": "bounds"; "required": false; }; "clickable": { "alias": "clickable"; "required": false; }; "opacity": { "alias": "opacity"; "required": false; }; }, { "mapClick": "mapClick"; "mapDblclick": "mapDblclick"; "groundOverlayInitialized": "groundOverlayInitialized"; }, never, never, true, never>;
}

/** Possible data that can be shown on a heatmap layer. */
type HeatmapData = google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation | google.maps.LatLngLiteral> | (google.maps.LatLng | google.maps.visualization.WeightedLocation | google.maps.LatLngLiteral)[];
/**
 * Angular directive that renders a Google Maps heatmap via the Google Maps JavaScript API.
 *
 * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
 */
declare class MapHeatmapLayer implements OnInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private _ngZone;
    /**
     * Data shown on the heatmap.
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    set data(data: HeatmapData);
    private _data;
    /**
     * Options used to configure the heatmap. See:
     * developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions
     */
    set options(options: Partial<google.maps.visualization.HeatmapLayerOptions>);
    private _options;
    /**
     * The underlying google.maps.visualization.HeatmapLayer object.
     *
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    heatmap?: google.maps.visualization.HeatmapLayer;
    /** Event emitted when the heatmap is initialized. */
    readonly heatmapInitialized: EventEmitter<google.maps.visualization.HeatmapLayer>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Gets the data that is currently shown on the heatmap.
     * See: developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayer
     */
    getData(): HeatmapData;
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    private _combineOptions;
    /**
     * Most Google Maps APIs support both `LatLng` objects and `LatLngLiteral`. The latter is more
     * convenient to write out, because the Google Maps API doesn't have to have been loaded in order
     * to construct them. The `HeatmapLayer` appears to be an exception that only allows a `LatLng`
     * object, or it throws a runtime error. Since it's more convenient and we expect that Angular
     * users will load the API asynchronously, we allow them to pass in a `LatLngLiteral` and we
     * convert it to a `LatLng` object before passing it off to Google Maps.
     */
    private _normalizeData;
    /** Asserts that the heatmap object has been initialized. */
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapHeatmapLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapHeatmapLayer, "map-heatmap-layer", ["mapHeatmapLayer"], { "data": { "alias": "data"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, { "heatmapInitialized": "heatmapInitialized"; }, never, never, true, never>;
}

interface MapAnchorPoint {
    getAnchor(): google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement;
}

/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
declare class MapInfoWindow implements OnInit, OnDestroy {
    private readonly _googleMap;
    private _elementRef;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _position;
    private readonly _destroy;
    /**
     * Underlying google.maps.InfoWindow
     *
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     */
    infoWindow?: google.maps.InfoWindow;
    set options(options: google.maps.InfoWindowOptions);
    set position(position: google.maps.LatLngLiteral | google.maps.LatLng);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
     */
    readonly closeclick: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.content_changed
     */
    readonly contentChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
     */
    readonly domready: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.position_changed
     */
    readonly positionChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.zindex_changed
     */
    readonly zindexChanged: Observable<void>;
    /** Event emitted when the info window is initialized. */
    readonly infoWindowInitialized: EventEmitter<google.maps.InfoWindow>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
     */
    close(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     */
    getContent(): string | Node | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     */
    getPosition(): google.maps.LatLng | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     */
    getZIndex(): number;
    /**
     * Opens the MapInfoWindow using the provided AdvancedMarkerElement.
     * @deprecated Use the `open` method instead.
     * @breaking-change 20.0.0
     */
    openAdvancedMarkerElement(advancedMarkerElement: google.maps.marker.AdvancedMarkerElement, content?: string | Element | Text): void;
    /**
     * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     */
    open(anchor?: MapAnchorPoint, shouldFocus?: boolean, content?: string | Element | Text): void;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPositionChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapInfoWindow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapInfoWindow, "map-info-window", ["mapInfoWindow"], { "options": { "alias": "options"; "required": false; }; "position": { "alias": "position"; "required": false; }; }, { "closeclick": "closeclick"; "contentChanged": "contentChanged"; "domready": "domready"; "positionChanged": "positionChanged"; "zindexChanged": "zindexChanged"; "infoWindowInitialized": "infoWindowInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps KML Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer
 */
declare class MapKmlLayer implements OnInit, OnDestroy {
    private readonly _map;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _url;
    private readonly _destroyed;
    /**
     * The underlying google.maps.KmlLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer
     */
    kmlLayer?: google.maps.KmlLayer;
    set options(options: google.maps.KmlLayerOptions);
    set url(url: string);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.click
     */
    readonly kmlClick: Observable<google.maps.KmlMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/kml
     * #KmlLayer.defaultviewport_changed
     */
    readonly defaultviewportChanged: Observable<void>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.status_changed
     */
    readonly statusChanged: Observable<void>;
    /** Event emitted when the KML layer is initialized. */
    readonly kmlLayerInitialized: EventEmitter<google.maps.KmlLayer>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getDefaultViewport
     */
    getDefaultViewport(): google.maps.LatLngBounds | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getMetadata
     */
    getMetadata(): google.maps.KmlLayerMetadata | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getStatus
     */
    getStatus(): google.maps.KmlLayerStatus;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getUrl
     */
    getUrl(): string;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getZIndex
     */
    getZIndex(): number;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForUrlChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapKmlLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapKmlLayer, "map-kml-layer", ["mapKmlLayer"], { "options": { "alias": "options"; "required": false; }; "url": { "alias": "url"; "required": false; }; }, { "kmlClick": "kmlClick"; "defaultviewportChanged": "defaultviewportChanged"; "statusChanged": "statusChanged"; "kmlLayerInitialized": "kmlLayerInitialized"; }, never, never, true, never>;
}

/** Marker types from the Google Maps API. */
type Marker = google.maps.Marker | google.maps.marker.AdvancedMarkerElement;
/** Interface that should be implemented by directives that wrap marker APIs. */
interface MarkerDirective {
    _resolveMarker(): Promise<Marker>;
}

/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/marker
 */
declare class MapMarker implements OnInit, OnChanges, OnDestroy, MapAnchorPoint, MarkerDirective {
    private readonly _googleMap;
    private _ngZone;
    private _eventManager;
    /**
     * Title of the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.title
     */
    set title(title: string);
    private _title;
    /**
     * Position of the marker. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.position
     */
    set position(position: google.maps.LatLngLiteral | google.maps.LatLng);
    private _position;
    /**
     * Label for the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.label
     */
    set label(label: string | google.maps.MarkerLabel);
    private _label;
    /**
     * Whether the marker is clickable. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.clickable
     */
    set clickable(clickable: boolean);
    private _clickable;
    /**
     * Options used to configure the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
     */
    set options(options: google.maps.MarkerOptions);
    private _options;
    /**
     * Icon to be used for the marker.
     * See: https://developers.google.com/maps/documentation/javascript/reference/marker#Icon
     */
    set icon(icon: string | google.maps.Icon | google.maps.Symbol);
    private _icon;
    /**
     * Whether the marker is visible.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.visible
     */
    set visible(value: boolean);
    private _visible;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
     */
    readonly animationChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
     */
    readonly mapClick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
     */
    readonly clickableChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
     */
    readonly cursorChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
     */
    readonly mapDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
     */
    readonly mapDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
     */
    readonly mapDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
     */
    readonly draggableChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
     */
    readonly mapDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
     */
    readonly flatChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
     */
    readonly iconChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
     */
    readonly mapMousedown: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
     */
    readonly mapMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
     */
    readonly mapMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
     */
    readonly mapMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
     */
    readonly positionChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
     */
    readonly mapRightclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
     */
    readonly shapeChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
     */
    readonly titleChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
     */
    readonly visibleChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
     */
    readonly zindexChanged: Observable<void>;
    /** Event emitted when the marker is initialized. */
    readonly markerInitialized: EventEmitter<google.maps.Marker>;
    /**
     * The underlying google.maps.Marker object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/marker#Marker
     */
    marker?: google.maps.Marker;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
     */
    getAnimation(): google.maps.Animation | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
     */
    getClickable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
     */
    getCursor(): string | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
     */
    getIcon(): string | google.maps.Icon | google.maps.Symbol | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
     */
    getLabel(): google.maps.MarkerLabel | string | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
     */
    getOpacity(): number | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
     */
    getPosition(): google.maps.LatLng | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
     */
    getShape(): google.maps.MarkerShape | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
     */
    getTitle(): string | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
     */
    getVisible(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
     */
    getZIndex(): number | null;
    /** Gets the anchor point that can be used to attach other Google Maps objects. */
    getAnchor(): google.maps.MVCObject;
    /** Returns a promise that resolves when the marker has been initialized. */
    _resolveMarker(): Promise<google.maps.Marker>;
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    private _combineOptions;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapMarker, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapMarker, "map-marker", ["mapMarker"], { "title": { "alias": "title"; "required": false; }; "position": { "alias": "position"; "required": false; }; "label": { "alias": "label"; "required": false; }; "clickable": { "alias": "clickable"; "required": false; }; "options": { "alias": "options"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "visible": { "alias": "visible"; "required": false; }; }, { "animationChanged": "animationChanged"; "mapClick": "mapClick"; "clickableChanged": "clickableChanged"; "cursorChanged": "cursorChanged"; "mapDblclick": "mapDblclick"; "mapDrag": "mapDrag"; "mapDragend": "mapDragend"; "draggableChanged": "draggableChanged"; "mapDragstart": "mapDragstart"; "flatChanged": "flatChanged"; "iconChanged": "iconChanged"; "mapMousedown": "mapMousedown"; "mapMouseout": "mapMouseout"; "mapMouseover": "mapMouseover"; "mapMouseup": "mapMouseup"; "positionChanged": "positionChanged"; "mapRightclick": "mapRightclick"; "shapeChanged": "shapeChanged"; "titleChanged": "titleChanged"; "visibleChanged": "visibleChanged"; "zindexChanged": "zindexChanged"; "markerInitialized": "markerInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/marker
 */
declare class MapAdvancedMarker implements OnInit, OnChanges, OnDestroy, MapAnchorPoint, MarkerDirective {
    private readonly _googleMap;
    private _ngZone;
    private _eventManager;
    /**
     * Rollover text. If provided, an accessibility text (e.g. for use with screen readers) will be added to the AdvancedMarkerElement with the provided value.
     * See: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.title
     */
    set title(title: string);
    private _title;
    /**
     * Sets the AdvancedMarkerElement's position. An AdvancedMarkerElement may be constructed without a position, but will not be displayed until its position is provided - for example, by a user's actions or choices. An AdvancedMarkerElement's position can be provided by setting AdvancedMarkerElement.position if not provided at the construction.
     * Note: AdvancedMarkerElement with altitude is only supported on vector maps.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.position
     */
    set position(position: google.maps.LatLngLiteral | google.maps.LatLng | google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral);
    private _position;
    /**
     * The DOM Element backing the visual of an AdvancedMarkerElement.
     * Note: AdvancedMarkerElement does not clone the passed-in DOM element. Once the DOM element is passed to an AdvancedMarkerElement, passing the same DOM element to another AdvancedMarkerElement will move the DOM element and cause the previous AdvancedMarkerElement to look empty.
     * See: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.content
     */
    set content(content: Node | google.maps.marker.PinElement | null);
    private _content;
    /**
     * If true, the AdvancedMarkerElement can be dragged.
     * Note: AdvancedMarkerElement with altitude is not draggable.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpDraggable
     */
    set gmpDraggable(draggable: boolean);
    private _draggable;
    /**
     * Options for constructing an AdvancedMarkerElement.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions
     */
    set options(options: google.maps.marker.AdvancedMarkerElementOptions);
    private _options;
    /**
     * AdvancedMarkerElements on the map are prioritized by zIndex, with higher values indicating higher display.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.zIndex
     */
    set zIndex(zIndex: number);
    private _zIndex;
    /**
     * This event is fired when the AdvancedMarkerElement element is clicked.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.click
     */
    readonly mapClick: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is fired when the AdvancedMarkerElement is double-clicked.
     */
    readonly mapDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is fired when the mouse moves out of the AdvancedMarkerElement.
     */
    readonly mapMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is fired when the mouse moves over the AdvancedMarkerElement.
     */
    readonly mapMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is fired when the mouse button is released over the AdvancedMarkerElement.
     */
    readonly mapMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is fired when the AdvancedMarkerElement is right-clicked.
     */
    readonly mapRightclick: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is repeatedly fired while the user drags the AdvancedMarkerElement.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.drag
     */
    readonly mapDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is fired when the user stops dragging the AdvancedMarkerElement.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.dragend
     */
    readonly mapDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * This event is fired when the user starts dragging the AdvancedMarkerElement.
     * https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.dragstart
     */
    readonly mapDragstart: Observable<google.maps.MapMouseEvent>;
    /** Event emitted when the marker is initialized. */
    readonly markerInitialized: EventEmitter<google.maps.marker.AdvancedMarkerElement>;
    /**
     * The underlying google.maps.marker.AdvancedMarkerElement object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement
     */
    advancedMarker: google.maps.marker.AdvancedMarkerElement;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    getAnchor(): google.maps.marker.AdvancedMarkerElement;
    /** Returns a promise that resolves when the marker has been initialized. */
    _resolveMarker(): Promise<google.maps.marker.AdvancedMarkerElement>;
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    private _combineOptions;
    /** Asserts that the map has been initialized. */
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapAdvancedMarker, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapAdvancedMarker, "map-advanced-marker", ["mapAdvancedMarker"], { "title": { "alias": "title"; "required": false; }; "position": { "alias": "position"; "required": false; }; "content": { "alias": "content"; "required": false; }; "gmpDraggable": { "alias": "gmpDraggable"; "required": false; }; "options": { "alias": "options"; "required": false; }; "zIndex": { "alias": "zIndex"; "required": false; }; }, { "mapClick": "mapClick"; "mapDblclick": "mapDblclick"; "mapMouseout": "mapMouseout"; "mapMouseover": "mapMouseover"; "mapMouseup": "mapMouseup"; "mapRightclick": "mapRightclick"; "mapDrag": "mapDrag"; "mapDragend": "mapDragend"; "mapDragstart": "mapDragstart"; "markerInitialized": "markerInitialized"; }, never, never, true, never>;
}

/**
 * Class for clustering markers on a Google Map.
 *
 * See
 * googlemaps.github.io/v3-utility-library/classes/_google_markerclustererplus.markerclusterer.html
 */
declare class MarkerClusterer$1 {
    constructor(map: google.maps.Map, markers?: google.maps.Marker[], options?: MarkerClustererOptions$1);
    ariaLabelFn: AriaLabelFn;
    static BATCH_SIZE: number;
    static BATCH_SIZE_IE: number;
    static IMAGE_EXTENSION: string;
    static IMAGE_PATH: string;
    static IMAGE_SIZES: number[];
    addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
    addMarker(marker: MarkerClusterer$1, nodraw: boolean): void;
    addMarkers(markers: google.maps.Marker[], nodraw?: boolean): void;
    bindTo(key: string, target: google.maps.MVCObject, targetKey: string, noNotify: boolean): void;
    changed(key: string): void;
    clearMarkers(): void;
    fitMapToMarkers(padding: number | google.maps.Padding): void;
    get(key: string): any;
    getAverageCenter(): boolean;
    getBatchSizeIE(): number;
    getCalculator(): Calculator;
    getClusterClass(): string;
    getClusters(): Cluster$1[];
    getEnableRetinaIcons(): boolean;
    getGridSize(): number;
    getIgnoreHidden(): boolean;
    getImageExtension(): string;
    getImagePath(): string;
    getImageSizes(): number[];
    getMap(): google.maps.Map | google.maps.StreetViewPanorama;
    getMarkers(): google.maps.Marker[];
    getMaxZoom(): number;
    getMinimumClusterSize(): number;
    getPanes(): google.maps.MapPanes;
    getProjection(): google.maps.MapCanvasProjection;
    getStyles(): ClusterIconStyle[];
    getTitle(): string;
    getTotalClusters(): number;
    getTotalMarkers(): number;
    getZIndex(): number;
    getZoomOnClick(): boolean;
    notify(key: string): void;
    removeMarker(marker: google.maps.Marker, nodraw: boolean): boolean;
    removeMarkers(markers: google.maps.Marker[], nodraw?: boolean): boolean;
    repaint(): void;
    set(key: string, value: any): void;
    setAverageCenter(averageCenter: boolean): void;
    setBatchSizeIE(batchSizeIE: number): void;
    setCalculator(calculator: Calculator): void;
    setClusterClass(clusterClass: string): void;
    setEnableRetinaIcons(enableRetinaIcons: boolean): void;
    setGridSize(gridSize: number): void;
    setIgnoreHidden(ignoreHidden: boolean): void;
    setImageExtension(imageExtension: string): void;
    setImagePath(imagePath: string): void;
    setImageSizes(imageSizes: number[]): void;
    setMap(map: google.maps.Map | null): void;
    setMaxZoom(maxZoom: number): void;
    setMinimumClusterSize(minimumClusterSize: number): void;
    setStyles(styles: ClusterIconStyle[]): void;
    setTitle(title: string): void;
    setValues(values: any): void;
    setZIndex(zIndex: number): void;
    setZoomOnClick(zoomOnClick: boolean): void;
    setOptions(options: MarkerClustererOptions$1): void;
    unbind(key: string): void;
    unbindAll(): void;
    static CALCULATOR(markers: google.maps.Marker[], numStyles: number): ClusterIconInfo;
    static withDefaultStyle(overrides: ClusterIconStyle): ClusterIconStyle;
}
/**
 * Cluster class from the @google/markerclustererplus library.
 *
 * See googlemaps.github.io/v3-utility-library/classes/_google_markerclustererplus.cluster.html
 */
declare class Cluster$1 {
    constructor(markerClusterer: MarkerClusterer$1);
    getCenter(): google.maps.LatLng;
    getMarkers(): google.maps.Marker[];
    getSize(): number;
    updateIcon(): void;
}
/**
 * Options for constructing a MarkerClusterer from the @google/markerclustererplus library.
 *
 * See
 * googlemaps.github.io/v3-utility-library/classes/
 * _google_markerclustererplus.markerclustereroptions.html
 */
declare interface MarkerClustererOptions$1 {
    ariaLabelFn?: AriaLabelFn;
    averageCenter?: boolean;
    batchSize?: number;
    batchSizeIE?: number;
    calculator?: Calculator;
    clusterClass?: string;
    enableRetinaIcons?: boolean;
    gridSize?: number;
    ignoreHidden?: boolean;
    imageExtension?: string;
    imagePath?: string;
    imageSizes?: number[];
    maxZoom?: number;
    minimumClusterSize?: number;
    styles?: ClusterIconStyle[];
    title?: string;
    zIndex?: number;
    zoomOnClick?: boolean;
}
/**
 * Style interface for a marker cluster icon.
 *
 * See
 * googlemaps.github.io/v3-utility-library/interfaces/
 * _google_markerclustererplus.clustericonstyle.html
 */
declare interface ClusterIconStyle {
    anchorIcon?: [number, number];
    anchorText?: [number, number];
    backgroundPosition?: string;
    className?: string;
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string;
    height: number;
    textColor?: string;
    textDecoration?: string;
    textLineHeight?: number;
    textSize?: number;
    url?: string;
    width: number;
}
/**
 * Info interface for a marker cluster icon.
 *
 * See
 * googlemaps.github.io/v3-utility-library/interfaces/
 * _google_markerclustererplus.clustericoninfo.html
 */
declare interface ClusterIconInfo {
    index: number;
    text: string;
    title: string;
}
/**
 * Function type alias for determining the aria label on a Google Maps marker cluster.
 *
 * See googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#arialabelfn
 */
declare type AriaLabelFn = (text: string) => string;
/**
 * Function type alias for calculating how a marker cluster is displayed.
 *
 * See googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#calculator
 */
declare type Calculator = (markers: google.maps.Marker[], clusterIconStylesCount: number) => ClusterIconInfo;

/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 *
 * @deprecated This component is using a deprecated clustering implementation. Use the
 *   `map-marker-clusterer` component instead.
 * @breaking-change 21.0.0
 *
 */
declare class DeprecatedMapMarkerClusterer implements OnInit, AfterContentInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private readonly _ngZone;
    private readonly _currentMarkers;
    private readonly _eventManager;
    private readonly _destroy;
    /** Whether the clusterer is allowed to be initialized. */
    private readonly _canInitialize;
    ariaLabelFn: AriaLabelFn;
    set averageCenter(averageCenter: boolean);
    private _averageCenter;
    batchSize?: number;
    set batchSizeIE(batchSizeIE: number);
    private _batchSizeIE;
    set calculator(calculator: Calculator);
    private _calculator;
    set clusterClass(clusterClass: string);
    private _clusterClass;
    set enableRetinaIcons(enableRetinaIcons: boolean);
    private _enableRetinaIcons;
    set gridSize(gridSize: number);
    private _gridSize;
    set ignoreHidden(ignoreHidden: boolean);
    private _ignoreHidden;
    set imageExtension(imageExtension: string);
    private _imageExtension;
    set imagePath(imagePath: string);
    private _imagePath;
    set imageSizes(imageSizes: number[]);
    private _imageSizes;
    set maxZoom(maxZoom: number);
    private _maxZoom;
    set minimumClusterSize(minimumClusterSize: number);
    private _minimumClusterSize;
    set styles(styles: ClusterIconStyle[]);
    private _styles;
    set title(title: string);
    private _title;
    set zIndex(zIndex: number);
    private _zIndex;
    set zoomOnClick(zoomOnClick: boolean);
    private _zoomOnClick;
    set options(options: MarkerClustererOptions$1);
    private _options;
    /**
     * See
     * googlemaps.github.io/v3-utility-library/modules/
     * _google_markerclustererplus.html#clusteringbegin
     */
    readonly clusteringbegin: Observable<void>;
    /**
     * See
     * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
     */
    readonly clusteringend: Observable<void>;
    /** Emits when a cluster has been clicked. */
    readonly clusterClick: Observable<Cluster$1>;
    _markers: QueryList<MapMarker>;
    /**
     * The underlying MarkerClusterer object.
     *
     * See
     * googlemaps.github.io/v3-utility-library/classes/
     * _google_markerclustererplus.markerclusterer.html
     */
    markerClusterer?: MarkerClusterer$1;
    /** Event emitted when the clusterer is initialized. */
    readonly markerClustererInitialized: EventEmitter<MarkerClusterer$1>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    fitMapToMarkers(padding: number | google.maps.Padding): void;
    getAverageCenter(): boolean;
    getBatchSizeIE(): number;
    getCalculator(): Calculator;
    getClusterClass(): string;
    getClusters(): Cluster$1[];
    getEnableRetinaIcons(): boolean;
    getGridSize(): number;
    getIgnoreHidden(): boolean;
    getImageExtension(): string;
    getImagePath(): string;
    getImageSizes(): number[];
    getMaxZoom(): number;
    getMinimumClusterSize(): number;
    getStyles(): ClusterIconStyle[];
    getTitle(): string;
    getTotalClusters(): number;
    getTotalMarkers(): number;
    getZIndex(): number;
    getZoomOnClick(): boolean;
    private _combineOptions;
    private _watchForMarkerChanges;
    private _getInternalMarkers;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeprecatedMapMarkerClusterer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeprecatedMapMarkerClusterer, "deprecated-map-marker-clusterer", ["mapMarkerClusterer"], { "ariaLabelFn": { "alias": "ariaLabelFn"; "required": false; }; "averageCenter": { "alias": "averageCenter"; "required": false; }; "batchSize": { "alias": "batchSize"; "required": false; }; "batchSizeIE": { "alias": "batchSizeIE"; "required": false; }; "calculator": { "alias": "calculator"; "required": false; }; "clusterClass": { "alias": "clusterClass"; "required": false; }; "enableRetinaIcons": { "alias": "enableRetinaIcons"; "required": false; }; "gridSize": { "alias": "gridSize"; "required": false; }; "ignoreHidden": { "alias": "ignoreHidden"; "required": false; }; "imageExtension": { "alias": "imageExtension"; "required": false; }; "imagePath": { "alias": "imagePath"; "required": false; }; "imageSizes": { "alias": "imageSizes"; "required": false; }; "maxZoom": { "alias": "maxZoom"; "required": false; }; "minimumClusterSize": { "alias": "minimumClusterSize"; "required": false; }; "styles": { "alias": "styles"; "required": false; }; "title": { "alias": "title"; "required": false; }; "zIndex": { "alias": "zIndex"; "required": false; }; "zoomOnClick": { "alias": "zoomOnClick"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, { "clusteringbegin": "clusteringbegin"; "clusteringend": "clusteringend"; "clusterClick": "clusterClick"; "markerClustererInitialized": "markerClustererInitialized"; }, ["_markers"], ["*"], true, never>;
}

/**
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
declare class MapPolygon implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _paths;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Polygon object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
     */
    polygon?: google.maps.Polygon;
    set options(options: google.maps.PolygonOptions);
    set paths(paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> | google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
     */
    readonly polygonClick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
     */
    readonly polygonDblclick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
     */
    readonly polygonDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
     */
    readonly polygonDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
     */
    readonly polygonDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
     */
    readonly polygonMousedown: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
     */
    readonly polygonMousemove: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
     */
    readonly polygonMouseout: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
     */
    readonly polygonMouseover: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
     */
    readonly polygonMouseup: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
     */
    readonly polygonRightclick: Observable<google.maps.PolyMouseEvent>;
    /** Event emitted when the polygon is initialized. */
    readonly polygonInitialized: EventEmitter<google.maps.Polygon>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
     */
    getEditable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
     */
    getPath(): google.maps.MVCArray<google.maps.LatLng>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
     */
    getPaths(): google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPathChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapPolygon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapPolygon, "map-polygon", ["mapPolygon"], { "options": { "alias": "options"; "required": false; }; "paths": { "alias": "paths"; "required": false; }; }, { "polygonClick": "polygonClick"; "polygonDblclick": "polygonDblclick"; "polygonDrag": "polygonDrag"; "polygonDragend": "polygonDragend"; "polygonDragstart": "polygonDragstart"; "polygonMousedown": "polygonMousedown"; "polygonMousemove": "polygonMousemove"; "polygonMouseout": "polygonMouseout"; "polygonMouseover": "polygonMouseover"; "polygonMouseup": "polygonMouseup"; "polygonRightclick": "polygonRightclick"; "polygonInitialized": "polygonInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
declare class MapPolyline implements OnInit, OnDestroy {
    private readonly _map;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _path;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Polyline object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
     */
    polyline?: google.maps.Polyline;
    set options(options: google.maps.PolylineOptions);
    set path(path: google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
     */
    readonly polylineClick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
     */
    readonly polylineDblclick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
     */
    readonly polylineDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
     */
    readonly polylineDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
     */
    readonly polylineDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
     */
    readonly polylineMousedown: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
     */
    readonly polylineMousemove: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
     */
    readonly polylineMouseout: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
     */
    readonly polylineMouseover: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
     */
    readonly polylineMouseup: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
     */
    readonly polylineRightclick: Observable<google.maps.PolyMouseEvent>;
    /** Event emitted when the polyline is initialized. */
    readonly polylineInitialized: EventEmitter<google.maps.Polyline>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
     */
    getEditable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
     */
    getPath(): google.maps.MVCArray<google.maps.LatLng>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPathChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapPolyline, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapPolyline, "map-polyline", ["mapPolyline"], { "options": { "alias": "options"; "required": false; }; "path": { "alias": "path"; "required": false; }; }, { "polylineClick": "polylineClick"; "polylineDblclick": "polylineDblclick"; "polylineDrag": "polylineDrag"; "polylineDragend": "polylineDragend"; "polylineDragstart": "polylineDragstart"; "polylineMousedown": "polylineMousedown"; "polylineMousemove": "polylineMousemove"; "polylineMouseout": "polylineMouseout"; "polylineMouseover": "polylineMouseover"; "polylineMouseup": "polylineMouseup"; "polylineRightclick": "polylineRightclick"; "polylineInitialized": "polylineInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
 */
declare class MapRectangle implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _bounds;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Rectangle object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
     */
    rectangle?: google.maps.Rectangle;
    set options(options: google.maps.RectangleOptions);
    set bounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.boundsChanged
     */ readonly boundsChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
     */
    readonly rectangleClick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
     */
    readonly rectangleDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
     */
    readonly rectangleDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
     */
    readonly rectangleDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
     */
    readonly rectangleDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
     */
    readonly rectangleMousedown: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
     */
    readonly rectangleMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
     */
    readonly rectangleMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
     */
    readonly rectangleMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
     */
    readonly rectangleMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.rightclick
     */
    readonly rectangleRightclick: Observable<google.maps.MapMouseEvent>;
    /** Event emitted when the rectangle is initialized. */
    readonly rectangleInitialized: EventEmitter<google.maps.Rectangle>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
     */
    getEditable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForBoundsChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapRectangle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapRectangle, "map-rectangle", ["mapRectangle"], { "options": { "alias": "options"; "required": false; }; "bounds": { "alias": "bounds"; "required": false; }; }, { "boundsChanged": "boundsChanged"; "rectangleClick": "rectangleClick"; "rectangleDblclick": "rectangleDblclick"; "rectangleDrag": "rectangleDrag"; "rectangleDragend": "rectangleDragend"; "rectangleDragstart": "rectangleDragstart"; "rectangleMousedown": "rectangleMousedown"; "rectangleMousemove": "rectangleMousemove"; "rectangleMouseout": "rectangleMouseout"; "rectangleMouseover": "rectangleMouseover"; "rectangleMouseup": "rectangleMouseup"; "rectangleRightclick": "rectangleRightclick"; "rectangleInitialized": "rectangleInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Traffic Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
 */
declare class MapTrafficLayer implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private readonly _autoRefresh;
    private readonly _destroyed;
    /**
     * The underlying google.maps.TrafficLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
     */
    trafficLayer?: google.maps.TrafficLayer;
    /**
     * Whether the traffic layer refreshes with updated information automatically.
     */
    set autoRefresh(autoRefresh: boolean);
    /** Event emitted when the traffic layer is initialized. */
    readonly trafficLayerInitialized: EventEmitter<google.maps.TrafficLayer>;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    private _combineOptions;
    private _watchForAutoRefreshChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapTrafficLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapTrafficLayer, "map-traffic-layer", ["mapTrafficLayer"], { "autoRefresh": { "alias": "autoRefresh"; "required": false; }; }, { "trafficLayerInitialized": "trafficLayerInitialized"; }, never, never, true, never>;
}

/**
 * Angular component that renders a Google Maps Transit Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
 */
declare class MapTransitLayer implements OnInit, OnDestroy {
    private _map;
    private _zone;
    /**
     * The underlying google.maps.TransitLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
     */
    transitLayer?: google.maps.TransitLayer;
    /** Event emitted when the transit layer is initialized. */
    readonly transitLayerInitialized: EventEmitter<google.maps.TransitLayer>;
    ngOnInit(): void;
    private _initialize;
    ngOnDestroy(): void;
    private _assertLayerInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapTransitLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapTransitLayer, "map-transit-layer", ["mapTransitLayer"], {}, { "transitLayerInitialized": "transitLayerInitialized"; }, never, never, true, never>;
}

interface ClusterOptions {
    position?: google.maps.LatLng | google.maps.LatLngLiteral;
    markers?: Marker[];
}
interface Cluster {
    marker?: Marker;
    readonly markers?: Marker[];
    bounds?: google.maps.LatLngBounds;
    position: google.maps.LatLng;
    count: number;
    push(marker: Marker): void;
    delete(): void;
    new (options: ClusterOptions): Cluster;
}
declare class MarkerClusterer extends google.maps.OverlayView {
    onClusterClick: onClusterClickHandler;
    protected algorithm: Algorithm;
    protected clusters: Cluster[];
    protected markers: Marker[];
    protected renderer: Renderer;
    protected map: google.maps.Map | null;
    protected idleListener: google.maps.MapsEventListener;
    constructor({ map, markers, algorithmOptions, algorithm, renderer, onClusterClick, }: MarkerClustererOptions);
    addMarker(marker: Marker, noDraw?: boolean): void;
    addMarkers(markers: Marker[], noDraw?: boolean): void;
    removeMarker(marker: Marker, noDraw?: boolean): boolean;
    removeMarkers(markers: Marker[], noDraw?: boolean): boolean;
    clearMarkers(noDraw?: boolean): void;
    render(): void;
    onAdd(): void;
    onRemove(): void;
    protected reset(): void;
    protected renderClusters(): void;
}
type onClusterClickHandler = (event: google.maps.MapMouseEvent, cluster: Cluster, map: google.maps.Map) => void;
interface MarkerClustererOptions {
    markers?: Marker[];
    /**
     * An algorithm to cluster markers. Default is {@link SuperClusterAlgorithm}. Must
     * provide a `calculate` method accepting {@link AlgorithmInput} and returning
     * an array of {@link Cluster}.
     */
    algorithm?: Algorithm;
    algorithmOptions?: AlgorithmOptions;
    map?: google.maps.Map | null;
    /**
     * An object that converts a {@link Cluster} into a `google.maps.Marker`.
     * Default is {@link DefaultRenderer}.
     */
    renderer?: Renderer;
    onClusterClick?: onClusterClickHandler;
}
declare enum MarkerClustererEvents {
    CLUSTERING_BEGIN = "clusteringbegin",
    CLUSTERING_END = "clusteringend",
    CLUSTER_CLICK = "click"
}
declare const defaultOnClusterClickHandler: onClusterClickHandler;
interface Renderer {
    /**
     * Turn a {@link Cluster} into a `Marker`.
     *
     * Below is a simple example to create a marker with the number of markers in the cluster as a label.
     *
     * ```typescript
     * return new google.maps.Marker({
     *   position,
     *   label: String(markers.length),
     * });
     * ```
     */
    render(cluster: Cluster, stats: ClusterStats, map: google.maps.Map): Marker;
}
interface ClusterStats {
    markers: {
        sum: number;
    };
    clusters: {
        count: number;
        markers: {
            mean: number;
            sum: number;
            min: number;
            max: number;
        };
    };
    new (markers: Marker[], clusters: Cluster[]): ClusterStats;
}
interface Algorithm {
    /**
     * Calculates an array of {@link Cluster}.
     */
    calculate: ({ markers, map }: AlgorithmInput) => AlgorithmOutput;
}
interface AlgorithmOptions {
    maxZoom?: number;
}
interface AlgorithmInput {
    /**
     * The map containing the markers and clusters.
     */
    map: google.maps.Map;
    /**
     * An array of markers to be clustered.
     *
     * There are some specific edge cases to be aware of including the following:
     * * Markers that are not visible.
     */
    markers: Marker[];
    /**
     * The `mapCanvasProjection` enables easy conversion from lat/lng to pixel.
     *
     * @see [MapCanvasProjection](https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapCanvasProjection)
     */
    mapCanvasProjection: google.maps.MapCanvasProjection;
}
interface AlgorithmOutput {
    /**
     * The clusters returned based upon the {@link AlgorithmInput}.
     */
    clusters: Cluster[];
    /**
     * A boolean flag indicating that the clusters have not changed.
     */
    changed?: boolean;
}

/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
declare class MapMarkerClusterer implements OnInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private readonly _ngZone;
    private readonly _currentMarkers;
    private readonly _closestMapEventManager;
    private _markersSubscription;
    /** Whether the clusterer is allowed to be initialized. */
    private readonly _canInitialize;
    /**
     * Used to customize how the marker cluster is rendered.
     * See https://googlemaps.github.io/js-markerclusterer/interfaces/Renderer.html.
     */
    renderer: Renderer;
    /**
     * Algorithm used to cluster the markers.
     * See https://googlemaps.github.io/js-markerclusterer/interfaces/Algorithm.html.
     */
    algorithm: Algorithm;
    /** Emits when clustering has started. */
    readonly clusteringbegin: Observable<void>;
    /** Emits when clustering is done. */
    readonly clusteringend: Observable<void>;
    /** Emits when a cluster has been clicked. */
    readonly clusterClick: EventEmitter<Cluster>;
    /** Event emitted when the marker clusterer is initialized. */
    readonly markerClustererInitialized: EventEmitter<MarkerClusterer>;
    _markers: QueryList<MarkerDirective>;
    /** Underlying MarkerClusterer object used to interact with Google Maps. */
    markerClusterer?: MarkerClusterer;
    ngOnInit(): Promise<void>;
    ngOnChanges(changes: SimpleChanges): Promise<void>;
    ngOnDestroy(): void;
    private _createCluster;
    private _watchForMarkerChanges;
    private _destroyCluster;
    private _getInternalMarkers;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapMarkerClusterer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MapMarkerClusterer, "map-marker-clusterer", ["mapMarkerClusterer"], { "renderer": { "alias": "renderer"; "required": false; }; "algorithm": { "alias": "algorithm"; "required": false; }; }, { "clusteringbegin": "clusteringbegin"; "clusteringend": "clusteringend"; "clusterClick": "clusterClick"; "markerClustererInitialized": "markerClustererInitialized"; }, ["_markers"], ["*"], true, never>;
}

declare class GoogleMapsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<GoogleMapsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<GoogleMapsModule, never, [typeof GoogleMap, typeof MapBaseLayer, typeof MapBicyclingLayer, typeof MapCircle, typeof MapDirectionsRenderer, typeof MapGroundOverlay, typeof MapHeatmapLayer, typeof MapInfoWindow, typeof MapKmlLayer, typeof MapMarker, typeof MapAdvancedMarker, typeof DeprecatedMapMarkerClusterer, typeof MapPolygon, typeof MapPolyline, typeof MapRectangle, typeof MapTrafficLayer, typeof MapTransitLayer, typeof MapMarkerClusterer], [typeof GoogleMap, typeof MapBaseLayer, typeof MapBicyclingLayer, typeof MapCircle, typeof MapDirectionsRenderer, typeof MapGroundOverlay, typeof MapHeatmapLayer, typeof MapInfoWindow, typeof MapKmlLayer, typeof MapMarker, typeof MapAdvancedMarker, typeof DeprecatedMapMarkerClusterer, typeof MapPolygon, typeof MapPolyline, typeof MapRectangle, typeof MapTrafficLayer, typeof MapTransitLayer, typeof MapMarkerClusterer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<GoogleMapsModule>;
}

interface MapDirectionsResponse {
    status: google.maps.DirectionsStatus;
    result?: google.maps.DirectionsResult;
}
/**
 * Angular service that wraps the Google Maps DirectionsService from the Google Maps JavaScript
 * API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsService
 */
declare class MapDirectionsService {
    private readonly _ngZone;
    private _directionsService;
    constructor(...args: unknown[]);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsService.route
     */
    route(request: google.maps.DirectionsRequest): Observable<MapDirectionsResponse>;
    private _getService;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapDirectionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapDirectionsService>;
}

interface MapGeocoderResponse {
    status: google.maps.GeocoderStatus;
    results: google.maps.GeocoderResult[];
}
/**
 * Angular service that wraps the Google Maps Geocoder from the Google Maps JavaScript API.
 * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder
 */
declare class MapGeocoder {
    private readonly _ngZone;
    private _geocoder;
    constructor(...args: unknown[]);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder.geocode
     */
    geocode(request: google.maps.GeocoderRequest): Observable<MapGeocoderResponse>;
    private _getGeocoder;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapGeocoder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapGeocoder>;
}

type MapEventManagerTarget = {
    addListener: (name: string, callback: (...args: any[]) => void) => google.maps.MapsEventListener | undefined;
} | undefined;
/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
declare class MapEventManager {
    private _ngZone;
    /** Pending listeners that were added before the target was set. */
    private _pending;
    private _listeners;
    private _targetStream;
    /** Clears all currently-registered event listeners. */
    private _clearListeners;
    constructor(_ngZone: NgZone);
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    getLazyEmitter<T>(name: string): Observable<T>;
    /** Sets the current target that the manager should bind events to. */
    setTarget(target: MapEventManagerTarget): void;
    /** Destroys the manager and clears the event listeners. */
    destroy(): void;
}

export { DeprecatedMapMarkerClusterer, GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapBaseLayer, MapBicyclingLayer, MapCircle, MapDirectionsRenderer, MapDirectionsService, MapEventManager, MapGeocoder, MapGroundOverlay, MapHeatmapLayer, MapInfoWindow, MapKmlLayer, MapMarker, MapMarkerClusterer, MapPolygon, MapPolyline, MapRectangle, MapTrafficLayer, MapTransitLayer, MarkerClusterer, MarkerClustererEvents, defaultOnClusterClickHandler };
export type { Algorithm, AlgorithmInput, AlgorithmOptions, AlgorithmOutput, AriaLabelFn, Calculator, Cluster, ClusterIconStyle, ClusterOptions, ClusterStats, HeatmapData, MapAnchorPoint, MapDirectionsResponse, MapGeocoderResponse, MarkerClustererOptions$1 as MarkerClustererOptions, Renderer, onClusterClickHandler };
