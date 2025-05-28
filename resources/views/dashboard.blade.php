@extends('layouts.app')

@section('head')
    <link rel="stylesheet" href="{{ asset('css/analytics.css') }}">
@endsection

@section('content')
    <div class="container py-5">
        <h2 class="analytics-heading text-center mb-4">Block Ratings Analytics</h2>

        <!-- Row for Charts -->
        <div class="row">
            <!-- Block Ratings Chart -->
            <div class="col-md-12 mb-4">
                <h3>Block Ratings</h3>
                <div class="chart-container">
                    <canvas id="ratingsChart" class="chart-canvas"></canvas>
                </div>
            </div>
        </div>


    <!-- Table for Block Ratings Analytics -->
    <div class="table-container mb-4">
            <!-- <h3>Block Ratings Analytics</h3> -->
            <table class="analytics-table table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Block</th>
                        <th>Average Rating</th>
                        <th>Total Reviews</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($blockRatings as $row)
                    <tr>
                        <td>{{ $row->name }}</td>
                        <td>{{ number_format($row->avg_rating, 2) }}</td>
                        <td>{{ $row->total_reviews }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>



        <!-- Row for Rating Distribution and Top 5 Highest Rated Lots -->
        <div class="row">
            <div class="col-md-6 mb-4">
                <h3>Rating Distribution</h3>
                <div class="chart-container">
                    <canvas id="ratingDistributionChart" class="chart-canvas"></canvas>
                </div>
            </div>

            <div class="col-md-6 mb-4">
                <h3>Top 5 Highest Rated Lots</h3>
                <div class="chart-container">
                    <canvas id="topRatedLotsChart" class="chart-canvas"></canvas>
                </div>
            </div>
        </div>
        <!-- Top Rated Lots Cards -->
        <div id="top-rated-lots" class="top-rated-cards-container mb-5">
            <!-- Cards will be populated here dynamically -->
        </div>

       

        <!-- Row for Recent Reviews and Lot Availability -->
        <div class="row mt-4">
            <!-- Recent Reviews Table -->
            <div class="col-md-6">
                <h3>Recent Reviews</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Lot</th>
                            <th>User</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($recentReviews as $review)
                        <tr>
                            <td>{{ $review->lot_id }}</td>
                            <td>{{ $review->user_name }}</td>
                            <td>{{ $review->rating }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Lot Availability Info -->
            <div class="col-md-6 lot-availability">
                <h3>Lot Availability</h3>
                <p><strong>Available Lots:</strong> {{ $availableLots }}</p>
                <p><strong>Reserved Lots:</strong> {{ $reservedLots }}</p>
            </div>
        </div>

        <!-- Hidden Data for Charts -->
        <div id="ratings-data"
            data-block-labels='@json($blockRatings->pluck("name"))'
            data-block-ratings='@json($blockRatings->pluck("avg_rating"))'
            data-rating-labels='@json($ratingDistribution->pluck("rating"))'
            data-rating-counts='@json($ratingDistribution->pluck("count"))'
            data-block-reviews='@json($blockRatings->pluck("total_reviews"))'>
        </div>
        <div id="top-rated-data"
            data-labels='@json($topRatedLots->pluck("id"))'
            data-ratings='@json($topRatedLots->pluck("avg_rating"))'>
        </div>
    </div>
@endsection
