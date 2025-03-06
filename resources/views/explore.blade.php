@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="text-center mt-4">Explore Available Lots</h1>

    <!-- Filters in a Card -->
    <div class="card shadow-sm p-3 mt-4">
        <form action="{{ route('explore') }}" method="GET" class="row g-3">
            <div class="col-md-3">
                <input type="text" name="location" class="form-control" placeholder="Enter location">
            </div>
            <div class="col-md-2">
                <input type="number" name="min_price" class="form-control" placeholder="Min Price">
            </div>
            <div class="col-md-2">
                <input type="number" name="max_price" class="form-control" placeholder="Max Price">
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-primary w-100">Filter</button>
            </div>
        </form>
    </div>

    <!-- Interactive Map (Placeholder) -->
    <div class="map-container mt-4">
        <div class="map-placeholder">
            🗺️ <span class="text-muted">Map View Coming Soon...</span>
        </div>
    </div>

    <!-- Available Lots -->
    <div class="row mt-4">
        @foreach($lots as $lot)
            <div class="col-md-4 mb-4">
                <div class="property-card shadow-sm">
                    <img src="{{ asset('storage/' . $lot->image) }}" alt="Lot Image" class="property-img">
                    <div class="property-info">
                        <h4>{{ $lot->location }}</h4>
                        <p>Size: {{ $lot->size }} sq ft</p>
                        <p>Price: ${{ number_format($lot->price, 2) }}</p>
                        <div class="d-flex justify-content-between">
                            <a href="#" class="btn btn-outline-primary">View Details</a>
                            <a href="#" class="btn btn-success">Reserve</a>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection
