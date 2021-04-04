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

  function _getKey(url, params) {
    const serializedParams = $httpParamSerializer(params);
    return `${url}${serializedParams}`;
  }

  function _getPromise(url, params, isPersistent, cb) {
    const key = _getKey(url, params);

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

            return _getPromise(url, params, isPersistent, function () {
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
