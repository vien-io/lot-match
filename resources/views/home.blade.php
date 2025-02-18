<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    @vite(['resources/css/home.css', 'resources/js/home.js'])
</head>
<body>
    <div class="create-container">
        <h2>Create an Account</h2>
        <form action="#" method="POST">
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
                <input type="password" id="password" name="password" placeholder="Confirm Password">
            </div>
            <p class="conditions"><input type="checkbox">I agree to terms and conditions</p>
            <button type="submit">Sign up</button>
            <p>Already have an account? <a href="#">Sign in</a></p>
        </form>
    </div>
</body>
</html>