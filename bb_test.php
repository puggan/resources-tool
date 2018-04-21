<?php

	require_once(__DIR__.'/vendor/autoload.php');

	use Kreait\Firebase;

	$firebase = (new Firebase\Factory())->withCredentials('/home/puggan/fbkeys/fb_bb.json')->create();
	if(!$firebase) die('DB failed' . PHP_EOL);

	$database = $firebase->getDatabase();
	if(!$database) die('DB failed' . PHP_EOL);

	$root = $database->getReference('/');
	var_dump($root->getValue());
