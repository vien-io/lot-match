<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LotController;  // Import the LotController

// Default route
Route::get('/', function () {
    return view('welcome');
});

// Route to show the list of lots
Route::get('/lots', [LotController::class, 'index']);

// route to 3d map
Route::get('/3dmap', function(){
    return view('3dmap');
});

// route to signup
Route::get('/signup', function () {
    return view('signup');
});

// route to signin
Route::get('/signin', function() {
    return view('signin');
});