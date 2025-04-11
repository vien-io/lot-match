<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function blockRatings()
    {
        $data = DB::table('blocks as b')
            ->join('lots as l', 'b.id', '=', 'l.block_id')
            ->join('reviews as r', 'l.id', '=', 'r.lot_id')
            ->select('b.name', 
            DB::raw('AVG(r.rating) as avg_rating'), 
            DB::raw('COUNT(r.id) as total_reviews')
            )
            ->groupBy('b.name')
            ->get();

        return view('analytics.block_ratings', compact('data'));
    }
    public function topRatedLots()
    {
        $topRated = DB::table('lots as l')
            ->join('reviews as r', 'l.lot_id', '=', 'r.lot_id')
            ->select('l.lot_id', 'l.price', DB::raw('AVG(r.rating) as avg_rating'), DB::raw('COUNT(r.review_id) as total_reviews'))
            ->groupBy('l.lot_id', 'l.price')
            ->orderByDesc('avg_rating')
            ->limit(5)
            ->get();

        return view('analytics.top_rated_lots', compact('topRated'));
    }


}
