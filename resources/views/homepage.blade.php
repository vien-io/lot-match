@extends('layouts.app')

@section('content')
<div class="hero-section">
    <div class="hero-text">
        <h1>Find Your Perfect Lot in Seconds</h1>
        <p>Easily explore, compare, and reserve the best lots in your preferred area.</p>
        <div class="cta-buttons">
            {{--
            <a href="{{ route('explore') }}" class="btn btn-primary">Explore</a>
            <a href="{{ route('login') }}" class="btn btn-outline-secondary">Sign In</a>
            <a href="{{ route('register') }}" class="btn btn-outline-secondary">Sign Up</a>
            --}}
            <a href="{{ route('explore') }}" class="btn btn-primary">Explore</a>
            <!-- <a href="#" class="btn btn-outline-secondary">Sign In</a>
            <a href="#" class="btn btn-outline-secondary">Sign Up</a> -->
        </div>
    </div>
</div>

<!-- Search Bar -->
<div class="search-bar">
    <form action="#" method="GET">
        <input type="text" name="query" placeholder="Search lot/block number..." required>
        <button type="submit">Search</button>
    </form>
</div>

<!-- Featured Properties -->
<div class="featured-properties container">
    <h2>Featured Properties</h2>
    <div class="row">

       
        @foreach($lots as $lot)
            <div class="col-md-4">
                <div class="property-card">
                    <img src="{{ asset('storage/' . $lot->image) }}" alt="Lot Image">
                    <div class="property-info">
                        <h4>{{ $lot->name }}</h4> <!-- Display Lot Name -->
                        <p><strong>Block:</strong> {{ $lot->block_number }}</p> <!-- Display Block Number -->
                        <h4>{{ $lot->location }}</h4>
                        <p>Size: {{ $lot->size }} sq meters</p>
                        <p>Price: ₱{{ number_format($lot->price, 2) }}</p>
                        <a href="#" class="btn btn-primary">View Details</a>
                        {{--
                        <a href="{{ route('lot.details', $lot->id) }}" class="btn btn-primary">View Details</a>
                        --}}
                    </div>
                </div>
            </div>
        @endforeach
       
        
    </div>
</div>

<!-- How It Works -->
<div class="how-it-works container">
    <h2>How It Works</h2>
    <div class="steps">
        <div class="step">
            <span>1</span>
            <p>Search for available lots using filters.</p>
        </div>
        <div class="step">
            <span>2</span>
            <p>Compare prices, sizes, and locations.</p>
        </div>
        <div class="step">
            <span>3</span>
            <p>Reserve your preferred lot instantly.</p>
        </div>
    </div>
</div>

<!-- Testimonials -->
<div class="testimonials container">
    <h2>What Our Users Say</h2>
    <div class="testimonial">
        <p>"LotMatch made finding my dream property so easy!"</p>
        <span>- Happy Customer</span>
    </div>
</div>



@endsection
