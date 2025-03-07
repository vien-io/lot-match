@extends('layouts.app')

@section('content')
<div class="container about-page">
    <h1 class="text-center mb-4">About LotMatch</h1>

    <!-- Introduction Section -->
    <div class="about-intro text-center">
        <p>
            LotMatch is a platform that helps you find the right lot of land. Whether you want to buy, sell, or invest in real estate, we make everything easy and straightforward.
        </p>
    </div>

    <!-- Mission Statement -->
    <div class="mission-section text-center my-5">
        <h2>Our Mission</h2>
        <p>
            Our mission is to make buying land easier by offering a simple, clear, and efficient platform.
        </p>
    </div>

    <!-- Our Team -->
    <div class="team-section text-center">
        <h2>Meet Our Team</h2>
        <div class="row">
            <div class="col-md-4">
                <img src="{{ asset('images/team1.jpg') }}" alt="Team Member" class="team-img">
                <h4>Clark Kent Caylao</h4>
                <p>Founder & CEO</p>
            </div>
            <div class="col-md-4">
                <img src="{{ asset('images/team2.jpg') }}" alt="Team Member" class="team-img">
                <h4>Jhonrev Abanes</h4>
                <p>Chief Operating Officer</p>
            </div>
            <div class="col-md-4">
                <img src="{{ asset('images/team3.jpg') }}" alt="Team Member" class="team-img">
                <h4>Ian Ilao</h4>
                <p>Head of Marketing</p>
            </div>
        </div>
    </div>
</div>
@endsection
