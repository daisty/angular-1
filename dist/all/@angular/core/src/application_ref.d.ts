import { ExceptionHandler } from '../src/facade/exceptions';
import { ConcreteType, Type } from '../src/facade/lang';
import { ChangeDetectorRef } from './change_detection/change_detector_ref';
import { Console } from './console';
import { Injector } from './di';
import { CompilerOptions } from './linker/compiler';
import { ComponentFactory, ComponentRef } from './linker/component_factory';
import { ComponentFactoryResolver } from './linker/component_factory_resolver';
import { NgModuleFactory, NgModuleRef } from './linker/ng_module_factory';
import { WtfScopeFn } from './profile/profile';
import { Testability, TestabilityRegistry } from './testability/testability';
import { NgZone } from './zone/ng_zone';
/**
 * Disable Angular's development mode, which turns off assertions and other
 * checks within the framework.
 *
 * One important assertion this disables verifies that a change detection pass
 * does not result in additional changes to any bindings (also known as
 * unidirectional data flow).
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function enableProdMode(): void;
/**
 * Locks the run mode of Angular. After this has been called,
 * it can't be changed any more. I.e. `isDevMode()` will always
 * return the same value.
 *
 * @deprecated This is a noop now. {@link isDevMode} automatically locks the run mode on first call.
 */
export declare function lockRunMode(): void;
/**
 * Returns whether Angular is in development mode. After called once,
 * the value is locked and won't change any more.
 *
 * By default, this is true, unless a user calls `enableProdMode` before calling this.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function isDevMode(): boolean;
/**
 * Creates a platform.
 * Platforms have to be eagerly created via this function.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function createPlatform(injector: Injector): PlatformRef;
/**
 * Creates a fatory for a platform
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function createPlatformFactory(name: string, providers: any[]): (extraProviders?: any[]) => PlatformRef;
/**
 * Checks that there currently is a platform
 * which contains the given token as a provider.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function assertPlatform(requiredToken: any): PlatformRef;
/**
 * Dispose the existing platform.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function disposePlatform(): void;
/**
 * Returns the current platform.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function getPlatform(): PlatformRef;
/**
 * Creates an instance of an `@NgModule` for the given platform
 * for offline compilation.
 *
 * ## Simple Example
 *
 * ```typescript
 * my_module.ts:
 *
 * @NgModule({
 *   imports: [BrowserModule]
 * })
 * class MyModule {}
 *
 * main.ts:
 * import {MyModuleNgFactory} from './my_module.ngfactory';
 * import {bootstrapModuleFactory} from '@angular/core';
 * import {browserPlatform} from '@angular/platform-browser';
 *
 * let moduleRef = bootstrapModuleFactory(MyModuleNgFactory, browserPlatform());
 * ```
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare function bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>, platform: PlatformRef): NgModuleRef<M>;
/**
 * Creates an instance of an `@NgModule` for a given platform using the given runtime compiler.
 *
 * ## Simple Example
 *
 * ```typescript
 * @NgModule({
 *   imports: [BrowserModule]
 * })
 * class MyModule {}
 *
 * let moduleRef = bootstrapModule(MyModule, browserPlatform());
 * ```
 * @stable
 */
export declare function bootstrapModule<M>(moduleType: ConcreteType<M>, platform: PlatformRef, compilerOptions?: CompilerOptions): Promise<NgModuleRef<M>>;
/**
 * Shortcut for ApplicationRef.bootstrap.
 * Requires a platform to be created first.
 *
 * @deprecated Use {@link bootstrapModuleFactory} instead.
 */
export declare function coreBootstrap<C>(componentFactory: ComponentFactory<C>, injector: Injector): ComponentRef<C>;
/**
 * Resolves the componentFactory for the given component,
 * waits for asynchronous initializers and bootstraps the component.
 * Requires a platform to be created first.
 *
 * @deprecated Use {@link bootstrapModule} instead.
 */
export declare function coreLoadAndBootstrap(componentType: Type, injector: Injector): Promise<ComponentRef<any>>;
/**
 * The Angular platform is the entry point for Angular on a web page. Each page
 * has exactly one platform, and services (such as reflection) which are common
 * to every Angular application running on the page are bound in its scope.
 *
 * A page's platform is initialized implicitly when {@link bootstrap}() is called, or
 * explicitly by calling {@link createPlatform}().
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare abstract class PlatformRef {
    /**
     * Register a listener to be called when the platform is disposed.
     */
    abstract registerDisposeListener(dispose: () => void): void;
    /**
     * Retrieve the platform {@link Injector}, which is the parent injector for
     * every Angular application on the page and provides singleton providers.
     */
    readonly injector: Injector;
    /**
     * Destroy the Angular platform and all Angular applications on the page.
     */
    abstract dispose(): void;
    readonly disposed: boolean;
}
export declare class PlatformRef_ extends PlatformRef {
    private _injector;
    /** @internal */
    _applications: ApplicationRef[];
    /** @internal */
    _disposeListeners: Function[];
    private _disposed;
    constructor(_injector: Injector);
    registerDisposeListener(dispose: () => void): void;
    readonly injector: Injector;
    readonly disposed: boolean;
    addApplication(appRef: ApplicationRef): void;
    dispose(): void;
    /** @internal */
    _applicationDisposed(app: ApplicationRef): void;
}
/**
 * A reference to an Angular application running on a page.
 *
 * For more about Angular applications, see the documentation for {@link bootstrap}.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export declare abstract class ApplicationRef {
    /**
     * Register a listener to be called each time `bootstrap()` is called to bootstrap
     * a new root component.
     */
    abstract registerBootstrapListener(listener: (ref: ComponentRef<any>) => void): void;
    /**
     * Register a listener to be called when the application is disposed.
     */
    abstract registerDisposeListener(dispose: () => void): void;
    /**
     * Returns a promise that resolves when all asynchronous application initializers
     * are done.
     */
    abstract waitForAsyncInitializers(): Promise<any>;
    /**
     * Runs the given callback in the zone and returns the result of the callback.
     * Exceptions will be forwarded to the ExceptionHandler and rethrown.
     */
    abstract run(callback: Function): any;
    /**
     * Bootstrap a new component at the root level of the application.
     *
     * ### Bootstrap process
     *
     * When bootstrapping a new root component into an application, Angular mounts the
     * specified application component onto DOM elements identified by the [componentType]'s
     * selector and kicks off automatic change detection to finish initializing the component.
     *
     * ### Example
     * {@example core/ts/platform/platform.ts region='longform'}
     */
    abstract bootstrap<C>(componentFactory: ComponentFactory<C> | ConcreteType<C>): ComponentRef<C>;
    /**
     * Retrieve the application {@link Injector}.
     */
    readonly injector: Injector;
    /**
     * Retrieve the application {@link NgZone}.
     */
    readonly zone: NgZone;
    /**
     * Dispose of this application and all of its components.
     */
    abstract dispose(): void;
    /**
     * Invoke this method to explicitly process change detection and its side-effects.
     *
     * In development mode, `tick()` also performs a second change detection cycle to ensure that no
     * further changes are detected. If additional changes are picked up during this second cycle,
     * bindings in the app have side-effects that cannot be resolved in a single change detection
     * pass.
     * In this case, Angular throws an error, since an Angular application can only have one change
     * detection pass during which all change detection must complete.
     */
    abstract tick(): void;
    /**
     * Get a list of component types registered to this application.
     */
    readonly componentTypes: Type[];
}
export declare class ApplicationRef_ extends ApplicationRef {
    private _platform;
    private _zone;
    private _console;
    private _injector;
    private _exceptionHandler;
    private _componentFactoryResolver;
    private _testabilityRegistry;
    private _testability;
    /** @internal */
    static _tickScope: WtfScopeFn;
    /** @internal */
    private _bootstrapListeners;
    /** @internal */
    private _disposeListeners;
    /** @internal */
    private _rootComponents;
    /** @internal */
    private _rootComponentTypes;
    /** @internal */
    private _changeDetectorRefs;
    /** @internal */
    private _runningTick;
    /** @internal */
    private _enforceNoNewChanges;
    private _asyncInitDonePromise;
    private _asyncInitDone;
    constructor(_platform: PlatformRef_, _zone: NgZone, _console: Console, _injector: Injector, _exceptionHandler: ExceptionHandler, _componentFactoryResolver: ComponentFactoryResolver, _testabilityRegistry: TestabilityRegistry, _testability: Testability, inits: Function[]);
    registerBootstrapListener(listener: (ref: ComponentRef<any>) => void): void;
    registerDisposeListener(dispose: () => void): void;
    registerChangeDetector(changeDetector: ChangeDetectorRef): void;
    unregisterChangeDetector(changeDetector: ChangeDetectorRef): void;
    waitForAsyncInitializers(): Promise<any>;
    run(callback: Function): any;
    bootstrap<C>(componentOrFactory: ComponentFactory<C> | ConcreteType<C>): ComponentRef<C>;
    /** @internal */
    _loadComponent(componentRef: ComponentRef<any>): void;
    /** @internal */
    _unloadComponent(componentRef: ComponentRef<any>): void;
    readonly injector: Injector;
    readonly zone: NgZone;
    tick(): void;
    dispose(): void;
    readonly componentTypes: Type[];
}
