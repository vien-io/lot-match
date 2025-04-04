<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Lot;

class UpdateLotsWithModelUrlSeeder extends Seeder
{
    public function run()
    {
   
        $defaultModelUrl = 'modelH.glb'; 

        // update all lots with the model URL
        Lot::query()->update(['model_url' => $defaultModelUrl]);

        echo "All lots updated with model URL!\n";
    }
}
