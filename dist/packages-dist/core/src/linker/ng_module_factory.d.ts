/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector } from '../di/injector';
import { ConcreteType } from '../facade/lang';
import { ComponentFactory } from './component_factory';
import { CodegenComponentFactoryResolver, ComponentFactoryResolver } from './component_factory_resolver';
/**
 * Represents an instance of an NgModule created via a {@link NgModuleFactory}.
 *
 * `NgModuleRef` provides access to the NgModule Instance as well other objects related to this
 * NgModule Instance.
 * @stable
 */
export declare abstract class NgModuleRef<T> {
    /**
     * The injector that contains all of the providers of the NgModule.
     */
    injector: Injector;
    /**
     * The ComponentFactoryResolver to get hold of the ComponentFactories
     * delcared in the `precompile` property of the module.
     */
    componentFactoryResolver: ComponentFactoryResolver;
    /**
     * The NgModule instance.
     */
    instance: T;
}
/**
 * @stable
 */
export declare class NgModuleFactory<T> {
    private _injectorClass;
    private _moduleype;
    constructor(_injectorClass: {
        new (parentInjector: Injector): NgModuleInjector<T>;
    }, _moduleype: ConcreteType<T>);
    moduleType: ConcreteType<T>;
    create(parentInjector?: Injector): NgModuleRef<T>;
}
export declare abstract class NgModuleInjector<T> extends CodegenComponentFactoryResolver implements Injector, NgModuleRef<T> {
    parent: Injector;
    instance: T;
    constructor(parent: Injector, factories: ComponentFactory<any>[]);
    create(): void;
    abstract createInternal(): T;
    get(token: any, notFoundValue?: any): any;
    abstract getInternal(token: any, notFoundValue: any): any;
    injector: Injector;
    componentFactoryResolver: ComponentFactoryResolver;
}
