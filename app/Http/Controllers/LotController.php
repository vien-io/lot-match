<?php

public function show($id)
{
    // Find the lot and eager load reviews with user info
    $lot = Lot::with('reviews.user')->find($id);

    // If lot doesn't exist, return a 404 error
    if (!$lot) {
        return response()->json(['error' => 'Lot not found'], 404);
    }

    // Format the reviews data
    $reviews = $lot->reviews->map(function ($review) {
        return [
            'id' => $review->id,
            'user_id' => $review->user_id,
            'user_name' => $review->user->name ?? 'Unknown', // Default to 'Unknown' if no user
            'rating' => $review->rating,
            'comment' => $review->comment,
            'created_at' => $review->created_at->toDateTimeString(),
        ];
    });

    // Check if the current user has a review for this lot
    $existingReview = null;
    if (Auth::check()) {
        $existingReview = $reviews->firstWhere('user_id', Auth::id());
    }

    // Return the lot data along with reviews and existing review if any
    return response()->json([
        'id' => $lot->id,
        'name' => $lot->name,
        'description' => $lot->description,
        'size' => $lot->size,
        'price' => $lot->price,
        'block_id' => $lot->block_id,
        'reviews' => $reviews,
        'existingReview' => $existingReview, // This will be null if no review is found for the current user
    ]);
}
