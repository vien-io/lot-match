<?php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Block;  
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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

            // analyze and update sentiment
            if ($request->comment) {
                $sentiment = $this->analyzeSentimentViaHuggingFace($request->comment);

                Log::info('Sentiment Result (update):', [
                    'comment' => $request->comment,
                    'sentiment' => $sentiment
                ]);


                $existingReview->sentiment = strtolower($sentiment);
                $existingReview->save();
            }

        } else {
            // create new review
            $review = Review::create([
                'user_id' => Auth::id(),
                'user_name' => Auth::user()->name,
                'block_id' => $request->block_id,  
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            // analyze and update sentiment
            if ($request->comment) {
                $sentiment = $this->analyzeSentimentViaHuggingFace($request->comment);

                Log::info('Sentiment Result (new):', [
                    'comment' => $request->comment,
                    'sentiment' => $sentiment
                ]);

                $review->sentiment = strtolower($sentiment);
                $review->save();
            }
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

        // analyze and update sentiment
        if ($request->comment) {
            $sentiment = $this->analyzeSentimentViaHuggingFace($request->comment);

            Log::info('Sentiment Result (update method):', [
                'comment' => $request->comment,
                'sentiment' => $sentiment
            ]);

            $review->sentiment = strtolower($sentiment);
            $review->save();
        }

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

/*     
    public function summarizeReviews($block_id) {
        $reviews = Review::where('block_id', $block_id)
        ->whereNotNull('comment')
        ->pluck('comment');

        if ($reviews->isEmpty()) {
            return response()->json(['summary' => 'No comments to summarize']);
        }
        
        // concat comments
        $text = $reviews->implode(' ');

        // return simple summary
        $summary = Str::limit($text, 300);

        return response()->json(['summary' => $summary]);
    }
 */

    private function analyzeSentimentViaHuggingFace($text)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.huggingface.api_key'),
        ])->post('https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment', [
            'inputs' => $text
        ]);

        if ($response->successful()) {
            $result = $response->json();
            Log::info('Hugging Face Raw Response: ', $result);

            $labelMap = [
                'LABEL_0' => 'negative',
                'LABEL_1' => 'neutral',
                'LABEL_2' => 'positive',
            ];

            $topLabel = $result[0][0]['label'] ?? null;
            
            return $topLabel ? $labelMap[$topLabel] ?? null : null;
        } 

         Log::error('Hugging Face API failed:', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
        return null;
    }
}

