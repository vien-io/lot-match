<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In</title>
    @vite(['resources/css/signin.css', 'resources/js/signin.js'])
</head>
<body>
    <div class="signin-container">
        <h2>Sign In</h2>
        <form action="#" method="POST">
            <div class="input-group">
                <label for="name"></label>
                <input type="text" id="name" name="name" placeholder="Your Name">
            </div>
            <div class="input-group">
                <label for="passoword"></label>
                <input type="password" id="password" name="password" placeholder="Your Password">
            </div>
            <button type="submit">Sign In</button>
            <div class="alink">
                <a href="#">Don't have an Account?</a> 
                <a href="#">Forgot Password?</a>
            </div>
        </form>
    </div>
</body>
</html>