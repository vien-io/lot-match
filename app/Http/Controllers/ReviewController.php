<?php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Lot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'lot_id' => 'required|exists:lots,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // Check if the user has already submitted a review for the lot
        $existingReview = Review::where('user_id', Auth::id())
                                ->where('lot_id', $request->lot_id)
                                ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already submitted a review for this lot.',
            ], 400); // Return 400 if the user already submitted a review
        }

        // Create the new review
        $review = Review::create([
            'user_id' => Auth::id(),
            'lot_id' => $request->lot_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Fetch the updated lot with reviews
        $lot = Lot::with('reviews.user')->find($request->lot_id);

        return response()->json([
            'message' => 'Review submitted successfully!',
            'lot' => $lot, // Return the updated lot data with reviews
        ]);
    }


    public function edit($id) {
        $review = Review::findOrFail($id);
    
        // Ensure the review belongs to the authenticated user
        if ($review->user_id != Auth::id()) {
            return response()->json(['message' => 'You can only edit your own reviews.'], 403);
        }
    
        return response()->json($review); // Return the review for editing
    }
    
    public function update(Request $request, $id) {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);
    
        $review = Review::findOrFail($id);
    
        // Ensure the review belongs to the authenticated user
        if ($review->user_id != Auth::id()) {
            return response()->json(['message' => 'You can only update your own reviews.'], 403);
        }
    
        // Update the review
        $review->update($request->only('rating', 'comment'));
    
        return response()->json([
            'message' => 'Review updated successfully!',
            'review' => $review,
        ]);
    }
    
    public function destroy($id) {
        $review = Review::findOrFail($id);
    
        // Ensure the review belongs to the authenticated user
        if ($review->user_id != Auth::id()) {
            return response()->json(['message' => 'You can only delete your own reviews.'], 403);
        }
    
        $review->delete();
    
        return response()->json(['message' => 'Review deleted successfully!']);
    }
    
}
