import AngularRequestDedup from "./angularRequestDedup.service";

angular
  .module("angular-request-dedup", [])
  .service("AngularRequestDedup", [
    "$httpParamSerializer",
    "$resource",
    AngularRequestDedup,
  ]);
