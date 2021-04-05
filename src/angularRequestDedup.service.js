import { getObjectWithoutProperties } from "./utils";

function AngularRequestDedup($httpParamSerializer, $resource) {
  const cachedPromises = {};

  function _addPromise(key, isPersistent, cb) {
    if (!cachedPromises[key]) {
      const promise = cb();
      if (!isPersistent) {
        promise.$promise.finally(function () {
          delete cachedPromises[key];
        });
      }

      cachedPromises[key] = promise;
    }
  }

  function _getKey(url, params, methodKey) {
    const serializedParams = $httpParamSerializer(params);
    return `${methodKey}:${url}${serializedParams}`;
  }

  function _getPromise(key, isPersistent, cb) {
    if (!cachedPromises[key]) {
      _addPromise(key, isPersistent, cb);
    }

    return cachedPromises[key];
  }

  return {
    dedup: function (url, paramDefaults, actions, options) {
      const resourceMethods = $resource(url, paramDefaults, actions, options);

      for (const methodKey in resourceMethods) {
        if (Object.prototype.hasOwnProperty.call(resourceMethods, methodKey)) {
          const method = resourceMethods[methodKey];

          resourceMethods[methodKey] = function (allParams) {
            const isPersistent = allParams && allParams.isPersistent;
            const params = getObjectWithoutProperties(allParams, [
              "isPersistent",
            ]);
            const key = _getKey(url, params, methodKey);

            return _getPromise(key, isPersistent, function () {
              return method(params);
            });
          };
        }
      }

      return resourceMethods;
    },
  };
}

export default AngularRequestDedup;
