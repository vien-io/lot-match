<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lot;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
        $blocks = range(1, 20); // Example: Blocks 1 to 20

        $lots = Lot::query();

        if ($request->location) {
            $lots->where('block_number', $request->location);
        }

        $lots = $lots->get();

        return view('explore', compact('lots', 'blocks'));
    }

}
