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
import { Injectable, NgZone } from '@angular/core';
import { importLibrary } from '../import-library';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Angular service that wraps the Google Maps DirectionsService from the Google Maps JavaScript
 * API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsService
 */
export class MapDirectionsService {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsService.route
     */
    route(request) {
        return new Observable(observer => {
            this._getService().then(service => {
                service.route(request, (result, status) => {
                    this._ngZone.run(() => {
                        observer.next({ result: result || undefined, status });
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
            }
            else {
                return importLibrary('routes', 'DirectionsService').then(serviceConstructor => {
                    this._directionsService = new serviceConstructor();
                    return this._directionsService;
                });
            }
        }
        return Promise.resolve(this._directionsService);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapDirectionsService, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapDirectionsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapDirectionsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtZGlyZWN0aW9ucy1yZW5kZXJlci9tYXAtZGlyZWN0aW9ucy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLHFDQUFxQztBQVRyQzs7Ozs7O0dBTUc7QUFFSCx5RUFBeUU7QUFDekUscUNBQXFDO0FBRXJDLE9BQU8sRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQU9oQzs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxvQkFBb0I7SUFHL0IsWUFBNkIsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFBRyxDQUFDO0lBRWhEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsT0FBc0M7UUFDMUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRTtvQkFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO3dCQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQzt3QkFDckQsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN0QixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sV0FBVztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDN0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNoRSxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sT0FBTyxhQUFhLENBQ2xCLFFBQVEsRUFDUixtQkFBbUIsQ0FDcEIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztvQkFDbkQsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEQsQ0FBQztxSEF2Q1Usb0JBQW9CO3lIQUFwQixvQkFBb0IsY0FEUixNQUFNOztrR0FDbEIsb0JBQW9CO2tCQURoQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpbXBvcnRMaWJyYXJ5fSBmcm9tICcuLi9pbXBvcnQtbGlicmFyeSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcERpcmVjdGlvbnNSZXNwb25zZSB7XG4gIHN0YXR1czogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cztcbiAgcmVzdWx0PzogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1Jlc3VsdDtcbn1cblxuLyoqXG4gKiBBbmd1bGFyIHNlcnZpY2UgdGhhdCB3cmFwcyB0aGUgR29vZ2xlIE1hcHMgRGlyZWN0aW9uc1NlcnZpY2UgZnJvbSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdFxuICogQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnMjRGlyZWN0aW9uc1NlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWFwRGlyZWN0aW9uc1NlcnZpY2Uge1xuICBwcml2YXRlIF9kaXJlY3Rpb25zU2VydmljZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlXG4gICAqL1xuICByb3V0ZShyZXF1ZXN0OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVxdWVzdCk6IE9ic2VydmFibGU8TWFwRGlyZWN0aW9uc1Jlc3BvbnNlPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMuX2dldFNlcnZpY2UoKS50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICBzZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIChyZXN1bHQsIHN0YXR1cykgPT4ge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7cmVzdWx0OiByZXN1bHQgfHwgdW5kZWZpbmVkLCBzdGF0dXN9KTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRTZXJ2aWNlKCk6IFByb21pc2U8Z29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2U+IHtcbiAgICBpZiAoIXRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRMaWJyYXJ5PHR5cGVvZiBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZT4oXG4gICAgICAgICAgJ3JvdXRlcycsXG4gICAgICAgICAgJ0RpcmVjdGlvbnNTZXJ2aWNlJyxcbiAgICAgICAgKS50aGVuKHNlcnZpY2VDb25zdHJ1Y3RvciA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgc2VydmljZUNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlKTtcbiAgfVxufVxuIl19