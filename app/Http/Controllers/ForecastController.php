<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class ForecastController extends Controller
{
    public function forecastBlockRating($block_id, $alpha = 0.3)
    {
        // fetch ratings for block ordered by created_at
        $ratings = DB::table('reviews')
            ->where('block_id', $block_id)
            ->orderBy('created_at', 'asc')
            ->pluck('rating')
            ->toArray();

        if (empty($ratings)) {
            return response()->json([
                'block_id' => $block_id,
                'forecasted_rating' => null,
                'message' => 'No ratings found for this block.'
            ]);
        }

        // calculate EMA
        $ema = $ratings[0];
        for ($i = 1; $i < count($ratings); $i++) {
            $ema = $alpha * $ratings[$i] + (1 - $alpha) * $ema;
        }
        $forecastedRating = round($ema, 2);

        return response()->json([
            'block_id' => $block_id,
            'forecasted_rating' => $forecastedRating
        ]);
    }
}
