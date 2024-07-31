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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapDirectionsService, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapDirectionsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MapDirectionsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtZGlyZWN0aW9ucy1yZW5kZXJlci9tYXAtZGlyZWN0aW9ucy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxREFBcUQ7QUFFckQsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFPaEM7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sb0JBQW9CO0lBRy9CLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUVoRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE9BQXNDO1FBQzFDLE9BQU8sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTt3QkFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7d0JBQ3JELFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDdEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFdBQVc7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzdCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDaEUsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNwRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSyxHQUFpQyxDQUFDLGlCQUFpQixFQUFFLENBQUM7b0JBQ3JGLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO2dCQUNqQyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xELENBQUM7cUhBcENVLG9CQUFvQjt5SEFBcEIsb0JBQW9CLGNBRFIsTUFBTTs7a0dBQ2xCLG9CQUFvQjtrQkFEaEMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIHByZXNlcnZlPVwidHJ1ZVwiIC8+XG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwRGlyZWN0aW9uc1Jlc3BvbnNlIHtcbiAgc3RhdHVzOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzO1xuICByZXN1bHQ/OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVzdWx0O1xufVxuXG4vKipcbiAqIEFuZ3VsYXIgc2VydmljZSB0aGF0IHdyYXBzIHRoZSBHb29nbGUgTWFwcyBEaXJlY3Rpb25zU2VydmljZSBmcm9tIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0XG4gKiBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9ucyNEaXJlY3Rpb25zU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXBEaXJlY3Rpb25zU2VydmljZSB7XG4gIHByaXZhdGUgX2RpcmVjdGlvbnNTZXJ2aWNlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1NlcnZpY2Uucm91dGVcbiAgICovXG4gIHJvdXRlKHJlcXVlc3Q6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZXF1ZXN0KTogT2JzZXJ2YWJsZTxNYXBEaXJlY3Rpb25zUmVzcG9uc2U+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgdGhpcy5fZ2V0U2VydmljZSgpLnRoZW4oc2VydmljZSA9PiB7XG4gICAgICAgIHNlcnZpY2Uucm91dGUocmVxdWVzdCwgKHJlc3VsdCwgc3RhdHVzKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtyZXN1bHQ6IHJlc3VsdCB8fCB1bmRlZmluZWQsIHN0YXR1c30pO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNlcnZpY2UoKTogUHJvbWlzZTxnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZT4ge1xuICAgIGlmICghdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2UpIHtcbiAgICAgIGlmIChnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSkge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdvb2dsZS5tYXBzLmltcG9ydExpYnJhcnkoJ3JvdXRlcycpLnRoZW4obGliID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zU2VydmljZSA9IG5ldyAobGliIGFzIGdvb2dsZS5tYXBzLlJvdXRlc0xpYnJhcnkpLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlKTtcbiAgfVxufVxuIl19