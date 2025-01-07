<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LotController;  // Import the LotController

// Default route
Route::get('/', function () {
    return view('welcome');
});

// Route to show the list of lots
Route::get('/lots', [LotController::class, 'index']);

