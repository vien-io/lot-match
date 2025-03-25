<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LotSeeder extends Seeder
{
    public function run()
    {
        // truncate the table before inserting new data
        DB::table('lots')->truncate(); 

        DB::table('lots')->insert([
            [
                'id' => 1,
                'block_id' => 1,
                'name' => 'Lot 1',
                'description' => 'Description for Lot 1',
                'size' => 100,
                'price' => '1000.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'block_id' => 1,
                'name' => 'Lot 2',
                'description' => 'Description for Lot 2',
                'size' => 150,
                'price' => '1500.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'block_id' => 2,
                'name' => 'Lot 3',
                'description' => 'Description for Lot 3',
                'size' => 200,
                'price' => '2000.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'block_id' => 2,
                'name' => 'Lot 4',
                'description' => 'Description for Lot 4',
                'size' => 250,
                'price' => '2500.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'block_id' => 3,
                'name' => 'Lot 5',
                'description' => 'Description for Lot 5',
                'size' => 300,
                'price' => '3000.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'block_id' => 3,
                'name' => 'Lot 6',
                'description' => 'Description for Lot 6',
                'size' => 350,
                'price' => '3500.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'block_id' => 4,
                'name' => 'Lot 7',
                'description' => 'Description for Lot 7',
                'size' => 400,
                'price' => '4000.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'block_id' => 4,
                'name' => 'Lot 8',
                'description' => 'Description for Lot 8',
                'size' => 450,
                'price' => '4500.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'block_id' => 5,
                'name' => 'Lot 9',
                'description' => 'Description for Lot 9',
                'size' => 500,
                'price' => '5000.00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
