<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Options
    |--------------------------------------------------------------------------
    |
    | Here you can configure your settings for handling Cross-Origin Resource
    | Sharing (CORS). This allows your application to respond to requests
    | from other domains, as well as configure which methods and headers
    | are allowed in the request.
    |
    */

    'paths' => ['api/*'], // Allow all routes starting with "api/"

    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, PUT, DELETE)

    'allowed_origins' => ['*'], // Allow all origins (replace with specific domains for production)

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Allow all request headers

    'exposed_headers' => [], // No headers exposed by default

    'max_age' => 0, // Preflight request cache duration (in seconds)

    'supports_credentials' => false, // Set to true if you want to include credentials (cookies, HTTP auth)
];