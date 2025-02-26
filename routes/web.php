<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LotController;  // import lot controller
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;

Auth::routes(['verify' => true]); // enable pass reset route



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

// password reset route
Route::get('/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');



// to signin page (already have an account?)
Route::get('/signin', [LoginController::class, 'showLoginForm'])->name('login');

// signin
Route::post('/signin', [AuthController::class, 'signin'])->name('signin');
Auth::routes();

// to signup page (dont have an account?)
Route::get('/signup', [RegisterController::class, 'showRegistrationForm'])->name('register');

// signup (form submission)
Route::post('/signup', [RegisterController::class, 'register'])->name('signup');





Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
