/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="google.maps" preserve="true" />
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2VyLWNsdXN0ZXJlci10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyLWNsdXN0ZXJlci9tYXJrZXItY2x1c3RlcmVyLXR5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILHFEQUFxRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgcHJlc2VydmU9XCJ0cnVlXCIgLz5cblxuLyoqXG4gKiBDbGFzcyBmb3IgY2x1c3RlcmluZyBtYXJrZXJzIG9uIGEgR29vZ2xlIE1hcC5cbiAqXG4gKiBTZWVcbiAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9jbGFzc2VzL19nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5tYXJrZXJjbHVzdGVyZXIuaHRtbFxuICovXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNYXJrZXJDbHVzdGVyZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBtYXA6IGdvb2dsZS5tYXBzLk1hcCxcbiAgICBtYXJrZXJzPzogZ29vZ2xlLm1hcHMuTWFya2VyW10sXG4gICAgb3B0aW9ucz86IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMsXG4gICk7XG4gIGFyaWFMYWJlbEZuOiBBcmlhTGFiZWxGbjtcbiAgc3RhdGljIEJBVENIX1NJWkU6IG51bWJlcjtcbiAgc3RhdGljIEJBVENIX1NJWkVfSUU6IG51bWJlcjtcbiAgc3RhdGljIElNQUdFX0VYVEVOU0lPTjogc3RyaW5nO1xuICBzdGF0aWMgSU1BR0VfUEFUSDogc3RyaW5nO1xuICBzdGF0aWMgSU1BR0VfU0laRVM6IG51bWJlcltdO1xuICBhZGRMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogRnVuY3Rpb24pOiBnb29nbGUubWFwcy5NYXBzRXZlbnRMaXN0ZW5lcjtcbiAgYWRkTWFya2VyKG1hcmtlcjogTWFya2VyQ2x1c3RlcmVyLCBub2RyYXc6IGJvb2xlYW4pOiB2b2lkO1xuICBhZGRNYXJrZXJzKG1hcmtlcnM6IGdvb2dsZS5tYXBzLk1hcmtlcltdLCBub2RyYXc/OiBib29sZWFuKTogdm9pZDtcbiAgYmluZFRvKGtleTogc3RyaW5nLCB0YXJnZXQ6IGdvb2dsZS5tYXBzLk1WQ09iamVjdCwgdGFyZ2V0S2V5OiBzdHJpbmcsIG5vTm90aWZ5OiBib29sZWFuKTogdm9pZDtcbiAgY2hhbmdlZChrZXk6IHN0cmluZyk6IHZvaWQ7XG4gIGNsZWFyTWFya2VycygpOiB2b2lkO1xuICBmaXRNYXBUb01hcmtlcnMocGFkZGluZzogbnVtYmVyIHwgZ29vZ2xlLm1hcHMuUGFkZGluZyk6IHZvaWQ7XG4gIGdldChrZXk6IHN0cmluZyk6IGFueTtcbiAgZ2V0QXZlcmFnZUNlbnRlcigpOiBib29sZWFuO1xuICBnZXRCYXRjaFNpemVJRSgpOiBudW1iZXI7XG4gIGdldENhbGN1bGF0b3IoKTogQ2FsY3VsYXRvcjtcbiAgZ2V0Q2x1c3RlckNsYXNzKCk6IHN0cmluZztcbiAgZ2V0Q2x1c3RlcnMoKTogQ2x1c3RlcltdO1xuICBnZXRFbmFibGVSZXRpbmFJY29ucygpOiBib29sZWFuO1xuICBnZXRHcmlkU2l6ZSgpOiBudW1iZXI7XG4gIGdldElnbm9yZUhpZGRlbigpOiBib29sZWFuO1xuICBnZXRJbWFnZUV4dGVuc2lvbigpOiBzdHJpbmc7XG4gIGdldEltYWdlUGF0aCgpOiBzdHJpbmc7XG4gIGdldEltYWdlU2l6ZXMoKTogbnVtYmVyW107XG4gIGdldE1hcCgpOiBnb29nbGUubWFwcy5NYXAgfCBnb29nbGUubWFwcy5TdHJlZXRWaWV3UGFub3JhbWE7XG4gIGdldE1hcmtlcnMoKTogZ29vZ2xlLm1hcHMuTWFya2VyW107XG4gIGdldE1heFpvb20oKTogbnVtYmVyO1xuICBnZXRNaW5pbXVtQ2x1c3RlclNpemUoKTogbnVtYmVyO1xuICBnZXRQYW5lcygpOiBnb29nbGUubWFwcy5NYXBQYW5lcztcbiAgZ2V0UHJvamVjdGlvbigpOiBnb29nbGUubWFwcy5NYXBDYW52YXNQcm9qZWN0aW9uO1xuICBnZXRTdHlsZXMoKTogQ2x1c3Rlckljb25TdHlsZVtdO1xuICBnZXRUaXRsZSgpOiBzdHJpbmc7XG4gIGdldFRvdGFsQ2x1c3RlcnMoKTogbnVtYmVyO1xuICBnZXRUb3RhbE1hcmtlcnMoKTogbnVtYmVyO1xuICBnZXRaSW5kZXgoKTogbnVtYmVyO1xuICBnZXRab29tT25DbGljaygpOiBib29sZWFuO1xuICBub3RpZnkoa2V5OiBzdHJpbmcpOiB2b2lkO1xuICByZW1vdmVNYXJrZXIobWFya2VyOiBnb29nbGUubWFwcy5NYXJrZXIsIG5vZHJhdzogYm9vbGVhbik6IGJvb2xlYW47XG4gIHJlbW92ZU1hcmtlcnMobWFya2VyczogZ29vZ2xlLm1hcHMuTWFya2VyW10sIG5vZHJhdz86IGJvb2xlYW4pOiBib29sZWFuO1xuICByZXBhaW50KCk6IHZvaWQ7XG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQ7XG4gIHNldEF2ZXJhZ2VDZW50ZXIoYXZlcmFnZUNlbnRlcjogYm9vbGVhbik6IHZvaWQ7XG4gIHNldEJhdGNoU2l6ZUlFKGJhdGNoU2l6ZUlFOiBudW1iZXIpOiB2b2lkO1xuICBzZXRDYWxjdWxhdG9yKGNhbGN1bGF0b3I6IENhbGN1bGF0b3IpOiB2b2lkO1xuICBzZXRDbHVzdGVyQ2xhc3MoY2x1c3RlckNsYXNzOiBzdHJpbmcpOiB2b2lkO1xuICBzZXRFbmFibGVSZXRpbmFJY29ucyhlbmFibGVSZXRpbmFJY29uczogYm9vbGVhbik6IHZvaWQ7XG4gIHNldEdyaWRTaXplKGdyaWRTaXplOiBudW1iZXIpOiB2b2lkO1xuICBzZXRJZ25vcmVIaWRkZW4oaWdub3JlSGlkZGVuOiBib29sZWFuKTogdm9pZDtcbiAgc2V0SW1hZ2VFeHRlbnNpb24oaW1hZ2VFeHRlbnNpb246IHN0cmluZyk6IHZvaWQ7XG4gIHNldEltYWdlUGF0aChpbWFnZVBhdGg6IHN0cmluZyk6IHZvaWQ7XG4gIHNldEltYWdlU2l6ZXMoaW1hZ2VTaXplczogbnVtYmVyW10pOiB2b2lkO1xuICBzZXRNYXAobWFwOiBnb29nbGUubWFwcy5NYXAgfCBudWxsKTogdm9pZDtcbiAgc2V0TWF4Wm9vbShtYXhab29tOiBudW1iZXIpOiB2b2lkO1xuICBzZXRNaW5pbXVtQ2x1c3RlclNpemUobWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXIpOiB2b2lkO1xuICBzZXRTdHlsZXMoc3R5bGVzOiBDbHVzdGVySWNvblN0eWxlW10pOiB2b2lkO1xuICBzZXRUaXRsZSh0aXRsZTogc3RyaW5nKTogdm9pZDtcbiAgc2V0VmFsdWVzKHZhbHVlczogYW55KTogdm9pZDtcbiAgc2V0WkluZGV4KHpJbmRleDogbnVtYmVyKTogdm9pZDtcbiAgc2V0Wm9vbU9uQ2xpY2soem9vbU9uQ2xpY2s6IGJvb2xlYW4pOiB2b2lkO1xuICAvLyBOb3RlOiBUaGlzIG9uZSBkb2Vzbid0IGFwcGVhciBpbiB0aGUgZG9jcyBwYWdlLCBidXQgaXQgZXhpc3RzIGF0IHJ1bnRpbWUuXG4gIHNldE9wdGlvbnMob3B0aW9uczogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucyk6IHZvaWQ7XG4gIHVuYmluZChrZXk6IHN0cmluZyk6IHZvaWQ7XG4gIHVuYmluZEFsbCgpOiB2b2lkO1xuICBzdGF0aWMgQ0FMQ1VMQVRPUihtYXJrZXJzOiBnb29nbGUubWFwcy5NYXJrZXJbXSwgbnVtU3R5bGVzOiBudW1iZXIpOiBDbHVzdGVySWNvbkluZm87XG4gIHN0YXRpYyB3aXRoRGVmYXVsdFN0eWxlKG92ZXJyaWRlczogQ2x1c3Rlckljb25TdHlsZSk6IENsdXN0ZXJJY29uU3R5bGU7XG59XG5cbi8qKlxuICogQ2x1c3RlciBjbGFzcyBmcm9tIHRoZSBAZ29vZ2xlL21hcmtlcmNsdXN0ZXJlcnBsdXMgbGlicmFyeS5cbiAqXG4gKiBTZWUgZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L2NsYXNzZXMvX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLmNsdXN0ZXIuaHRtbFxuICovXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBDbHVzdGVyIHtcbiAgY29uc3RydWN0b3IobWFya2VyQ2x1c3RlcmVyOiBNYXJrZXJDbHVzdGVyZXIpO1xuICBnZXRDZW50ZXIoKTogZ29vZ2xlLm1hcHMuTGF0TG5nO1xuICBnZXRNYXJrZXJzKCk6IGdvb2dsZS5tYXBzLk1hcmtlcltdO1xuICBnZXRTaXplKCk6IG51bWJlcjtcbiAgdXBkYXRlSWNvbigpOiB2b2lkO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbnN0cnVjdGluZyBhIE1hcmtlckNsdXN0ZXJlciBmcm9tIHRoZSBAZ29vZ2xlL21hcmtlcmNsdXN0ZXJlcnBsdXMgbGlicmFyeS5cbiAqXG4gKiBTZWVcbiAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9jbGFzc2VzL1xuICogX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLm1hcmtlcmNsdXN0ZXJlcm9wdGlvbnMuaHRtbFxuICovXG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgTWFya2VyQ2x1c3RlcmVyT3B0aW9ucyB7XG4gIGFyaWFMYWJlbEZuPzogQXJpYUxhYmVsRm47XG4gIGF2ZXJhZ2VDZW50ZXI/OiBib29sZWFuO1xuICBiYXRjaFNpemU/OiBudW1iZXI7XG4gIGJhdGNoU2l6ZUlFPzogbnVtYmVyO1xuICBjYWxjdWxhdG9yPzogQ2FsY3VsYXRvcjtcbiAgY2x1c3RlckNsYXNzPzogc3RyaW5nO1xuICBlbmFibGVSZXRpbmFJY29ucz86IGJvb2xlYW47XG4gIGdyaWRTaXplPzogbnVtYmVyO1xuICBpZ25vcmVIaWRkZW4/OiBib29sZWFuO1xuICBpbWFnZUV4dGVuc2lvbj86IHN0cmluZztcbiAgaW1hZ2VQYXRoPzogc3RyaW5nO1xuICBpbWFnZVNpemVzPzogbnVtYmVyW107XG4gIG1heFpvb20/OiBudW1iZXI7XG4gIG1pbmltdW1DbHVzdGVyU2l6ZT86IG51bWJlcjtcbiAgc3R5bGVzPzogQ2x1c3Rlckljb25TdHlsZVtdO1xuICB0aXRsZT86IHN0cmluZztcbiAgekluZGV4PzogbnVtYmVyO1xuICB6b29tT25DbGljaz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogU3R5bGUgaW50ZXJmYWNlIGZvciBhIG1hcmtlciBjbHVzdGVyIGljb24uXG4gKlxuICogU2VlXG4gKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvaW50ZXJmYWNlcy9cbiAqIF9nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5jbHVzdGVyaWNvbnN0eWxlLmh0bWxcbiAqL1xuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIENsdXN0ZXJJY29uU3R5bGUge1xuICBhbmNob3JJY29uPzogW251bWJlciwgbnVtYmVyXTtcbiAgYW5jaG9yVGV4dD86IFtudW1iZXIsIG51bWJlcl07XG4gIGJhY2tncm91bmRQb3NpdGlvbj86IHN0cmluZztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBmb250RmFtaWx5Pzogc3RyaW5nO1xuICBmb250U3R5bGU/OiBzdHJpbmc7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0ZXh0Q29sb3I/OiBzdHJpbmc7XG4gIHRleHREZWNvcmF0aW9uPzogc3RyaW5nO1xuICB0ZXh0TGluZUhlaWdodD86IG51bWJlcjtcbiAgdGV4dFNpemU/OiBudW1iZXI7XG4gIHVybD86IHN0cmluZztcbiAgd2lkdGg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBJbmZvIGludGVyZmFjZSBmb3IgYSBtYXJrZXIgY2x1c3RlciBpY29uLlxuICpcbiAqIFNlZVxuICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L2ludGVyZmFjZXMvXG4gKiBfZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuY2x1c3Rlcmljb25pbmZvLmh0bWxcbiAqL1xuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIENsdXN0ZXJJY29uSW5mbyB7XG4gIGluZGV4OiBudW1iZXI7XG4gIHRleHQ6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0eXBlIGFsaWFzIGZvciBkZXRlcm1pbmluZyB0aGUgYXJpYSBsYWJlbCBvbiBhIEdvb2dsZSBNYXBzIG1hcmtlciBjbHVzdGVyLlxuICpcbiAqIFNlZSBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9fZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNhcmlhbGFiZWxmblxuICovXG5leHBvcnQgZGVjbGFyZSB0eXBlIEFyaWFMYWJlbEZuID0gKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nO1xuXG4vKipcbiAqIEZ1bmN0aW9uIHR5cGUgYWxpYXMgZm9yIGNhbGN1bGF0aW5nIGhvdyBhIG1hcmtlciBjbHVzdGVyIGlzIGRpc3BsYXllZC5cbiAqXG4gKiBTZWUgZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L21vZHVsZXMvX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLmh0bWwjY2FsY3VsYXRvclxuICovXG5leHBvcnQgZGVjbGFyZSB0eXBlIENhbGN1bGF0b3IgPSAoXG4gIG1hcmtlcnM6IGdvb2dsZS5tYXBzLk1hcmtlcltdLFxuICBjbHVzdGVySWNvblN0eWxlc0NvdW50OiBudW1iZXIsXG4pID0+IENsdXN0ZXJJY29uSW5mbztcbiJdfQ==