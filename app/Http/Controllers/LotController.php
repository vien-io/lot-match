<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lot;

class LotController extends Controller
{
    public function getLots($blockId)
    {
        $lots = Lot::where('block_id', $blockId)->get();
        return response()->json($lots);
    }

    public function show($id)
    {
        $lot = Lot::find($id);
        if (!$lot) {
            return response()->json(['error' => 'Lot not found'], 404);
        }
        return response()->json($lot);
    }

    
}
