<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LotsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('lots')->insert([
            [
                'name' => 'Lot A1',
                'description' => 'A beautiful lot with a great view.',
                'size' => 120.5,
                'price' => 250000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot A2',
                'description' => 'Spacious lot ideal for a large house.',
                'size' => 150.0,
                'price' => 300000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot B1',
                'description' => 'Quiet and peaceful, perfect for a small family.',
                'size' => 80.0,
                'price' => 180000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more lots as needed
        ]);
    }
}
