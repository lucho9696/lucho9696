<?php

declare(strict_types=1);

use Poliluz\Http\Request;

/** @var \Poliluz\App $app */
$app = require dirname(__DIR__) . '/src/bootstrap.php';

$app->handle(Request::fromGlobals())->send();
