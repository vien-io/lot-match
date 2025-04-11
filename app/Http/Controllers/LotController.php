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
        // fetch lot details from the database using the ID
        $lot = Lot::find($id);

        // check if lot exists
        if (!$lot) {
            return response()->json(['error' => 'Lot not found'], 404);
        }

        // return lot details as a JSON response, including model URL
        return response()->json([
            'id' => $lot->id,
            'name' => $lot->name,
            'description' => $lot->description,
            'size' => $lot->size,
            'price' => $lot->price,
            'block_id' => $lot->block_id,
            'modelUrl' => $lot->model_url ? asset('models/' . $lot->model_url) : null, 
        ]);
    }
}
