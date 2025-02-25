<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LotController;  // import lot controller
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Auth;



// default
Route::get('/', function () {
    return view('welcome');
});

// route for lots
Route::get('/lots', [LotController::class, 'index']);

// route to 3d map
Route::get('/3dmap', function(){
    return view('3dmap');
});

/* // route to signup
Route::get('/signup', function () {
    return view('signup');
}); */

// route to signin
Route::get('/signin', function() {
    return view('signin');
});

Route::post('/signin', [AuthController::class, 'signin'])->name('signin');
Auth::routes();

// signup
Route::get('/signup', [RegisterController::class, 'showRegistrationForm'])->name('signup');
// Route::post('/register', [RegisterController::class, 'register'])->name('register.post');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
