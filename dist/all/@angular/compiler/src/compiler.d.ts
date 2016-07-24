/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Compiler, CompilerFactory, CompilerOptions, Type } from '@angular/core';
export * from './template_ast';
export { TEMPLATE_TRANSFORMS } from './template_parser';
export { CompilerConfig, RenderTypes } from './config';
export * from './compile_metadata';
export * from './offline_compiler';
export { RuntimeCompiler } from './runtime_compiler';
export * from './url_resolver';
export * from './xhr';
export { ViewResolver } from './view_resolver';
export { DirectiveResolver } from './directive_resolver';
export { PipeResolver } from './pipe_resolver';
export { NgModuleResolver } from './ng_module_resolver';
/**
 * A set of providers that provide `RuntimeCompiler` and its dependencies to use for
 * template compilation.
 */
export declare const COMPILER_PROVIDERS: Array<any | Type | {
    [k: string]: any;
} | any[]>;
export declare function analyzeAppProvidersForDeprecatedConfiguration(appProviders?: any[]): {
    compilerOptions: CompilerOptions;
    moduleDeclarations: Type[];
    deprecationMessages: string[];
};
export declare class _RuntimeCompilerFactory extends CompilerFactory {
    createCompiler(options: CompilerOptions): Compiler;
}
export declare const RUNTIME_COMPILER_FACTORY: _RuntimeCompilerFactory;
