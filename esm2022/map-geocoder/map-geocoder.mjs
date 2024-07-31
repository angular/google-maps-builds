/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" preserve="true" />
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Angular service that wraps the Google Maps Geocoder from the Google Maps JavaScript API.
 * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder
 */
export class MapGeocoder {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder.geocode
     */
    geocode(request) {
        return new Observable(observer => {
            this._getGeocoder().then(geocoder => {
                geocoder.geocode(request, (results, status) => {
                    this._ngZone.run(() => {
                        observer.next({ results: results || [], status });
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
            }
            else {
                return google.maps.importLibrary('geocoding').then(lib => {
                    this._geocoder = new lib.Geocoder();
                    return this._geocoder;
                });
            }
        }
        return Promise.resolve(this._geocoder);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapGeocoder, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapGeocoder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapGeocoder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdlb2NvZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1nZW9jb2Rlci9tYXAtZ2VvY29kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFEQUFxRDtBQUVyRCxPQUFPLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQU9oQzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sV0FBVztJQUd0QixZQUE2QixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUFFaEQ7O09BRUc7SUFDSCxPQUFPLENBQUMsT0FBb0M7UUFDMUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNsQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtvQkFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO3dCQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQzt3QkFDaEQsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN0QixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sWUFBWTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3BCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDOUMsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUN2RCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUssR0FBb0MsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDdEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUN4QixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDO3FIQWxDVSxXQUFXO3lIQUFYLFdBQVcsY0FEQyxNQUFNOztrR0FDbEIsV0FBVztrQkFEdkIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIHByZXNlcnZlPVwidHJ1ZVwiIC8+XG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwR2VvY29kZXJSZXNwb25zZSB7XG4gIHN0YXR1czogZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXM7XG4gIHJlc3VsdHM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyUmVzdWx0W107XG59XG5cbi8qKlxuICogQW5ndWxhciBzZXJ2aWNlIHRoYXQgd3JhcHMgdGhlIEdvb2dsZSBNYXBzIEdlb2NvZGVyIGZyb20gdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZ2VvY29kZXIjR2VvY29kZXJcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWFwR2VvY29kZXIge1xuICBwcml2YXRlIF9nZW9jb2RlcjogZ29vZ2xlLm1hcHMuR2VvY29kZXIgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2dlb2NvZGVyI0dlb2NvZGVyLmdlb2NvZGVcbiAgICovXG4gIGdlb2NvZGUocmVxdWVzdDogZ29vZ2xlLm1hcHMuR2VvY29kZXJSZXF1ZXN0KTogT2JzZXJ2YWJsZTxNYXBHZW9jb2RlclJlc3BvbnNlPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMuX2dldEdlb2NvZGVyKCkudGhlbihnZW9jb2RlciA9PiB7XG4gICAgICAgIGdlb2NvZGVyLmdlb2NvZGUocmVxdWVzdCwgKHJlc3VsdHMsIHN0YXR1cykgPT4ge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7cmVzdWx0czogcmVzdWx0cyB8fCBbXSwgc3RhdHVzfSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0R2VvY29kZXIoKTogUHJvbWlzZTxnb29nbGUubWFwcy5HZW9jb2Rlcj4ge1xuICAgIGlmICghdGhpcy5fZ2VvY29kZXIpIHtcbiAgICAgIGlmIChnb29nbGUubWFwcy5HZW9jb2Rlcikge1xuICAgICAgICB0aGlzLl9nZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ2dlb2NvZGluZycpLnRoZW4obGliID0+IHtcbiAgICAgICAgICB0aGlzLl9nZW9jb2RlciA9IG5ldyAobGliIGFzIGdvb2dsZS5tYXBzLkdlb2NvZGluZ0xpYnJhcnkpLkdlb2NvZGVyKCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2dlb2NvZGVyO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2dlb2NvZGVyKTtcbiAgfVxufVxuIl19