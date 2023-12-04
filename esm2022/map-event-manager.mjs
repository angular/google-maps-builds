/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
export class MapEventManager {
    /** Clears all currently-registered event listeners. */
    _clearListeners() {
        for (const listener of this._listeners) {
            listener.remove();
        }
        this._listeners = [];
    }
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /** Pending listeners that were added before the target was set. */
        this._pending = [];
        this._listeners = [];
        this._targetStream = new BehaviorSubject(undefined);
    }
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    getLazyEmitter(name) {
        return this._targetStream.pipe(switchMap(target => {
            const observable = new Observable(observer => {
                // If the target hasn't been initialized yet, cache the observer so it can be added later.
                if (!target) {
                    this._pending.push({ observable, observer });
                    return undefined;
                }
                const listener = target.addListener(name, (event) => {
                    this._ngZone.run(() => observer.next(event));
                });
                // If there's an error when initializing the Maps API (e.g. a wrong API key), it will
                // return a dummy object that returns `undefined` from `addListener` (see #26514).
                if (!listener) {
                    observer.complete();
                    return undefined;
                }
                this._listeners.push(listener);
                return () => listener.remove();
            });
            return observable;
        }));
    }
    /** Sets the current target that the manager should bind events to. */
    setTarget(target) {
        const currentTarget = this._targetStream.value;
        if (target === currentTarget) {
            return;
        }
        // Clear the listeners from the pre-existing target.
        if (currentTarget) {
            this._clearListeners();
            this._pending = [];
        }
        this._targetStream.next(target);
        // Add the listeners that were bound before the map was initialized.
        this._pending.forEach(subscriber => subscriber.observable.subscribe(subscriber.observer));
        this._pending = [];
    }
    /** Destroys the manager and clears the event listeners. */
    destroy() {
        this._clearListeners();
        this._pending = [];
        this._targetStream.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWV2ZW50LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBV3pDLGlHQUFpRztBQUNqRyxNQUFNLE9BQU8sZUFBZTtJQU0xQix1REFBdUQ7SUFDL0MsZUFBZTtRQUNyQixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN2QyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxZQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWRuQyxtRUFBbUU7UUFDM0QsYUFBUSxHQUErRCxFQUFFLENBQUM7UUFDMUUsZUFBVSxHQUFvQyxFQUFFLENBQUM7UUFDakQsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBd0IsU0FBUyxDQUFDLENBQUM7SUFXeEMsQ0FBQztJQUV2QyxrR0FBa0c7SUFDbEcsY0FBYyxDQUFJLElBQVk7UUFDNUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDNUIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2pCLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFJLFFBQVEsQ0FBQyxFQUFFO2dCQUM5QywwRkFBMEY7Z0JBQzFGLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLFNBQVMsQ0FBQztnQkFDbkIsQ0FBQztnQkFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQVEsRUFBRSxFQUFFO29CQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLENBQUMsQ0FBQyxDQUFDO2dCQUVILHFGQUFxRjtnQkFDckYsa0ZBQWtGO2dCQUNsRixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2QsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNwQixPQUFPLFNBQVMsQ0FBQztnQkFDbkIsQ0FBQztnQkFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLFVBQVUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELHNFQUFzRTtJQUN0RSxTQUFTLENBQUMsTUFBNkI7UUFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFFL0MsSUFBSSxNQUFNLEtBQUssYUFBYSxFQUFFLENBQUM7WUFDN0IsT0FBTztRQUNULENBQUM7UUFFRCxvREFBb0Q7UUFDcEQsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDckIsQ0FBQztRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWhDLG9FQUFvRTtRQUNwRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCwyREFBMkQ7SUFDM0QsT0FBTztRQUNMLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N3aXRjaE1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG50eXBlIE1hcEV2ZW50TWFuYWdlclRhcmdldCA9XG4gIHwge1xuICAgICAgYWRkTGlzdGVuZXI6IChcbiAgICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgICBjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLFxuICAgICAgKSA9PiBnb29nbGUubWFwcy5NYXBzRXZlbnRMaXN0ZW5lciB8IHVuZGVmaW5lZDtcbiAgICB9XG4gIHwgdW5kZWZpbmVkO1xuXG4vKiogTWFuYWdlcyBldmVudCBvbiBhIEdvb2dsZSBNYXBzIG9iamVjdCwgZW5zdXJpbmcgdGhhdCBldmVudHMgYXJlIGFkZGVkIG9ubHkgd2hlbiBuZWNlc3NhcnkuICovXG5leHBvcnQgY2xhc3MgTWFwRXZlbnRNYW5hZ2VyIHtcbiAgLyoqIFBlbmRpbmcgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZCBiZWZvcmUgdGhlIHRhcmdldCB3YXMgc2V0LiAqL1xuICBwcml2YXRlIF9wZW5kaW5nOiB7b2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+OyBvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+fVtdID0gW107XG4gIHByaXZhdGUgX2xpc3RlbmVyczogZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXJbXSA9IFtdO1xuICBwcml2YXRlIF90YXJnZXRTdHJlYW0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE1hcEV2ZW50TWFuYWdlclRhcmdldD4odW5kZWZpbmVkKTtcblxuICAvKiogQ2xlYXJzIGFsbCBjdXJyZW50bHktcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuICovXG4gIHByaXZhdGUgX2NsZWFyTGlzdGVuZXJzKCkge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lci5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBhZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBtYXAgd2hlbiBhIGNvbnN1bWVyIHN1YnNjcmliZXMgdG8gaXQuICovXG4gIGdldExhenlFbWl0dGVyPFQ+KG5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLl90YXJnZXRTdHJlYW0ucGlwZShcbiAgICAgIHN3aXRjaE1hcCh0YXJnZXQgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8VD4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgICAgIC8vIElmIHRoZSB0YXJnZXQgaGFzbid0IGJlZW4gaW5pdGlhbGl6ZWQgeWV0LCBjYWNoZSB0aGUgb2JzZXJ2ZXIgc28gaXQgY2FuIGJlIGFkZGVkIGxhdGVyLlxuICAgICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9wZW5kaW5nLnB1c2goe29ic2VydmFibGUsIG9ic2VydmVyfSk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0LmFkZExpc3RlbmVyKG5hbWUsIChldmVudDogVCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiBvYnNlcnZlci5uZXh0KGV2ZW50KSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBJZiB0aGVyZSdzIGFuIGVycm9yIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSBNYXBzIEFQSSAoZS5nLiBhIHdyb25nIEFQSSBrZXkpLCBpdCB3aWxsXG4gICAgICAgICAgLy8gcmV0dXJuIGEgZHVtbXkgb2JqZWN0IHRoYXQgcmV0dXJucyBgdW5kZWZpbmVkYCBmcm9tIGBhZGRMaXN0ZW5lcmAgKHNlZSAjMjY1MTQpLlxuICAgICAgICAgIGlmICghbGlzdGVuZXIpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICByZXR1cm4gKCkgPT4gbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBjdXJyZW50IHRhcmdldCB0aGF0IHRoZSBtYW5hZ2VyIHNob3VsZCBiaW5kIGV2ZW50cyB0by4gKi9cbiAgc2V0VGFyZ2V0KHRhcmdldDogTWFwRXZlbnRNYW5hZ2VyVGFyZ2V0KSB7XG4gICAgY29uc3QgY3VycmVudFRhcmdldCA9IHRoaXMuX3RhcmdldFN0cmVhbS52YWx1ZTtcblxuICAgIGlmICh0YXJnZXQgPT09IGN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDbGVhciB0aGUgbGlzdGVuZXJzIGZyb20gdGhlIHByZS1leGlzdGluZyB0YXJnZXQuXG4gICAgaWYgKGN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIHRoaXMuX2NsZWFyTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLl9wZW5kaW5nID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fdGFyZ2V0U3RyZWFtLm5leHQodGFyZ2V0KTtcblxuICAgIC8vIEFkZCB0aGUgbGlzdGVuZXJzIHRoYXQgd2VyZSBib3VuZCBiZWZvcmUgdGhlIG1hcCB3YXMgaW5pdGlhbGl6ZWQuXG4gICAgdGhpcy5fcGVuZGluZy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5vYnNlcnZhYmxlLnN1YnNjcmliZShzdWJzY3JpYmVyLm9ic2VydmVyKSk7XG4gICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBtYW5hZ2VyIGFuZCBjbGVhcnMgdGhlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgIHRoaXMuX3BlbmRpbmcgPSBbXTtcbiAgICB0aGlzLl90YXJnZXRTdHJlYW0uY29tcGxldGUoKTtcbiAgfVxufVxuIl19