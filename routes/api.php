<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LotController;

Route::get('/lot/{id}', [LotController::class, 'show']);
