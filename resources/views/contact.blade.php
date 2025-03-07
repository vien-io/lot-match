@extends('layouts.app')

@section('content')
<div class="container contact-page">
    <h1 class="text-center mb-4">Contact Us</h1>

    <!-- Contact Details -->
    <div class="contact-info text-center">
        <p><strong>Email:</strong> lotmatch@gmail.com</p>
        <p><strong>Phone:</strong> +63 936 228 0260</p>
        <p><strong>Address:</strong> Angeles City</p>
        <p>
            <strong>Follow us:</strong> 
            <a href="#" target="_blank">Facebook</a> | 
            <a href="#" target="_blank">Twitter</a> | 
            <a href="#" target="_blank">Instagram</a>
        </p>
    </div>

    <!-- Google Maps Embed -->
    <div class="map-container text-center">
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3850.991347319292!2d120.63022247452074!3d15.158819885396412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f1e2f5d7ad75%3A0x51d1aca6b2de0ea9!2sSameera%20Subdivision!5e0!3m2!1sen!2sph!4v1741349195239!5m2!1sen!2sph" 
            width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
    </div>

    <!-- Contact Form -->
    <div class="contact-form">
        <h2 class="text-center">Send Us a Message</h2>
        
        <!-- Success Message -->
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <form action="{{ route('contact.submit') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label for="name" class="form-label">Your Name</label>
                <input type="text" id="name" name="name" class="form-control" placeholder="Enter your name" required>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Your Email</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email" required>
            </div>

            <div class="mb-3">
                <label for="message" class="form-label">Your Message</label>
                <textarea id="message" name="message" class="form-control" rows="4" placeholder="Enter your message" required></textarea>
            </div>

            <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
    </div>
</div>
@endsection
