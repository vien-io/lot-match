<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;


class RegisterController extends Controller
{
    
    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/signin';

    /**
     * show signup pge
     *
     * @return \Illuminate\View\View
     */

    public function showRegistrationForm()
    {
        return view('signup');
    }

 /**
     * Handle user registration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */


   

    // handles register submission
    public function register(Request $request){
        // validate req
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // create user
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // redirect user to login
        return redirect()->route('login')->with('success', 'Account created successfully! You may now sign in.');
    }
}
