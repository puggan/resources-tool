/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/resources.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/resources.ts":
/*!**************************!*\
  !*** ./src/resources.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDBqHYrSTc21YXXVVl3fOCi-3-UfDi0Vmk",
    authDomain: "resources-f6ccf.firebaseapp.com",
    databaseURL: "https://resources-f6ccf.firebaseio.com",
    projectId: "resources-f6ccf",
    storageBucket: "resources-f6ccf.appspot.com",
    messagingSenderId: "59344905235"
};
firebase.initializeApp(config);
var app = angular.module("angFireResources", ["firebase"]);
app.controller('Resources', [
    "$scope",
    "$firebaseAuth",
    "$firebaseObject",
    function ($scope, $firebaseAuth, $firebaseObject) {
        $scope.authObj = $firebaseAuth();
        $scope.signedIn = false;
        $scope.signingIn = true;
        $scope.username = 'Anonymous';
        $scope.userImage = null;
        $scope.sums = { flow: { in: 0, out: 0, profit: 0 } };
        $scope.cache = {};
        var loadUserdata = function (uid) {
            if (!uid) {
                $scope.userData = { transport_cost: 15, flow_time: "1", gidi: 0, factoryLevel: {}, mines: {}, warehouse: {}, fake: true };
                return $scope.userData;
            }
            var userData = $firebaseObject($scope.db.child('userData/' + uid));
            userData.$loaded()
                .then(function () {
                var updated = false;
                if (!userData.transport_cost) {
                    userData.transport_cost = 15;
                    updated = true;
                }
                if (!userData.flow_time) {
                    userData.flow_time = 1;
                    updated = true;
                }
                if (!userData.gidi && userData.gidi === 0) {
                    userData.gidi = 0;
                    updated = true;
                }
                if (!userData.mines) {
                    userData.mines = {};
                    updated = true;
                }
                if (!userData.warehouse) {
                    userData.warehouse = {};
                    updated = true;
                }
                if (!userData.factoryLevel) {
                    userData.factoryLevel = {};
                    updated = true;
                }
                if (updated) {
                    userData.$save();
                }
                userData.$bindTo($scope, "userData");
                if (!$scope.userData.transport_cost || $scope.userData.transport_cost < 5 || $scope.userData.transport_cost > 15) {
                    $scope.userData.transport_cost = 15;
                }
            });
            return $scope.userData;
        };
        $scope.authObj.$onAuthStateChanged(function (firebaseUser) {
            if (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                console.log(firebaseUser);
                $scope.signedIn = true;
                $scope.tab = "Flow";
                $scope.username = firebaseUser.displayName;
                $scope.userImage = firebaseUser.photoURL;
                var linkedUser_1 = $firebaseObject($scope.db.child('userLinks/' + firebaseUser.uid));
                linkedUser_1
                    .$loaded()
                    .then(function () {
                    if (linkedUser_1.$value)
                        loadUserdata(linkedUser_1.$value, firebaseUser);
                    else
                        loadUserdata(firebaseUser.uid, firebaseUser);
                })
                    .catch(function () {
                    loadUserdata(firebaseUser.uid, firebaseUser);
                });
                var userInfo_1 = $firebaseObject($scope.db.child('userInfo/' + firebaseUser.uid));
                userInfo_1
                    .$loaded()
                    .then(function () {
                    userInfo_1.name = firebaseUser.displayName;
                    userInfo_1.email = firebaseUser.email;
                    userInfo_1.photoURL = firebaseUser.photoURL;
                    userInfo_1.providerId = firebaseUser.providerData[0].providerId;
                    userInfo_1.uid = firebaseUser.providerData[0].uid;
                    userInfo_1.$save();
                });
            }
            else {
                console.log("Signed out");
                $scope.signedIn = false;
                $scope.username = 'Anonymous';
                $scope.userImage = null;
                loadUserdata(null, null);
            }
            $scope.signingIn = false;
        });
        $scope.signOut = function () {
            $scope.authObj.$signOut();
        };
        $scope.signIn = function (auth_provider) {
            $scope.authObj
                .$signInWithRedirect(auth_provider)
                .catch(function (error) {
                console.error("Authentication failed:", error);
            });
        };
        $scope.db = firebase.database()
            .ref();
        var gameData = $scope.db.child('gameData');
        $scope.factories = $firebaseObject(gameData.child('factories'));
        $scope.recycling = $firebaseObject(gameData.child('recycling'));
        $scope.units = $firebaseObject(gameData.child('units'));
        $scope.itemNames = $firebaseObject(gameData.child('items'));
        $scope.itemValues = $firebaseObject($scope.db.child('apiData/itemValues'));
        $scope.userData = { transport_cost: 15, flow_time: "1", factoryLevel: {}, mines: {}, fake: true };
        $scope.getObjectKeys = function (o) {
            return Object.keys(o);
        };
        $scope.nrformat = function (org_nr) {
            var nr = parseFloat(org_nr);
            if (nr < 0) {
                return "-" + this.nrformat(-nr);
            }
            if (nr < 100) {
                return parseInt(nr);
            }
            var sufix_nr;
            var sufix_list = ['', ' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'];
            for (sufix_nr = 0; sufix_nr < sufix_list.length; sufix_nr++) {
                if (nr < 1000) {
                    break;
                }
                nr = nr / 1000;
            }
            if (nr < 1000) {
                return nr.toPrecision(3) + sufix_list[sufix_nr];
            }
            else if (org_nr.toPrecision) {
                return org_nr.toPrecision(3);
            }
            else {
                return org_nr;
            }
        };
        $scope.procentformat = function (org_nr, append) {
            if (append === void 0) { append = '%'; }
            var nr = parseFloat(org_nr);
            if (nr < 0) {
                return "-" + this.procentformat(-nr, append);
            }
            if (nr < 1000) {
                return nr.toPrecision(3) + append;
            }
            else {
                return Math.round(org_nr) + append;
            }
        };
        $scope.timeformat = function (hours) {
            if (hours < 0)
                return '-' + $scope.timeformat(-hours);
            var v = 3600 * hours;
            if (v < 60)
                return v + ' s';
            if (v < 60 * 60)
                return Math.floor(v / 60) + ' m ' + Math.floor(v % 60) + ' s';
            v = v / 60;
            if (v < 24 * 60)
                return Math.floor(v / 60) + ' h ' + Math.floor(v % 60) + ' m';
            v = v / 60;
            if (v < 31 * 24)
                return Math.floor(v / 24) + ' d ' + Math.floor(v % 24) + ' h';
            v = v / 24;
            if (v < 7 * 52)
                return Math.floor(v / 7) + ' w ' + Math.floor(v % 24) + ' d';
            return Math.floor(v / 365) + ' y ' + Math.floor((v % 365) / 7) + ' w';
        };
        $scope.titleformat = function (resource_id, amount, itemvalue, itemNames) {
            if (resource_id === 1 || resource_id === '1') {
                return this.nrformat(amount) + ' ' + itemNames[1];
            }
            return this.nrformat(amount) + ' ' + itemNames[resource_id] + ' = ' + this.nrformat(amount * itemvalue) + ' ' + itemNames[1];
        };
        $scope.factory_list = function (factories, factory_levels, itemValues, transport_cost) {
            var factory_list = [];
            for (var factory_id in factories) {
                if (!factories.hasOwnProperty(factory_id)) {
                    continue;
                }
                if (!(parseInt(factory_id) > 0)) {
                    continue;
                }
                var resource_count = 0;
                var resource_value = 0;
                var resource_transport_value = 0;
                var factory = factories[factory_id];
                factory.factory_id = factory_id;
                factory.level = factory_levels[factory_id];
                factory.next_level = factory.level + 1;
                factory.credits_out = 0;
                for (resource_id in factory.out) {
                    if (!factory.out.hasOwnProperty(resource_id)) {
                        continue;
                    }
                    resource_count = factory.out[resource_id];
                    resource_value = itemValues[resource_id];
                    factory.credits_out += resource_count * resource_value;
                }
                factory.credits_in = 0;
                for (resource_id in factory.in) {
                    if (!factory.in.hasOwnProperty(resource_id)) {
                        continue;
                    }
                    resource_count = factory.in[resource_id];
                    resource_value = itemValues[resource_id];
                    resource_transport_value = resource_value;
                    if (resource_id > 1) {
                        resource_transport_value = resource_value * (100 + transport_cost) / 100;
                    }
                    factory.credits_in += resource_count * resource_transport_value;
                }
                factory.turnover = factory.speed * factory.level * factory.credits_out;
                factory.profit_base = factory.credits_out - factory.credits_in;
                factory.profit_percent = 100 * factory.profit_base / factory.credits_in;
                factory.profit = factory.speed * factory.level * factory.profit_base;
                factory.next_turnover = factory.turnover + factory.speed * factory.credits_out;
                factory.next_profit = factory.profit + factory.speed * factory.profit_base;
                factory.upgrade_base = 0;
                factory.upgrade_resources = [];
                for (resource_id in factory.upgrade) {
                    if (!factory.upgrade.hasOwnProperty(resource_id)) {
                        continue;
                    }
                    resource_count = factory.upgrade[resource_id];
                    resource_value = itemValues[resource_id];
                    resource_transport_value = resource_value;
                    if (resource_id > 1) {
                        resource_transport_value = resource_value * (100 + transport_cost) / 100;
                    }
                    factory.upgrade_base += resource_count * resource_transport_value;
                    factory.upgrade_resources[resource_id] = {
                        id: resource_id,
                        base_count: resource_count,
                        base_value: resource_value,
                        next_count: resource_count * factory.next_level * factory.next_level,
                        next_value: resource_transport_value * factory.next_level * factory.next_level,
                        resource_price: resource_transport_value
                    };
                }
                factory.upgrade_total = factory.upgrade_base * factory.level * factory.level;
                factory.payback = false;
                if (factory.profit > 0) {
                    factory.payback = factory.upgrade_total / factory.profit_base / factory.speed / 24;
                }
                factory_list.push(factory);
            }
            var factory_count = factory_list.length;
            for (var factory_rank_index = 0; factory_rank_index < factory_count; factory_rank_index++) {
                var factory_rank = factory_list[factory_rank_index];
                if (factory_rank.profit > 0) {
                    var profit_rank = 1;
                    var payback_rank = 1;
                    for (var factory_profit_index = 0; factory_profit_index < factory_count; factory_profit_index++) {
                        var factory_profit = factory_list[factory_profit_index];
                        if (factory_profit.profit > factory_rank.profit) {
                            profit_rank++;
                        }
                        if (factory_profit.payback && factory_profit.payback < factory_rank.payback) {
                            payback_rank++;
                        }
                    }
                    factory_rank.profit_rank = profit_rank;
                    factory_rank.payback_rank_sort = payback_rank;
                    factory_rank.payback_rank = payback_rank;
                }
                else {
                    factory_rank.profit_rank = '';
                    factory_rank.payback_rank = '';
                    factory_rank.payback_rank_sort = factory_count + factory_rank.pos;
                }
            }
            // compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
            if ($scope.cache.factories) {
                if (angular.toJson($scope.cache.factories) !== angular.toJson(factory_list)) {
                    $scope.cache.factories = factory_list;
                }
            }
            else {
                $scope.cache.factories = factory_list;
            }
            return $scope.cache.factories;
        };
        $scope.recycling_list = function (recycling, itemValues, transport_cost) {
            var recycling_list = [];
            recycling.forEach(function (dbrr, recycling_id) {
                var rr = {};
                rr.id = recycling_id;
                rr.in_count = dbrr.in[recycling_id];
                rr.in_value = itemValues[recycling_id] * rr.in_count;
                rr.in_buy_value = rr.in_value * (100 + transport_cost) / 100;
                rr.out = [];
                rr.out_value = 0;
                for (var item_id in dbrr.out) {
                    if (!dbrr.out.hasOwnProperty(item_id)) {
                        continue;
                    }
                    var out = {};
                    out.item_id = item_id;
                    out.count = dbrr.out[item_id];
                    out.value = itemValues[item_id] * out.count;
                    rr.out.push(out);
                    rr.out_value += out.value;
                }
                rr.profit = rr.out_value - rr.in_buy_value;
                rr.profit_procent = 100 * rr.profit / rr.in_buy_value;
                rr.max_price = rr.out_value * 100 / (100 + transport_cost);
                this.push(rr);
            }, recycling_list);
            // compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
            if ($scope.cache.recycling) {
                if (angular.toJson($scope.cache.recycling) !== angular.toJson(recycling_list)) {
                    $scope.cache.recycling = recycling_list;
                }
            }
            else {
                $scope.cache.recycling = recycling_list;
            }
            return $scope.cache.recycling;
        };
        $scope.unit_list = function (units, itemValues, transport_cost) {
            var unit_list = [];
            units.forEach(function (dbur, unit_id) {
                var ur = {};
                ur.id = unit_id;
                ur.a = dbur.a;
                ur.aa = (ur.a < 0) && -ur.a || ur.a;
                ur.in = [];
                ur.out = [];
                ur.in_value = 0;
                ur.out_value = 0;
                for (var item_id in dbur.in) {
                    if (!dbur.in.hasOwnProperty(item_id)) {
                        continue;
                    }
                    var item = {};
                    item.item_id = item_id;
                    item.count = dbur.in[item_id];
                    item.value = itemValues[item_id] * item.count;
                    ur.in.push(item);
                    ur.in_value += item.value;
                }
                for (var item_id in dbur.out) {
                    if (!dbur.out.hasOwnProperty(item_id)) {
                        continue;
                    }
                    var item = {};
                    item.item_id = item_id;
                    item.count = dbur.out[item_id];
                    item.value = itemValues[item_id] * item.count;
                    ur.out.push(item);
                    ur.out_value += item.value;
                }
                ur.in_buy_value = ur.in_value * (100 + transport_cost) / 100;
                ur.profit = ur.out_value - ur.in_buy_value;
                ur.profit_procent = 100 * ur.profit / ur.in_buy_value;
                ur.max_price = ur.out_value * 100 / (100 + transport_cost);
                this.push(ur);
            }, unit_list);
            // compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
            if ($scope.cache.units) {
                if (angular.toJson($scope.cache.units) !== angular.toJson(unit_list)) {
                    console.log('cache.units updated');
                    console.log([$scope.cache.units, unit_list, angular.toJson($scope.cache.units), angular.toJson(unit_list)]);
                    $scope.cache.units = unit_list;
                }
            }
            else {
                $scope.cache.units = unit_list;
            }
            return $scope.cache.units;
        };
        $scope.resources_flow = function (itemValues, units, factories, factoryLevel, transport_cost, mines, gidi) {
            var factory_list = this.factory_list(factories, factoryLevel, itemValues, transport_cost);
            var resources_flow = {};
            itemValues.forEach(function (item_value, item_id) {
                resources_flow[item_id] = { id: item_id, in: 0, out: (mines[item_id] || 0), fin: false, fout: false, type: '' };
                resources_flow[item_id].in_plain = resources_flow[item_id].in;
                resources_flow[item_id].out_plain = resources_flow[item_id].out;
            }, resources_flow);
            for (var _i = 0, factory_list_1 = factory_list; _i < factory_list_1.length; _i++) {
                var factory = factory_list_1[_i];
                for (var item_id in factory.in) {
                    if (!factory.in.hasOwnProperty(item_id)) {
                        continue;
                    }
                    if (typeof (factory.in[item_id]) === "undefined") {
                        continue;
                    }
                    if (typeof (resources_flow[item_id]) === "undefined") {
                        continue;
                    }
                    resources_flow[item_id].fin = true;
                    if (factory.profit > 0) {
                        resources_flow[item_id].in_plain += factory.speed * factory.level * factory.in[item_id];
                        resources_flow[item_id].in += factory.speed * factory.level * factory.in[item_id];
                        if (factory.profit_rank <= gidi) {
                            resources_flow[item_id].in += factory.speed * factory.level * factory.in[item_id];
                        }
                    }
                }
                for (var item_id in factory.out) {
                    if (!factory.out.hasOwnProperty(item_id)) {
                        continue;
                    }
                    if (typeof (factory.out[item_id]) === "undefined") {
                        continue;
                    }
                    if (typeof (resources_flow[item_id]) === "undefined") {
                        continue;
                    }
                    resources_flow[item_id].fout = true;
                    if (factory.profit > 0) {
                        resources_flow[item_id].out_plain += factory.speed * factory.level * factory.out[item_id];
                        resources_flow[item_id].out += factory.speed * factory.level * factory.out[item_id];
                        if (factory.profit_rank <= gidi) {
                            resources_flow[item_id].out += factory.speed * factory.level * factory.out[item_id];
                        }
                    }
                }
            }
            resources_flow.list = [];
            resources_flow.in = 0;
            resources_flow.out = 0;
            resources_flow.profit = 0;
            itemValues.forEach(function (item_value, item_id) {
                if (resources_flow[item_id].fin) {
                    if (resources_flow[item_id].fout) {
                        resources_flow[item_id].type = 'middle';
                        if (resources_flow[item_id].in < resources_flow[item_id].out) {
                            resources_flow[item_id].status = 'good';
                        }
                        else if (resources_flow[item_id].in === resources_flow[item_id].out) {
                            resources_flow[item_id].status = '';
                        }
                        else if (resources_flow[item_id].out <= 0) {
                            resources_flow[item_id].status = 'buy';
                        }
                        else {
                            resources_flow[item_id].status = 'bleading';
                        }
                        resources_flow[item_id].sort_type = 3;
                    }
                    else {
                        resources_flow[item_id].type = 'resource';
                        resources_flow[item_id].sort_type = 2;
                        if (resources_flow[item_id].in < resources_flow[item_id].out) {
                            resources_flow[item_id].status = 'good';
                        }
                        else if (resources_flow[item_id].in === resources_flow[item_id].out) {
                            resources_flow[item_id].status = '';
                        }
                        else if (resources_flow[item_id].out <= 0) {
                            resources_flow[item_id].status = 'buy';
                        }
                        else {
                            resources_flow[item_id].status = 'bleading';
                        }
                    }
                }
                else {
                    if (resources_flow[item_id].fout) {
                        resources_flow[item_id].type = 'product';
                        resources_flow[item_id].status = '';
                        resources_flow[item_id].sort_type = 3;
                    }
                    else {
                        resources_flow[item_id].type = 'loot';
                        resources_flow[item_id].sort_type = 4;
                        resources_flow[item_id].status = '';
                    }
                }
                if (units[item_id]) {
                    resources_flow[item_id].type = 'unit';
                    resources_flow[item_id].sort_type = 5;
                    resources_flow[item_id].status = '';
                }
                resources_flow.in += resources_flow[item_id].in * item_value;
                resources_flow.out += resources_flow[item_id].out * item_value;
                resources_flow[item_id].profit = (resources_flow[item_id].out - resources_flow[item_id].in) * item_value;
                if (item_id === 1 || item_id === '1') {
                    resources_flow[item_id].sort_type = 1;
                    resources_flow[item_id].status = '';
                }
                else if (resources_flow[item_id].profit < 0) {
                    resources_flow[item_id].profit = resources_flow[item_id].profit * (100 + transport_cost) / 100;
                }
                resources_flow.profit += resources_flow[item_id].profit;
                resources_flow[item_id].sort_value = resources_flow[item_id].sort_type + $scope.itemNames[item_id];
                resources_flow.list.push(resources_flow[item_id]);
            }, resources_flow);
            if ($scope.sums.flow.in !== resources_flow.in)
                $scope.sums.flow.in = resources_flow.in;
            if ($scope.sums.flow.out !== resources_flow.out)
                $scope.sums.flow.out = resources_flow.out;
            if ($scope.sums.flow.profit !== resources_flow.profit)
                $scope.sums.flow.profit = resources_flow.profit;
            // compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
            if ($scope.cache.flow) {
                if (angular.toJson($scope.cache.flow) !== angular.toJson(resources_flow.list)) {
                    $scope.cache.flow = resources_flow.list;
                }
            }
            else {
                $scope.cache.flow = resources_flow.list;
            }
            return $scope.cache.flow;
        };
        $scope.ask_mine = function (id) {
            var i = prompt($scope.itemNames[id] + ' per hour', $scope.userData.mines[id]);
            if (i !== null) {
                $scope.userData.mines[id] = parseInt(i);
            }
        };
        $scope.tab = "Recycling";
        if (!window.puggan) {
            window.puggan = {};
        }
        window.puggan.debug_scope = $scope;
    }
]);
app.component('resource', {
    template: '<span ng-bind="nrformat(amount)" title="{{ titleformat(resource_id, amount, itemValues[resource_id], itemNames) }}"></span>' +
        '<img class="tr_icon" title="{{ titleformat(resource_id, amount, itemValues[resource_id], itemNames) }}" ng-src="https://www.resources-game.ch/images/appimages/res{{resource_id}}.png">',
    controller: function ($scope) {
        this.$onInit = function () {
            $scope.resource_id = this.resource;
            $scope.amount = this.amount;
        };
        $scope.resource_id = this.resource;
        $scope.amount = this.amount;
        $scope.nrformat = $scope.$parent.nrformat;
        $scope.titleformat = $scope.$parent.titleformat;
        $scope.itemValues = $scope.$parent.itemValues;
        $scope.itemNames = $scope.$parent.itemNames;
    },
    bindings: {
        resource: '<',
        amount: '<'
    }
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc291cmNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkVBLHNCQUFzQjtBQUN0QixJQUFJLE1BQU0sR0FBRztJQUNaLE1BQU0sRUFBRSx5Q0FBeUM7SUFDakQsVUFBVSxFQUFFLGlDQUFpQztJQUM3QyxXQUFXLEVBQUUsd0NBQXdDO0lBQ3JELFNBQVMsRUFBRSxpQkFBaUI7SUFDNUIsYUFBYSxFQUFFLDZCQUE2QjtJQUM1QyxpQkFBaUIsRUFBRSxhQUFhO0NBQ2hDLENBQUM7QUFDRixRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRS9CLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBRTNELEdBQUcsQ0FBQyxVQUFVLENBQ2IsV0FBVyxFQUNYO0lBQ0MsUUFBUTtJQUNSLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsVUFBUyxNQUFNLEVBQUUsYUFBYSxFQUFFLGVBQWU7UUFFOUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxh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LENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQzthQUNuQztRQUNGLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsVUFBUyxLQUFLO1lBRWpDLElBQUcsS0FBSyxHQUFHLENBQUM7Z0JBQUUsT0FBTyxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBRyxDQUFDLEdBQUcsRUFBRTtnQkFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDM0IsSUFBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzlFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1gsSUFBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzlFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1gsSUFBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzlFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1gsSUFBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQUUs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QUFDO1FBQ25DLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM1QixNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUM5QyxNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQzdDLENBQUM7SUFDRCxRQUFRLEVBQUU7UUFDVCxRQUFRLEVBQUUsR0FBRztRQUNiLE1BQU0sRUFBRSxHQUFHO0tBQ1g7Q0FDRCxDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3Jlc291cmNlcy50c1wiKTtcbiIsIi8vIEluaXRpYWxpemUgRmlyZWJhc2VcbmxldCBjb25maWcgPSB7XG5cdGFwaUtleTogXCJBSXphU3lEQnFIWXJTVGMyMVlYWFZWbDNmT0NpLTMtVWZEaTBWbWtcIixcblx0YXV0aERvbWFpbjogXCJyZXNvdXJjZXMtZjZjY2YuZmlyZWJhc2VhcHAuY29tXCIsXG5cdGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcmVzb3VyY2VzLWY2Y2NmLmZpcmViYXNlaW8uY29tXCIsXG5cdHByb2plY3RJZDogXCJyZXNvdXJjZXMtZjZjY2ZcIixcblx0c3RvcmFnZUJ1Y2tldDogXCJyZXNvdXJjZXMtZjZjY2YuYXBwc3BvdC5jb21cIixcblx0bWVzc2FnaW5nU2VuZGVySWQ6IFwiNTkzNDQ5MDUyMzVcIlxufTtcbmZpcmViYXNlLmluaXRpYWxpemVBcHAoY29uZmlnKTtcblxubGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKFwiYW5nRmlyZVJlc291cmNlc1wiLCBbXCJmaXJlYmFzZVwiXSk7XG5cbmFwcC5jb250cm9sbGVyKFxuXHQnUmVzb3VyY2VzJyxcblx0W1xuXHRcdFwiJHNjb3BlXCIsXG5cdFx0XCIkZmlyZWJhc2VBdXRoXCIsXG5cdFx0XCIkZmlyZWJhc2VPYmplY3RcIixcblx0XHRmdW5jdGlvbigkc2NvcGUsICRmaXJlYmFzZUF1dGgsICRmaXJlYmFzZU9iamVjdClcblx0XHR7XG5cdFx0XHQkc2NvcGUuYXV0aE9iaiA9ICRmaXJlYmFzZUF1dGgoKTtcblxuXHRcdFx0JHNjb3BlLnNpZ25lZEluID0gZmFsc2U7XG5cdFx0XHQkc2NvcGUuc2lnbmluZ0luID0gdHJ1ZTtcblx0XHRcdCRzY29wZS51c2VybmFtZSA9ICdBbm9ueW1vdXMnO1xuXHRcdFx0JHNjb3BlLnVzZXJJbWFnZSA9IG51bGw7XG5cdFx0XHQkc2NvcGUuc3VtcyA9IHtmbG93OiB7aW46IDAsIG91dDogMCwgcHJvZml0OiAwfX07XG5cdFx0XHQkc2NvcGUuY2FjaGUgPSB7fTtcblx0XHRcdGxldCBsb2FkVXNlcmRhdGEgPSBmdW5jdGlvbih1aWQpIHtcblx0XHRcdFx0aWYoIXVpZCkge1xuXHRcdFx0XHRcdCRzY29wZS51c2VyRGF0YSA9IHt0cmFuc3BvcnRfY29zdDogMTUsIGZsb3dfdGltZTogXCIxXCIsIGdpZGk6IDAsIGZhY3RvcnlMZXZlbDoge30sIG1pbmVzOiB7fSwgd2FyZWhvdXNlOiB7fSwgZmFrZTogdHJ1ZX07XG5cdFx0XHRcdFx0cmV0dXJuICRzY29wZS51c2VyRGF0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgdXNlckRhdGEgPSAkZmlyZWJhc2VPYmplY3QoJHNjb3BlLmRiLmNoaWxkKCd1c2VyRGF0YS8nICsgdWlkKSk7XG5cdFx0XHRcdHVzZXJEYXRhLiRsb2FkZWQoKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgdXBkYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0aWYoIXVzZXJEYXRhLnRyYW5zcG9ydF9jb3N0KVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR1c2VyRGF0YS50cmFuc3BvcnRfY29zdCA9IDE1O1xuXHRcdFx0XHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKCF1c2VyRGF0YS5mbG93X3RpbWUpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHVzZXJEYXRhLmZsb3dfdGltZSA9IDE7XG5cdFx0XHRcdFx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoIXVzZXJEYXRhLmdpZGkgJiYgdXNlckRhdGEuZ2lkaSA9PT0gMClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dXNlckRhdGEuZ2lkaSA9IDA7XG5cdFx0XHRcdFx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoIXVzZXJEYXRhLm1pbmVzKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR1c2VyRGF0YS5taW5lcyA9IHt9O1xuXHRcdFx0XHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKCF1c2VyRGF0YS53YXJlaG91c2UpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHVzZXJEYXRhLndhcmVob3VzZSA9IHt9O1xuXHRcdFx0XHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKCF1c2VyRGF0YS5mYWN0b3J5TGV2ZWwpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHVzZXJEYXRhLmZhY3RvcnlMZXZlbCA9IHt9O1xuXHRcdFx0XHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHVwZGF0ZWQpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHVzZXJEYXRhLiRzYXZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR1c2VyRGF0YS4kYmluZFRvKCRzY29wZSwgXCJ1c2VyRGF0YVwiKTtcblx0XHRcdFx0XHRcdGlmKCEkc2NvcGUudXNlckRhdGEudHJhbnNwb3J0X2Nvc3QgfHwgJHNjb3BlLnVzZXJEYXRhLnRyYW5zcG9ydF9jb3N0IDwgNSB8fCAkc2NvcGUudXNlckRhdGEudHJhbnNwb3J0X2Nvc3QgPiAxNSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnVzZXJEYXRhLnRyYW5zcG9ydF9jb3N0ID0gMTU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiAkc2NvcGUudXNlckRhdGE7XG5cdFx0XHR9O1xuXG5cdFx0XHQkc2NvcGUuYXV0aE9iai4kb25BdXRoU3RhdGVDaGFuZ2VkKFxuXHRcdFx0XHRmdW5jdGlvbihmaXJlYmFzZVVzZXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZihmaXJlYmFzZVVzZXIpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJTaWduZWQgaW4gYXM6XCIsIGZpcmViYXNlVXNlci51aWQpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZmlyZWJhc2VVc2VyKTtcblx0XHRcdFx0XHRcdCRzY29wZS5zaWduZWRJbiA9IHRydWU7XG5cdFx0XHRcdFx0XHQkc2NvcGUudGFiID0gXCJGbG93XCI7XG5cdFx0XHRcdFx0XHQkc2NvcGUudXNlcm5hbWUgPSBmaXJlYmFzZVVzZXIuZGlzcGxheU5hbWU7XG5cdFx0XHRcdFx0XHQkc2NvcGUudXNlckltYWdlID0gZmlyZWJhc2VVc2VyLnBob3RvVVJMO1xuXG5cdFx0XHRcdFx0XHRsZXQgbGlua2VkVXNlciA9ICRmaXJlYmFzZU9iamVjdCgkc2NvcGUuZGIuY2hpbGQoJ3VzZXJMaW5rcy8nICsgZmlyZWJhc2VVc2VyLnVpZCkpO1xuXHRcdFx0XHRcdFx0bGlua2VkVXNlclxuXHRcdFx0XHRcdFx0XHQuJGxvYWRlZCgpXG5cdFx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmKGxpbmtlZFVzZXIuJHZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0bG9hZFVzZXJkYXRhKGxpbmtlZFVzZXIuJHZhbHVlLCBmaXJlYmFzZVVzZXIpO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGxvYWRVc2VyZGF0YShmaXJlYmFzZVVzZXIudWlkLCBmaXJlYmFzZVVzZXIpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0bG9hZFVzZXJkYXRhKGZpcmViYXNlVXNlci51aWQsIGZpcmViYXNlVXNlcik7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQ7XG5cdFx0XHRcdFx0XHRsZXQgdXNlckluZm8gPSAkZmlyZWJhc2VPYmplY3QoJHNjb3BlLmRiLmNoaWxkKCd1c2VySW5mby8nICsgZmlyZWJhc2VVc2VyLnVpZCkpO1xuXHRcdFx0XHRcdFx0dXNlckluZm9cblx0XHRcdFx0XHRcdFx0LiRsb2FkZWQoKVxuXHRcdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHR1c2VySW5mby5uYW1lID0gZmlyZWJhc2VVc2VyLmRpc3BsYXlOYW1lO1xuXHRcdFx0XHRcdFx0XHRcdHVzZXJJbmZvLmVtYWlsID0gZmlyZWJhc2VVc2VyLmVtYWlsO1xuXHRcdFx0XHRcdFx0XHRcdHVzZXJJbmZvLnBob3RvVVJMID0gZmlyZWJhc2VVc2VyLnBob3RvVVJMO1xuXHRcdFx0XHRcdFx0XHRcdHVzZXJJbmZvLnByb3ZpZGVySWQgPSBmaXJlYmFzZVVzZXIucHJvdmlkZXJEYXRhWzBdLnByb3ZpZGVySWQ7XG5cdFx0XHRcdFx0XHRcdFx0dXNlckluZm8udWlkID0gZmlyZWJhc2VVc2VyLnByb3ZpZGVyRGF0YVswXS51aWQ7XG5cdFx0XHRcdFx0XHRcdFx0dXNlckluZm8uJHNhdmUoKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlNpZ25lZCBvdXRcIik7XG5cdFx0XHRcdFx0XHQkc2NvcGUuc2lnbmVkSW4gPSBmYWxzZTtcblx0XHRcdFx0XHRcdCRzY29wZS51c2VybmFtZSA9ICdBbm9ueW1vdXMnO1xuXHRcdFx0XHRcdFx0JHNjb3BlLnVzZXJJbWFnZSA9IG51bGw7XG5cdFx0XHRcdFx0XHRsb2FkVXNlcmRhdGEobnVsbCwgbnVsbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCRzY29wZS5zaWduaW5nSW4gPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0JHNjb3BlLnNpZ25PdXQgPSBmdW5jdGlvbigpXG5cdFx0XHR7XG5cdFx0XHRcdCRzY29wZS5hdXRoT2JqLiRzaWduT3V0KCk7XG5cdFx0XHR9O1xuXG5cdFx0XHQkc2NvcGUuc2lnbkluID0gZnVuY3Rpb24oYXV0aF9wcm92aWRlcilcblx0XHRcdHtcblx0XHRcdFx0JHNjb3BlLmF1dGhPYmpcblx0XHRcdFx0XHQuJHNpZ25JbldpdGhSZWRpcmVjdChhdXRoX3Byb3ZpZGVyKVxuXHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZDpcIiwgZXJyb3IpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHR9O1xuXG5cdFx0XHQkc2NvcGUuZGIgPSBmaXJlYmFzZS5kYXRhYmFzZSgpXG5cdFx0XHRcdC5yZWYoKTtcblx0XHRcdGxldCBnYW1lRGF0YSA9ICRzY29wZS5kYi5jaGlsZCgnZ2FtZURhdGEnKTtcblx0XHRcdCRzY29wZS5mYWN0b3JpZXMgPSAkZmlyZWJhc2VPYmplY3QoZ2FtZURhdGEuY2hpbGQoJ2ZhY3RvcmllcycpKTtcblx0XHRcdCRzY29wZS5yZWN5Y2xpbmcgPSAkZmlyZWJhc2VPYmplY3QoZ2FtZURhdGEuY2hpbGQoJ3JlY3ljbGluZycpKTtcblx0XHRcdCRzY29wZS51bml0cyA9ICRmaXJlYmFzZU9iamVjdChnYW1lRGF0YS5jaGlsZCgndW5pdHMnKSk7XG5cdFx0XHQkc2NvcGUuaXRlbU5hbWVzID0gJGZpcmViYXNlT2JqZWN0KGdhbWVEYXRhLmNoaWxkKCdpdGVtcycpKTtcblx0XHRcdCRzY29wZS5pdGVtVmFsdWVzID0gJGZpcmViYXNlT2JqZWN0KCRzY29wZS5kYi5jaGlsZCgnYXBpRGF0YS9pdGVtVmFsdWVzJykpO1xuXHRcdFx0JHNjb3BlLnVzZXJEYXRhID0ge3RyYW5zcG9ydF9jb3N0OiAxNSwgZmxvd190aW1lOiBcIjFcIiwgZmFjdG9yeUxldmVsOiB7fSwgbWluZXM6IHt9LCBmYWtlOiB0cnVlfTtcblx0XHRcdCRzY29wZS5nZXRPYmplY3RLZXlzID0gZnVuY3Rpb24obylcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKG8pO1xuXHRcdFx0fTtcblx0XHRcdCRzY29wZS5ucmZvcm1hdCA9IGZ1bmN0aW9uKG9yZ19ucilcblx0XHRcdHtcblx0XHRcdFx0bGV0IG5yID0gcGFyc2VGbG9hdChvcmdfbnIpO1xuXHRcdFx0XHRpZihuciA8IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gXCItXCIgKyB0aGlzLm5yZm9ybWF0KC1ucik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobnIgPCAxMDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyc2VJbnQobnIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHN1Zml4X25yO1xuXHRcdFx0XHRsZXQgc3VmaXhfbGlzdCA9IFsnJywgJyBrJywgJyBNJywgJyBHJywgJyBUJywgJyBQJywgJyBFJywgJyBaJywgJyBZJ107XG5cdFx0XHRcdGZvcihzdWZpeF9uciA9IDA7IHN1Zml4X25yIDwgc3VmaXhfbGlzdC5sZW5ndGg7IHN1Zml4X25yKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZihuciA8IDEwMDApXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5yID0gbnIgLyAxMDAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYobnIgPCAxMDAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIG5yLnRvUHJlY2lzaW9uKDMpICsgc3VmaXhfbGlzdFtzdWZpeF9ucl07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZihvcmdfbnIudG9QcmVjaXNpb24pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gb3JnX25yLnRvUHJlY2lzaW9uKDMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBvcmdfbnI7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHQkc2NvcGUucHJvY2VudGZvcm1hdCA9IGZ1bmN0aW9uKG9yZ19uciwgYXBwZW5kID0gJyUnKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgbnIgPSBwYXJzZUZsb2F0KG9yZ19ucik7XG5cdFx0XHRcdGlmKG5yIDwgMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBcIi1cIiArIHRoaXMucHJvY2VudGZvcm1hdCgtbnIsIGFwcGVuZCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihuciA8IDEwMDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gbnIudG9QcmVjaXNpb24oMykgKyBhcHBlbmQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIE1hdGgucm91bmQob3JnX25yKSArIGFwcGVuZDtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdCRzY29wZS50aW1lZm9ybWF0ID0gZnVuY3Rpb24oaG91cnMpXG5cdFx0XHR7XG5cdFx0XHRcdGlmKGhvdXJzIDwgMCkgcmV0dXJuICctJyArICRzY29wZS50aW1lZm9ybWF0KC1ob3Vycyk7XG5cdFx0XHRcdGxldCB2ID0gMzYwMCAqIGhvdXJzO1xuXHRcdFx0XHRpZih2IDwgNjApIHJldHVybiB2ICsgJyBzJztcblx0XHRcdFx0aWYodiA8IDYwICogNjApIHJldHVybiBNYXRoLmZsb29yKHYgLyA2MCkgKyAnIG0gJyArIE1hdGguZmxvb3IodiAlIDYwKSArICcgcyc7XG5cdFx0XHRcdHYgPSB2IC8gNjA7XG5cdFx0XHRcdGlmKHYgPCAyNCAqIDYwKSByZXR1cm4gTWF0aC5mbG9vcih2IC8gNjApICsgJyBoICcgKyBNYXRoLmZsb29yKHYgJSA2MCkgKyAnIG0nO1xuXHRcdFx0XHR2ID0gdiAvIDYwO1xuXHRcdFx0XHRpZih2IDwgMzEgKiAyNCkgcmV0dXJuIE1hdGguZmxvb3IodiAvIDI0KSArICcgZCAnICsgTWF0aC5mbG9vcih2ICUgMjQpICsgJyBoJztcblx0XHRcdFx0diA9IHYgLyAyNDtcblx0XHRcdFx0aWYodiA8IDcgKiA1MikgcmV0dXJuIE1hdGguZmxvb3IodiAvIDcpICsgJyB3ICcgKyBNYXRoLmZsb29yKHYgJSAyNCkgKyAnIGQnO1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5mbG9vcih2IC8gMzY1KSArICcgeSAnICsgTWF0aC5mbG9vcigodiAlIDM2NSkvNykgKyAnIHcnO1xuXHRcdFx0fTtcblx0XHRcdCRzY29wZS50aXRsZWZvcm1hdCA9IGZ1bmN0aW9uKHJlc291cmNlX2lkLCBhbW91bnQsIGl0ZW12YWx1ZSwgaXRlbU5hbWVzKVxuXHRcdFx0e1xuXHRcdFx0XHRpZihyZXNvdXJjZV9pZCA9PT0gMSB8fCByZXNvdXJjZV9pZCA9PT0gJzEnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMubnJmb3JtYXQoYW1vdW50KSArICcgJyArIGl0ZW1OYW1lc1sxXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5ucmZvcm1hdChhbW91bnQpICsgJyAnICsgaXRlbU5hbWVzW3Jlc291cmNlX2lkXSArICcgPSAnICsgdGhpcy5ucmZvcm1hdChhbW91bnQgKiBpdGVtdmFsdWUpICsgJyAnICsgaXRlbU5hbWVzWzFdO1xuXG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLmZhY3RvcnlfbGlzdCA9IGZ1bmN0aW9uKGZhY3RvcmllcywgZmFjdG9yeV9sZXZlbHMsIGl0ZW1WYWx1ZXMsIHRyYW5zcG9ydF9jb3N0KVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgZmFjdG9yeV9saXN0ID0gW107XG5cdFx0XHRcdGZvcihsZXQgZmFjdG9yeV9pZCBpbiBmYWN0b3JpZXMpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZighZmFjdG9yaWVzLmhhc093blByb3BlcnR5KGZhY3RvcnlfaWQpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZighKHBhcnNlSW50KGZhY3RvcnlfaWQpID4gMCkpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IHJlc291cmNlX2NvdW50ID0gMDtcblx0XHRcdFx0XHRsZXQgcmVzb3VyY2VfdmFsdWUgPSAwO1xuXHRcdFx0XHRcdGxldCByZXNvdXJjZV90cmFuc3BvcnRfdmFsdWUgPSAwO1xuXG5cdFx0XHRcdFx0bGV0IGZhY3RvcnkgPSBmYWN0b3JpZXNbZmFjdG9yeV9pZF07XG5cdFx0XHRcdFx0ZmFjdG9yeS5mYWN0b3J5X2lkID0gZmFjdG9yeV9pZDtcblx0XHRcdFx0XHRmYWN0b3J5LmxldmVsID0gZmFjdG9yeV9sZXZlbHNbZmFjdG9yeV9pZF07XG5cdFx0XHRcdFx0ZmFjdG9yeS5uZXh0X2xldmVsID0gZmFjdG9yeS5sZXZlbCArIDE7XG5cblx0XHRcdFx0XHRmYWN0b3J5LmNyZWRpdHNfb3V0ID0gMDtcblx0XHRcdFx0XHRmb3IocmVzb3VyY2VfaWQgaW4gZmFjdG9yeS5vdXQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYoIWZhY3Rvcnkub3V0Lmhhc093blByb3BlcnR5KHJlc291cmNlX2lkKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJlc291cmNlX2NvdW50ID0gZmFjdG9yeS5vdXRbcmVzb3VyY2VfaWRdO1xuXHRcdFx0XHRcdFx0cmVzb3VyY2VfdmFsdWUgPSBpdGVtVmFsdWVzW3Jlc291cmNlX2lkXTtcblx0XHRcdFx0XHRcdGZhY3RvcnkuY3JlZGl0c19vdXQgKz0gcmVzb3VyY2VfY291bnQgKiByZXNvdXJjZV92YWx1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmYWN0b3J5LmNyZWRpdHNfaW4gPSAwXG5cdFx0XHRcdFx0Zm9yKHJlc291cmNlX2lkIGluIGZhY3RvcnkuaW4pXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYoIWZhY3RvcnkuaW4uaGFzT3duUHJvcGVydHkocmVzb3VyY2VfaWQpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmVzb3VyY2VfY291bnQgPSBmYWN0b3J5LmluW3Jlc291cmNlX2lkXTtcblx0XHRcdFx0XHRcdHJlc291cmNlX3ZhbHVlID0gaXRlbVZhbHVlc1tyZXNvdXJjZV9pZF07XG5cdFx0XHRcdFx0XHRyZXNvdXJjZV90cmFuc3BvcnRfdmFsdWUgPSByZXNvdXJjZV92YWx1ZTtcblx0XHRcdFx0XHRcdGlmKHJlc291cmNlX2lkID4gMSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VfdHJhbnNwb3J0X3ZhbHVlID0gcmVzb3VyY2VfdmFsdWUgKiAoMTAwICsgdHJhbnNwb3J0X2Nvc3QpIC8gMTAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZmFjdG9yeS5jcmVkaXRzX2luICs9IHJlc291cmNlX2NvdW50ICogcmVzb3VyY2VfdHJhbnNwb3J0X3ZhbHVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGZhY3RvcnkudHVybm92ZXIgPSBmYWN0b3J5LnNwZWVkICogZmFjdG9yeS5sZXZlbCAqIGZhY3RvcnkuY3JlZGl0c19vdXQ7XG5cdFx0XHRcdFx0ZmFjdG9yeS5wcm9maXRfYmFzZSA9IGZhY3RvcnkuY3JlZGl0c19vdXQgLSBmYWN0b3J5LmNyZWRpdHNfaW47XG5cdFx0XHRcdFx0ZmFjdG9yeS5wcm9maXRfcGVyY2VudCA9IDEwMCAqIGZhY3RvcnkucHJvZml0X2Jhc2UgLyBmYWN0b3J5LmNyZWRpdHNfaW47XG5cdFx0XHRcdFx0ZmFjdG9yeS5wcm9maXQgPSBmYWN0b3J5LnNwZWVkICogZmFjdG9yeS5sZXZlbCAqIGZhY3RvcnkucHJvZml0X2Jhc2U7XG5cblx0XHRcdFx0XHRmYWN0b3J5Lm5leHRfdHVybm92ZXIgPSBmYWN0b3J5LnR1cm5vdmVyICsgZmFjdG9yeS5zcGVlZCAqIGZhY3RvcnkuY3JlZGl0c19vdXQ7XG5cdFx0XHRcdFx0ZmFjdG9yeS5uZXh0X3Byb2ZpdCA9IGZhY3RvcnkucHJvZml0ICsgZmFjdG9yeS5zcGVlZCAqIGZhY3RvcnkucHJvZml0X2Jhc2U7XG5cblx0XHRcdFx0XHRmYWN0b3J5LnVwZ3JhZGVfYmFzZSA9IDA7XG5cdFx0XHRcdFx0ZmFjdG9yeS51cGdyYWRlX3Jlc291cmNlcyA9IFtdO1xuXHRcdFx0XHRcdGZvcihyZXNvdXJjZV9pZCBpbiBmYWN0b3J5LnVwZ3JhZGUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYoIWZhY3RvcnkudXBncmFkZS5oYXNPd25Qcm9wZXJ0eShyZXNvdXJjZV9pZCkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXNvdXJjZV9jb3VudCA9IGZhY3RvcnkudXBncmFkZVtyZXNvdXJjZV9pZF07XG5cdFx0XHRcdFx0XHRyZXNvdXJjZV92YWx1ZSA9IGl0ZW1WYWx1ZXNbcmVzb3VyY2VfaWRdO1xuXHRcdFx0XHRcdFx0cmVzb3VyY2VfdHJhbnNwb3J0X3ZhbHVlID0gcmVzb3VyY2VfdmFsdWU7XG5cdFx0XHRcdFx0XHRpZihyZXNvdXJjZV9pZCA+IDEpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJlc291cmNlX3RyYW5zcG9ydF92YWx1ZSA9IHJlc291cmNlX3ZhbHVlICogKDEwMCArIHRyYW5zcG9ydF9jb3N0KSAvIDEwMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGZhY3RvcnkudXBncmFkZV9iYXNlICs9IHJlc291cmNlX2NvdW50ICogcmVzb3VyY2VfdHJhbnNwb3J0X3ZhbHVlO1xuXHRcdFx0XHRcdFx0ZmFjdG9yeS51cGdyYWRlX3Jlc291cmNlc1tyZXNvdXJjZV9pZF0gPSB7XG5cdFx0XHRcdFx0XHRcdGlkOiByZXNvdXJjZV9pZCxcblx0XHRcdFx0XHRcdFx0YmFzZV9jb3VudDogcmVzb3VyY2VfY291bnQsXG5cdFx0XHRcdFx0XHRcdGJhc2VfdmFsdWU6IHJlc291cmNlX3ZhbHVlLFxuXHRcdFx0XHRcdFx0XHRuZXh0X2NvdW50OiByZXNvdXJjZV9jb3VudCAqIGZhY3RvcnkubmV4dF9sZXZlbCAqIGZhY3RvcnkubmV4dF9sZXZlbCxcblx0XHRcdFx0XHRcdFx0bmV4dF92YWx1ZTogcmVzb3VyY2VfdHJhbnNwb3J0X3ZhbHVlICogZmFjdG9yeS5uZXh0X2xldmVsICogZmFjdG9yeS5uZXh0X2xldmVsLFxuXHRcdFx0XHRcdFx0XHRyZXNvdXJjZV9wcmljZTogcmVzb3VyY2VfdHJhbnNwb3J0X3ZhbHVlXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmYWN0b3J5LnVwZ3JhZGVfdG90YWwgPSBmYWN0b3J5LnVwZ3JhZGVfYmFzZSAqIGZhY3RvcnkubGV2ZWwgKiBmYWN0b3J5LmxldmVsO1xuXHRcdFx0XHRcdGZhY3RvcnkucGF5YmFjayA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmKGZhY3RvcnkucHJvZml0ID4gMClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmYWN0b3J5LnBheWJhY2sgPSBmYWN0b3J5LnVwZ3JhZGVfdG90YWwgLyBmYWN0b3J5LnByb2ZpdF9iYXNlIC8gZmFjdG9yeS5zcGVlZCAvIDI0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmYWN0b3J5X2xpc3QucHVzaChmYWN0b3J5KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgZmFjdG9yeV9jb3VudCA9IGZhY3RvcnlfbGlzdC5sZW5ndGg7XG5cdFx0XHRcdGZvcihsZXQgZmFjdG9yeV9yYW5rX2luZGV4ID0gMDsgZmFjdG9yeV9yYW5rX2luZGV4IDwgZmFjdG9yeV9jb3VudDsgZmFjdG9yeV9yYW5rX2luZGV4KyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgZmFjdG9yeV9yYW5rID0gZmFjdG9yeV9saXN0W2ZhY3RvcnlfcmFua19pbmRleF07XG5cdFx0XHRcdFx0aWYoZmFjdG9yeV9yYW5rLnByb2ZpdCA+IDApXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IHByb2ZpdF9yYW5rID0gMTtcblx0XHRcdFx0XHRcdGxldCBwYXliYWNrX3JhbmsgPSAxO1xuXHRcdFx0XHRcdFx0Zm9yKGxldCBmYWN0b3J5X3Byb2ZpdF9pbmRleCA9IDA7IGZhY3RvcnlfcHJvZml0X2luZGV4IDwgZmFjdG9yeV9jb3VudDsgZmFjdG9yeV9wcm9maXRfaW5kZXgrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGZhY3RvcnlfcHJvZml0ID0gZmFjdG9yeV9saXN0W2ZhY3RvcnlfcHJvZml0X2luZGV4XTtcblx0XHRcdFx0XHRcdFx0aWYoZmFjdG9yeV9wcm9maXQucHJvZml0ID4gZmFjdG9yeV9yYW5rLnByb2ZpdClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHByb2ZpdF9yYW5rKys7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZmFjdG9yeV9wcm9maXQucGF5YmFjayAmJiBmYWN0b3J5X3Byb2ZpdC5wYXliYWNrIDwgZmFjdG9yeV9yYW5rLnBheWJhY2spXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRwYXliYWNrX3JhbmsrKztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZmFjdG9yeV9yYW5rLnByb2ZpdF9yYW5rID0gcHJvZml0X3Jhbms7XG5cdFx0XHRcdFx0XHRmYWN0b3J5X3JhbmsucGF5YmFja19yYW5rX3NvcnQgPSBwYXliYWNrX3Jhbms7XG5cdFx0XHRcdFx0XHRmYWN0b3J5X3JhbmsucGF5YmFja19yYW5rID0gcGF5YmFja19yYW5rO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZmFjdG9yeV9yYW5rLnByb2ZpdF9yYW5rID0gJyc7XG5cdFx0XHRcdFx0XHRmYWN0b3J5X3JhbmsucGF5YmFja19yYW5rID0gJyc7XG5cdFx0XHRcdFx0XHRmYWN0b3J5X3JhbmsucGF5YmFja19yYW5rX3NvcnQgPSBmYWN0b3J5X2NvdW50ICsgZmFjdG9yeV9yYW5rLnBvcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjb21wYXJlIHdpdGggY2FjaGUsIHJldHVybiBjYWNoZSBpZiBlcXVhbCwgc28gYW5ndWxhciBkb24ndCBnZXQgc3R1Y2sgaW46IFwiRXJyb3I6ICRyb290U2NvcGU6aW5mZGlnXCJcblx0XHRcdFx0aWYoJHNjb3BlLmNhY2hlLmZhY3Rvcmllcylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmKGFuZ3VsYXIudG9Kc29uKCRzY29wZS5jYWNoZS5mYWN0b3JpZXMpICE9PSBhbmd1bGFyLnRvSnNvbihmYWN0b3J5X2xpc3QpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRzY29wZS5jYWNoZS5mYWN0b3JpZXMgPSBmYWN0b3J5X2xpc3Q7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCRzY29wZS5jYWNoZS5mYWN0b3JpZXMgPSBmYWN0b3J5X2xpc3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICRzY29wZS5jYWNoZS5mYWN0b3JpZXM7XG5cdFx0XHR9O1xuXHRcdFx0JHNjb3BlLnJlY3ljbGluZ19saXN0ID0gZnVuY3Rpb24ocmVjeWNsaW5nLCBpdGVtVmFsdWVzLCB0cmFuc3BvcnRfY29zdClcblx0XHRcdHtcblx0XHRcdFx0bGV0IHJlY3ljbGluZ19saXN0ID0gW107XG5cdFx0XHRcdHJlY3ljbGluZy5mb3JFYWNoKFxuXHRcdFx0XHRcdGZ1bmN0aW9uKGRicnIsIHJlY3ljbGluZ19pZClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgcnIgPSB7fTtcblx0XHRcdFx0XHRcdHJyLmlkID0gcmVjeWNsaW5nX2lkO1xuXHRcdFx0XHRcdFx0cnIuaW5fY291bnQgPSBkYnJyLmluW3JlY3ljbGluZ19pZF07XG5cdFx0XHRcdFx0XHRyci5pbl92YWx1ZSA9IGl0ZW1WYWx1ZXNbcmVjeWNsaW5nX2lkXSAqIHJyLmluX2NvdW50O1xuXHRcdFx0XHRcdFx0cnIuaW5fYnV5X3ZhbHVlID0gcnIuaW5fdmFsdWUgKiAoMTAwICsgdHJhbnNwb3J0X2Nvc3QpIC8gMTAwO1xuXG5cdFx0XHRcdFx0XHRyci5vdXQgPSBbXTtcblx0XHRcdFx0XHRcdHJyLm91dF92YWx1ZSA9IDA7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgaXRlbV9pZCBpbiBkYnJyLm91dClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWYoIWRicnIub3V0Lmhhc093blByb3BlcnR5KGl0ZW1faWQpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRsZXQgb3V0ID0ge307XG5cdFx0XHRcdFx0XHRcdG91dC5pdGVtX2lkID0gaXRlbV9pZDtcblx0XHRcdFx0XHRcdFx0b3V0LmNvdW50ID0gZGJyci5vdXRbaXRlbV9pZF07XG5cdFx0XHRcdFx0XHRcdG91dC52YWx1ZSA9IGl0ZW1WYWx1ZXNbaXRlbV9pZF0gKiBvdXQuY291bnQ7XG5cdFx0XHRcdFx0XHRcdHJyLm91dC5wdXNoKG91dCk7XG5cdFx0XHRcdFx0XHRcdHJyLm91dF92YWx1ZSArPSBvdXQudmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJyLnByb2ZpdCA9IHJyLm91dF92YWx1ZSAtIHJyLmluX2J1eV92YWx1ZTtcblx0XHRcdFx0XHRcdHJyLnByb2ZpdF9wcm9jZW50ID0gMTAwICogcnIucHJvZml0IC8gcnIuaW5fYnV5X3ZhbHVlO1xuXHRcdFx0XHRcdFx0cnIubWF4X3ByaWNlID0gcnIub3V0X3ZhbHVlICogMTAwIC8gKDEwMCArIHRyYW5zcG9ydF9jb3N0KTtcblxuXHRcdFx0XHRcdFx0dGhpcy5wdXNoKHJyKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJlY3ljbGluZ19saXN0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Ly8gY29tcGFyZSB3aXRoIGNhY2hlLCByZXR1cm4gY2FjaGUgaWYgZXF1YWwsIHNvIGFuZ3VsYXIgZG9uJ3QgZ2V0IHN0dWNrIGluOiBcIkVycm9yOiAkcm9vdFNjb3BlOmluZmRpZ1wiXG5cdFx0XHRcdGlmKCRzY29wZS5jYWNoZS5yZWN5Y2xpbmcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZihhbmd1bGFyLnRvSnNvbigkc2NvcGUuY2FjaGUucmVjeWNsaW5nKSAhPT0gYW5ndWxhci50b0pzb24ocmVjeWNsaW5nX2xpc3QpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRzY29wZS5jYWNoZS5yZWN5Y2xpbmcgPSByZWN5Y2xpbmdfbGlzdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JHNjb3BlLmNhY2hlLnJlY3ljbGluZyA9IHJlY3ljbGluZ19saXN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAkc2NvcGUuY2FjaGUucmVjeWNsaW5nO1xuXHRcdFx0fTtcblx0XHRcdCRzY29wZS51bml0X2xpc3QgPSBmdW5jdGlvbih1bml0cywgaXRlbVZhbHVlcywgdHJhbnNwb3J0X2Nvc3QpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB1bml0X2xpc3QgPSBbXTtcblx0XHRcdFx0dW5pdHMuZm9yRWFjaChcblx0XHRcdFx0XHRmdW5jdGlvbihkYnVyLCB1bml0X2lkKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxldCB1ciA9IHt9O1xuXHRcdFx0XHRcdFx0dXIuaWQgPSB1bml0X2lkO1xuXHRcdFx0XHRcdFx0dXIuYSA9IGRidXIuYTtcblx0XHRcdFx0XHRcdHVyLmFhID0gKHVyLmEgPCAwKSAmJiAtdXIuYSB8fCB1ci5hO1xuXHRcdFx0XHRcdFx0dXIuaW4gPSBbXTtcblx0XHRcdFx0XHRcdHVyLm91dCA9IFtdO1xuXHRcdFx0XHRcdFx0dXIuaW5fdmFsdWUgPSAwO1xuXHRcdFx0XHRcdFx0dXIub3V0X3ZhbHVlID0gMDtcblxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpdGVtX2lkIGluIGRidXIuaW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmKCFkYnVyLmluLmhhc093blByb3BlcnR5KGl0ZW1faWQpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRsZXQgaXRlbSA9IHt9O1xuXHRcdFx0XHRcdFx0XHRpdGVtLml0ZW1faWQgPSBpdGVtX2lkO1xuXHRcdFx0XHRcdFx0XHRpdGVtLmNvdW50ID0gZGJ1ci5pbltpdGVtX2lkXTtcblx0XHRcdFx0XHRcdFx0aXRlbS52YWx1ZSA9IGl0ZW1WYWx1ZXNbaXRlbV9pZF0gKiBpdGVtLmNvdW50O1xuXHRcdFx0XHRcdFx0XHR1ci5pbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHR1ci5pbl92YWx1ZSArPSBpdGVtLnZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRmb3IobGV0IGl0ZW1faWQgaW4gZGJ1ci5vdXQpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmKCFkYnVyLm91dC5oYXNPd25Qcm9wZXJ0eShpdGVtX2lkKSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0bGV0IGl0ZW0gPSB7fTtcblx0XHRcdFx0XHRcdFx0aXRlbS5pdGVtX2lkID0gaXRlbV9pZDtcblx0XHRcdFx0XHRcdFx0aXRlbS5jb3VudCA9IGRidXIub3V0W2l0ZW1faWRdO1xuXHRcdFx0XHRcdFx0XHRpdGVtLnZhbHVlID0gaXRlbVZhbHVlc1tpdGVtX2lkXSAqIGl0ZW0uY291bnQ7XG5cdFx0XHRcdFx0XHRcdHVyLm91dC5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHR1ci5vdXRfdmFsdWUgKz0gaXRlbS52YWx1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dXIuaW5fYnV5X3ZhbHVlID0gdXIuaW5fdmFsdWUgKiAoMTAwICsgdHJhbnNwb3J0X2Nvc3QpIC8gMTAwO1xuXHRcdFx0XHRcdFx0dXIucHJvZml0ID0gdXIub3V0X3ZhbHVlIC0gdXIuaW5fYnV5X3ZhbHVlO1xuXHRcdFx0XHRcdFx0dXIucHJvZml0X3Byb2NlbnQgPSAxMDAgKiB1ci5wcm9maXQgLyB1ci5pbl9idXlfdmFsdWU7XG5cdFx0XHRcdFx0XHR1ci5tYXhfcHJpY2UgPSB1ci5vdXRfdmFsdWUgKiAxMDAgLyAoMTAwICsgdHJhbnNwb3J0X2Nvc3QpO1xuXG5cdFx0XHRcdFx0XHR0aGlzLnB1c2godXIpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dW5pdF9saXN0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Ly8gY29tcGFyZSB3aXRoIGNhY2hlLCByZXR1cm4gY2FjaGUgaWYgZXF1YWwsIHNvIGFuZ3VsYXIgZG9uJ3QgZ2V0IHN0dWNrIGluOiBcIkVycm9yOiAkcm9vdFNjb3BlOmluZmRpZ1wiXG5cdFx0XHRcdGlmKCRzY29wZS5jYWNoZS51bml0cylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmKGFuZ3VsYXIudG9Kc29uKCRzY29wZS5jYWNoZS51bml0cykgIT09IGFuZ3VsYXIudG9Kc29uKHVuaXRfbGlzdCkpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2NhY2hlLnVuaXRzIHVwZGF0ZWQnKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFskc2NvcGUuY2FjaGUudW5pdHMsIHVuaXRfbGlzdCwgYW5ndWxhci50b0pzb24oJHNjb3BlLmNhY2hlLnVuaXRzKSwgYW5ndWxhci50b0pzb24odW5pdF9saXN0KV0pO1xuXHRcdFx0XHRcdFx0JHNjb3BlLmNhY2hlLnVuaXRzID0gdW5pdF9saXN0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkc2NvcGUuY2FjaGUudW5pdHMgPSB1bml0X2xpc3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICRzY29wZS5jYWNoZS51bml0cztcblx0XHRcdH07XG5cdFx0XHQkc2NvcGUucmVzb3VyY2VzX2Zsb3cgPSBmdW5jdGlvbihpdGVtVmFsdWVzLCB1bml0cywgZmFjdG9yaWVzLCBmYWN0b3J5TGV2ZWwsIHRyYW5zcG9ydF9jb3N0LCBtaW5lcywgZ2lkaSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IGZhY3RvcnlfbGlzdCA9IHRoaXMuZmFjdG9yeV9saXN0KGZhY3RvcmllcywgZmFjdG9yeUxldmVsLCBpdGVtVmFsdWVzLCB0cmFuc3BvcnRfY29zdCk7XG5cdFx0XHRcdGxldCByZXNvdXJjZXNfZmxvdyA9IHt9O1xuXHRcdFx0XHRpdGVtVmFsdWVzLmZvckVhY2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24oaXRlbV92YWx1ZSwgaXRlbV9pZClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXSA9IHtpZDogaXRlbV9pZCwgaW46IDAsIG91dDogKG1pbmVzW2l0ZW1faWRdIHx8IDApLCBmaW46IGZhbHNlLCBmb3V0OiBmYWxzZSwgdHlwZTogJyd9O1xuXHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uaW5fcGxhaW4gPSByZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5pbjtcblx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLm91dF9wbGFpbiA9IHJlc291cmNlc19mbG93W2l0ZW1faWRdLm91dDtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJlc291cmNlc19mbG93XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGZvcihsZXQgZmFjdG9yeSBvZiBmYWN0b3J5X2xpc3QpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRmb3IobGV0IGl0ZW1faWQgaW4gZmFjdG9yeS5pbilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZighZmFjdG9yeS5pbi5oYXNPd25Qcm9wZXJ0eShpdGVtX2lkKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0eXBlb2YoZmFjdG9yeS5pbltpdGVtX2lkXSkgPT09IFwidW5kZWZpbmVkXCIpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodHlwZW9mKHJlc291cmNlc19mbG93W2l0ZW1faWRdKSA9PT0gXCJ1bmRlZmluZWRcIilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLmZpbiA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZihmYWN0b3J5LnByb2ZpdCA+IDApXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLmluX3BsYWluICs9IGZhY3Rvcnkuc3BlZWQgKiBmYWN0b3J5LmxldmVsICogZmFjdG9yeS5pbltpdGVtX2lkXTtcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uaW4gKz0gZmFjdG9yeS5zcGVlZCAqIGZhY3RvcnkubGV2ZWwgKiBmYWN0b3J5LmluW2l0ZW1faWRdO1xuXHRcdFx0XHRcdFx0XHRpZihmYWN0b3J5LnByb2ZpdF9yYW5rIDw9IGdpZGkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5pbiArPSBmYWN0b3J5LnNwZWVkICogZmFjdG9yeS5sZXZlbCAqIGZhY3RvcnkuaW5baXRlbV9pZF07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IobGV0IGl0ZW1faWQgaW4gZmFjdG9yeS5vdXQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYoIWZhY3Rvcnkub3V0Lmhhc093blByb3BlcnR5KGl0ZW1faWQpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHR5cGVvZihmYWN0b3J5Lm91dFtpdGVtX2lkXSkgPT09IFwidW5kZWZpbmVkXCIpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodHlwZW9mKHJlc291cmNlc19mbG93W2l0ZW1faWRdKSA9PT0gXCJ1bmRlZmluZWRcIilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLmZvdXQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYoZmFjdG9yeS5wcm9maXQgPiAwKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5vdXRfcGxhaW4gKz0gZmFjdG9yeS5zcGVlZCAqIGZhY3RvcnkubGV2ZWwgKiBmYWN0b3J5Lm91dFtpdGVtX2lkXTtcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ub3V0ICs9IGZhY3Rvcnkuc3BlZWQgKiBmYWN0b3J5LmxldmVsICogZmFjdG9yeS5vdXRbaXRlbV9pZF07XG5cdFx0XHRcdFx0XHRcdGlmKGZhY3RvcnkucHJvZml0X3JhbmsgPD0gZ2lkaSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLm91dCArPSBmYWN0b3J5LnNwZWVkICogZmFjdG9yeS5sZXZlbCAqIGZhY3Rvcnkub3V0W2l0ZW1faWRdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc291cmNlc19mbG93Lmxpc3QgPSBbXTtcblx0XHRcdFx0cmVzb3VyY2VzX2Zsb3cuaW4gPSAwO1xuXHRcdFx0XHRyZXNvdXJjZXNfZmxvdy5vdXQgPSAwO1xuXHRcdFx0XHRyZXNvdXJjZXNfZmxvdy5wcm9maXQgPSAwO1xuXHRcdFx0XHRpdGVtVmFsdWVzLmZvckVhY2goXG5cdFx0XHRcdFx0ZnVuY3Rpb24oaXRlbV92YWx1ZSwgaXRlbV9pZClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZihyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5maW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmKHJlc291cmNlc19mbG93W2l0ZW1faWRdLmZvdXQpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS50eXBlID0gJ21pZGRsZSc7XG5cdFx0XHRcdFx0XHRcdFx0aWYocmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uaW4gPCByZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5vdXQpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc3RhdHVzID0gJ2dvb2QnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmKHJlc291cmNlc19mbG93W2l0ZW1faWRdLmluID09PSByZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5vdXQpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc3RhdHVzID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYocmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ub3V0IDw9IDApXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc3RhdHVzID0gJ2J1eSc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zdGF0dXMgPSAnYmxlYWRpbmcnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zb3J0X3R5cGUgPSAzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLnR5cGUgPSAncmVzb3VyY2UnO1xuXHRcdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLnNvcnRfdHlwZSA9IDI7XG5cdFx0XHRcdFx0XHRcdFx0aWYocmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uaW4gPCByZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5vdXQpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc3RhdHVzID0gJ2dvb2QnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmKHJlc291cmNlc19mbG93W2l0ZW1faWRdLmluID09PSByZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5vdXQpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc3RhdHVzID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYocmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ub3V0IDw9IDApXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc3RhdHVzID0gJ2J1eSc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zdGF0dXMgPSAnYmxlYWRpbmcnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZihyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5mb3V0KVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0udHlwZSA9ICdwcm9kdWN0Jztcblx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zdGF0dXMgPSAnJztcblx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zb3J0X3R5cGUgPSAzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLnR5cGUgPSAnbG9vdCc7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc29ydF90eXBlID0gNDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zdGF0dXMgPSAnJztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodW5pdHNbaXRlbV9pZF0pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLnR5cGUgPSAndW5pdCc7XG5cdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLnNvcnRfdHlwZSA9IDU7XG5cdFx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93W2l0ZW1faWRdLnN0YXR1cyA9ICcnO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3cuaW4gKz0gcmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uaW4gKiBpdGVtX3ZhbHVlO1xuXHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3cub3V0ICs9IHJlc291cmNlc19mbG93W2l0ZW1faWRdLm91dCAqIGl0ZW1fdmFsdWU7XG5cdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5wcm9maXQgPSAocmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ub3V0IC0gcmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uaW4pICogaXRlbV92YWx1ZTtcblx0XHRcdFx0XHRcdGlmKGl0ZW1faWQgPT09IDEgfHwgaXRlbV9pZCA9PT0gJzEnKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zb3J0X3R5cGUgPSAxO1xuXHRcdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXS5zdGF0dXMgPSAnJztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYocmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ucHJvZml0IDwgMClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ucHJvZml0ID0gcmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ucHJvZml0ICogKDEwMCArIHRyYW5zcG9ydF9jb3N0KS8xMDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvdy5wcm9maXQgKz0gcmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0ucHJvZml0O1xuXHRcdFx0XHRcdFx0cmVzb3VyY2VzX2Zsb3dbaXRlbV9pZF0uc29ydF92YWx1ZSA9IHJlc291cmNlc19mbG93W2l0ZW1faWRdLnNvcnRfdHlwZSArICRzY29wZS5pdGVtTmFtZXNbaXRlbV9pZF07XG5cblx0XHRcdFx0XHRcdHJlc291cmNlc19mbG93Lmxpc3QucHVzaChyZXNvdXJjZXNfZmxvd1tpdGVtX2lkXSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZXNvdXJjZXNfZmxvd1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmKCRzY29wZS5zdW1zLmZsb3cuaW4gIT09IHJlc291cmNlc19mbG93LmluKSAkc2NvcGUuc3Vtcy5mbG93LmluID0gcmVzb3VyY2VzX2Zsb3cuaW47XG5cdFx0XHRcdGlmKCRzY29wZS5zdW1zLmZsb3cub3V0ICE9PSByZXNvdXJjZXNfZmxvdy5vdXQpICRzY29wZS5zdW1zLmZsb3cub3V0ID0gcmVzb3VyY2VzX2Zsb3cub3V0O1xuXHRcdFx0XHRpZigkc2NvcGUuc3Vtcy5mbG93LnByb2ZpdCAhPT0gcmVzb3VyY2VzX2Zsb3cucHJvZml0KSAkc2NvcGUuc3Vtcy5mbG93LnByb2ZpdCA9IHJlc291cmNlc19mbG93LnByb2ZpdDtcblxuXHRcdFx0XHQvLyBjb21wYXJlIHdpdGggY2FjaGUsIHJldHVybiBjYWNoZSBpZiBlcXVhbCwgc28gYW5ndWxhciBkb24ndCBnZXQgc3R1Y2sgaW46IFwiRXJyb3I6ICRyb290U2NvcGU6aW5mZGlnXCJcblx0XHRcdFx0aWYoJHNjb3BlLmNhY2hlLmZsb3cpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZihhbmd1bGFyLnRvSnNvbigkc2NvcGUuY2FjaGUuZmxvdykgIT09IGFuZ3VsYXIudG9Kc29uKHJlc291cmNlc19mbG93Lmxpc3QpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRzY29wZS5jYWNoZS5mbG93ID0gcmVzb3VyY2VzX2Zsb3cubGlzdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JHNjb3BlLmNhY2hlLmZsb3cgPSByZXNvdXJjZXNfZmxvdy5saXN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAkc2NvcGUuY2FjaGUuZmxvdztcblx0XHRcdH07XG5cdFx0XHQkc2NvcGUuYXNrX21pbmUgPSBmdW5jdGlvbihpZClcblx0XHRcdHtcblx0XHRcdFx0bGV0IGkgPSBwcm9tcHQoJHNjb3BlLml0ZW1OYW1lc1tpZF0gKyAnIHBlciBob3VyJywgJHNjb3BlLnVzZXJEYXRhLm1pbmVzW2lkXSk7XG5cdFx0XHRcdGlmKGkgIT09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkc2NvcGUudXNlckRhdGEubWluZXNbaWRdID0gcGFyc2VJbnQoaSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHQkc2NvcGUudGFiID0gXCJSZWN5Y2xpbmdcIjtcblxuXHRcdFx0aWYoIXdpbmRvdy5wdWdnYW4pXG5cdFx0XHR7XG5cdFx0XHRcdHdpbmRvdy5wdWdnYW4gPSB7fTtcblx0XHRcdH1cblx0XHRcdHdpbmRvdy5wdWdnYW4uZGVidWdfc2NvcGUgPSAkc2NvcGU7XG5cdFx0fVxuXHRdXG4pO1xuXG5hcHAuY29tcG9uZW50KCdyZXNvdXJjZScsIHtcblx0dGVtcGxhdGU6ICc8c3BhbiBuZy1iaW5kPVwibnJmb3JtYXQoYW1vdW50KVwiIHRpdGxlPVwie3sgdGl0bGVmb3JtYXQocmVzb3VyY2VfaWQsIGFtb3VudCwgaXRlbVZhbHVlc1tyZXNvdXJjZV9pZF0sIGl0ZW1OYW1lcykgfX1cIj48L3NwYW4+JyArXG5cdCc8aW1nIGNsYXNzPVwidHJfaWNvblwiIHRpdGxlPVwie3sgdGl0bGVmb3JtYXQocmVzb3VyY2VfaWQsIGFtb3VudCwgaXRlbVZhbHVlc1tyZXNvdXJjZV9pZF0sIGl0ZW1OYW1lcykgfX1cIiBuZy1zcmM9XCJodHRwczovL3d3dy5yZXNvdXJjZXMtZ2FtZS5jaC9pbWFnZXMvYXBwaW1hZ2VzL3Jlc3t7cmVzb3VyY2VfaWR9fS5wbmdcIj4nLFxuXHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpXG5cdHtcblx0XHR0aGlzLiRvbkluaXQgPSBmdW5jdGlvbigpXG5cdFx0e1xuXHRcdFx0JHNjb3BlLnJlc291cmNlX2lkID0gdGhpcy5yZXNvdXJjZTtcblx0XHRcdCRzY29wZS5hbW91bnQgPSB0aGlzLmFtb3VudDtcblx0XHR9O1xuXHRcdCRzY29wZS5yZXNvdXJjZV9pZCA9IHRoaXMucmVzb3VyY2U7XG5cdFx0JHNjb3BlLmFtb3VudCA9IHRoaXMuYW1vdW50O1xuXHRcdCRzY29wZS5ucmZvcm1hdCA9ICRzY29wZS4kcGFyZW50Lm5yZm9ybWF0O1xuXHRcdCRzY29wZS50aXRsZWZvcm1hdCA9ICRzY29wZS4kcGFyZW50LnRpdGxlZm9ybWF0O1xuXHRcdCRzY29wZS5pdGVtVmFsdWVzID0gJHNjb3BlLiRwYXJlbnQuaXRlbVZhbHVlcztcblx0XHQkc2NvcGUuaXRlbU5hbWVzID0gJHNjb3BlLiRwYXJlbnQuaXRlbU5hbWVzO1xuXHR9LFxuXHRiaW5kaW5nczoge1xuXHRcdHJlc291cmNlOiAnPCcsXG5cdFx0YW1vdW50OiAnPCdcblx0fVxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9