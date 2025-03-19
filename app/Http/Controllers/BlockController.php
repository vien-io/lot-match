<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Block;
use App\Models\Lot;

class BlockController extends Controller
{
    public function getBlocks()
    {
        return response()->json(Block::all());
    }


}

