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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapGeocoder, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapGeocoder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MapGeocoder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdlb2NvZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1nZW9jb2Rlci9tYXAtZ2VvY29kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFPaEM7OztHQUdHO0FBRUgsTUFBTSxPQUFPLFdBQVc7SUFHdEIsWUFBNkIsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFBRyxDQUFDO0lBRWhEOztPQUVHO0lBQ0gsT0FBTyxDQUFDLE9BQW9DO1FBQzFDLE9BQU8sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDbEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTt3QkFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7d0JBQ2hELFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDdEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFlBQVk7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzlDLENBQUM7aUJBQU0sQ0FBQztnQkFDTixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDdkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFLLEdBQW9DLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3RFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQzs4R0FsQ1UsV0FBVztrSEFBWCxXQUFXLGNBREMsTUFBTTs7MkZBQ2xCLFdBQVc7a0JBRHZCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge0luamVjdGFibGUsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcEdlb2NvZGVyUmVzcG9uc2Uge1xuICBzdGF0dXM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzO1xuICByZXN1bHRzOiBnb29nbGUubWFwcy5HZW9jb2RlclJlc3VsdFtdO1xufVxuXG4vKipcbiAqIEFuZ3VsYXIgc2VydmljZSB0aGF0IHdyYXBzIHRoZSBHb29nbGUgTWFwcyBHZW9jb2RlciBmcm9tIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2dlb2NvZGVyI0dlb2NvZGVyXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hcEdlb2NvZGVyIHtcbiAgcHJpdmF0ZSBfZ2VvY29kZXI6IGdvb2dsZS5tYXBzLkdlb2NvZGVyIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9nZW9jb2RlciNHZW9jb2Rlci5nZW9jb2RlXG4gICAqL1xuICBnZW9jb2RlKHJlcXVlc3Q6IGdvb2dsZS5tYXBzLkdlb2NvZGVyUmVxdWVzdCk6IE9ic2VydmFibGU8TWFwR2VvY29kZXJSZXNwb25zZT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLl9nZXRHZW9jb2RlcigpLnRoZW4oZ2VvY29kZXIgPT4ge1xuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHJlcXVlc3QsIChyZXN1bHRzLCBzdGF0dXMpID0+IHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe3Jlc3VsdHM6IHJlc3VsdHMgfHwgW10sIHN0YXR1c30pO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEdlb2NvZGVyKCk6IFByb21pc2U8Z29vZ2xlLm1hcHMuR2VvY29kZXI+IHtcbiAgICBpZiAoIXRoaXMuX2dlb2NvZGVyKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuR2VvY29kZXIpIHtcbiAgICAgICAgdGhpcy5fZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnb29nbGUubWFwcy5pbXBvcnRMaWJyYXJ5KCdnZW9jb2RpbmcnKS50aGVuKGxpYiA9PiB7XG4gICAgICAgICAgdGhpcy5fZ2VvY29kZXIgPSBuZXcgKGxpYiBhcyBnb29nbGUubWFwcy5HZW9jb2RpbmdMaWJyYXJ5KS5HZW9jb2RlcigpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9nZW9jb2RlcjtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9nZW9jb2Rlcik7XG4gIH1cbn1cbiJdfQ==