/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { GoogleMap } from './google-map/google-map';
import { MapBaseLayer } from './map-base-layer';
import { MapBicyclingLayer } from './map-bicycling-layer/map-bicycling-layer';
import { MapCircle } from './map-circle/map-circle';
import { MapDirectionsRenderer } from './map-directions-renderer/map-directions-renderer';
import { MapGroundOverlay } from './map-ground-overlay/map-ground-overlay';
import { MapInfoWindow } from './map-info-window/map-info-window';
import { MapKmlLayer } from './map-kml-layer/map-kml-layer';
import { MapMarker } from './map-marker/map-marker';
import { MapMarkerClusterer } from './map-marker-clusterer/map-marker-clusterer';
import { MapPolygon } from './map-polygon/map-polygon';
import { MapPolyline } from './map-polyline/map-polyline';
import { MapRectangle } from './map-rectangle/map-rectangle';
import { MapTrafficLayer } from './map-traffic-layer/map-traffic-layer';
import { MapTransitLayer } from './map-transit-layer/map-transit-layer';
import { MapHeatmapLayer } from './map-heatmap-layer/map-heatmap-layer';
import * as i0 from "@angular/core";
const COMPONENTS = [
    GoogleMap,
    MapBaseLayer,
    MapBicyclingLayer,
    MapCircle,
    MapDirectionsRenderer,
    MapGroundOverlay,
    MapHeatmapLayer,
    MapInfoWindow,
    MapKmlLayer,
    MapMarker,
    MapMarkerClusterer,
    MapPolygon,
    MapPolyline,
    MapRectangle,
    MapTrafficLayer,
    MapTransitLayer,
];
export class GoogleMapsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: GoogleMapsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.5", ngImport: i0, type: GoogleMapsModule, imports: [GoogleMap,
            MapBaseLayer,
            MapBicyclingLayer,
            MapCircle,
            MapDirectionsRenderer,
            MapGroundOverlay,
            MapHeatmapLayer,
            MapInfoWindow,
            MapKmlLayer,
            MapMarker,
            MapMarkerClusterer,
            MapPolygon,
            MapPolyline,
            MapRectangle,
            MapTrafficLayer,
            MapTransitLayer], exports: [GoogleMap,
            MapBaseLayer,
            MapBicyclingLayer,
            MapCircle,
            MapDirectionsRenderer,
            MapGroundOverlay,
            MapHeatmapLayer,
            MapInfoWindow,
            MapKmlLayer,
            MapMarker,
            MapMarkerClusterer,
            MapPolygon,
            MapPolyline,
            MapRectangle,
            MapTrafficLayer,
            MapTransitLayer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: GoogleMapsModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: GoogleMapsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: COMPONENTS,
                    exports: COMPONENTS,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDNUUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLG1EQUFtRCxDQUFDO0FBQ3hGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNoRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLDZDQUE2QyxDQUFDO0FBQy9FLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzNELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUN0RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDdEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVDQUF1QyxDQUFDOztBQUV0RSxNQUFNLFVBQVUsR0FBRztJQUNqQixTQUFTO0lBQ1QsWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixTQUFTO0lBQ1QscUJBQXFCO0lBQ3JCLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsYUFBYTtJQUNiLFdBQVc7SUFDWCxTQUFTO0lBQ1Qsa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixXQUFXO0lBQ1gsWUFBWTtJQUNaLGVBQWU7SUFDZixlQUFlO0NBQ2hCLENBQUM7QUFNRixNQUFNLE9BQU8sZ0JBQWdCO3FIQUFoQixnQkFBZ0I7c0hBQWhCLGdCQUFnQixZQXRCM0IsU0FBUztZQUNULFlBQVk7WUFDWixpQkFBaUI7WUFDakIsU0FBUztZQUNULHFCQUFxQjtZQUNyQixnQkFBZ0I7WUFDaEIsZUFBZTtZQUNmLGFBQWE7WUFDYixXQUFXO1lBQ1gsU0FBUztZQUNULGtCQUFrQjtZQUNsQixVQUFVO1lBQ1YsV0FBVztZQUNYLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZSxhQWZmLFNBQVM7WUFDVCxZQUFZO1lBQ1osaUJBQWlCO1lBQ2pCLFNBQVM7WUFDVCxxQkFBcUI7WUFDckIsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFDZixhQUFhO1lBQ2IsV0FBVztZQUNYLFNBQVM7WUFDVCxrQkFBa0I7WUFDbEIsVUFBVTtZQUNWLFdBQVc7WUFDWCxZQUFZO1lBQ1osZUFBZTtZQUNmLGVBQWU7c0hBT0osZ0JBQWdCOztrR0FBaEIsZ0JBQWdCO2tCQUo1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxVQUFVO29CQUNuQixPQUFPLEVBQUUsVUFBVTtpQkFDcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEJhc2VMYXllcn0gZnJvbSAnLi9tYXAtYmFzZS1sYXllcic7XG5pbXBvcnQge01hcEJpY3ljbGluZ0xheWVyfSBmcm9tICcuL21hcC1iaWN5Y2xpbmctbGF5ZXIvbWFwLWJpY3ljbGluZy1sYXllcic7XG5pbXBvcnQge01hcENpcmNsZX0gZnJvbSAnLi9tYXAtY2lyY2xlL21hcC1jaXJjbGUnO1xuaW1wb3J0IHtNYXBEaXJlY3Rpb25zUmVuZGVyZXJ9IGZyb20gJy4vbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXInO1xuaW1wb3J0IHtNYXBHcm91bmRPdmVybGF5fSBmcm9tICcuL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXknO1xuaW1wb3J0IHtNYXBJbmZvV2luZG93fSBmcm9tICcuL21hcC1pbmZvLXdpbmRvdy9tYXAtaW5mby13aW5kb3cnO1xuaW1wb3J0IHtNYXBLbWxMYXllcn0gZnJvbSAnLi9tYXAta21sLWxheWVyL21hcC1rbWwtbGF5ZXInO1xuaW1wb3J0IHtNYXBNYXJrZXJ9IGZyb20gJy4vbWFwLW1hcmtlci9tYXAtbWFya2VyJztcbmltcG9ydCB7TWFwTWFya2VyQ2x1c3RlcmVyfSBmcm9tICcuL21hcC1tYXJrZXItY2x1c3RlcmVyL21hcC1tYXJrZXItY2x1c3RlcmVyJztcbmltcG9ydCB7TWFwUG9seWdvbn0gZnJvbSAnLi9tYXAtcG9seWdvbi9tYXAtcG9seWdvbic7XG5pbXBvcnQge01hcFBvbHlsaW5lfSBmcm9tICcuL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUnO1xuaW1wb3J0IHtNYXBSZWN0YW5nbGV9IGZyb20gJy4vbWFwLXJlY3RhbmdsZS9tYXAtcmVjdGFuZ2xlJztcbmltcG9ydCB7TWFwVHJhZmZpY0xheWVyfSBmcm9tICcuL21hcC10cmFmZmljLWxheWVyL21hcC10cmFmZmljLWxheWVyJztcbmltcG9ydCB7TWFwVHJhbnNpdExheWVyfSBmcm9tICcuL21hcC10cmFuc2l0LWxheWVyL21hcC10cmFuc2l0LWxheWVyJztcbmltcG9ydCB7TWFwSGVhdG1hcExheWVyfSBmcm9tICcuL21hcC1oZWF0bWFwLWxheWVyL21hcC1oZWF0bWFwLWxheWVyJztcblxuY29uc3QgQ09NUE9ORU5UUyA9IFtcbiAgR29vZ2xlTWFwLFxuICBNYXBCYXNlTGF5ZXIsXG4gIE1hcEJpY3ljbGluZ0xheWVyLFxuICBNYXBDaXJjbGUsXG4gIE1hcERpcmVjdGlvbnNSZW5kZXJlcixcbiAgTWFwR3JvdW5kT3ZlcmxheSxcbiAgTWFwSGVhdG1hcExheWVyLFxuICBNYXBJbmZvV2luZG93LFxuICBNYXBLbWxMYXllcixcbiAgTWFwTWFya2VyLFxuICBNYXBNYXJrZXJDbHVzdGVyZXIsXG4gIE1hcFBvbHlnb24sXG4gIE1hcFBvbHlsaW5lLFxuICBNYXBSZWN0YW5nbGUsXG4gIE1hcFRyYWZmaWNMYXllcixcbiAgTWFwVHJhbnNpdExheWVyLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogQ09NUE9ORU5UUyxcbiAgZXhwb3J0czogQ09NUE9ORU5UUyxcbn0pXG5leHBvcnQgY2xhc3MgR29vZ2xlTWFwc01vZHVsZSB7fVxuIl19