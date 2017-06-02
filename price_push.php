<?php

	require_once(__DIR__.'/vendor/autoload.php');

	require_once(__DIR__.'/config.php');
	global $firebase_credentials_file;

	use Kreait\Firebase;

	$firebase = (new Firebase\Factory())->withCredentials($firebase_credentials_file)->create();
	if(!$firebase) die('DB failed' . PHP_EOL);

	$database = $firebase->getDatabase();
	if(!$database) die('DB failed' . PHP_EOL);

	$raw_exchange = file_get_contents("http://www.resources-game.ch/exchange/kurseliste_json.txt");
	$exchange = json_decode($raw_exchange);

	$prices = [1 => 1];

	foreach($exchange as $current_item)
	{
		$prices[(int) $current_item->ITEM_ID] = max((int) $current_item->SMKURS, (int) $current_item->NORMKURS);
	}

	$database->getReference('/apiData/itemValues')->set($prices);