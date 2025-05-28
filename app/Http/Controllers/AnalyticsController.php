<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function dashboard()
    {
        // block ratings
        $blockRatings = DB::table('blocks as b')
        ->join('lots as l', 'b.id', '=', 'l.block_id')
        ->join('reviews as r', 'l.block_id', '=', 'r.block_id')
        ->select('b.name', 
            DB::raw('AVG(r.rating) as avg_rating'),
            DB::raw('COUNT(r.id) as total_reviews')
        )
        ->groupBy('b.name')
        ->get();
    

        // top 5 highest rated
        $topRatedLots = DB::table('blocks as b')
        ->join('reviews as r', 'b.id', '=', 'r.block_id') // Join reviews with blocks
        ->join('lots as l', 'b.id', '=', 'l.block_id')   // Join blocks with lots
        ->select('l.id', 'l.price', DB::raw('AVG(r.rating) as avg_rating'))
        ->groupBy('l.id', 'l.price')  // Group by lot id and price
        ->orderByDesc('avg_rating')   // Order by average rating descending
        ->limit(5)                   // Limit to the top 5
        ->get();

            

        // recent reviews
        $recentReviews = DB::table('reviews as r')
        ->join('users as u', 'r.user_id', '=', 'u.id')   // Join reviews with users
        ->join('blocks as b', 'r.block_id', '=', 'b.id')  // Join reviews with blocks
        ->join('lots as l', 'b.id', '=', 'l.block_id')    // Join blocks with lots
        ->select('r.user_id', 'u.name as user_name', 'r.rating', 'l.id as lot_id')
        ->orderBy('r.created_at', 'desc')
        ->limit(5)
        ->get();
    
        
        // lot available
        $availableLots = DB::table('lots')->where('status', 'available')->count();
        $reservedLots = DB::table('lots')->where('status', 'reserved')->count();
    

        // rating dist
        $rawDistribution = DB::table('reviews')
        ->select(DB::raw('FLOOR(rating) as rating'), DB::raw('COUNT(id) as count'))
        ->groupBy(DB::raw('FLOOR(rating)'))
        ->orderBy('rating')
        ->pluck('count', 'rating'); // gives associative array: [rating => count]
    
        // fill missing ratings with 0
        $ratingDistribution = collect(range(1, 5))->map(function ($rating) use ($rawDistribution) {
            return [
                'rating' => $rating,
                'count' => $rawDistribution->get($rating, 0)
            ];
        });


        return view('dashboard', compact('blockRatings', 'topRatedLots', 'recentReviews', 'availableLots', 'reservedLots', 'ratingDistribution'));

    }
}
