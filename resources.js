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
						userData.$loaded().then(function()
						{
							if(!userData.$value)
							{
								userData.transport_cost = 15;
								userData.$save();
							}
							userData.$bindTo($scope, "userData");
						});
						console.log(['$scope.userData', $scope.userData]);
						if(!$scope.userData.transport_cost || $scope.userData.transport_cost < 5 || $scope.userData.transport_cost > 15)
						{
							$scope.userData.transport_cost = 15;
						}
					}
					else
					{
						console.log("Signed out");
						$scope.signedIn = false;
						$scope.username = 'Anonymous';
						$scope.userData = { "transport_cost": 15 };
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

			$scope.db = firebase.database().ref();
			$scope.factories = $firebaseObject($scope.db.child('gameData/factories'));
			$scope.itemValues = $firebaseObject($scope.db.child('apiData/itemValues'));
			$scope.itemNames = $firebaseObject($scope.db.child('gameData/items'));
			$scope.userData = { "transport_cost": 15 };
			$scope.getObjectKeys = function(o)
			{
				return Object.keys(o);
			};
			$scope.nrformat = function(org_nr)
			{
				var nr = parseFloat(org_nr);
				if(nr < 0) return "-" + this.nrformat(-nr);

				var sufix_list = ['', ' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'];
				for(var sufix_nr = 0; sufix_nr < sufix_list.length; sufix_nr++)
				{
					if(nr < 1000) break;
					nr = nr / 1000;
				}

				if(nr < 1000) return nr.toPrecision(3) + sufix_list[sufix_nr];
				else return org_nr.toPrecision(3);
			};
			$scope.factorytools = {
				credits_out: function(factory, itemValues)
				{
					var value = 0;
					for(resource_id in factory.out)
					{
						if(!factory.out.hasOwnProperty(resource_id))
						{
							continue;
						}

						var resource_count = factory.out[resource_id];
						var resource_value = itemValues[resource_id];
						value += resource_count * resource_value;
					}
					return value;
				},
				credits_in: function(factory, itemValues, transport_cost)
				{
					var value = 0;
					for(resource_id in factory.in)
					{
						if(!factory.in.hasOwnProperty(resource_id)) continue;

						var resource_count = factory.in[resource_id];
						var resource_value = itemValues[resource_id];
						value += resource_count * resource_value * (resource_id === 1 ? 1 : (100 + transport_cost) / 100);
					}
					return value;
				},
				turnover: function(factory, itemValues, level)
				{
					if(!level) return 0;
					return factory.speed * level * this.credits_out(factory, itemValues);
				},
				profit: function(factory, itemValues, level, transport_cost)
				{
					if(!level) return 0;
					// value = (tr.pb.credits_out - tr.pb.credits_in) * level * pb.factories[row_nr].speed;
					return factory.speed * level * (this.credits_out(factory, itemValues) - this.credits_in(factory, itemValues, transport_cost));
				},
				upgrade: function(factory, itemValues, level, transport_cost)
				{
					var value = 0;
					if(!level) return value;
					for(resource_id in factory.upgrade)
					{
						if(!factory.upgrade.hasOwnProperty(resource_id)) continue;

						var resource_count = factory.upgrade[resource_id];
						var resource_value = itemValues[resource_id];
						value += resource_count * resource_value * (resource_id === 1 ? 1 : (100 + transport_cost)/100);
					}

					return value * level * level;
				},
				upgradeResourceAmount: function(resource_id, factory, level) {
					if(!level) return 0;
					return factory.upgrade[resource_id] * level * level;
				},
				upgradeResourceValue: function(resource_id, factory, level, itemValues) {
					if(!level) return 0;
					return this.upgradeResourceAmount(resource_id, factory, level) * itemValues[resource_id];
				},
				payback: function(factory, itemValues, level, transport_cost, decimals)
				{
					if(!level) return '';
					var value = this.upgrade(factory, itemValues, level, transport_cost) / this.profit(factory, itemValues, level, transport_cost) / 24;
					if(value <= 0)
					{
						return '';
					}
					if(decimals || decimals === 0)
					{
						return value.toFixed(decimals);
					}
					return value;
				},

				rank: function(factory, factories, itemValues, levels, transport_cost) {
					// TODO calc rank
					return '';
				}
			};
		}
	]
);
