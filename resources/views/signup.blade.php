<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    @vite(['resources/css/signup.css', 'resources/js/signup.js'])
</head>
<body>
    <!-- <div id="hero"></div> -->
    <div class="create-container">
        <h2>Create Account</h2>
        <form action="{{ route('signup') }}" method="POST">
            @csrf
            <div class="input-group">
                <label for="name"></label>
                <input type="text" id="name" name="name" placeholder="Your Name" require>
            </div>
            <div class="input-group">
                <label for="email"></label>
                <input type="email" id="email" name="email" placeholder="Your Email" require>
            </div>
            <div class="input-group">
                <label for="password"></label>
                <input type="password" id="password" name="password" placeholder="Password" require>
            </div>
            <div class="input-group">
                <label for="password"></label>
                <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirm Password" require>
            </div>
            <div class="conditions">
                <input type="checkbox" id="agreeTerms">
                <p>By signing up, you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a></p>
            </div>
            @if ($errors->any())
                <div class="error-message">
                    @foreach($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif
            <button type="submit" id="signupBtn" disabled>Sign up</button>
            <p>Already have an account? <a href="{{ route('login') }}">Sign in</a></p>
        </form>
    </div>
</body>
</html>