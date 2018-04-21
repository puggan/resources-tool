// Initialize Firebase
let config = {
	apiKey: "AIzaSyDBqHYrSTc21YXXVVl3fOCi-3-UfDi0Vmk",
	authDomain: "resources-f6ccf.firebaseapp.com",
	databaseURL: "https://resources-f6ccf.firebaseio.com",
	projectId: "resources-f6ccf",
	storageBucket: "resources-f6ccf.appspot.com",
	messagingSenderId: "59344905235"
};
firebase.initializeApp(config);

let app = angular.module("angFireResources", ["firebase"]);

app.controller(
	'Resources',
	[
		"$scope",
		"$firebaseAuth",
		"$firebaseObject",
		function($scope, $firebaseAuth, $firebaseObject)
		{
			$scope.authObj = $firebaseAuth();

			$scope.signedIn = false;
			$scope.signingIn = true;
			$scope.username = 'Anonymous';
			$scope.userImage = null;
			$scope.sums = {flow: {in: 0, out: 0, profit: 0}};
			$scope.cache = {};
			let loadUserdata = function(uid) {
				if(!uid) {
					$scope.userData = {transport_cost: 15, flow_time: "1", gidi: 0, factoryLevel: {}, mines: {}, warehouse: {}, fake: true};
					return $scope.userData;
				}
				let userData = $firebaseObject($scope.db.child('userData/' + uid));
				userData.$loaded()
					.then(function()
					{
						let updated = false;
						if(!userData.transport_cost)
						{
							userData.transport_cost = 15;
							updated = true;
						}
						if(!userData.flow_time)
						{
							userData.flow_time = 1;
							updated = true;
						}
						if(!userData.gidi && userData.gidi === 0)
						{
							userData.gidi = 0;
							updated = true;
						}
						if(!userData.mines)
						{
							userData.mines = {};
							updated = true;
						}
						if(!userData.warehouse)
						{
							userData.warehouse = {};
							updated = true;
						}
						if(!userData.factoryLevel)
						{
							userData.factoryLevel = {};
							updated = true;
						}
						if(updated)
						{
							userData.$save();
						}
						userData.$bindTo($scope, "userData");
						if(!$scope.userData.transport_cost || $scope.userData.transport_cost < 5 || $scope.userData.transport_cost > 15)
						{
							$scope.userData.transport_cost = 15;
						}
					});
				return $scope.userData;
			};

			$scope.authObj.$onAuthStateChanged(
				function(firebaseUser)
				{
					if(firebaseUser)
					{
						console.log("Signed in as:", firebaseUser.uid);
						console.log(firebaseUser);
						$scope.signedIn = true;
						$scope.tab = "Flow";
						$scope.username = firebaseUser.displayName;
						$scope.userImage = firebaseUser.photoURL;

						let linkedUser = $firebaseObject($scope.db.child('userLinks/' + firebaseUser.uid));
						linkedUser
							.$loaded()
							.then(function() {
								if(linkedUser.$value)
									loadUserdata(linkedUser.$value, firebaseUser);
								else
									loadUserdata(firebaseUser.uid, firebaseUser);
							})
							.catch(function() {
								loadUserdata(firebaseUser.uid, firebaseUser);
							})
						;
						let userInfo = $firebaseObject($scope.db.child('userInfo/' + firebaseUser.uid));
						userInfo
							.$loaded()
							.then(function() {
								userInfo.name = firebaseUser.displayName;
								userInfo.email = firebaseUser.email;
								userInfo.photoURL = firebaseUser.photoURL;
								userInfo.providerId = firebaseUser.providerData[0].providerId;
								userInfo.uid = firebaseUser.providerData[0].uid;
								userInfo.$save();
							});
					}
					else
					{
						console.log("Signed out");
						$scope.signedIn = false;
						$scope.username = 'Anonymous';
						$scope.userImage = null;
						loadUserdata(null, null);
					}
					$scope.signingIn = false;
				}
			);

			$scope.signOut = function()
			{
				$scope.authObj.$signOut();
			};

			$scope.signIn = function(auth_provider)
			{
				$scope.authObj
					.$signInWithRedirect(auth_provider)
					.catch(function(error)
						{
							console.error("Authentication failed:", error);
						}
					);
			};

			$scope.db = firebase.database()
				.ref();
			let gameData = $scope.db.child('gameData');
			$scope.factories = $firebaseObject(gameData.child('factories'));
			$scope.recycling = $firebaseObject(gameData.child('recycling'));
			$scope.units = $firebaseObject(gameData.child('units'));
			$scope.itemNames = $firebaseObject(gameData.child('items'));
			$scope.itemValues = $firebaseObject($scope.db.child('apiData/itemValues'));
			$scope.userData = {transport_cost: 15, flow_time: "1", factoryLevel: {}, mines: {}, fake: true};
			$scope.getObjectKeys = function(o)
			{
				return Object.keys(o);
			};
			$scope.nrformat = function(org_nr)
			{
				let nr = parseFloat(org_nr);
				if(nr < 0)
				{
					return "-" + this.nrformat(-nr);
				}
				if(nr < 100)
				{
					return parseInt(nr);
				}

				let sufix_nr;
				let sufix_list = ['', ' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'];
				for(sufix_nr = 0; sufix_nr < sufix_list.length; sufix_nr++)
				{
					if(nr < 1000)
					{
						break;
					}
					nr = nr / 1000;
				}

				if(nr < 1000)
				{
					return nr.toPrecision(3) + sufix_list[sufix_nr];
				}
				else if(org_nr.toPrecision)
				{
					return org_nr.toPrecision(3);
				}
				else
				{
					return org_nr;
				}
			};
			$scope.procentformat = function(org_nr, append = '%')
			{
				let nr = parseFloat(org_nr);
				if(nr < 0)
				{
					return "-" + this.procentformat(-nr, append);
				}

				if(nr < 1000)
				{
					return nr.toPrecision(3) + append;
				}
				else
				{
					return Math.round(org_nr) + append;
				}
			};
			$scope.timeformat = function(hours)
			{
				if(hours < 0) return '-' + $scope.timeformat(-hours);
				let v = 3600 * hours;
				if(v < 60) return v + ' s';
				if(v < 60 * 60) return Math.floor(v / 60) + ' m ' + Math.floor(v % 60) + ' s';
				v = v / 60;
				if(v < 24 * 60) return Math.floor(v / 60) + ' h ' + Math.floor(v % 60) + ' m';
				v = v / 60;
				if(v < 31 * 24) return Math.floor(v / 24) + ' d ' + Math.floor(v % 24) + ' h';
				v = v / 24;
				if(v < 7 * 52) return Math.floor(v / 7) + ' w ' + Math.floor(v % 24) + ' d';
				return Math.floor(v / 365) + ' y ' + Math.floor((v % 365)/7) + ' w';
			};
			$scope.titleformat = function(resource_id, amount, itemvalue, itemNames)
			{
				if(resource_id === 1 || resource_id === '1')
				{
					return this.nrformat(amount) + ' ' + itemNames[1];
				}
				return this.nrformat(amount) + ' ' + itemNames[resource_id] + ' = ' + this.nrformat(amount * itemvalue) + ' ' + itemNames[1];

			};
			$scope.factory_list = function(factories, factory_levels, itemValues, transport_cost)
			{
				let factory_list = [];
				for(let factory_id in factories)
				{
					if(!factories.hasOwnProperty(factory_id))
					{
						continue;
					}
					if(!(parseInt(factory_id) > 0))
					{
						continue;
					}

					let resource_count = 0;
					let resource_value = 0;
					let resource_transport_value = 0;

					let factory = factories[factory_id];
					factory.factory_id = factory_id;
					factory.level = factory_levels[factory_id];
					factory.next_level = factory.level + 1;

					factory.credits_out = 0;
					for(resource_id in factory.out)
					{
						if(!factory.out.hasOwnProperty(resource_id))
						{
							continue;
						}

						resource_count = factory.out[resource_id];
						resource_value = itemValues[resource_id];
						factory.credits_out += resource_count * resource_value;
					}

					factory.credits_in = 0
					for(resource_id in factory.in)
					{
						if(!factory.in.hasOwnProperty(resource_id))
						{
							continue;
						}

						resource_count = factory.in[resource_id];
						resource_value = itemValues[resource_id];
						resource_transport_value = resource_value;
						if(resource_id > 1)
						{
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
					for(resource_id in factory.upgrade)
					{
						if(!factory.upgrade.hasOwnProperty(resource_id))
						{
							continue;
						}

						resource_count = factory.upgrade[resource_id];
						resource_value = itemValues[resource_id];
						resource_transport_value = resource_value;
						if(resource_id > 1)
						{
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
					if(factory.profit > 0)
					{
						factory.payback = factory.upgrade_total / factory.profit_base / factory.speed / 24;
					}
					factory_list.push(factory);
				}
				let factory_count = factory_list.length;
				for(let factory_rank_index = 0; factory_rank_index < factory_count; factory_rank_index++)
				{
					let factory_rank = factory_list[factory_rank_index];
					if(factory_rank.profit > 0)
					{
						let profit_rank = 1;
						let payback_rank = 1;
						for(let factory_profit_index = 0; factory_profit_index < factory_count; factory_profit_index++)
						{
							let factory_profit = factory_list[factory_profit_index];
							if(factory_profit.profit > factory_rank.profit)
							{
								profit_rank++;
							}
							if(factory_profit.payback && factory_profit.payback < factory_rank.payback)
							{
								payback_rank++;
							}
						}
						factory_rank.profit_rank = profit_rank;
						factory_rank.payback_rank_sort = payback_rank;
						factory_rank.payback_rank = payback_rank;
					}
					else
					{
						factory_rank.profit_rank = '';
						factory_rank.payback_rank = '';
						factory_rank.payback_rank_sort = factory_count + factory_rank.pos;
					}
				}

				// compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
				if($scope.cache.factories)
				{
					if(angular.toJson($scope.cache.factories) !== angular.toJson(factory_list))
					{
						$scope.cache.factories = factory_list;
					}
				}
				else
				{
					$scope.cache.factories = factory_list;
				}
				return $scope.cache.factories;
			};
			$scope.recycling_list = function(recycling, itemValues, transport_cost)
			{
				let recycling_list = [];
				recycling.forEach(
					function(dbrr, recycling_id)
					{
						let rr = {};
						rr.id = recycling_id;
						rr.in_count = dbrr.in[recycling_id];
						rr.in_value = itemValues[recycling_id] * rr.in_count;
						rr.in_buy_value = rr.in_value * (100 + transport_cost) / 100;

						rr.out = [];
						rr.out_value = 0;

						for(let item_id in dbrr.out)
						{
							if(!dbrr.out.hasOwnProperty(item_id))
							{
								continue;
							}

							let out = {};
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
					},
					recycling_list
				);

				// compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
				if($scope.cache.recycling)
				{
					if(angular.toJson($scope.cache.recycling) !== angular.toJson(recycling_list))
					{
						$scope.cache.recycling = recycling_list;
					}
				}
				else
				{
					$scope.cache.recycling = recycling_list;
				}
				return $scope.cache.recycling;
			};
			$scope.unit_list = function(units, itemValues, transport_cost)
			{
				let unit_list = [];
				units.forEach(
					function(dbur, unit_id)
					{
						let ur = {};
						ur.id = unit_id;
						ur.a = dbur.a;
						ur.aa = (ur.a < 0) && -ur.a || ur.a;
						ur.in = [];
						ur.out = [];
						ur.in_value = 0;
						ur.out_value = 0;

						for(let item_id in dbur.in)
						{
							if(!dbur.in.hasOwnProperty(item_id))
							{
								continue;
							}

							let item = {};
							item.item_id = item_id;
							item.count = dbur.in[item_id];
							item.value = itemValues[item_id] * item.count;
							ur.in.push(item);
							ur.in_value += item.value;
						}

						for(let item_id in dbur.out)
						{
							if(!dbur.out.hasOwnProperty(item_id))
							{
								continue;
							}

							let item = {};
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
					},
					unit_list
				);

				// compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
				if($scope.cache.units)
				{
					if(angular.toJson($scope.cache.units) !== angular.toJson(unit_list))
					{
						console.log('cache.units updated');
						console.log([$scope.cache.units, unit_list, angular.toJson($scope.cache.units), angular.toJson(unit_list)]);
						$scope.cache.units = unit_list;
					}
				}
				else
				{
					$scope.cache.units = unit_list;
				}
				return $scope.cache.units;
			};
			$scope.resources_flow = function(itemValues, units, factories, factoryLevel, transport_cost, mines, gidi)
			{
				let factory_list = this.factory_list(factories, factoryLevel, itemValues, transport_cost);
				let resources_flow = {};
				itemValues.forEach(
					function(item_value, item_id)
					{
						resources_flow[item_id] = {id: item_id, in: 0, out: (mines[item_id] || 0), fin: false, fout: false, type: ''};
						resources_flow[item_id].in_plain = resources_flow[item_id].in;
						resources_flow[item_id].out_plain = resources_flow[item_id].out;
					},
					resources_flow
				);
				for(let factory of factory_list)
				{
					for(let item_id in factory.in)
					{
						if(!factory.in.hasOwnProperty(item_id))
						{
							continue;
						}
						if(typeof(factory.in[item_id]) === "undefined")
						{
							continue;
						}
						if(typeof(resources_flow[item_id]) === "undefined")
						{
							continue;
						}

						resources_flow[item_id].fin = true;
						if(factory.profit > 0)
						{
							resources_flow[item_id].in_plain += factory.speed * factory.level * factory.in[item_id];
							resources_flow[item_id].in += factory.speed * factory.level * factory.in[item_id];
							if(factory.profit_rank <= gidi)
							{
								resources_flow[item_id].in += factory.speed * factory.level * factory.in[item_id];
							}
						}
					}

					for(let item_id in factory.out)
					{
						if(!factory.out.hasOwnProperty(item_id))
						{
							continue;
						}
						if(typeof(factory.out[item_id]) === "undefined")
						{
							continue;
						}
						if(typeof(resources_flow[item_id]) === "undefined")
						{
							continue;
						}

						resources_flow[item_id].fout = true;
						if(factory.profit > 0)
						{
							resources_flow[item_id].out_plain += factory.speed * factory.level * factory.out[item_id];
							resources_flow[item_id].out += factory.speed * factory.level * factory.out[item_id];
							if(factory.profit_rank <= gidi)
							{
								resources_flow[item_id].out += factory.speed * factory.level * factory.out[item_id];
							}
						}
					}
				}
				resources_flow.list = [];
				resources_flow.in = 0;
				resources_flow.out = 0;
				resources_flow.profit = 0;
				itemValues.forEach(
					function(item_value, item_id)
					{
						if(resources_flow[item_id].fin)
						{
							if(resources_flow[item_id].fout)
							{
								resources_flow[item_id].type = 'middle';
								if(resources_flow[item_id].in < resources_flow[item_id].out)
								{
									resources_flow[item_id].status = 'good';
								}
								else if(resources_flow[item_id].in === resources_flow[item_id].out)
								{
									resources_flow[item_id].status = '';
								}
								else if(resources_flow[item_id].out <= 0)
								{
									resources_flow[item_id].status = 'buy';
								}
								else
								{
									resources_flow[item_id].status = 'bleading';
								}
								resources_flow[item_id].sort_type = 3;
							}
							else
							{
								resources_flow[item_id].type = 'resource';
								resources_flow[item_id].sort_type = 2;
								if(resources_flow[item_id].in < resources_flow[item_id].out)
								{
									resources_flow[item_id].status = 'good';
								}
								else if(resources_flow[item_id].in === resources_flow[item_id].out)
								{
									resources_flow[item_id].status = '';
								}
								else if(resources_flow[item_id].out <= 0)
								{
									resources_flow[item_id].status = 'buy';
								}
								else
								{
									resources_flow[item_id].status = 'bleading';
								}
							}
						}
						else
						{
							if(resources_flow[item_id].fout)
							{
								resources_flow[item_id].type = 'product';
								resources_flow[item_id].status = '';
								resources_flow[item_id].sort_type = 3;
							}
							else
							{
								resources_flow[item_id].type = 'loot';
								resources_flow[item_id].sort_type = 4;
								resources_flow[item_id].status = '';
							}
						}
						if(units[item_id])
						{
							resources_flow[item_id].type = 'unit';
							resources_flow[item_id].sort_type = 5;
							resources_flow[item_id].status = '';
						}
						resources_flow.in += resources_flow[item_id].in * item_value;
						resources_flow.out += resources_flow[item_id].out * item_value;
						resources_flow[item_id].profit = (resources_flow[item_id].out - resources_flow[item_id].in) * item_value;
						if(item_id === 1 || item_id === '1')
						{
							resources_flow[item_id].sort_type = 1;
							resources_flow[item_id].status = '';
						}
						else if(resources_flow[item_id].profit < 0)
						{
							resources_flow[item_id].profit = resources_flow[item_id].profit * (100 + transport_cost)/100;
						}
						resources_flow.profit += resources_flow[item_id].profit;
						resources_flow[item_id].sort_value = resources_flow[item_id].sort_type + $scope.itemNames[item_id];

						resources_flow.list.push(resources_flow[item_id]);
					},
					resources_flow
				);

				if($scope.sums.flow.in !== resources_flow.in) $scope.sums.flow.in = resources_flow.in;
				if($scope.sums.flow.out !== resources_flow.out) $scope.sums.flow.out = resources_flow.out;
				if($scope.sums.flow.profit !== resources_flow.profit) $scope.sums.flow.profit = resources_flow.profit;

				// compare with cache, return cache if equal, so angular don't get stuck in: "Error: $rootScope:infdig"
				if($scope.cache.flow)
				{
					if(angular.toJson($scope.cache.flow) !== angular.toJson(resources_flow.list))
					{
						$scope.cache.flow = resources_flow.list;
					}
				}
				else
				{
					$scope.cache.flow = resources_flow.list;
				}
				return $scope.cache.flow;
			};
			$scope.ask_mine = function(id)
			{
				let i = prompt($scope.itemNames[id] + ' per hour', $scope.userData.mines[id]);
				if(i !== null)
				{
					$scope.userData.mines[id] = parseInt(i);
				}
			};
			$scope.tab = "Recycling";

			if(!window.puggan)
			{
				window.puggan = {};
			}
			window.puggan.debug_scope = $scope;
		}
	]
);

app.component('resource', {
	template: '<span ng-bind="nrformat(amount)" title="{{ titleformat(resource_id, amount, itemValues[resource_id], itemNames) }}"></span>' +
	'<img class="tr_icon" title="{{ titleformat(resource_id, amount, itemValues[resource_id], itemNames) }}" ng-src="https://www.resources-game.ch/images/appimages/res{{resource_id}}.png">',
	controller: function($scope)
	{
		this.$onInit = function()
		{
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
