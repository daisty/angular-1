/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * @module
 * @description
 * Entry point from which you should import all public core APIs.
 */
__export(require('./src/metadata'));
__export(require('./src/util'));
__export(require('./src/di'));
var application_ref_1 = require('./src/application_ref');
exports.createPlatform = application_ref_1.createPlatform;
exports.assertPlatform = application_ref_1.assertPlatform;
exports.disposePlatform = application_ref_1.disposePlatform;
exports.getPlatform = application_ref_1.getPlatform;
exports.bootstrapModuleFactory = application_ref_1.bootstrapModuleFactory;
exports.bootstrapModule = application_ref_1.bootstrapModule;
exports.coreBootstrap = application_ref_1.coreBootstrap;
exports.coreLoadAndBootstrap = application_ref_1.coreLoadAndBootstrap;
exports.PlatformRef = application_ref_1.PlatformRef;
exports.ApplicationRef = application_ref_1.ApplicationRef;
exports.enableProdMode = application_ref_1.enableProdMode;
exports.lockRunMode = application_ref_1.lockRunMode;
exports.isDevMode = application_ref_1.isDevMode;
exports.createPlatformFactory = application_ref_1.createPlatformFactory;
var application_tokens_1 = require('./src/application_tokens');
exports.APP_ID = application_tokens_1.APP_ID;
exports.APP_INITIALIZER = application_tokens_1.APP_INITIALIZER;
exports.PACKAGE_ROOT_URL = application_tokens_1.PACKAGE_ROOT_URL;
exports.PLATFORM_INITIALIZER = application_tokens_1.PLATFORM_INITIALIZER;
__export(require('./src/zone'));
__export(require('./src/render'));
__export(require('./src/linker'));
var debug_node_1 = require('./src/debug/debug_node');
exports.DebugElement = debug_node_1.DebugElement;
exports.DebugNode = debug_node_1.DebugNode;
exports.asNativeElements = debug_node_1.asNativeElements;
exports.getDebugNode = debug_node_1.getDebugNode;
__export(require('./src/testability/testability'));
__export(require('./src/change_detection'));
__export(require('./src/platform_directives_and_pipes'));
__export(require('./src/platform_core_providers'));
var application_module_1 = require('./src/application_module');
exports.APPLICATION_COMMON_PROVIDERS = application_module_1.APPLICATION_COMMON_PROVIDERS;
exports.ApplicationModule = application_module_1.ApplicationModule;
var profile_1 = require('./src/profile/profile');
exports.wtfCreateScope = profile_1.wtfCreateScope;
exports.wtfLeave = profile_1.wtfLeave;
exports.wtfStartTimeRange = profile_1.wtfStartTimeRange;
exports.wtfEndTimeRange = profile_1.wtfEndTimeRange;
var lang_1 = require('./src/facade/lang');
exports.Type = lang_1.Type;
var async_1 = require('./src/facade/async');
exports.EventEmitter = async_1.EventEmitter;
var exceptions_1 = require('./src/facade/exceptions');
exports.ExceptionHandler = exceptions_1.ExceptionHandler;
exports.WrappedException = exceptions_1.WrappedException;
exports.BaseException = exceptions_1.BaseException;
__export(require('./private_export'));
__export(require('./src/animation/metadata'));
var animation_player_1 = require('./src/animation/animation_player');
exports.AnimationPlayer = animation_player_1.AnimationPlayer;
var security_1 = require('./src/security');
exports.SanitizationService = security_1.SanitizationService;
exports.SecurityContext = security_1.SecurityContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7OztBQUVIOzs7O0dBSUc7QUFDSCxpQkFBYyxnQkFBZ0IsQ0FBQyxFQUFBO0FBQy9CLGlCQUFjLFlBQVksQ0FBQyxFQUFBO0FBQzNCLGlCQUFjLFVBQVUsQ0FBQyxFQUFBO0FBQ3pCLGdDQUFxUCx1QkFBdUIsQ0FBQztBQUFyUSwwREFBYztBQUFFLDBEQUFjO0FBQUUsNERBQWU7QUFBRSxvREFBVztBQUFFLDBFQUFzQjtBQUFFLDREQUFlO0FBQUUsd0RBQWE7QUFBRSxzRUFBb0I7QUFBRSxvREFBVztBQUFFLDBEQUFjO0FBQUUsMERBQWM7QUFBRSxvREFBVztBQUFFLGdEQUFTO0FBQUUsd0VBQW9EO0FBQzdRLG1DQUE4RSwwQkFBMEIsQ0FBQztBQUFqRyw2Q0FBTTtBQUFFLCtEQUFlO0FBQUUsaUVBQWdCO0FBQUUseUVBQXNEO0FBQ3pHLGlCQUFjLFlBQVksQ0FBQyxFQUFBO0FBQzNCLGlCQUFjLGNBQWMsQ0FBQyxFQUFBO0FBQzdCLGlCQUFjLGNBQWMsQ0FBQyxFQUFBO0FBQzdCLDJCQUFzRSx3QkFBd0IsQ0FBQztBQUF2RixpREFBWTtBQUFFLDJDQUFTO0FBQUUseURBQWdCO0FBQUUsaURBQTRDO0FBQy9GLGlCQUFjLCtCQUErQixDQUFDLEVBQUE7QUFDOUMsaUJBQWMsd0JBQXdCLENBQUMsRUFBQTtBQUN2QyxpQkFBYyxxQ0FBcUMsQ0FBQyxFQUFBO0FBQ3BELGlCQUFjLCtCQUErQixDQUFDLEVBQUE7QUFDOUMsbUNBQThELDBCQUEwQixDQUFDO0FBQWpGLHlGQUE0QjtBQUFFLG1FQUFtRDtBQUN6Rix3QkFBdUYsdUJBQXVCLENBQUM7QUFBdkcsa0RBQWM7QUFBRSxzQ0FBUTtBQUFFLHdEQUFpQjtBQUFFLG9EQUEwRDtBQUUvRyxxQkFBbUIsbUJBQW1CLENBQUM7QUFBL0IsMkJBQStCO0FBQ3ZDLHNCQUEyQixvQkFBb0IsQ0FBQztBQUF4Qyw0Q0FBd0M7QUFDaEQsMkJBQWdFLHlCQUF5QixDQUFDO0FBQWxGLHlEQUFnQjtBQUFFLHlEQUFnQjtBQUFFLG1EQUE4QztBQUMxRixpQkFBYyxrQkFBa0IsQ0FBQyxFQUFBO0FBRWpDLGlCQUFjLDBCQUEwQixDQUFDLEVBQUE7QUFDekMsaUNBQThCLGtDQUFrQyxDQUFDO0FBQXpELDZEQUF5RDtBQUVqRSx5QkFBbUQsZ0JBQWdCLENBQUM7QUFBNUQsNkRBQW1CO0FBQUUscURBQXVDIn0=