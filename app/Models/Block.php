<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    use HasFactory;

    protected $table = 'blocks'; // Table name
    protected $fillable = ['name']; // Add other columns as needed
    
    public function lots()
    {
        return $this->hasMany(Lot::class);
    }
}

