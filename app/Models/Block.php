<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    use HasFactory;

    protected $table = 'blocks'; 
    protected $fillable = ['name', 'description']; 
    
    // Block has many lots
    public function lots()
    {
        return $this->hasMany(Lot::class, 'block_id');
    }

    // Block has many reviews
    public function reviews()
    {
        return $this->hasMany(Review::class, 'block_id');
    }
}

