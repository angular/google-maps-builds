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
import { Directive, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { importLibrary } from '../import-library';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Traffic Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
 */
export class MapTrafficLayer {
    /**
     * Whether the traffic layer refreshes with updated information automatically.
     */
    set autoRefresh(autoRefresh) {
        this._autoRefresh.next(autoRefresh);
    }
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._autoRefresh = new BehaviorSubject(true);
        this._destroyed = new Subject();
        /** Event emitted when the traffic layer is initialized. */
        this.trafficLayerInitialized = new EventEmitter();
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            this._combineOptions()
                .pipe(take(1))
                .subscribe(options => {
                if (google.maps.TrafficLayer && this._map.googleMap) {
                    this._initialize(this._map.googleMap, google.maps.TrafficLayer, options);
                }
                else {
                    this._ngZone.runOutsideAngular(() => {
                        Promise.all([
                            this._map._resolveMap(),
                            importLibrary('maps', 'TrafficLayer'),
                        ]).then(([map, layerConstructor]) => {
                            this._initialize(map, layerConstructor, options);
                        });
                    });
                }
            });
        }
    }
    _initialize(map, layerConstructor, options) {
        this._ngZone.runOutsideAngular(() => {
            this.trafficLayer = new layerConstructor(options);
            this._assertInitialized();
            this.trafficLayer.setMap(map);
            this.trafficLayerInitialized.emit(this.trafficLayer);
            this._watchForAutoRefreshChanges();
        });
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this.trafficLayer?.setMap(null);
    }
    _combineOptions() {
        return this._autoRefresh.pipe(map(autoRefresh => {
            const combinedOptions = { autoRefresh };
            return combinedOptions;
        }));
    }
    _watchForAutoRefreshChanges() {
        this._combineOptions()
            .pipe(takeUntil(this._destroyed))
            .subscribe(options => {
            this._assertInitialized();
            this.trafficLayer.setOptions(options);
        });
    }
    _assertInitialized() {
        if (!this.trafficLayer) {
            throw Error('Cannot interact with a Google Map Traffic Layer before it has been initialized. ' +
                'Please wait for the Traffic Layer to load before trying to interact with it.');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapTrafficLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MapTrafficLayer, isStandalone: true, selector: "map-traffic-layer", inputs: { autoRefresh: "autoRefresh" }, outputs: { trafficLayerInitialized: "trafficLayerInitialized" }, exportAs: ["mapTrafficLayer"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MapTrafficLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-traffic-layer',
                    exportAs: 'mapTrafficLayer',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.GoogleMap }, { type: i0.NgZone }], propDecorators: { autoRefresh: [{
                type: Input
            }], trafficLayerInitialized: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYWZmaWMtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYWZmaWMtbGF5ZXIvbWFwLXRyYWZmaWMtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBcUIsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hHLE9BQU8sRUFBQyxlQUFlLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7OztBQUVoRDs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGVBQWU7SUFXMUI7O09BRUc7SUFDSCxJQUNJLFdBQVcsQ0FBQyxXQUFvQjtRQUNsQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBTUQsWUFDbUIsSUFBZSxFQUNmLE9BQWU7UUFEZixTQUFJLEdBQUosSUFBSSxDQUFXO1FBQ2YsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXhCakIsaUJBQVksR0FBRyxJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztRQUNsRCxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWlCbEQsMkRBQTJEO1FBQ3hDLDRCQUF1QixHQUN4QyxJQUFJLFlBQVksRUFBNEIsQ0FBQztJQUs1QyxDQUFDO0lBRUosUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLElBQUks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QUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjttR0FnQkssV0FBVztzQkFEZCxLQUFLO2dCQU1hLHVCQUF1QjtzQkFBekMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtpbXBvcnRMaWJyYXJ5fSBmcm9tICcuLi9pbXBvcnQtbGlicmFyeSc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgVHJhZmZpYyBMYXllciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNUcmFmZmljTGF5ZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLXRyYWZmaWMtbGF5ZXInLFxuICBleHBvcnRBczogJ21hcFRyYWZmaWNMYXllcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcFRyYWZmaWNMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfYXV0b1JlZnJlc2ggPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KHRydWUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjVHJhZmZpY0xheWVyXG4gICAqL1xuICB0cmFmZmljTGF5ZXI/OiBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHRyYWZmaWMgbGF5ZXIgcmVmcmVzaGVzIHdpdGggdXBkYXRlZCBpbmZvcm1hdGlvbiBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGF1dG9SZWZyZXNoKGF1dG9SZWZyZXNoOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXV0b1JlZnJlc2gubmV4dChhdXRvUmVmcmVzaCk7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0cmFmZmljIGxheWVyIGlzIGluaXRpYWxpemVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdHJhZmZpY0xheWVySW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxnb29nbGUubWFwcy5UcmFmZmljTGF5ZXI+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllcj4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKVxuICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIGlmIChnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIgJiYgdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSh0aGlzLl9tYXAuZ29vZ2xlTWFwLCBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIsIG9wdGlvbnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwLl9yZXNvbHZlTWFwKCksXG4gICAgICAgICAgICAgICAgaW1wb3J0TGlicmFyeTx0eXBlb2YgZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyPignbWFwcycsICdUcmFmZmljTGF5ZXInKSxcbiAgICAgICAgICAgICAgXSkudGhlbigoW21hcCwgbGF5ZXJDb25zdHJ1Y3Rvcl0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKG1hcCwgbGF5ZXJDb25zdHJ1Y3Rvciwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplKFxuICAgIG1hcDogZ29vZ2xlLm1hcHMuTWFwLFxuICAgIGxheWVyQ29uc3RydWN0b3I6IHR5cGVvZiBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIsXG4gICAgb3B0aW9uczogZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyT3B0aW9ucyxcbiAgKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMudHJhZmZpY0xheWVyID0gbmV3IGxheWVyQ29uc3RydWN0b3Iob3B0aW9ucyk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy50cmFmZmljTGF5ZXIuc2V0TWFwKG1hcCk7XG4gICAgICB0aGlzLnRyYWZmaWNMYXllckluaXRpYWxpemVkLmVtaXQodGhpcy50cmFmZmljTGF5ZXIpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JBdXRvUmVmcmVzaENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy50cmFmZmljTGF5ZXI/LnNldE1hcChudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyT3B0aW9ucz4ge1xuICAgIHJldHVybiB0aGlzLl9hdXRvUmVmcmVzaC5waXBlKFxuICAgICAgbWFwKGF1dG9SZWZyZXNoID0+IHtcbiAgICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXJPcHRpb25zID0ge2F1dG9SZWZyZXNofTtcbiAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckF1dG9SZWZyZXNoQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMudHJhZmZpY0xheWVyLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7dHJhZmZpY0xheWVyOiBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXJ9IHtcbiAgICBpZiAoIXRoaXMudHJhZmZpY0xheWVyKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBUcmFmZmljIExheWVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgVHJhZmZpYyBMYXllciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==