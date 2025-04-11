<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReviewsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $now = Carbon::now();

        // reviews sample
        DB::table('reviews')->insert([
            [
                'id'   => 1,
                'block_id'  => 1,
                'lot_id'    => 1,
                'rating'    => 4.5,
                'user_name' => 'Clyde',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id'    => 2,
                'block_id'   => 1,
                'lot_id'     => 2,
                'rating'     => 3.8,
                'user_name'  => 'Bob',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id'    => 3,
                'block_id'   => 2,
                'lot_id'     => 3,
                'rating'     => 5.0,
                'user_name'  => 'Charlie',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
