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

        @if (session('success'))
            <div class="success-message">
                {{ session('success') }}
            </div>
        @endif

        <form action="{{ route('signin') }}" method="POST">
            @csrf
            <div class="input-group">
                <label for="name"></label>
                <input type="text" id="name" name="name" placeholder="Your Name" required>
            </div>
            <div class="input-group">
                <label for="passoword"></label>
                <input type="password" id="password" name="password" placeholder="Your Password" required>
            </div>
            @if (session('error'))
                <div class="error-message">
                    {{ session('error') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="error-message">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif
            <button type="submit">Sign In</button>
            <div class="alink">
                <a href="{{ route('register') }}">Don't have an Account?</a> 
                <a href="{{ route('password.request') }}">Forgot Password?</a>
            </div>
        </form>
    </div>
</body>
</html>