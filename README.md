# angular-request-dedup

This library aims to deduplicate repetitive call to the server while the request is still pending and pass the same promise to callers.

![GitHub](https://img.shields.io/github/license/AndrewLawendy/angular-request-dedup)
![GitHub package.json version](https://img.shields.io/github/package-json/v/AndrewLawendy/angular-request-dedup)
![npm](https://img.shields.io/npm/dw/angular-request-dedup)
![GitHub file size in bytes](https://img.shields.io/github/size/AndrewLawendy/angular-request-dedup/src/index.js)

[![NPM](https://nodei.co/npm/angular-request-dedup.png?downloads=true)](https://nodei.co/npm/angular-request-dedup/)

## When to use it

Almost always.

Say you have a button that calls the server then process the response and does something, but then the user -_or any other scenario_- clicked the button three times, that's **three calls** to server to do the same thing.

Our service can provide caching the promise and dispatching the same promise to all three calls.

## How to use

`npm i angular-request-dedup`

Integrate in the angular app
`angular.module("app", ["angular-request-dedup"])`

## Example

```
class MainResource {
    constructor(AngularRequestDedup) {
        this.AngularRequestDedup = AngularRequestDedup;
    }

    getAll(params) {
        return this.AngularRequestDedup.dedup(url).get(params)
    }
}
```

## Highlights

1. Once the promise is resolved, the promise is discarded from the cache.
2. You can pass `isPersistent` flag in the params object to keep the promise in the app state.

## Prerequisites

- It works with minium of AngualrJs 1.5.x
- Any bundler would do, no need for special loaders
