/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var shared_1 = require('./shared');
var collection_1 = require('./utils/collection');
function createEmptyUrlTree() {
    return new UrlTree(new UrlSegment([], {}), {}, null);
}
exports.createEmptyUrlTree = createEmptyUrlTree;
function containsTree(container, containee, exact) {
    if (exact) {
        return equalSegments(container.root, containee.root);
    }
    else {
        return containsSegment(container.root, containee.root);
    }
}
exports.containsTree = containsTree;
function equalSegments(container, containee) {
    if (!equalPath(container.pathsWithParams, containee.pathsWithParams))
        return false;
    if (container.numberOfChildren !== containee.numberOfChildren)
        return false;
    for (var c in containee.children) {
        if (!container.children[c])
            return false;
        if (!equalSegments(container.children[c], containee.children[c]))
            return false;
    }
    return true;
}
function containsSegment(container, containee) {
    return containsSegmentHelper(container, containee, containee.pathsWithParams);
}
function containsSegmentHelper(container, containee, containeePaths) {
    if (container.pathsWithParams.length > containeePaths.length) {
        var current = container.pathsWithParams.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths))
            return false;
        if (containee.hasChildren())
            return false;
        return true;
    }
    else if (container.pathsWithParams.length === containeePaths.length) {
        if (!equalPath(container.pathsWithParams, containeePaths))
            return false;
        for (var c in containee.children) {
            if (!container.children[c])
                return false;
            if (!containsSegment(container.children[c], containee.children[c]))
                return false;
        }
        return true;
    }
    else {
        var current = containeePaths.slice(0, container.pathsWithParams.length);
        var next = containeePaths.slice(container.pathsWithParams.length);
        if (!equalPath(container.pathsWithParams, current))
            return false;
        if (!container.children[shared_1.PRIMARY_OUTLET])
            return false;
        return containsSegmentHelper(container.children[shared_1.PRIMARY_OUTLET], containee, next);
    }
}
/**
 * A URL in the tree form.
 *
 * @stable
 */
var UrlTree = (function () {
    /**
     * @internal
     */
    function UrlTree(root, queryParams, fragment) {
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
    }
    UrlTree.prototype.toString = function () { return new DefaultUrlSerializer().serialize(this); };
    return UrlTree;
}());
exports.UrlTree = UrlTree;
/**
 * @stable
 */
var UrlSegment = (function () {
    function UrlSegment(pathsWithParams, children) {
        var _this = this;
        this.pathsWithParams = pathsWithParams;
        this.children = children;
        this.parent = null;
        collection_1.forEach(children, function (v, k) { return v.parent = _this; });
    }
    /**
     * Return true if the segment has child segments
     */
    UrlSegment.prototype.hasChildren = function () { return this.numberOfChildren > 0; };
    Object.defineProperty(UrlSegment.prototype, "numberOfChildren", {
        /**
         * Returns the number of child sements.
         */
        get: function () { return Object.keys(this.children).length; },
        enumerable: true,
        configurable: true
    });
    UrlSegment.prototype.toString = function () { return serializePaths(this); };
    return UrlSegment;
}());
exports.UrlSegment = UrlSegment;
/**
 * @stable
 */
var UrlPathWithParams = (function () {
    function UrlPathWithParams(path, parameters) {
        this.path = path;
        this.parameters = parameters;
    }
    UrlPathWithParams.prototype.toString = function () { return serializePath(this); };
    return UrlPathWithParams;
}());
exports.UrlPathWithParams = UrlPathWithParams;
function equalPathsWithParams(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i].path !== b[i].path)
            return false;
        if (!collection_1.shallowEqual(a[i].parameters, b[i].parameters))
            return false;
    }
    return true;
}
exports.equalPathsWithParams = equalPathsWithParams;
function equalPath(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i].path !== b[i].path)
            return false;
    }
    return true;
}
exports.equalPath = equalPath;
function mapChildrenIntoArray(segment, fn) {
    var res = [];
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet === shared_1.PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet !== shared_1.PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    return res;
}
exports.mapChildrenIntoArray = mapChildrenIntoArray;
/**
 * Defines a way to serialize/deserialize a url tree.
 *
 * @experimental
 */
var UrlSerializer = (function () {
    function UrlSerializer() {
    }
    return UrlSerializer;
}());
exports.UrlSerializer = UrlSerializer;
/**
 * A default implementation of the serialization.
 *
 * @experimental
 */
var DefaultUrlSerializer = (function () {
    function DefaultUrlSerializer() {
    }
    DefaultUrlSerializer.prototype.parse = function (url) {
        var p = new UrlParser(url);
        return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
    };
    DefaultUrlSerializer.prototype.serialize = function (tree) {
        var segment = "/" + serializeSegment(tree.root, true);
        var query = serializeQueryParams(tree.queryParams);
        var fragment = tree.fragment !== null && tree.fragment !== undefined ?
            "#" + encodeURIComponent(tree.fragment) :
            '';
        return "" + segment + query + fragment;
    };
    return DefaultUrlSerializer;
}());
exports.DefaultUrlSerializer = DefaultUrlSerializer;
function serializePaths(segment) {
    return segment.pathsWithParams.map(function (p) { return serializePath(p); }).join('/');
}
exports.serializePaths = serializePaths;
function serializeSegment(segment, root) {
    if (segment.hasChildren() && root) {
        var primary = segment.children[shared_1.PRIMARY_OUTLET] ?
            serializeSegment(segment.children[shared_1.PRIMARY_OUTLET], false) :
            '';
        var children_1 = [];
        collection_1.forEach(segment.children, function (v, k) {
            if (k !== shared_1.PRIMARY_OUTLET) {
                children_1.push(k + ":" + serializeSegment(v, false));
            }
        });
        if (children_1.length > 0) {
            return primary + "(" + children_1.join('//') + ")";
        }
        else {
            return "" + primary;
        }
    }
    else if (segment.hasChildren() && !root) {
        var children = mapChildrenIntoArray(segment, function (v, k) {
            if (k === shared_1.PRIMARY_OUTLET) {
                return [serializeSegment(segment.children[shared_1.PRIMARY_OUTLET], false)];
            }
            else {
                return [(k + ":" + serializeSegment(v, false))];
            }
        });
        return serializePaths(segment) + "/(" + children.join('//') + ")";
    }
    else {
        return serializePaths(segment);
    }
}
function serializePath(path) {
    return "" + encodeURIComponent(path.path) + serializeParams(path.parameters);
}
exports.serializePath = serializePath;
function serializeParams(params) {
    return pairs(params)
        .map(function (p) { return (";" + encodeURIComponent(p.first) + "=" + encodeURIComponent(p.second)); })
        .join('');
}
function serializeQueryParams(params) {
    var strs = pairs(params).map(function (p) { return (encodeURIComponent(p.first) + "=" + encodeURIComponent(p.second)); });
    return strs.length > 0 ? "?" + strs.join("&") : '';
}
var Pair = (function () {
    function Pair(first, second) {
        this.first = first;
        this.second = second;
    }
    return Pair;
}());
function pairs(obj) {
    var res = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            res.push(new Pair(prop, obj[prop]));
        }
    }
    return res;
}
var SEGMENT_RE = /^[^\/\(\)\?;=&#]+/;
function matchPathWithParams(str) {
    SEGMENT_RE.lastIndex = 0;
    var match = SEGMENT_RE.exec(str);
    return match ? match[0] : '';
}
var QUERY_PARAM_RE = /^[^=\?&#]+/;
function matchQueryParams(str) {
    QUERY_PARAM_RE.lastIndex = 0;
    var match = SEGMENT_RE.exec(str);
    return match ? match[0] : '';
}
var QUERY_PARAM_VALUE_RE = /^[^\?&#]+/;
function matchUrlQueryParamValue(str) {
    QUERY_PARAM_VALUE_RE.lastIndex = 0;
    var match = QUERY_PARAM_VALUE_RE.exec(str);
    return match ? match[0] : '';
}
var UrlParser = (function () {
    function UrlParser(url) {
        this.url = url;
        this.remaining = url;
    }
    UrlParser.prototype.peekStartsWith = function (str) { return this.remaining.startsWith(str); };
    UrlParser.prototype.capture = function (str) {
        if (!this.remaining.startsWith(str)) {
            throw new Error("Expected \"" + str + "\".");
        }
        this.remaining = this.remaining.substring(str.length);
    };
    UrlParser.prototype.parseRootSegment = function () {
        if (this.remaining.startsWith('/')) {
            this.capture('/');
        }
        if (this.remaining === '' || this.remaining.startsWith('?') || this.remaining.startsWith('#')) {
            return new UrlSegment([], {});
        }
        else {
            return new UrlSegment([], this.parseSegmentChildren());
        }
    };
    UrlParser.prototype.parseSegmentChildren = function () {
        if (this.remaining.length == 0) {
            return {};
        }
        if (this.peekStartsWith('/')) {
            this.capture('/');
        }
        var paths = [];
        if (!this.peekStartsWith('(')) {
            paths.push(this.parsePathWithParams());
        }
        while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
            this.capture('/');
            paths.push(this.parsePathWithParams());
        }
        var children = {};
        if (this.peekStartsWith('/(')) {
            this.capture('/');
            children = this.parseParens(true);
        }
        var res = {};
        if (this.peekStartsWith('(')) {
            res = this.parseParens(false);
        }
        if (paths.length > 0 || Object.keys(children).length > 0) {
            res[shared_1.PRIMARY_OUTLET] = new UrlSegment(paths, children);
        }
        return res;
    };
    UrlParser.prototype.parsePathWithParams = function () {
        var path = matchPathWithParams(this.remaining);
        if (path === '' && this.peekStartsWith(';')) {
            throw new Error("Empty path url segment cannot have parameters: '" + this.remaining + "'.");
        }
        this.capture(path);
        var matrixParams = {};
        if (this.peekStartsWith(';')) {
            matrixParams = this.parseMatrixParams();
        }
        return new UrlPathWithParams(decodeURIComponent(path), matrixParams);
    };
    UrlParser.prototype.parseQueryParams = function () {
        var params = {};
        if (this.peekStartsWith('?')) {
            this.capture('?');
            this.parseQueryParam(params);
            while (this.remaining.length > 0 && this.peekStartsWith('&')) {
                this.capture('&');
                this.parseQueryParam(params);
            }
        }
        return params;
    };
    UrlParser.prototype.parseFragment = function () {
        if (this.peekStartsWith('#')) {
            return decodeURIComponent(this.remaining.substring(1));
        }
        else {
            return null;
        }
    };
    UrlParser.prototype.parseMatrixParams = function () {
        var params = {};
        while (this.remaining.length > 0 && this.peekStartsWith(';')) {
            this.capture(';');
            this.parseParam(params);
        }
        return params;
    };
    UrlParser.prototype.parseParam = function (params) {
        var key = matchPathWithParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        var value = 'true';
        if (this.peekStartsWith('=')) {
            this.capture('=');
            var valueMatch = matchPathWithParams(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    };
    UrlParser.prototype.parseQueryParam = function (params) {
        var key = matchQueryParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        var value = 'true';
        if (this.peekStartsWith('=')) {
            this.capture('=');
            var valueMatch = matchUrlQueryParamValue(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    };
    UrlParser.prototype.parseParens = function (allowPrimary) {
        var segments = {};
        this.capture('(');
        while (!this.peekStartsWith(')') && this.remaining.length > 0) {
            var path = matchPathWithParams(this.remaining);
            var next = this.remaining[path.length];
            // if is is not one of these characters, then the segment was unescaped
            // or the group was not closed
            if (next !== '/' && next !== ')' && next !== ';') {
                throw new Error("Cannot parse url '" + this.url + "'");
            }
            var outletName = void 0;
            if (path.indexOf(':') > -1) {
                outletName = path.substr(0, path.indexOf(':'));
                this.capture(outletName);
                this.capture(':');
            }
            else if (allowPrimary) {
                outletName = shared_1.PRIMARY_OUTLET;
            }
            var children = this.parseSegmentChildren();
            segments[outletName] = Object.keys(children).length === 1 ? children[shared_1.PRIMARY_OUTLET] :
                new UrlSegment([], children);
            if (this.peekStartsWith('//')) {
                this.capture('//');
            }
        }
        this.capture(')');
        return segments;
    };
    return UrlParser;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3RyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL0Bhbmd1bGFyL3JvdXRlci9zcmMvdXJsX3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHVCQUE2QixVQUFVLENBQUMsQ0FBQTtBQUN4QywyQkFBb0Msb0JBQW9CLENBQUMsQ0FBQTtBQUV6RDtJQUNFLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFGZSwwQkFBa0IscUJBRWpDLENBQUE7QUFFRCxzQkFBNkIsU0FBa0IsRUFBRSxTQUFrQixFQUFFLEtBQWM7SUFDakYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNWLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0FBQ0gsQ0FBQztBQU5lLG9CQUFZLGVBTTNCLENBQUE7QUFFRCx1QkFBdUIsU0FBcUIsRUFBRSxTQUFxQjtJQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDbkYsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDNUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFD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