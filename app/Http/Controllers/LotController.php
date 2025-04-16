<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lot;
use Illuminate\Support\Facades\Auth;

class LotController extends Controller
{
    public function getLots($blockId)
    {
        $lots = Lot::where('block_id', $blockId)->get();
        return response()->json($lots);
    }

    public function show($id)
    {
        $lot = Lot::with('reviews')->find($id);

        // check if lot exists
        if (!$lot) {
            return response()->json(['error' => 'Lot not found'], 404);
        }

        $lot->reviews->transform(function ($review) {
            return [
                'id' => $review->id,
                'user_id' => $review->user_id,
                'user_name' => $review->user->name, 
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at->toDateTimeString(),
            ];
        });

        $existingReview = $lot->reviews->firstWhere('user_id', Auth::id());

        // return lot details as json response, including model url
        return response()->json([
            'id' => $lot->id,
            'name' => $lot->name,
            'description' => $lot->description,
            'size' => $lot->size,
            'price' => $lot->price,
            'block_id' => $lot->block_id,
            'modelUrl' => $lot->model_url ? asset('models/' . $lot->model_url) : null, 
            'reviews' => $lot->reviews,
            'existingReview' => $existingReview,
        ]);
    }
}
