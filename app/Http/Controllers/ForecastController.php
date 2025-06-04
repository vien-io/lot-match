<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ForecastController extends Controller
{
    private function calculateForecast($blockId, $alpha = 0.3)
    {
        $ratingsQuery = DB::table('reviews')
        ->where('block_id', $blockId)
        ->orderBy('created_at', 'asc')
        ->select('rating', 'created_at')
        ->get();

        if ($ratingsQuery->isEmpty()) {
            return null;
        }

        $ratings = $ratingsQuery->pluck('rating')->toArray();

        $ema = $ratings[0];
        for ($i = 1; $i < count($ratings); $i++) {
            $ema = $alpha * $ratings[$i] + (1 - $alpha) * $ema;
        }

        return round($ema, 2);
    }



    public function forecastBlockRating($blockId, $alpha = 0.3)
    {
        $forecastedRating = $this->calculateForecast($blockId, $alpha);

        if ($forecastedRating === null) {
            return response()->json([
                'block_id' => $blockId,
                'forecasted_rating' => null,
                'ratings' => [],
                'message' => 'No ratings found for this block.'
            ]);
        }

        $ratingsQuery = DB::table('reviews')
            ->where('block_id', $blockId)
            ->orderBy('created_at', 'asc')
            ->select('rating', 'created_at')
            ->get();

        return response()->json([
            'block_id' => $blockId,
            'forecasted_rating' => $forecastedRating,
            'ratings' => $ratingsQuery
        ]);
    }

    public function getBlockSentimentTrends($blockId)
    {
        $results = DB::table('reviews')
        ->selectRaw('
            DATE_FORMAT(created_at, "%Y-%m") as month,
            sentiment,
            COUNT(*) as count
        ')
        ->where('block_id', $blockId)
        ->groupBy('month', 'sentiment')
        ->orderBy('month')
        ->get();

        $sentimentByMonth = [];

        foreach ($results as $row) {
            $month = $row->month;
            $sentiment = $row->sentiment;
            
            if (!isset($sentimentByMonth[$month])) {
                $sentimentByMonth[$month] = ['positive' => 0, 'neutral' => 0, 'negative' => 0];
            }
            $sentimentByMonth[$month][$sentiment] = $row->count;
        }
        return response()->json($sentimentByMonth);
    }

    private function fetchSentimentTrends($blockId)
    {
        $results = DB::table('reviews')
            ->selectRaw('
                DATE_FORMAT(created_at, "%Y-%m") as month,
                sentiment,
                COUNT(*) as count
            ')
            ->where('block_id', $blockId)
            ->groupBy('month', 'sentiment')
            ->orderBy('month')
            ->get();

        $sentimentByMonth = [];

        foreach ($results as $row) {
            $month = $row->month;
            $sentiment = $row->sentiment;

            if (!in_array($sentiment, ['positive', 'neutral', 'negative'])) {
                $sentiment = 'neutral';
            }
            if (!isset($sentimentByMonth[$month])) {
                $sentimentByMonth[$month] = ['positive' => 0, 'neutral' => 0, 'negative' => 0];
            }
            $sentimentByMonth[$month][$sentiment] = $row->count;
        }

        return $sentimentByMonth;
    }


    public function getBlockSummary ($blockId)
    {
        $forecastedRating = $this->calculateForecast($blockId);
        $sentiments = $this->fetchSentimentTrends($blockId);
        Log::info('Sentiments: ', $sentiments);

        $latestMonth = array_key_last($sentiments);
        $latestSentiment = $sentiments[$latestMonth] ?? ['positive' => 0, 'neutral' => 0, 'negative' => 0];
 
        $total = array_sum($latestSentiment) ?: 1;
        $positivePct = round(($latestSentiment['positive'] ?? 0) / $total * 100);
        $neutralPct = round(($latestSentiment['neutral'] ?? 0) / $total * 100);
        $negativePct = round(($latestSentiment['negative'] ?? 0) / $total * 100);

        if ($forecastedRating === null) {
            return response()->json(['summary' => 'Rating forecast unavailable.'], 200);
        }

        $summary = "Block $blockId looks ";

        if ($forecastedRating >= 4) {
            $summary .= "great for living, with a forecasted rating of " . number_format($forecastedRating, 1) . ". ";
        } elseif ($forecastedRating >= 3) {
            $summary .= "decent, with a forecasted rating of " . number_format($forecastedRating, 1) . ". ";
        } else {
            $summary .= "concerning, with a forecasted rating of " . number_format($forecastedRating, 1) . ". ";
        }

        $summary .= "Recent sentiment from residents: $positivePct% positive, $neutralPct% neutral, $negativePct$ negative.";

        return response()->json(['summary' => $summary]);
    }   
}
