<?php

declare(strict_types=1);

use Bluepack\Http\Request;

/** @var \Bluepack\App $app */
$app = require dirname(__DIR__) . '/src/bootstrap.php';

$app->handle(Request::fromGlobals())->send();
