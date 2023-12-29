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
                return importLibrary('geocoding', 'Geocoder').then(geocoderConstructor => {
                    this._geocoder = new geocoderConstructor();
                    return this._geocoder;
                });
            }
        }
        return Promise.resolve(this._geocoder);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapGeocoder, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapGeocoder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MapGeocoder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.NgZone }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdlb2NvZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1nZW9jb2Rlci9tYXAtZ2VvY29kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBT2hDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxXQUFXO0lBR3RCLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUVoRDs7T0FFRztJQUNILE9BQU8sQ0FBQyxPQUFvQztRQUMxQyxPQUFPLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2xDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7d0JBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO3dCQUNoRCxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3RCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxZQUFZO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDcEIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM5QyxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sT0FBTyxhQUFhLENBQThCLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQzdFLG1CQUFtQixDQUFDLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO29CQUMzQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3hCLENBQUMsQ0FDRixDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7cUhBcENVLFdBQVc7eUhBQVgsV0FBVyxjQURDLE1BQU07O2tHQUNsQixXQUFXO2tCQUR2QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpbXBvcnRMaWJyYXJ5fSBmcm9tICcuLi9pbXBvcnQtbGlicmFyeSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcEdlb2NvZGVyUmVzcG9uc2Uge1xuICBzdGF0dXM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzO1xuICByZXN1bHRzOiBnb29nbGUubWFwcy5HZW9jb2RlclJlc3VsdFtdO1xufVxuXG4vKipcbiAqIEFuZ3VsYXIgc2VydmljZSB0aGF0IHdyYXBzIHRoZSBHb29nbGUgTWFwcyBHZW9jb2RlciBmcm9tIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2dlb2NvZGVyI0dlb2NvZGVyXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hcEdlb2NvZGVyIHtcbiAgcHJpdmF0ZSBfZ2VvY29kZXI6IGdvb2dsZS5tYXBzLkdlb2NvZGVyIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9nZW9jb2RlciNHZW9jb2Rlci5nZW9jb2RlXG4gICAqL1xuICBnZW9jb2RlKHJlcXVlc3Q6IGdvb2dsZS5tYXBzLkdlb2NvZGVyUmVxdWVzdCk6IE9ic2VydmFibGU8TWFwR2VvY29kZXJSZXNwb25zZT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLl9nZXRHZW9jb2RlcigpLnRoZW4oZ2VvY29kZXIgPT4ge1xuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHJlcXVlc3QsIChyZXN1bHRzLCBzdGF0dXMpID0+IHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe3Jlc3VsdHM6IHJlc3VsdHMgfHwgW10sIHN0YXR1c30pO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEdlb2NvZGVyKCk6IFByb21pc2U8Z29vZ2xlLm1hcHMuR2VvY29kZXI+IHtcbiAgICBpZiAoIXRoaXMuX2dlb2NvZGVyKSB7XG4gICAgICBpZiAoZ29vZ2xlLm1hcHMuR2VvY29kZXIpIHtcbiAgICAgICAgdGhpcy5fZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRMaWJyYXJ5PHR5cGVvZiBnb29nbGUubWFwcy5HZW9jb2Rlcj4oJ2dlb2NvZGluZycsICdHZW9jb2RlcicpLnRoZW4oXG4gICAgICAgICAgZ2VvY29kZXJDb25zdHJ1Y3RvciA9PiB7XG4gICAgICAgICAgICB0aGlzLl9nZW9jb2RlciA9IG5ldyBnZW9jb2RlckNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2VvY29kZXI7XG4gICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2dlb2NvZGVyKTtcbiAgfVxufVxuIl19