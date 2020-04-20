/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { OnDestroy, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
/**
 * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
 */
export declare class MapRectangle implements OnInit, OnDestroy {
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
     */
    boundsChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
     */
    rectangleClick: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
     */
    rectangleDblclick: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
     */
    rectangleDrag: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
     */
    rectangleDragend: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
     */
    rectangleDragstart: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
     */
    rectangleMousedown: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
     */
    rectangleMousemove: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
     */
    rectangleMouseout: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
     */
    rectangleMouseover: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
     */
    rectangleMouseup: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.rightclick
     */
    rectangleRightclick: Observable<google.maps.MouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
     */
    getBounds(): google.maps.LatLngBounds;
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
}
