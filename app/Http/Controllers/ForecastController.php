<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Block;

class ForecastController extends Controller
{
    public function getBlockRatingTrends(Block $block)
    {
        $ratings = DB::table('reviews')
            ->selectRaw("block_id, DATE_FORMAT(created_at, '%Y-%m') as rating_month, AVG(rating) as avg_rating")
            ->where('block_id', $block->id)
            ->groupBy('block_id', 'rating_month')
            ->orderBy('block_id')
            ->orderBy('rating_month')
            ->get()
            ;

            return response()->json($ratings);
    }
    public function showForecast(Block $block)
    {
        return view('block-forecast', ['block' => $block]);
    }

}
