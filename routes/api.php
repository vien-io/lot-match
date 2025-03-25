<?php
use App\Http\Controllers\LotController;
use Illuminate\Support\Facades\Route;


Route::middleware('api')->group(function () {
    Route::get('/lot/{id}', [LotController::class, 'show']); 
});