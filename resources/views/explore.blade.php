@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="text-center mt-4">Explore Available Lots</h1>

    <!-- Filters in a Card -->
    <div class="card shadow-sm p-3 mt-4">
        <form action="{{ route('explore') }}" method="GET" class="row g-3">
            <div class="col-md-3">
                <select name="location" class="form-control">
                    <option value="">Select Block</option>
                    @foreach($blocks as $block)
                    <option value="{{ $block }}">Block {{ $block }}</option>
                    @endforeach
                    </select>
            </div>
            <div class="col-md-4">
                <div class="price-range-container">
                    <label for="priceRange" class="form-label">Price Range</label>
                    <p id="priceValue">₱10,000 - ₱1,000,000</p>
                </div>
                <input type="range" class="form-range" min="10000" max="1000000" step="5000" id="priceRange" 
                    oninput="updatePriceRange(this.value)">
            </div>

            <div class="col-md-2">
                <button type="submit" class="btn btn-primary w-100">Filter</button>
            </div>
        </form>
    </div>

    <!-- Interactive Map (Placeholder) -->
    <div class="map-container mt-4">
        <div class="map-placeholder">
            <span class="text-muted">2d map siguro ilalagay ko dito</span>
        </div>
    </div>

    <!-- Available Lots -->
    <div class="row mt-4">
        @foreach($lots as $lot)
            <div class="col-md-4 mb-4">
                <div class="property-card shadow-sm">
                    <img src="{{ asset('storage/' . $lot->image) }}" alt="Lot Image" class="property-img">
                    <div class="property-info">
                        <h4>{{ $lot->name }}</h4> <!-- Display Lot Name -->
                        <p><strong>Block:</strong> {{ $lot->block_number }}</p> <!-- Display Block Number -->
                        <h4>{{ $lot->location }}</h4>
                        <p>Size: {{ $lot->size }} sq ft</p>
                        <p>Price: ₱{{ number_format($lot->price, 2) }}</p>
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

<script>
function updatePriceRange(value) {
    document.getElementById('priceValue').innerText = `₱${value}`;
}
</script>
@endsection
