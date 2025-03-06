<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lot; // Assuming you have a Lot model

class HomeController extends Controller
{
    public function index()
    {
        $lots = Lot::latest()->take(6)->get(); // Fetch latest 6 featured lots
      /*   dd($lots); // Debugging: Check if lots are retrieved */
        return view('homepage', compact('lots'));
    }
}

