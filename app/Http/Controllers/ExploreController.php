<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lot;

class ExploreController extends Controller
{
    public function index()
    {
        // Fetch all lots to display on the explore page
        $lots = Lot::latest()->paginate(9); // Paginate to prevent long loads

        return view('explore', compact('lots'));
    }
}
