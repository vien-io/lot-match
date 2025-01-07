<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lot;

class LotController extends Controller
{
    public function index()
    {

        $lots = Lot::all();
        return view('lots.index', compact('lots'));
    }
}

