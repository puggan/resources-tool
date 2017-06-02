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

			$scope.authObj.$onAuthStateChanged(
				function(firebaseUser)
				{
					if(firebaseUser)
					{
						console.log("Signed in as:", firebaseUser.uid);
						console.log(firebaseUser);
						$scope.signedIn = true;
						$scope.username = firebaseUser.displayName;
						var userData = $firebaseObject($scope.db.child('userData/' + firebaseUser.uid));
						userData.$loaded()
							.then(function()
							{
								if(!userData.transport_cost)
								{
									userData.transport_cost = 15;
									userData.$save();
								}
								userData.$bindTo($scope, "userData");
								if(!$scope.userData.transport_cost || $scope.userData.transport_cost < 5 || $scope.userData.transport_cost > 15)
								{
									$scope.userData.transport_cost = 15;
								}
							});
					}
					else
					{
						console.log("Signed out");
						$scope.signedIn = false;
						$scope.username = 'Anonymous';
						$scope.userData = {"transport_cost": 15};
					}
					$scope.signingIn = false;
				}
			);

			$scope.signOut = function()
			{
				$scope.authObj.$signOut();
			};

			$scope.signIn = function()
			{
				$scope.authObj
					.$signInWithRedirect("google")
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
			$scope.userData = {"transport_cost": 15};
			$scope.getObjectKeys = function(o)
			{
				return Object.keys(o);
			};
			$scope.nrformat = function(org_nr)
			{
				var nr = parseFloat(org_nr);
				if(nr < 0)
				{
					return "-" + this.nrformat(-nr);
				}
				if(nr < 100)
				{
					return parseInt(nr);
				}

				var sufix_list = ['', ' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'];
				for(var sufix_nr = 0; sufix_nr < sufix_list.length; sufix_nr++)
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
				else
				{
					return org_nr.toPrecision(3);
				}
			};
			$scope.procentformat = function(org_nr, append = '%')
			{
				var nr = parseFloat(org_nr);
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
			$scope.titleformat = function(resource_id, amount, itemvalue, itemNames)
			{
				if(resource_id == 1)
				{
					return this.nrformat(amount) + ' ' + itemNames[1];
				}
				return this.nrformat(amount) + ' ' + itemNames[resource_id] + ' = ' + this.nrformat(amount * itemvalue) + ' ' + itemNames[1];

			}
			$scope.factory_list = function(factories, factory_levels, itemValues, transport_cost)
			{
				var factory_list = [];
				for(var factory_id in factories)
				{
					if(!factories.hasOwnProperty(factory_id))
					{
						continue;
					}
					if(!(parseInt(factory_id) > 0))
					{
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
				var factory_count = factory_list.length;
				for(var factory_rank_index = 0; factory_rank_index < factory_count; factory_rank_index++)
				{
					var factory_rank = factory_list[factory_rank_index];
					if(factory_rank.profit > 0)
					{
						var profit_rank = 1;
						var payback_rank = 1;
						for(var factory_profit_index = 0; factory_profit_index < factory_count; factory_profit_index++)
						{
							var factory_profit = factory_list[factory_profit_index];
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
						factory_rank.payback_rank_sort = factory_count + factory.pos;
					}
				}
				return factory_list;
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
				return recycling_list;
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
						ur.aa = (ur.a < 0) && -ur.a || ur.a
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
				return unit_list;
			};
			$scope.resources_flow = function(itemValues, units, factories, factoryLevel, transport_cost)
			{
				factory_list = this.factory_list(factories, factoryLevel, itemValues, transport_cost);
				let resources_flow = {};
				itemValues.forEach(
					function(item_value, item_id)
					{
						resources_flow[item_id] = {id: item_id, in: 0, out: 0, fin: false, fout: false, type: ''};
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

						resources_flow[item_id].fin = true;

						if(factory.profit > 0) resources_flow[item_id].in += factory.speed * factory.level * factory.in[item_id];
					}

					for(let item_id in factory.out)
					{
						if(!factory.out.hasOwnProperty(item_id))
						{
							continue;
						}

						resources_flow[item_id].fout = true;

						if(factory.profit > 0) resources_flow[item_id].out += factory.speed * factory.level * factory.out[item_id];
					}
				}
				resources_flow.list = [];
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
								else
								{
									resources_flow[item_id].status = 'bleading';
								}
							}
							else
							{
								resources_flow[item_id].type = 'resource';
								resources_flow[item_id].status = '';
							}
						}
						else
						{
							if(resources_flow[item_id].fout)
							{
								resources_flow[item_id].type = 'product';
								resources_flow[item_id].status = '';
							}
							else
							{
								resources_flow[item_id].type = 'loot';
								resources_flow[item_id].status = '';
							}
						}
						if(units[item_id])
						{
							resources_flow[item_id].type = 'unit';
							resources_flow[item_id].status = '';
						}
						resources_flow.list.push(resources_flow[item_id]);
					},
					resources_flow
				);

				return resources_flow.list;
			};
			$scope.tab = "Production";
			$scope.tab = "Flow";

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
