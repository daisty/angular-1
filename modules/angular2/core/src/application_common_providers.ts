import {Type, CONST_EXPR} from './facade/lang';
import {Provider} from './di';
import {APP_ID_RANDOM_PROVIDER} from './application_tokens';
import {APPLICATION_CORE_PROVIDERS} from './application_ref';
import {
  IterableDiffers,
  defaultIterableDiffers,
  KeyValueDiffers,
  defaultKeyValueDiffers
} from './change_detection/change_detection';
import {ViewUtils} from "./linker/view_utils";
import {ComponentResolver} from './linker/component_resolver';
import {ReflectorComponentResolver} from "./linker/component_resolver";
import {DynamicComponentLoader} from './linker/dynamic_component_loader';
import {DynamicComponentLoader_} from "./linker/dynamic_component_loader";

var __unused: Type;  // avoid unused import when Type union types are erased

/**
 * A default set of providers which should be included in any Angular
 * application, regardless of the platform it runs onto.
 */
export const APPLICATION_COMMON_PROVIDERS: Array<Type | Provider | any[]> = CONST_EXPR([
  APPLICATION_CORE_PROVIDERS,
  new Provider(ComponentResolver, {useClass: ReflectorComponentResolver}),
  APP_ID_RANDOM_PROVIDER,
  ViewUtils,
  new Provider(IterableDiffers, {useValue: defaultIterableDiffers}),
  new Provider(KeyValueDiffers, {useValue: defaultKeyValueDiffers}),
  new Provider(DynamicComponentLoader, {useClass: DynamicComponentLoader_})
]);