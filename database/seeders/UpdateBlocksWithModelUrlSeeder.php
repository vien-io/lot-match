<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Block;

class UpdateBlocksWithModelUrlSeeder extends Seeder
{
    public function run()
    {
        $defaultModelUrl = 'modelH.glb';

        // update all blocks with the model url
        Block::query()->update(['model_url' => $defaultModelUrl]);

        echo "All blocks updated with model URL!\n";
    }
}
