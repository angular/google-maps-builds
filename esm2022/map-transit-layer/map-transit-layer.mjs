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
import { Directive, EventEmitter, NgZone, Output, inject } from '@angular/core';
import { importLibrary } from '../import-library';
import { GoogleMap } from '../google-map/google-map';
import * as i0 from "@angular/core";
/**
 * Angular component that renders a Google Maps Transit Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
 */
export class MapTransitLayer {
    constructor() {
        this._map = inject(GoogleMap);
        this._zone = inject(NgZone);
        /** Event emitted when the transit layer is initialized. */
        this.transitLayerInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            if (google.maps.TransitLayer && this._map.googleMap) {
                this._initialize(this._map.googleMap, google.maps.TransitLayer);
            }
            else {
                this._zone.runOutsideAngular(() => {
                    Promise.all([
                        this._map._resolveMap(),
                        importLibrary('maps', 'TransitLayer'),
                    ]).then(([map, layerConstructor]) => {
                        this._initialize(map, layerConstructor);
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
            throw Error('Cannot interact with a Google Map Transit Layer before it has been initialized. ' +
                'Please wait for the Transit Layer to load before trying to interact with it.');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapTransitLayer, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.2", type: MapTransitLayer, isStandalone: true, selector: "map-transit-layer", outputs: { transitLayerInitialized: "transitLayerInitialized" }, exportAs: ["mapTransitLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapTransitLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-transit-layer',
                    exportAs: 'mapTransitLayer',
                    standalone: true,
                }]
        }], propDecorators: { transitLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYW5zaXQtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYW5zaXQtbGF5ZXIvbWFwLXRyYW5zaXQtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpHLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7O0FBRW5EOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8sZUFBZTtJQUw1QjtRQU1VLFNBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsVUFBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQVMvQiwyREFBMkQ7UUFDeEMsNEJBQXVCLEdBQ3hDLElBQUksWUFBWSxFQUE0QixDQUFDO0tBd0NoRDtJQXRDQyxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xFLENBQUM7aUJBQU0sQ0FBQztnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtvQkFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQzt3QkFDVixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDdkIsYUFBYSxDQUFrQyxNQUFNLEVBQUUsY0FBYyxDQUFDO3FCQUN2RSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxFQUFFO3dCQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUMxQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLFdBQVcsQ0FBQyxHQUFvQixFQUFFLGdCQUFpRDtRQUN6RixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUMzQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLHVCQUF1QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sS0FBSyxDQUNULGtGQUFrRjtnQkFDaEYsOEVBQThFLENBQ2pGLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztxSEFwRFUsZUFBZTt5R0FBZixlQUFlOztrR0FBZixlQUFlO2tCQUwzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs4QkFhb0IsdUJBQXVCO3NCQUF6QyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIGluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7aW1wb3J0TGlicmFyeX0gZnJvbSAnLi4vaW1wb3J0LWxpYnJhcnknO1xuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgVHJhbnNpdCBMYXllciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNUcmFuc2l0TGF5ZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLXRyYW5zaXQtbGF5ZXInLFxuICBleHBvcnRBczogJ21hcFRyYW5zaXRMYXllcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcFRyYW5zaXRMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfbWFwID0gaW5qZWN0KEdvb2dsZU1hcCk7XG4gIHByaXZhdGUgX3pvbmUgPSBpbmplY3QoTmdab25lKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI1RyYW5zaXRMYXllclxuICAgKi9cbiAgdHJhbnNpdExheWVyPzogZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHRyYW5zaXQgbGF5ZXIgaXMgaW5pdGlhbGl6ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0cmFuc2l0TGF5ZXJJbml0aWFsaXplZDogRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcj4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Z29vZ2xlLm1hcHMuVHJhbnNpdExheWVyPigpO1xuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgaWYgKGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllciAmJiB0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUodGhpcy5fbWFwLmdvb2dsZU1hcCwgZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuX21hcC5fcmVzb2x2ZU1hcCgpLFxuICAgICAgICAgICAgaW1wb3J0TGlicmFyeTx0eXBlb2YgZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyPignbWFwcycsICdUcmFuc2l0TGF5ZXInKSxcbiAgICAgICAgICBdKS50aGVuKChbbWFwLCBsYXllckNvbnN0cnVjdG9yXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZShtYXAsIGxheWVyQ29uc3RydWN0b3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKG1hcDogZ29vZ2xlLm1hcHMuTWFwLCBsYXllckNvbnN0cnVjdG9yOiB0eXBlb2YgZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyKSB7XG4gICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLnRyYW5zaXRMYXllciA9IG5ldyBsYXllckNvbnN0cnVjdG9yKCk7XG4gICAgICB0aGlzLnRyYW5zaXRMYXllckluaXRpYWxpemVkLmVtaXQodGhpcy50cmFuc2l0TGF5ZXIpO1xuICAgICAgdGhpcy5fYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy50cmFuc2l0TGF5ZXIuc2V0TWFwKG1hcCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnRyYW5zaXRMYXllcj8uc2V0TWFwKG51bGwpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge3RyYW5zaXRMYXllcjogZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyfSB7XG4gICAgaWYgKCF0aGlzLnRyYW5zaXRMYXllcikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgVHJhbnNpdCBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIFRyYW5zaXQgTGF5ZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=