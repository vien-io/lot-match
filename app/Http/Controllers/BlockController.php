<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Block;
use Illuminate\Support\Facades\Auth;

class BlockController extends Controller
{
    public function getBlocks()
    {
        $blocks = Block::all();  // or use pagination if needed
        return response()->json($blocks);
    }
    public function show($id)
    {
        // eager load lots and their reviews + user info
        $block = Block::with('lots.reviews.user')->find($id);

        if (!$block) {
            return response()->json(['error' => 'Block not found'], 404);
        }

        // map lots and structure reviews
        $lots = $block->lots->map(function ($lot) {
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

            $existingReview = $reviews->firstWhere('user_id', Auth::id());

            return [
                'id' => $lot->id,
                'name' => $lot->name,
                'description' => $lot->description,
                'size' => $lot->size,
                'price' => $lot->price,
                'block_id' => $lot->block_id,
                'modelUrl' => $lot->model_url ? asset('models/' . $lot->model_url) : null,
                'reviews' => $reviews,
                'existingReview' => $existingReview,
            ];
        });

        return response()->json([
            'id' => $block->id,
            'name' => $block->name,
            'description' => $block->description,
            'modelUrl' => $block->model_url ? asset('models/' . $block->model_url) : null,
            'lots' => $lots,
        ]);
    }
}
