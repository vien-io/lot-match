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
                'block_id' => 1, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 2',
                'description' => 'A residential lot with a nice view.',
                'size' => 400,
                'price' => 120000,
                'block_number' => '2',
                'block_id' => 1, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 3',
                'description' => 'A commercial lot with easy access to major roads.',
                'size' => 800,
                'price' => 250000,
                'block_number' => '3',
                'block_id' => 2, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 4',
                'description' => 'A corner lot ideal for retail or business.',
                'size' => 600,
                'price' => 180000,
                'block_number' => '4',
                'block_id' => 2, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 5',
                'description' => 'A quiet residential lot located near a park.',
                'size' => 350,
                'price' => 100000,
                'block_number' => '5',
                'block_id' => 3, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 6',
                'description' => 'A spacious lot with great potential for development.',
                'size' => 1000,
                'price' => 300000,
                'block_number' => '6',
                'block_id' => 3, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 7',
                'description' => 'A lot with road frontage and access to utilities.',
                'size' => 700,
                'price' => 220000,
                'block_number' => '7',
                'block_id' => 4, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 8',
                'description' => 'An elevated lot with a scenic view of the ocean.',
                'size' => 450,
                'price' => 175000,
                'block_number' => '8',
                'block_id' => 4, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 9',
                'description' => 'A large industrial lot with access to highways.',
                'size' => 1500,
                'price' => 500000,
                'block_number' => '9',
                'block_id' => 5, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lot 10',
                'description' => 'A prime location lot near schools and shopping centers.',
                'size' => 550,
                'price' => 200000,
                'block_number' => '10',
                'block_id' => 5, // Reference to block ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
