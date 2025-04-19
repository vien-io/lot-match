<?php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Block;  
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'block_id' => 'required|exists:blocks,id',  
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // check if user has already submitted review for the block
        $existingReview = Review::where('user_id', Auth::id())
                                ->where('block_id', $request->block_id) 
                                ->first();

        if ($existingReview) {
            // update existing review
            $existingReview->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);
        } else {
            // create new review
            Review::create([
                'user_id' => Auth::id(),
                'user_name' => Auth::user()->name,
                'block_id' => $request->block_id,  
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);
        }

        // fetch block with its reviews and related user info
        $block = Block::with('reviews.user')->find($request->block_id);

        return response()->json([
            'message' => 'Review submitted successfully!',
            'block' => $block,  
        ]);
    }

    public function edit($id) {
        $review = Review::findOrFail($id);

        // make sure review belongs to the authenticated user
        if ($review->user_id != Auth::id()) {
            return response()->json(['message' => 'You can only edit your own reviews.'], 403);
        }

        return response()->json($review); 
    }

    public function update(Request $request, $id) {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = Review::findOrFail($id);

        // make sure review belongs to authenticated user
        if ($review->user_id != Auth::id()) {
            return response()->json(['message' => 'You can only update your own reviews.'], 403);
        }

        // update review
        $review->update($request->only('rating', 'comment'));

        return response()->json([
            'message' => 'Review updated successfully!',
            'review' => $review,
        ]);
    }

    public function destroy($id) {
        $review = Review::findOrFail($id);

        // make sure review belongs to the authenticated user
        if ($review->user_id != Auth::id()) {
            return response()->json(['message' => 'You can only delete your own reviews.'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully!']);
    }
}

