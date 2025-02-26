<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signin(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)){
            return redirect()->intended('/3dmap');
        }
        return back()->withErrors([
            'error' => 'You have entered an invalid name or password. Try again.'
        ]);
    }
}
