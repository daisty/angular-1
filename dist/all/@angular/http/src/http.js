/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('@angular/core');
var exceptions_1 = require('../src/facade/exceptions');
var lang_1 = require('../src/facade/lang');
var base_request_options_1 = require('./base_request_options');
var enums_1 = require('./enums');
var interfaces_1 = require('./interfaces');
var static_request_1 = require('./static_request');
function httpRequest(backend, request) {
    return backend.createConnection(request).response;
}
function mergeOptions(defaultOpts, providedOpts, method, url) {
    var newOptions = defaultOpts;
    if (lang_1.isPresent(providedOpts)) {
        // Hack so Dart can used named parameters
        return newOptions.merge(new base_request_options_1.RequestOptions({
            method: providedOpts.method || method,
            url: providedOpts.url || url,
            search: providedOpts.search,
            headers: providedOpts.headers,
            body: providedOpts.body,
            withCredentials: providedOpts.withCredentials,
            responseType: providedOpts.responseType
        }));
    }
    if (lang_1.isPresent(method)) {
        return newOptions.merge(new base_request_options_1.RequestOptions({ method: method, url: url }));
    }
    else {
        return newOptions.merge(new base_request_options_1.RequestOptions({ url: url }));
    }
}
var Http = (function () {
    function Http(_backend, _defaultOptions) {
        this._backend = _backend;
        this._defaultOptions = _defaultOptions;
    }
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    Http.prototype.request = function (url, options) {
        var responseObservable;
        if (lang_1.isString(url)) {
            responseObservable = httpRequest(this._backend, new static_request_1.Request(mergeOptions(this._defaultOptions, options, enums_1.RequestMethod.Get, url)));
        }
        else if (url instanceof static_request_1.Request) {
            responseObservable = httpRequest(this._backend, url);
        }
        else {
            throw exceptions_1.makeTypeError('First argument must be a url string or Request instance.');
        }
        return responseObservable;
    };
    /**
     * Performs a request with `get` http method.
     */
    Http.prototype.get = function (url, options) {
        return httpRequest(this._backend, new static_request_1.Request(mergeOptions(this._defaultOptions, options, enums_1.RequestMethod.Get, url)));
    };
    /**
     * Performs a request with `post` http method.
     */
    Http.prototype.post = function (url, body, options) {
        return httpRequest(this._backend, new static_request_1.Request(mergeOptions(this._defaultOptions.merge(new base_request_options_1.RequestOptions({ body: body })), options, enums_1.RequestMethod.Post, url)));
    };
    /**
     * Performs a request with `put` http method.
     */
    Http.prototype.put = function (url, body, options) {
        return httpRequest(this._backend, new static_request_1.Request(mergeOptions(this._defaultOptions.merge(new base_request_options_1.RequestOptions({ body: body })), options, enums_1.RequestMethod.Put, url)));
    };
    /**
     * Performs a request with `delete` http method.
     */
    Http.prototype.delete = function (url, options) {
        return httpRequest(this._backend, new static_request_1.Request(mergeOptions(this._defaultOptions, options, enums_1.RequestMethod.Delete, url)));
    };
    /**
     * Performs a request with `patch` http method.
     */
    Http.prototype.patch = function (url, body, options) {
        return httpRequest(this._backend, new static_request_1.Request(mergeOptions(this._defaultOptions.merge(new base_request_options_1.RequestOptions({ body: body })), options, enums_1.RequestMethod.Patch, url)));
    };
    /**
     * Performs a request with `head` http method.
     */
    Http.prototype.head = function (url, options) {
        return httpRequest(this._backend, new static_request_1.Request(mergeOptions(this._defaultOptions, options, enums_1.RequestMethod.Head, url)));
    };
    /** @nocollapse */
    Http.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    Http.ctorParameters = [
        { type: interfaces_1.ConnectionBackend, },
        { type: base_request_options_1.RequestOptions, },
    ];
    return Http;
}());
exports.Http = Http;
var Jsonp = (function (_super) {
    __extends(Jsonp, _super);
    function Jsonp(backend, defaultOptions) {
        _super.call(this, backend, defaultOptions);
    }
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     *
     * @security Regular XHR is the safest alternative to JSONP for most applications, and is
     * supported by all current browsers. Because JSONP creates a `<script>` element with
     * contents retrieved from a remote source, attacker-controlled data introduced by an untrusted
     * source could expose your application to XSS risks. Data exposed by JSONP may also be
     * readable by malicious third-party websites. In addition, JSONP introduces potential risk for
     * future security issues (e.g. content sniffing).  For more detail, see the
     * [Security Guide](http://g.co/ng/security).
     */
    Jsonp.prototype.request = function (url, options) {
        var responseObservable;
        if (lang_1.isString(url)) {
            url =
                new static_request_1.Request(mergeOptions(this._defaultOptions, options, enums_1.RequestMethod.Get, url));
        }
        if (url instanceof static_request_1.Request) {
            if (url.method !== enums_1.RequestMethod.Get) {
                exceptions_1.makeTypeError('JSONP requests must use GET request method.');
            }
            responseObservable = httpRequest(this._backend, url);
        }
        else {
            throw exceptions_1.makeTypeError('First argument must be a url string or Request instance.');
        }
        return responseObservable;
    };
    /** @nocollapse */
    Jsonp.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    Jsonp.ctorParameters = [
        { type: interfaces_1.ConnectionBackend, },
        { type: base_request_options_1.RequestOptions, },
    ];
    return Jsonp;
}(Http));
exports.Jsonp = Jsonp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvQGFuZ3VsYXIvaHR0cC9zcmMvaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7QUFFSCxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFHekMsMkJBQTRCLDBCQUEwQixDQUFDLENBQUE7QUFDdkQscUJBQWtDLG9CQUFvQixDQUFDLENBQUE7QUFFdkQscUNBQWlELHdCQUF3QixDQUFDLENBQUE7QUFDMUUsc0JBQTRCLFNBQVMsQ0FBQyxDQUFBO0FBQ3RDLDJCQUFvRCxjQUFjLENBQUMsQ0FBQTtBQUNuRSwrQkFBc0Isa0JBQWtCLENBQUMsQ0FBQTtBQUl6QyxxQkFBcUIsT0FBMEIsRUFBRSxPQUFnQjtJQUMvRCxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUNwRCxDQUFDO0FBRUQsc0JBQ0ksV0FBK0IsRUFBRSxZQUFnQyxFQUFFLE1BQXFCLEVBQ3hGLEdBQVc7SUFDYixJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUM7SUFDN0IsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIseUNBQXlDO1FBQ3pDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUkscUNBQWMsQ0FBQztZQUN6QyxNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU0sSUFBSSxNQUFNO1lBQ3JDLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFJLEdBQUc7WUFDNUIsTUFBTSxFQUFFLFlBQVksQ0FBQyxNQUFNO1lBQzNCLE9BQU8sRUFBRSxZQUFZLENBQUMsT0FBTztZQUM3QixJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUk7WUFDdkIsZUFBZSxFQUFFLFlBQVksQ0FBQyxlQUFlO1lBQzdDLFlBQVksRUFBRSxZQUFZLENBQUMsWUFBWTtT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