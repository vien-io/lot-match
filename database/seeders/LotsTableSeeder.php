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
                'name' => 'Lot 1',
                'description' => 'A spacious lot located in the city center.',
                'size' => 500, // size in square meters
                'price' => 150000, // price in PHP
                'block_number' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 2',
                'description' => 'A residential lot with a nice view.',
                'size' => 400,
                'price' => 120000,
                'block_number' => '2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 3',
                'description' => 'A commercial lot with easy access to major roads.',
                'size' => 800,
                'price' => 250000,
                'block_number' => '3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more lots as needed
        ]);
    }
}
