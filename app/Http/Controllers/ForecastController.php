<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class ForecastController extends Controller
{
    public function forecastBlockRating($block_id, $alpha = 0.3)
    {
        $ratingsQuery = DB::table('reviews')
            ->where('block_id', $block_id)
            ->orderBy('created_at', 'asc')
            ->select('rating', 'created_at')
            ->get();

        if ($ratingsQuery->isEmpty()) {
            return response()->json([
                'block_id' => $block_id,
                'forecasted_rating' => null,
                'ratings' => [],
                'message' => 'No ratings found for this block.'
            ]);
        }

        $ratings = $ratingsQuery->pluck('rating')->toArray();

        $ema = $ratings[0];
        for ($i = 1; $i < count($ratings); $i++) {
            $ema = $alpha * $ratings[$i] + (1 - $alpha) * $ema;
        }

        return response()->json([
            'block_id' => $block_id,
            'forecasted_rating' => round($ema, 2),
            'ratings' => $ratingsQuery
        ]);
    }
}
