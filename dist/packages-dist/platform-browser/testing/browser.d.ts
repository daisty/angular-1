import { PlatformRef } from '@angular/core';
/**
 * Providers for the browser test platform
 *
 * @experimental
 */
export declare const TEST_BROWSER_PLATFORM_PROVIDERS: Array<any>;
/**
 * @deprecated Use initTestEnvironment with BrowserTestModule instead.
 */
export declare const TEST_BROWSER_APPLICATION_PROVIDERS: Array<any>;
/**
 * Platform for testing
 *
 * @experimental API related to bootstrapping are still under review.
 */
export declare const browserTestPlatform: (extraProviders?: any[]) => PlatformRef;
/**
 * NgModule for testing.
 *
 * @stable
 */
export declare class BrowserTestModule {
}
