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
                return google.maps.importLibrary('routes').then(lib => {
                    this._directionsService = new lib.DirectionsService();
                    return this._directionsService;
                });
            }
        }
        return Promise.resolve(this._directionsService);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapDirectionsService, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapDirectionsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapDirectionsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtZGlyZWN0aW9ucy1yZW5kZXJlci9tYXAtZGlyZWN0aW9ucy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLHFDQUFxQztBQVRyQzs7Ozs7O0dBTUc7QUFFSCx5RUFBeUU7QUFDekUscUNBQXFDO0FBRXJDLE9BQU8sRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBT2hDOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLG9CQUFvQjtJQUcvQixZQUE2QixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUFFaEQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxPQUFzQztRQUMxQyxPQUFPLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7d0JBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO3dCQUNyRCxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3RCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxXQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM3QixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ2hFLENBQUM7aUJBQU0sQ0FBQztnQkFDTixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDcEQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUssR0FBaUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUNyRixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztnQkFDakMsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxDQUFDOzhHQXBDVSxvQkFBb0I7a0hBQXBCLG9CQUFvQixjQURSLE1BQU07OzJGQUNsQixvQkFBb0I7a0JBRGhDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge0luamVjdGFibGUsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcERpcmVjdGlvbnNSZXNwb25zZSB7XG4gIHN0YXR1czogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cztcbiAgcmVzdWx0PzogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1Jlc3VsdDtcbn1cblxuLyoqXG4gKiBBbmd1bGFyIHNlcnZpY2UgdGhhdCB3cmFwcyB0aGUgR29vZ2xlIE1hcHMgRGlyZWN0aW9uc1NlcnZpY2UgZnJvbSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdFxuICogQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnMjRGlyZWN0aW9uc1NlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWFwRGlyZWN0aW9uc1NlcnZpY2Uge1xuICBwcml2YXRlIF9kaXJlY3Rpb25zU2VydmljZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlXG4gICAqL1xuICByb3V0ZShyZXF1ZXN0OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVxdWVzdCk6IE9ic2VydmFibGU8TWFwRGlyZWN0aW9uc1Jlc3BvbnNlPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMuX2dldFNlcnZpY2UoKS50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICBzZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIChyZXN1bHQsIHN0YXR1cykgPT4ge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7cmVzdWx0OiByZXN1bHQgfHwgdW5kZWZpbmVkLCBzdGF0dXN9KTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRTZXJ2aWNlKCk6IFByb21pc2U8Z29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2U+IHtcbiAgICBpZiAoIXRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdyb3V0ZXMnKS50aGVuKGxpYiA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgKGxpYiBhcyBnb29nbGUubWFwcy5Sb3V0ZXNMaWJyYXJ5KS5EaXJlY3Rpb25zU2VydmljZSgpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb25zU2VydmljZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9kaXJlY3Rpb25zU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==