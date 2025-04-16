<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['user_id', 'lot_id', 'rating', 'comment', 'user_name'];

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function lot() {
        return $this->belongsTo(Lot::class);
    }
 
}
