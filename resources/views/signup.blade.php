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
        <form action="#" method="POST">
            @csrf
            <div class="input-group">
                <label for="name"></label>
                <input type="text" id="name" name="name" placeholder="Your Name">
            </div>
            <div class="input-group">
                <label for="email"></label>
                <input type="email" id="email" name="email" placeholder="Your Email">
            </div>
            <div class="input-group">
                <label for="password"></label>
                <input type="password" id="password" name="password" placeholder="Password">
            </div>
            <div class="input-group">
                <label for="password"></label>
                <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirm Password">
            </div>
            <div class="conditions">
                <input type="checkbox">
                <p>By signing up, you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a></p>
            </div>
            <button type="submit">Sign up</button>
            <p>Already have an account? <a href="#">Sign in</a></p>
        </form>
    </div>
</body>
</html>