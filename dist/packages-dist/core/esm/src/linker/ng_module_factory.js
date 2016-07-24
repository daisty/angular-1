/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector, THROW_IF_NOT_FOUND } from '../di/injector';
import { unimplemented } from '../facade/exceptions';
import { CodegenComponentFactoryResolver, ComponentFactoryResolver } from './component_factory_resolver';
/**
 * Represents an instance of an NgModule created via a {@link NgModuleFactory}.
 *
 * `NgModuleRef` provides access to the NgModule Instance as well other objects related to this
 * NgModule Instance.
 * @stable
 */
export class NgModuleRef {
    /**
     * The injector that contains all of the providers of the NgModule.
     */
    get injector() { return unimplemented(); }
    /**
     * The ComponentFactoryResolver to get hold of the ComponentFactories
     * delcared in the `precompile` property of the module.
     */
    get componentFactoryResolver() { return unimplemented(); }
    /**
     * The NgModule instance.
     */
    get instance() { return unimplemented(); }
}
/**
 * @stable
 */
export class NgModuleFactory {
    constructor(_injectorClass, _moduleype) {
        this._injectorClass = _injectorClass;
        this._moduleype = _moduleype;
    }
    get moduleType() { return this._moduleype; }
    create(parentInjector = null) {
        if (!parentInjector) {
            parentInjector = Injector.NULL;
        }
        var instance = new this._injectorClass(parentInjector);
        instance.create();
        return instance;
    }
}
const _UNDEFINED = new Object();
export class NgModuleInjector extends CodegenComponentFactoryResolver {
    constructor(parent, factories) {
        super(factories, parent.get(ComponentFactoryResolver, ComponentFactoryResolver.NULL));
        this.parent = parent;
    }
    create() { this.instance = this.createInternal(); }
    get(token, notFoundValue = THROW_IF_NOT_FOUND) {
        if (token === Injector || token === ComponentFactoryResolver) {
            return this;
        }
        var result = this.getInternal(token, _UNDEFINED);
        return result === _UNDEFINED ? this.parent.get(token, notFoundValue) : result;
    }
    get injector() { return this; }
    get componentFactoryResolver() { return this; }
}
//# sourceMappingURL=ng_module_factory.js.map