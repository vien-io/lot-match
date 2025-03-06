<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lot;

class PropertyController extends Controller
{
    public function index()
    {
        // Fetch all available properties (lots)
        $lots = Lot::latest()->paginate(12); // Paginate results

        return view('properties', compact('lots'));
    }
}
