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
    $lot = Lot::with('reviews.user')->find($id);

    if (!$lot) {
        return response()->json(['error' => 'Lot not found'], 404);
    }

    $reviews = $lot->reviews->map(function ($review) {
        return [
            'id' => $review->id,
            'user_id' => $review->user_id,
            'user_name' => $review->user->name ?? 'Unknown', 
            'rating' => $review->rating,
            'comment' => $review->comment,
            'created_at' => $review->created_at->toDateTimeString(),
        ];
    });

    $existingReview = null;
    if (Auth::check()) {
        $existingReview = $reviews->firstWhere('user_id', Auth::id());
    }

    return response()->json([
        'id' => $lot->id,
        'name' => $lot->name,
        'description' => $lot->description,
        'size' => $lot->size,
        'price' => $lot->price,
        'block_id' => $lot->block_id,
        'reviews' => $reviews,
        'existingReview' => $existingReview, 
    ]);
}


}
