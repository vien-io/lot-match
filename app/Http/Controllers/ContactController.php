<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function showForm()
    {
        return view('contact');
    }

    public function submitForm(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string|min:10',
        ]);

        // Save to database
        Contact::create($request->all());

        // Send an email notification (optional)
        Mail::raw("New Contact Message: \n\n{$request->message}", function ($message) use ($request) {
            $message->to('admin@example.com')
                    ->subject("Contact Form Submission from {$request->name}");
        });

        return redirect()->back()->with('success', 'Your message has been sent!');
    }
}
